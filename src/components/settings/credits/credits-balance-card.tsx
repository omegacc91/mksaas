'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { websiteConfig } from '@/config/website';
import { useCreditBalance, useCreditStats } from '@/hooks/use-credits';
import { useMounted } from '@/hooks/use-mounted';
import { useLocaleRouter } from '@/i18n/navigation';
import { formatDate } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Credits balance card, show credit balance
 */
export default function CreditsBalanceCard() {
  // Don't render if credits are disabled - move this check before any hooks
  if (!websiteConfig.credits.enableCredits) {
    return null;
  }

  const t = useTranslations('Dashboard.settings.credits.balance');
  const searchParams = useSearchParams();
  const localeRouter = useLocaleRouter();
  const hasHandledSession = useRef(false);
  const mounted = useMounted();

  // Use TanStack Query hooks for credits
  const {
    data: balance = 0,
    isLoading: isLoadingBalance,
    error: balanceError,
    refetch: refetchBalance,
  } = useCreditBalance();

  // TanStack Query hook for credit statistics
  const {
    data: creditStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useCreditStats();

  // Handle payment success after credits purchase
  const handlePaymentSuccess = useCallback(async () => {
    // Use queueMicrotask to avoid React rendering conflicts
    queueMicrotask(() => {
      toast.success(t('creditsAdded'));
    });

    // Wait for webhook to process (simplified approach)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Force refresh data
    refetchBalance();
    refetchStats();
  }, [t, refetchBalance, refetchStats]);

  // Check for payment success and show success message
  useEffect(() => {
    const sessionId = searchParams.get('credits_session_id');
    if (sessionId && !hasHandledSession.current) {
      hasHandledSession.current = true;

      // Clean up URL parameters first
      const url = new URL(window.location.href);
      url.searchParams.delete('credits_session_id');
      localeRouter.replace(Routes.SettingsCredits + url.search);

      // Handle payment success
      handlePaymentSuccess();
    }
  }, [searchParams, localeRouter, handlePaymentSuccess]);

  // Retry all data fetching using refetch methods
  const handleRetry = useCallback(() => {
    // Use refetch methods for immediate data refresh
    refetchBalance();
    refetchStats();
  }, [refetchBalance, refetchStats]);

  // Render loading skeleton
  if (!mounted || isLoadingBalance || isLoadingStats) {
    return (
      <Card className={cn('w-full overflow-hidden pt-6 pb-0 flex flex-col')}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <div className="flex items-center justify-start space-x-4">
            <Skeleton className="h-6 w-1/5" />
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <Skeleton className="h-6 w-3/5" />
          </div>
        </CardContent>
        <CardFooter className="">{/* show nothing */}</CardFooter>
      </Card>
    );
  }

  // Render error state
  if (balanceError || statsError) {
    return (
      <Card className={cn('w-full overflow-hidden pt-6 pb-0 flex flex-col')}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <div className="text-destructive text-sm">
            {balanceError?.message || statsError?.message}
          </div>
        </CardContent>
        <CardFooter className="mt-2 px-6 py-4 flex justify-end items-center bg-background rounded-none">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleRetry}
          >
            <RefreshCwIcon className="size-4 mr-1" />
            {t('retry')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full overflow-hidden pt-6 pb-0 flex flex-col')}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {/* Credits balance display */}
        <div className="flex items-center justify-start space-x-4">
          <div className="flex items-center space-x-2">
            {/* <CoinsIcon className="h-6 w-6 text-muted-foreground" /> */}
            <div className="text-3xl font-medium">
              {balance.toLocaleString()}
            </div>
          </div>
          {/* <Badge variant="outline">available</Badge> */}
        </div>

        {/* Balance information */}
        <div className="text-sm text-muted-foreground space-y-2">
          {/* Expiring credits warning */}
          {!isLoadingStats &&
            creditStats &&
            creditStats.expiringCredits.amount > 0 &&
            creditStats.expiringCredits.earliestExpiration && (
              <div className="flex items-center gap-2 text-amber-600">
                <span>
                  {t('expiringCredits', {
                    credits: creditStats.expiringCredits.amount,
                    date: formatDate(
                      new Date(creditStats.expiringCredits.earliestExpiration)
                    ),
                  })}
                </span>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="">
        {/* <Button variant="default" className="cursor-pointer" asChild>
          <LocaleLink href={Routes.SettingsCredits}>
            {t('viewTransactions')}
          </LocaleLink>
        </Button> */}
      </CardFooter>
    </Card>
  );
}
