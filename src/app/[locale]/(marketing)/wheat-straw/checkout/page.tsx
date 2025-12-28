'use client';

import { getProductOptions, type ProductOptionsByCategory } from '@/actions/get-product-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useLocaleRouter } from '@/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const paymentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  cardNumber: z.string().min(15, 'Card number is too short').max(19, 'Card number is too long'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid date (MM/YY)'),
  cvc: z.string().min(3, 'CVC is too short').max(4, 'CVC is too long'),
  cardName: z.string().min(2, 'Name is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function CheckoutPage() {
  const router = useLocaleRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productOptions, setProductOptions] = useState<ProductOptionsByCategory | null>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      cardName: '',
    },
  });

  useEffect(() => {
    async function init() {
      // 1. Get order data
      const orderDataStr = sessionStorage.getItem('wheatStrawOrderData');
      if (!orderDataStr) {
        router.push('/wheat-straw/customize');
        return;
      }
      setOrderData(JSON.parse(orderDataStr));

      // 2. Get product options to display names
      try {
        const options = await getProductOptions();
        setProductOptions(options);
      } catch (error) {
        console.error('Failed to load options', error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [router]);

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Clear session storage on success
      sessionStorage.removeItem('wheatStrawOrderData');
      sessionStorage.removeItem('wheatStrawImage');
      sessionStorage.removeItem('wheatStrawOriginalImage');
      sessionStorage.removeItem('wheatStrawPrompt');
    }, 2000);
  };

  const getOptionName = (category: keyof ProductOptionsByCategory, id: string) => {
    if (!productOptions) return id;
    const option = productOptions[category].find((o: any) => o.id === id);
    return option ? (locale === 'zh' ? option.nameZh : option.name) : id;
  };

  const getOptionPrice = (category: keyof ProductOptionsByCategory, id: string) => {
    if (!productOptions) return 0;
    const option = productOptions[category].find((o: any) => o.id === id);
    return option ? option.priceAdjustment : 0;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-10 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-800">
                  {locale === 'zh' ? '支付成功！' : 'Payment Successful!'}
                </h2>
                <p className="text-muted-foreground">
                  {locale === 'zh' 
                    ? '感谢您的购买。您的麦秆画定制订单已确认。' 
                    : 'Thank you for your purchase. Your custom wheat straw painting order has been confirmed.'}
                </p>
              </div>

              <div className="w-full pt-4">
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/wheat-straw')}
                >
                  {locale === 'zh' ? '创建新作品' : 'Create Another'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/wheat-straw/customize')}
          className="pl-0 hover:pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '返回修改' : 'Back to Customize'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '订单摘要' : 'Order Summary'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {orderData.imageUrl && (
                      <Image 
                        src={orderData.imageUrl} 
                        alt="Preview" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {locale === 'zh' ? '定制麦秆画' : 'Custom Wheat Straw Painting'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {orderData.prompt}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{locale === 'zh' ? '基础价格' : 'Base Price'}</span>
                    <span>${(orderData.basePrice / 100).toFixed(2)}</span>
                  </div>
                  
                  {orderData.sizeOptionId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {locale === 'zh' ? '尺寸' : 'Size'}: {getOptionName('size', orderData.sizeOptionId)}
                      </span>
                      <span>
                        +${(getOptionPrice('size', orderData.sizeOptionId) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {orderData.frameOptionId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {locale === 'zh' ? '边框' : 'Frame'}: {getOptionName('frame', orderData.frameOptionId)}
                      </span>
                      <span>
                        +${(getOptionPrice('frame', orderData.frameOptionId) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {orderData.mountingOptionId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {locale === 'zh' ? '装裱' : 'Mounting'}: {getOptionName('mounting', orderData.mountingOptionId)}
                      </span>
                      <span>
                        +${(getOptionPrice('mounting', orderData.mountingOptionId) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{locale === 'zh' ? '总计' : 'Total'}</span>
                  <span>${(orderData.totalPrice / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            {locale === 'zh' ? '安全支付，SSL加密保障' : 'Secure payment embedded with SSL encryption'}
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '支付详情' : 'Payment Details'}</CardTitle>
              <CardDescription>
                {locale === 'zh' ? '输入您的银行卡信息完成支付' : 'Enter your card details to complete purchase'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{locale === 'zh' ? '电子邮箱' : 'Email'}</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{locale === 'zh' ? '持卡人姓名' : 'Name on Card'}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{locale === 'zh' ? '卡号' : 'Card Number'}</FormLabel>
                        <FormControl>
                          <div className="relative">
                             <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="4242 4242 4242 4242" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{locale === 'zh' ? '有效期' : 'Expiry Date'}</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="123" type="password" maxLength={4} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full mt-4" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {locale === 'zh' ? '支付中...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        {locale === 'zh' ? `支付 $${(orderData?.totalPrice / 100).toFixed(2)}` : `Pay $${(orderData?.totalPrice / 100).toFixed(2)}`}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="bg-muted/50 text-xs text-muted-foreground text-center px-6 py-4 rounded-b-lg">
              {locale === 'zh' 
                ? '这是一个模拟支付演示。不会发生真实扣款。' 
                : 'This is a simulated payment for demonstration purposes. No real charge will be made.'}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
