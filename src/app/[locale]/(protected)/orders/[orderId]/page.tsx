import { getWheatStrawOrderDetail } from '@/actions/get-wheat-straw-orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-blue-500';
    case 'in_production':
      return 'bg-yellow-500';
    case 'shipped':
      return 'bg-purple-500';
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  const t = await getTranslations({ locale, namespace: 'Orders' });
  
  const result = await getWheatStrawOrderDetail({ orderId });
  
  if (!result?.data?.success || !result.data.data) {
    notFound();
  }

  const order = result.data.data;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToOrders')}
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('orderNumber')}: {order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {t('placed')} {new Date(order.createdAt).toLocaleString(locale)}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
            {t(`status.${order.status}` as any)}
          </Badge>
        </div>

        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>{t('orderTimeline')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('orderPlaced')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              )}
              
              {order.paidAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('paymentConfirmed')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.paidAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              )}
              
              {order.inProductionAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('inProduction')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.inProductionAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              )}
              
              {order.shippedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('shipped')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.shippedAt).toLocaleString(locale)}
                    </p>
                    {order.shippingCompany && (
                      <p className="text-sm">
                        {t('carrier')}: {order.shippingCompany}
                      </p>
                    )}
                    {order.trackingNumber && (
                      <p className="text-sm">
                        {t('tracking')}: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {order.completedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('completed')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.completedAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              )}
              
              {order.cancelledAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('cancelled')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.cancelledAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t('productDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-square max-w-md rounded-lg overflow-hidden bg-muted">
              <img
                src={order.generatedImageUrl}
                alt={order.orderNumber}
                className="w-full h-full object-cover"
              />
            </div>
            
            {order.prompt && (
              <div>
                <h4 className="font-medium mb-1">{t('design')}</h4>
                <p className="text-sm text-muted-foreground">{order.prompt}</p>
              </div>
            )}
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              {order.sizeOption && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('size')}</p>
                  <p className="font-medium">
                    {locale === 'zh' ? order.sizeOption.nameZh : order.sizeOption.name}
                  </p>
                </div>
              )}
              {order.frameOption && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('frame')}</p>
                  <p className="font-medium">
                    {locale === 'zh' ? order.frameOption.nameZh : order.frameOption.name}
                  </p>
                </div>
              )}
              {order.mountingOption && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('mounting')}</p>
                  <p className="font-medium">
                    {locale === 'zh' ? order.mountingOption.nameZh : order.mountingOption.name}
                  </p>
                </div>
              )}
            </div>
            
            {order.customerNote && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-1">{t('yourNote')}</h4>
                  <p className="text-sm text-muted-foreground">{order.customerNote}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t('shippingAddress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-medium">{order.recipientName}</p>
              <p className="text-sm">{order.recipientPhone}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}
              </p>
              <p className="text-sm text-muted-foreground">{order.shippingCountry}</p>
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t('priceSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('basePrice')}</span>
              <span>${(order.basePrice / 100).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>{t('total')}</span>
              <span>${(order.totalPrice / 100).toFixed(2)} {order.currency}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

