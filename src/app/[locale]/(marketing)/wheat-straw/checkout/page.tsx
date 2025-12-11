'use client';

import { createWheatStrawCheckoutAction } from '@/actions/create-wheat-straw-checkout';
import { useLocaleRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const router = useLocaleRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processCheckout() {
      // Get order data from session storage
      const orderDataStr = sessionStorage.getItem('wheatStrawOrderData');
      
      if (!orderDataStr) {
        router.push('/wheat-straw/customize');
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const orderData = JSON.parse(orderDataStr);
        
        // Create checkout session
        const result = await createWheatStrawCheckoutAction(orderData);
        
        if (result?.data?.success && result.data.data) {
          const checkoutUrl = result.data.data.url;
          if (checkoutUrl) {
            // Clear session storage
            sessionStorage.removeItem('wheatStrawOrderData');
            sessionStorage.removeItem('wheatStrawImage');
            sessionStorage.removeItem('wheatStrawOriginalImage');
            sessionStorage.removeItem('wheatStrawPrompt');
            
            // Redirect to Stripe checkout
            window.location.href = checkoutUrl;
          } else {
            setError('Failed to get checkout URL');
            setIsProcessing(false);
          }
        } else {
          setError(result?.data?.error || 'Failed to create checkout session');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setError('An unexpected error occurred');
        setIsProcessing(false);
      }
    }

    processCheckout();
  }, [router, locale]);

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '处理支付' : 'Processing Payment'}</CardTitle>
            <CardDescription>
              {locale === 'zh' ? '请稍候，正在跳转到支付页面...' : 'Please wait, redirecting to payment page...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground text-center">
                  {locale === 'zh' ? '正在准备您的订单...' : 'Preparing your order...'}
                </p>
              </>
            ) : error ? (
              <>
                <div className="bg-destructive/10 p-4 rounded-lg w-full">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/wheat-straw/customize')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {locale === 'zh' ? '返回' : 'Go Back'}
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

