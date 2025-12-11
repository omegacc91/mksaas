'use server';

import { getDb } from '@/db';
import { wheatStrawOrder, payment as paymentTable } from '@/db/schema';
import type { User } from '@/lib/auth-types';
import { userActionClient } from '@/lib/safe-action';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { Routes } from '@/routes';
import Stripe from 'stripe';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Wheat straw order checkout schema
const wheatStrawCheckoutSchema = z.object({
  imageUrl: z.string().url(),
  originalImageUrl: z.string().url().optional(),
  prompt: z.string().optional(),
  sizeOptionId: z.string(),
  frameOptionId: z.string(),
  mountingOptionId: z.string(),
  basePrice: z.number().positive(),
  totalPrice: z.number().positive(),
  recipientName: z.string().min(2),
  recipientPhone: z.string().min(10),
  shippingAddress: z.string().min(10),
  shippingCity: z.string().min(2),
  shippingProvince: z.string().min(2),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().default('CN'),
  customerNote: z.string().optional(),
});

type WheatStrawCheckoutInput = z.infer<typeof wheatStrawCheckoutSchema>;

/**
 * Create a checkout session for a wheat straw painting order
 */
export const createWheatStrawCheckoutAction = userActionClient
  .schema(wheatStrawCheckoutSchema)
  .action(async ({ parsedInput, ctx }) => {
    const currentUser = (ctx as { user: User }).user;

    try {
      const db = await getDb();
      const locale = await getLocale();

      // Generate order number
      const orderNumber = `WS${Date.now()}${nanoid(6).toUpperCase()}`;

      // Create order in database
      const orderId = nanoid();
      await db.insert(wheatStrawOrder).values({
        id: orderId,
        orderNumber,
        userId: currentUser.id,
        status: 'pending',
        originalImageUrl: parsedInput.originalImageUrl || null,
        generatedImageUrl: parsedInput.imageUrl,
        prompt: parsedInput.prompt || null,
        sizeOptionId: parsedInput.sizeOptionId,
        frameOptionId: parsedInput.frameOptionId,
        mountingOptionId: parsedInput.mountingOptionId,
        basePrice: parsedInput.basePrice,
        totalPrice: parsedInput.totalPrice,
        currency: 'USD',
        recipientName: parsedInput.recipientName,
        recipientPhone: parsedInput.recipientPhone,
        shippingAddress: parsedInput.shippingAddress,
        shippingCity: parsedInput.shippingCity,
        shippingProvince: parsedInput.shippingProvince,
        shippingPostalCode: parsedInput.shippingPostalCode || null,
        shippingCountry: parsedInput.shippingCountry,
        customerNote: parsedInput.customerNote || null,
      });

      // Create Stripe checkout session
      const successUrl = getUrlWithLocale(
        `${Routes.Payment}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        locale
      );
      const cancelUrl = getUrlWithLocale('/wheat-straw/customize', locale);

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: locale === 'zh' ? '定制麦秆画' : 'Custom Wheat Straw Painting',
                description: parsedInput.prompt 
                  ? (locale === 'zh' ? `设计：${parsedInput.prompt}` : `Design: ${parsedInput.prompt}`)
                  : undefined,
                images: [parsedInput.imageUrl],
              },
              unit_amount: parsedInput.totalPrice,
            },
            quantity: 1,
          },
        ],
        customer_email: currentUser.email,
        client_reference_id: orderId,
        metadata: {
          orderId,
          orderNumber,
          userId: currentUser.id,
          userName: currentUser.name,
          scene: 'physical_product',
          type: 'wheat_straw_painting',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      // Store session ID in order
      await db
        .update(wheatStrawOrder)
        .set({ 
          sessionId: session.id,
          updatedAt: new Date(),
        })
        .where(eq(wheatStrawOrder.id, orderId));

      return {
        success: true,
        data: {
          url: session.url!,
          id: session.id,
          orderId,
          orderNumber,
        },
      };
    } catch (error) {
      console.error('Error creating wheat straw checkout:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      };
    }
  });

