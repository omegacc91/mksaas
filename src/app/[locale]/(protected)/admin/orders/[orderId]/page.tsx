'use client';

import { getWheatStrawOrderDetail } from '@/actions/get-wheat-straw-orders';
import { updateOrderStatus, updateShippingInfo, updateAdminNote } from '@/actions/update-wheat-straw-order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, Loader2, MapPin, Package, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [status, setStatus] = useState('');
  const [shippingCompany, setShippingCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const result = await getWheatStrawOrderDetail({ orderId });
      if (result?.data?.success && result.data.data) {
        const orderData = result.data.data;
        setOrder(orderData);
        setStatus(orderData.status);
        setShippingCompany(orderData.shippingCompany || '');
        setTrackingNumber(orderData.trackingNumber || '');
        setAdminNote(orderData.adminNote || '');
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleSaveStatus = async () => {
    setIsSaving(true);
    try {
      const result = await updateOrderStatus({ orderId, status: status as any });
      if (result?.data?.success) {
        alert(locale === 'zh' ? '状态已更新' : 'Status updated');
        await loadOrder();
      } else {
        alert(locale === 'zh' ? '更新失败' : 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(locale === 'zh' ? '更新失败' : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveShipping = async () => {
    if (!shippingCompany || !trackingNumber) {
      alert(locale === 'zh' ? '请填写所有运输信息' : 'Please fill in all shipping information');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateShippingInfo({ orderId, shippingCompany, trackingNumber });
      if (result?.data?.success) {
        alert(locale === 'zh' ? '运输信息已更新' : 'Shipping information updated');
        await loadOrder();
      } else {
        alert(locale === 'zh' ? '更新失败' : 'Update failed');
      }
    } catch (error) {
      console.error('Error updating shipping info:', error);
      alert(locale === 'zh' ? '更新失败' : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      const result = await updateAdminNote({ orderId, adminNote });
      if (result?.data?.success) {
        alert(locale === 'zh' ? '备注已保存' : 'Note saved');
        await loadOrder();
      } else {
        alert(locale === 'zh' ? '保存失败' : 'Save failed');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert(locale === 'zh' ? '保存失败' : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>{locale === 'zh' ? '订单未找到' : 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {locale === 'zh' ? '返回订单列表' : 'Back to Orders'}
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {locale === 'zh' ? '订单详情' : 'Order Details'}
            </h1>
            <p className="text-muted-foreground">{order.orderNumber}</p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
            {locale === 'zh' 
              ? ({ paid: '已支付', in_production: '制作中', shipped: '已发货', completed: '已完成', cancelled: '已取消' } as any)[order.status]
              : order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '产品图片' : 'Product Image'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={order.generatedImageUrl}
                    alt={order.orderNumber}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href={order.generatedImageUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    {locale === 'zh' ? '下载高清图片' : 'Download High-Res Image'}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '客户信息' : 'Customer Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>{locale === 'zh' ? '收件人' : 'Recipient'}</Label>
                  <p className="text-sm">{order.recipientName}</p>
                </div>
                <div>
                  <Label>{locale === 'zh' ? '联系电话' : 'Phone'}</Label>
                  <p className="text-sm">{order.recipientPhone}</p>
                </div>
                <div>
                  <Label>{locale === 'zh' ? '配送地址' : 'Shipping Address'}</Label>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}</p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </div>
                {order.customerNote && (
                  <div>
                    <Label>{locale === 'zh' ? '客户备注' : 'Customer Note'}</Label>
                    <p className="text-sm text-muted-foreground">{order.customerNote}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '产品规格' : 'Product Specifications'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.sizeOption && (
                  <div>
                    <Label>{locale === 'zh' ? '尺寸' : 'Size'}</Label>
                    <p className="text-sm">
                      {locale === 'zh' ? order.sizeOption.nameZh : order.sizeOption.name}
                    </p>
                  </div>
                )}
                {order.frameOption && (
                  <div>
                    <Label>{locale === 'zh' ? '边框' : 'Frame'}</Label>
                    <p className="text-sm">
                      {locale === 'zh' ? order.frameOption.nameZh : order.frameOption.name}
                    </p>
                  </div>
                )}
                {order.mountingOption && (
                  <div>
                    <Label>{locale === 'zh' ? '装裱' : 'Mounting'}</Label>
                    <p className="text-sm">
                      {locale === 'zh' ? order.mountingOption.nameZh : order.mountingOption.name}
                    </p>
                  </div>
                )}
                {order.prompt && (
                  <div>
                    <Label>{locale === 'zh' ? '设计描述' : 'Design Description'}</Label>
                    <p className="text-sm text-muted-foreground">{order.prompt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Management */}
          <div className="space-y-6">
            {/* Order Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '订单状态管理' : 'Order Status Management'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{locale === 'zh' ? '当前状态' : 'Current Status'}</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">
                        {locale === 'zh' ? '已支付' : 'Paid'}
                      </SelectItem>
                      <SelectItem value="in_production">
                        {locale === 'zh' ? '制作中' : 'In Production'}
                      </SelectItem>
                      <SelectItem value="shipped">
                        {locale === 'zh' ? '已发货' : 'Shipped'}
                      </SelectItem>
                      <SelectItem value="completed">
                        {locale === 'zh' ? '已完成' : 'Completed'}
                      </SelectItem>
                      <SelectItem value="cancelled">
                        {locale === 'zh' ? '已取消' : 'Cancelled'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSaveStatus} 
                  disabled={isSaving || status === order.status}
                  className="w-full"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {locale === 'zh' ? '更新状态' : 'Update Status'}
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '运输信息' : 'Shipping Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{locale === 'zh' ? '快递公司' : 'Shipping Company'}</Label>
                  <Input
                    value={shippingCompany}
                    onChange={(e) => setShippingCompany(e.target.value)}
                    placeholder={locale === 'zh' ? '顺丰快递' : 'FedEx'}
                  />
                </div>
                <div>
                  <Label>{locale === 'zh' ? '运单号' : 'Tracking Number'}</Label>
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder={locale === 'zh' ? '输入运单号' : 'Enter tracking number'}
                  />
                </div>
                <Button 
                  onClick={handleSaveShipping} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {locale === 'zh' ? '保存运输信息' : 'Save Shipping Info'}
                </Button>
              </CardContent>
            </Card>

            {/* Admin Note */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '管理员备注' : 'Admin Note'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={locale === 'zh' ? '添加内部备注...' : 'Add internal note...'}
                  rows={4}
                />
                <Button 
                  onClick={handleSaveNote} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {locale === 'zh' ? '保存备注' : 'Save Note'}
                </Button>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '订单时间线' : 'Order Timeline'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {order.createdAt && (
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '创建：' : 'Created: '}</span>
                    <span className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString(locale)}
                    </span>
                  </div>
                )}
                {order.paidAt && (
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '支付：' : 'Paid: '}</span>
                    <span className="text-muted-foreground">
                      {new Date(order.paidAt).toLocaleString(locale)}
                    </span>
                  </div>
                )}
                {order.inProductionAt && (
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '制作：' : 'In Production: '}</span>
                    <span className="text-muted-foreground">
                      {new Date(order.inProductionAt).toLocaleString(locale)}
                    </span>
                  </div>
                )}
                {order.shippedAt && (
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '发货：' : 'Shipped: '}</span>
                    <span className="text-muted-foreground">
                      {new Date(order.shippedAt).toLocaleString(locale)}
                    </span>
                  </div>
                )}
                {order.completedAt && (
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '完成：' : 'Completed: '}</span>
                    <span className="text-muted-foreground">
                      {new Date(order.completedAt).toLocaleString(locale)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'zh' ? '价格明细' : 'Price Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === 'zh' ? '基础价格' : 'Base Price'}
                  </span>
                  <span>${(order.basePrice / 100).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{locale === 'zh' ? '总计' : 'Total'}</span>
                  <span>${(order.totalPrice / 100).toFixed(2)} {order.currency}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

