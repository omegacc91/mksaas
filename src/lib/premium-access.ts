import { getDb } from '@/db';
import { payment } from '@/db/schema';
import { findPlanByPriceId, getAllPricePlans } from '@/lib/price-plan';
import { PaymentScenes, PaymentTypes } from '@/payment/types';
import { and, desc, eq, or } from 'drizzle-orm';

/**
 * Check premium access for a specific user ID
 */
export async function checkPremiumAccess(userId: string): Promise<boolean> {
  try {
    const db = await getDb();

    // Single optimized query to check both lifetime and active subscriptions
    const result = await db
      .select({
        id: payment.id,
        priceId: payment.priceId,
        type: payment.type,
        status: payment.status,
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
              // eq(payment.scene, PaymentScenes.SUBSCRIPTION),
              or(eq(payment.status, 'active'), eq(payment.status, 'trialing'))
            )
          )
        )
      )
      .orderBy(desc(payment.createdAt));

    if (!result || result.length === 0) {
      console.log('Check premium access, not payments for user:', userId);
      return false;
    }

    // Get lifetime plan IDs for efficient checking
    const plans = getAllPricePlans();
    const lifetimePlanIds = plans
      .filter((plan) => plan.isLifetime)
      .map((plan) => plan.id);

    // Check if any payment grants premium access
    return result.some((paymentRecord) => {
      // For one-time payments, check if it's a lifetime plan
      if (
        paymentRecord.type === PaymentTypes.ONE_TIME &&
        paymentRecord.status === 'completed'
      ) {
        const plan = findPlanByPriceId(paymentRecord.priceId);
        const isLifetimePlan = plan && lifetimePlanIds.includes(plan.id);
        console.log('Check premium access, isLifetimePlan:', isLifetimePlan);
        return isLifetimePlan;
      }

      // For subscriptions, they're still active/trialing
      if (
        paymentRecord.type === PaymentTypes.SUBSCRIPTION &&
        (paymentRecord.status === 'active' ||
          paymentRecord.status === 'trialing')
      ) {
        console.log('Check premium access, subscription is active/trialing');
        return true;
      }

      // For other cases, return false (free plan)
      console.log('Check premium access, free plan');
      return false;
    });
  } catch (error) {
    console.error('Check premium access error:', error);
    return false;
  }
}
