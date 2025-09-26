'use server';

import { getDb } from '@/db';
import { payment } from '@/db/schema';
import { userActionClient } from '@/lib/safe-action';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const checkPaymentCompletionSchema = z.object({
  sessionId: z.string(),
});

/**
 * Check if a payment is completed for the given session ID
 */
export const checkPaymentCompletionAction = userActionClient
  .schema(checkPaymentCompletionSchema)
  .action(async ({ parsedInput: { sessionId } }) => {
    try {
      const db = await getDb();
      const paymentRecord = await db
        .select()
        .from(payment)
        .where(eq(payment.sessionId, sessionId))
        .limit(1);

      const paymentData = paymentRecord[0] || null;
      const isPaid = paymentData ? paymentData.paid : false;
      console.log('Check payment completion, isPaid:', isPaid);

      return {
        success: true,
        isPaid,
      };
    } catch (error) {
      console.error('Check payment completion error:', error);
      return {
        success: false,
        error: 'Failed to check payment completion',
      };
    }
  });
