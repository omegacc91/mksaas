'use server';

import { getDb } from '@/db';
import { creditTransaction } from '@/db/schema';
import type { User } from '@/lib/auth-types';
import { userActionClient } from '@/lib/safe-action';
import { addDays } from 'date-fns';
import { and, eq, gte, isNotNull, lte, sql, sum } from 'drizzle-orm';

const CREDITS_EXPIRATION_DAYS = 31;

/**
 * Get credit statistics for a user
 */
export const getCreditStatsAction = userActionClient.action(async ({ ctx }) => {
  try {
    const currentUser = (ctx as { user: User }).user;
    const userId = currentUser.id;

    const db = await getDb();
    // Get credits expiring in the next CREDITS_EXPIRATION_DAYS days
    const expirationDaysFromNow = addDays(new Date(), CREDITS_EXPIRATION_DAYS);
    const expiringCredits = await db
      .select({
        amount: sum(creditTransaction.remainingAmount),
        earliestExpiration: sql<Date>`MIN(${creditTransaction.expirationDate})`,
      })
      .from(creditTransaction)
      .where(
        and(
          eq(creditTransaction.userId, userId),
          isNotNull(creditTransaction.expirationDate),
          isNotNull(creditTransaction.remainingAmount),
          gte(creditTransaction.remainingAmount, 1),
          lte(creditTransaction.expirationDate, expirationDaysFromNow),
          gte(creditTransaction.expirationDate, new Date())
        )
      );

    return {
      success: true,
      data: {
        expiringCredits: {
          amount: Number(expiringCredits[0]?.amount) || 0,
          earliestExpiration: expiringCredits[0]?.earliestExpiration || null,
        },
      },
    };
  } catch (error) {
    console.error('get credit stats error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch credit statistics',
    };
  }
});
