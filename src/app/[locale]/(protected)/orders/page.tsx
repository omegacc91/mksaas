import { getUserWheatStrawOrders } from '@/actions/get-wheat-straw-orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from 'next-intl';

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

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Orders' });
  
  const result = await getUserWheatStrawOrders();
  
  if (!result?.data?.success || !result.data.data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('myOrders')}</CardTitle>
            <CardDescription>{t('errorLoadingOrders')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const orders = result.data.data;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('myOrders')}</h1>
          <p className="text-muted-foreground">{t('viewYourOrders')}</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{t('noOrders')}</h3>
              <p className="text-muted-foreground mb-4">{t('noOrdersDescription')}</p>
              <Button asChild>
                <Link href="/wheat-straw">
                  {t('createYourFirst')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Order Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={order.generatedImageUrl}
                        alt={order.orderNumber}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{t('orderNumber')}: {order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(locale)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {t(`status.${order.status}` as any)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        {order.sizeOption && (
                          <div>
                            <span className="text-muted-foreground">{t('size')}:</span>{' '}
                            {locale === 'zh' ? order.sizeOption.nameZh : order.sizeOption.name}
                          </div>
                        )}
                        {order.frameOption && (
                          <div>
                            <span className="text-muted-foreground">{t('frame')}:</span>{' '}
                            {locale === 'zh' ? order.frameOption.nameZh : order.frameOption.name}
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">{t('total')}:</span>{' '}
                          <span className="font-semibold">
                            ${(order.totalPrice / 100).toFixed(2)}
                          </span>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <span className="text-muted-foreground">{t('tracking')}:</span>{' '}
                            {order.trackingNumber}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            {t('viewDetails')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

