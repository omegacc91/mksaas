'use client';

import { getProductOptions, type ProductOptionsByCategory } from '@/actions/get-product-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

const customizationSchema = z.object({
  sizeOptionId: z.string().min(1, 'Please select a size'),
  frameOptionId: z.string().min(1, 'Please select a frame option'),
  mountingOptionId: z.string().min(1, 'Please select a mounting option'),
  recipientName: z.string().min(2, 'Name must be at least 2 characters'),
  recipientPhone: z.string().min(10, 'Please enter a valid phone number'),
  shippingAddress: z.string().min(10, 'Address must be at least 10 characters'),
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
  const [productOptions, setProductOptions] = useState<ProductOptionsByCategory | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      shippingCountry: 'CN',
    },
  });

  const watchedOptions = form.watch(['sizeOptionId', 'frameOptionId', 'mountingOptionId']);

  // Load image from session storage
  useEffect(() => {
    const storedImage = sessionStorage.getItem('wheatStrawImage');
    const storedOriginal = sessionStorage.getItem('wheatStrawOriginalImage');
    const storedPrompt = sessionStorage.getItem('wheatStrawPrompt');

    if (!storedImage) {
      router.push('/wheat-straw');
      return;
    }

    setImageUrl(storedImage);
    setOriginalImageUrl(storedOriginal);
    setPrompt(storedPrompt || '');
  }, [router, locale]);

  // Load product options
  useEffect(() => {
    async function loadOptions() {
      try {
        const options = await getProductOptions();
        setProductOptions(options);
        
        // Set default selections
        if (options.size.length > 0) {
          form.setValue('sizeOptionId', options.size[0].id);
        }
        if (options.frame.length > 0) {
          form.setValue('frameOptionId', options.frame[0].id);
        }
        if (options.mounting.length > 0) {
          form.setValue('mountingOptionId', options.mounting[0].id);
        }
      } catch (error) {
        console.error('Error loading product options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    }

    loadOptions();
  }, [form]);

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!productOptions) return BASE_PRICE;

    let total = BASE_PRICE;

    const [sizeId, frameId, mountingId] = watchedOptions;

    if (sizeId) {
      const option = productOptions.size.find(o => o.id === sizeId);
      if (option) total += option.priceAdjustment;
    }

    if (frameId) {
      const option = productOptions.frame.find(o => o.id === frameId);
      if (option) total += option.priceAdjustment;
    }

    if (mountingId) {
      const option = productOptions.mounting.find(o => o.id === mountingId);
      if (option) total += option.priceAdjustment;
    }

    return total;
  };

  const totalPrice = calculateTotalPrice();

  const onSubmit = async (data: CustomizationFormData) => {
    setIsSubmitting(true);
    try {
      // Store the order data in session storage for checkout
      const orderData = {
        ...data,
        imageUrl,
        originalImageUrl,
        prompt,
        basePrice: BASE_PRICE,
        totalPrice,
      };

      sessionStorage.setItem('wheatStrawOrderData', JSON.stringify(orderData));

      // Navigate to checkout (will be created in payment integration step)
      router.push('/wheat-straw/checkout');
    } catch (error) {
      console.error('Error submitting customization:', error);
      alert(locale === 'zh' ? '提交失败，请重试' : 'Submission failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!imageUrl || isLoadingOptions) {
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
                {productOptions && watchedOptions[0] && (
                  <div className="flex justify-between text-sm">
                    <span>{locale === 'zh' ? '尺寸选项' : 'Size Option'}</span>
                    <span>
                      ${((productOptions.size.find(o => o.id === watchedOptions[0])?.priceAdjustment || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {productOptions && watchedOptions[1] && (
                  <div className="flex justify-between text-sm">
                    <span>{locale === 'zh' ? '边框选项' : 'Frame Option'}</span>
                    <span>
                      ${((productOptions.frame.find(o => o.id === watchedOptions[1])?.priceAdjustment || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {productOptions && watchedOptions[2] && (
                  <div className="flex justify-between text-sm">
                    <span>{locale === 'zh' ? '装裱选项' : 'Mounting Option'}</span>
                    <span>
                      ${((productOptions.mounting.find(o => o.id === watchedOptions[2])?.priceAdjustment || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>{locale === 'zh' ? '总计' : 'Total'}</span>
                  <span>${(totalPrice / 100).toFixed(2)}</span>
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
                  {locale === 'zh' ? '选择您的产品规格和配送信息' : 'Choose your product specifications and shipping details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Size Selection */}
                    {productOptions && productOptions.size.length > 0 && (
                      <FormField
                        control={form.control}
                        name="sizeOptionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{locale === 'zh' ? '尺寸' : 'Size'}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 gap-2"
                              >
                                {productOptions.size.map((option) => (
                                  <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                                    <RadioGroupItem value={option.id} id={`size-${option.id}`} />
                                    <Label htmlFor={`size-${option.id}`} className="flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <span>{locale === 'zh' ? option.nameZh : option.name}</span>
                                        {option.priceAdjustment !== 0 && (
                                          <span className="text-sm text-muted-foreground">
                                            +${(option.priceAdjustment / 100).toFixed(2)}
                                          </span>
                                        )}
                                      </div>
                                      {option.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {locale === 'zh' ? option.descriptionZh : option.description}
                                        </p>
                                      )}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Frame Selection */}
                    {productOptions && productOptions.frame.length > 0 && (
                      <FormField
                        control={form.control}
                        name="frameOptionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{locale === 'zh' ? '边框' : 'Frame'}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 gap-2"
                              >
                                {productOptions.frame.map((option) => (
                                  <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                                    <RadioGroupItem value={option.id} id={`frame-${option.id}`} />
                                    <Label htmlFor={`frame-${option.id}`} className="flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <span>{locale === 'zh' ? option.nameZh : option.name}</span>
                                        {option.priceAdjustment !== 0 && (
                                          <span className="text-sm text-muted-foreground">
                                            +${(option.priceAdjustment / 100).toFixed(2)}
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Mounting Selection */}
                    {productOptions && productOptions.mounting.length > 0 && (
                      <FormField
                        control={form.control}
                        name="mountingOptionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{locale === 'zh' ? '装裱方式' : 'Mounting'}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 gap-2"
                              >
                                {productOptions.mounting.map((option) => (
                                  <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                                    <RadioGroupItem value={option.id} id={`mounting-${option.id}`} />
                                    <Label htmlFor={`mounting-${option.id}`} className="flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <span>{locale === 'zh' ? option.nameZh : option.name}</span>
                                        {option.priceAdjustment !== 0 && (
                                          <span className="text-sm text-muted-foreground">
                                            +${(option.priceAdjustment / 100).toFixed(2)}
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">{locale === 'zh' ? '配送信息' : 'Shipping Information'}</h3>
                      
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

