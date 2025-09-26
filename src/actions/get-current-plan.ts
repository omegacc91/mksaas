'use server';

import { getDb } from '@/db';
import { payment } from '@/db/schema';
import type { User } from '@/lib/auth-types';
import { findPlanByPriceId, getAllPricePlans } from '@/lib/price-plan';
import { userActionClient } from '@/lib/safe-action';
import {
  PaymentScenes,
  type PaymentStatus,
  PaymentTypes,
  type PlanInterval,
  type PricePlan,
  type Subscription,
} from '@/payment/types';
import { and, desc, eq, or } from 'drizzle-orm';
import { z } from 'zod';

const schema = z.object({
  userId: z.string().min(1, { error: 'User ID is required' }),
});

/**
 * Get user's current plan with subscription and lifetime status
 */
export const getCurrentPlanAction = userActionClient
  .schema(schema)
  .action(async ({ ctx }) => {
    const currentUser = (ctx as { user: User }).user;
    const userId = currentUser.id;

    try {
      console.log('Check current plan start for userId:', userId);

      const db = await getDb();
      const plans = getAllPricePlans();
      const freePlan = plans.find((plan) => plan.isFree && !plan.disabled);
      const lifetimePlanIds = plans
        .filter((plan) => plan.isLifetime)
        .map((plan) => plan.id);

      // Single optimized query to get all relevant payments
      const payments = await db
        .select({
          id: payment.id,
          priceId: payment.priceId,
          customerId: payment.customerId,
          type: payment.type,
          status: payment.status,
          scene: payment.scene,
          interval: payment.interval,
          periodStart: payment.periodStart,
          periodEnd: payment.periodEnd,
          cancelAtPeriodEnd: payment.cancelAtPeriodEnd,
          trialStart: payment.trialStart,
          trialEnd: payment.trialEnd,
          createdAt: payment.createdAt,
        })
        .from(payment)
        .where(
          and(
            eq(payment.paid, true),
            eq(payment.userId, userId),
            or(
              // Check for completed lifetime payments
              and(
                eq(payment.type, PaymentTypes.ONE_TIME),
                eq(payment.scene, PaymentScenes.LIFETIME),
                eq(payment.status, 'completed')
              ),
              // Check for active or trialing subscriptions
              and(
                eq(payment.type, PaymentTypes.SUBSCRIPTION),
                or(eq(payment.status, 'active'), eq(payment.status, 'trialing'))
              )
            )
          )
        )
        .orderBy(desc(payment.createdAt));

      console.log(
        `Check current plan, found ${payments.length} relevant payments`
      );

      // Analyze payments to determine current plan
      let userLifetimePlan: PricePlan | null = null;
      let activeSubscription: Subscription | null = null;

      for (const paymentRecord of payments) {
        // Check for lifetime plan first (higher priority)
        if (
          paymentRecord.type === PaymentTypes.ONE_TIME &&
          paymentRecord.scene === PaymentScenes.LIFETIME &&
          paymentRecord.status === 'completed' &&
          !userLifetimePlan // Only take the first (most recent) lifetime plan
        ) {
          const pricePlan = findPlanByPriceId(paymentRecord.priceId);
          if (pricePlan && lifetimePlanIds.includes(pricePlan.id)) {
            userLifetimePlan = pricePlan;
            console.log(
              'Check current plan, found lifetime plan:',
              pricePlan.id
            );
          }
        }

        // Check for active subscription (only if no lifetime plan found)
        if (
          !userLifetimePlan &&
          paymentRecord.type === PaymentTypes.SUBSCRIPTION &&
          (paymentRecord.status === 'active' ||
            paymentRecord.status === 'trialing') &&
          !activeSubscription // Only take the first (most recent) active subscription
        ) {
          activeSubscription = {
            id: paymentRecord.id!,
            priceId: paymentRecord.priceId,
            customerId: paymentRecord.customerId,
            status: paymentRecord.status as PaymentStatus,
            type: paymentRecord.type as PaymentTypes,
            interval: paymentRecord.interval as PlanInterval,
            currentPeriodStart: paymentRecord.periodStart || undefined,
            currentPeriodEnd: paymentRecord.periodEnd || undefined,
            cancelAtPeriodEnd: paymentRecord.cancelAtPeriodEnd || false,
            trialStartDate: paymentRecord.trialStart || undefined,
            trialEndDate: paymentRecord.trialEnd || undefined,
            createdAt: paymentRecord.createdAt,
          };
          console.log(
            'Check current plan, found active subscription:',
            activeSubscription.id
          );
        }
      }

      // Return results based on priority: lifetime > subscription > free
      if (userLifetimePlan) {
        console.log('Check current plan, user is lifetime member');
        return {
          success: true,
          data: {
            currentPlan: userLifetimePlan,
            subscription: null,
          },
        };
      }

      if (activeSubscription) {
        console.log('Check current plan, user has active subscription');
        // Find the corresponding plan for the subscription
        const subscriptionPlan =
          plans.find((p) =>
            p.prices.find(
              (price) => price.priceId === activeSubscription!.priceId
            )
          ) || null;

        return {
          success: true,
          data: {
            currentPlan: subscriptionPlan,
            subscription: activeSubscription,
          },
        };
      }

      // Default to free plan
      console.log('Check current plan, return free plan');
      return {
        success: true,
        data: {
          currentPlan: freePlan || null,
          subscription: null,
        },
      };
    } catch (error) {
      console.error('Check current plan error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get current plan',
      };
    }
  });
