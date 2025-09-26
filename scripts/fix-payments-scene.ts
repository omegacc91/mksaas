import { PaymentScenes } from '@/payment/types.js';
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
      if (record.scene) {
        continue;
      }
      const isOneTimePayment =
        record.type === 'one_time' && record.status === 'completed';
      if (isOneTimePayment && record.paid) {
        console.log(
          'Updating payment, id:',
          record.id,
          'isOneTimePayment:',
          isOneTimePayment,
          'scene:',
          record.scene
        );
        await db
          .update(payment)
          .set({ scene: PaymentScenes.LIFETIME })
          .where(eq(payment.id, record.id));
      }
    }

    console.log('Fix payments completed');
  } catch (error) {
    console.error('Fix payments error:', error);
  }
}

fixPayments();
