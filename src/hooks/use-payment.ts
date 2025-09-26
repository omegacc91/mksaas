import { getCurrentPlanAction } from '@/actions/get-current-plan';
import { getAllPricePlans } from '@/lib/price-plan';
import type { PricePlan, Subscription } from '@/payment/types';
import { useQuery } from '@tanstack/react-query';

// Query keys
export const paymentKeys = {
  all: ['payment'] as const,
  currentPlan: (userId: string) =>
    [...paymentKeys.all, 'currentPlan', userId] as const,
};

// Hook to get current plan with subscription and lifetime status
export function useCurrentPlan(userId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.currentPlan(userId || ''),
    queryFn: async (): Promise<{
      currentPlan: PricePlan | null;
      subscription: Subscription | null;
    }> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      console.log('>>> Check current plan start for userId:', userId);
      const result = await getCurrentPlanAction({ userId });
      if (!result?.data?.success) {
        console.log('<<< Check current plan failed:', result?.data?.error);
        throw new Error(result?.data?.error || 'Failed to fetch current plan');
      }

      console.log('<<< Check current plan success');
      return (
        result.data.data || {
          currentPlan: getAllPricePlans().find((plan) => plan.isFree) || null,
          subscription: null,
        }
      );
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
}
