import { checkPaymentCompletionAction } from '@/actions/check-payment-completion';
import { PAYMENT_POLL_INTERVAL } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';

// Query keys for payment completion
export const paymentCompletionKeys = {
  all: ['paymentCompletion'] as const,
  session: (sessionId: string) =>
    [...paymentCompletionKeys.all, 'session', sessionId] as const,
};

// Hook to check if payment is completed by session ID
export function usePaymentCompletion(
  sessionId: string | null,
  enablePolling = false
) {
  return useQuery({
    queryKey: paymentCompletionKeys.session(sessionId || ''),
    queryFn: async () => {
      if (!sessionId) {
        return {
          isPaid: false,
        };
      }
      console.log('>>> Check payment completion for sessionId:', sessionId);
      const result = await checkPaymentCompletionAction({ sessionId });
      if (!result?.data?.success) {
        console.log('<<< Check payment completion error:', result?.data?.error);
        throw new Error(
          result?.data?.error || 'Failed to check payment completion'
        );
      }

      const { isPaid } = result.data;
      console.log('<<< Check payment completion, paid:', isPaid);
      return {
        isPaid,
      };
    },
    enabled: !!sessionId,
    refetchInterval: enablePolling ? PAYMENT_POLL_INTERVAL : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
