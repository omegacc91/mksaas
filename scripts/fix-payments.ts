import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/db/index.js';
import { payment } from '../src/db/schema.js';
dotenv.config();

export default async function fixPayments() {
  const db = await getDb();

  try {
    const payments = await db.select().from(payment);

    for (const record of payments) {
      if (record.paid) {
        continue;
      }
      const isOneTimePayment =
        record.type === 'one_time' && record.status === 'completed';
      const isSubscriptionPayment =
        record.type === 'subscription' &&
        (record.status === 'active' || record.status === 'trialing');
      if (isOneTimePayment || isSubscriptionPayment) {
        console.log(
          'Updating payment, id:',
          record.id,
          'isOneTimePayment:',
          isOneTimePayment,
          'isSubscriptionPayment:',
          isSubscriptionPayment
        );
        await db
          .update(payment)
          .set({ paid: true })
          .where(eq(payment.id, record.id));
      }
    }

    console.log('Fix payments completed');
  } catch (error) {
    console.error('Fix payments error:', error);
  }
}

fixPayments();
