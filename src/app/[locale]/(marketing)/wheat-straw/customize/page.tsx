'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocaleRouter } from '@/i18n/navigation';
import { ArrowLeft, Check, Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const BASE_PRICE = 9900; // $99 base price in cents

// Relaxed validation schema
const customizationSchema = z.object({
  recipientName: z.string().min(1, 'Name is required'),
  recipientPhone: z.string().min(5, 'Phone number must be at least 5 digits'),
  shippingAddress: z.string().min(5, 'Address must be at least 5 characters'),
  shippingCity: z.string().min(2, 'City is required'),
  shippingProvince: z.string().min(2, 'Province/State is required'),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().min(1, 'Country is required'),
  customerNote: z.string().optional(),
});

type CustomizationFormData = z.infer<typeof customizationSchema>;

export default function CustomizePage() {
  const router = useLocaleRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed default values as requested
  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      recipientName: '',
      recipientPhone: '',
      shippingAddress: '',
      shippingCity: '',
      shippingProvince: '',
      shippingPostalCode: '',
      shippingCountry: 'US', // Default to US
      customerNote: '',
    },
  });

  // Load image from session storage
  useEffect(() => {
    // Ensure we are in the browser
    if (typeof window === 'undefined') return;

    const storedImage = sessionStorage.getItem('wheatStrawImage');
    const storedOriginal = sessionStorage.getItem('wheatStrawOriginalImage');
    const storedPrompt = sessionStorage.getItem('wheatStrawPrompt');

    if (!storedImage) {
      // If direct access without image, redirect back
      router.push('/wheat-straw');
      return;
    }

    setImageUrl(storedImage);
    setOriginalImageUrl(storedOriginal);
    setPrompt(storedPrompt || '');
  }, [router, locale]);

  const onSubmit = async (data: CustomizationFormData) => {
    console.log('Submitting form data:', data);
    setIsSubmitting(true);
    try {
      // Store the order data in session storage for checkout
      const orderData = {
        ...data,
        imageUrl,
        originalImageUrl,
        prompt,
        basePrice: BASE_PRICE,
        totalPrice: BASE_PRICE, // Fixed price since options are removed
        sizeOptionId: null,
        frameOptionId: null,
        mountingOptionId: null,
      };

      sessionStorage.setItem('wheatStrawOrderData', JSON.stringify(orderData));
      console.log('Stored order data, redirecting to checkout...');

      // Navigate to checkout
      router.push('/wheat-straw/checkout');
    } catch (error) {
      console.error('Error submitting customization:', error);
      alert(locale === 'zh' ? '提交失败，请重试' : 'Submission failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.error('Form validation errors:', errors);
    const errorMessages = Object.values(errors)
      .map((e: any) => e.message)
      .join('\n');
    alert(locale === 'zh' 
      ? `提交失败，请检查以下信息：\n${errorMessages}` 
      : `Submission failed, please check the following:\n${errorMessages}`);
  };

  if (!imageUrl) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/wheat-straw')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '返回生成器' : 'Back to Generator'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'zh' ? '您的麦秆画' : 'Your Wheat Straw Painting'}</CardTitle>
                <CardDescription>
                  {prompt || (locale === 'zh' ? '自定义麦秆画设计' : 'Custom wheat straw painting design')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Wheat straw painting"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'zh' ? '价格明细' : 'Price Summary'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{locale === 'zh' ? '基础价格' : 'Base Price'}</span>
                  <span>${(BASE_PRICE / 100).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>{locale === 'zh' ? '总计' : 'Total'}</span>
                  <span>${(BASE_PRICE / 100).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customization Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'zh' ? '定制选项' : 'Customization Options'}</CardTitle>
                <CardDescription>
                  {locale === 'zh' ? '填写配送信息' : 'Enter shipping details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                    
                    <div className="pt-2">
                       {/* Shipping Info Fields */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="recipientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{locale === 'zh' ? '收件人姓名' : 'Recipient Name'}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={locale === 'zh' ? '张三' : 'John Doe'} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="recipientPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{locale === 'zh' ? '联系电话' : 'Phone Number'}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={locale === 'zh' ? '13800138000' : '+1234567890'} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shippingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{locale === 'zh' ? '详细地址' : 'Street Address'}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={locale === 'zh' ? 'XX路XX号XX小区XX栋XX单元' : '123 Main St, Apt 4B'} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="shippingCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{locale === 'zh' ? '城市' : 'City'}</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={locale === 'zh' ? '北京' : 'New York'} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="shippingProvince"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{locale === 'zh' ? '省/州' : 'Province/State'}</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={locale === 'zh' ? '北京' : 'NY'} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="shippingCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{locale === 'zh' ? '国家' : 'Country'}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={locale === 'zh' ? '选择国家' : 'Select a country'} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="US">{locale === 'zh' ? '美国' : 'United States'}</SelectItem>
                                  <SelectItem value="CN">{locale === 'zh' ? '中国' : 'China'}</SelectItem>
                                  <SelectItem value="CA">{locale === 'zh' ? '加拿大' : 'Canada'}</SelectItem>
                                  <SelectItem value="UK">{locale === 'zh' ? '英国' : 'United Kingdom'}</SelectItem>
                                  <SelectItem value="AU">{locale === 'zh' ? '澳大利亚' : 'Australia'}</SelectItem>
                                  <SelectItem value="JP">{locale === 'zh' ? '日本' : 'Japan'}</SelectItem>
                                  <SelectItem value="DE">{locale === 'zh' ? '德国' : 'Germany'}</SelectItem>
                                  <SelectItem value="FR">{locale === 'zh' ? '法国' : 'France'}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shippingPostalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{locale === 'zh' ? '邮政编码（可选）' : 'Postal Code (Optional)'}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={locale === 'zh' ? '100000' : '10001'} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerNote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{locale === 'zh' ? '备注（可选）' : 'Note (Optional)'}</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder={locale === 'zh' ? '特殊要求或备注信息' : 'Special requests or notes'} rows={3} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {locale === 'zh' ? '处理中...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {locale === 'zh' ? '前往支付' : 'Proceed to Checkout'}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
