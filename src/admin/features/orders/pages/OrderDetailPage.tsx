/**
 * Order Detail Page - Admin Portal
 * Comprehensive order details with timeline, items, and admin actions
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrders } from '../../../data/mockOrders';
import { OrderStatus } from '../../../types/order';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Truck,
  Edit,
  MessageSquare,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-neutral-100 text-neutral-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-secondary-100 text-secondary-700', icon: CheckCircle2 },
  active: { label: 'Active', color: 'bg-primary-100 text-primary-700', icon: Package },
  completed: { label: 'Completed', color: 'bg-[#22C55E]/10 text-[#22C55E]', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-error-100 text-error-700', icon: XCircle },
  disputed: { label: 'Disputed', color: 'bg-error-100 text-error-700', icon: XCircle },
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = mockOrders.find((o) => o.id === id);
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'pending');

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Order Not Found</h2>
          <p className="text-neutral-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as OrderStatus);
    toast.success(`Order status updated to ${statusConfig[newStatus as OrderStatus].label}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Created on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Actions */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Order Status</h2>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${statusConfig[status].color}`}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-medium">{statusConfig[status].label}</span>
              </div>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{item.name}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{item.category}</p>
                      {item.specifications && (
                        <p className="text-sm text-neutral-500 mt-1">
                          Specs: {item.specifications}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-neutral-600">
                          Quantity: <span className="font-medium">{item.quantity} {item.unit}</span>
                        </span>
                        <span className="text-sm text-neutral-600">
                          Unit Price: <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-neutral-900">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-neutral-200 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-neutral-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Platform Fee (3%)</span>
                <span className="text-neutral-900">{formatCurrency(order.platformFee)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span className="text-neutral-900">{formatCurrency(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">GST (12%)</span>
                <span className="text-neutral-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-neutral-200">
                <span className="text-neutral-900">Total Amount</span>
                <span className="text-primary-700">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Delivery Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Delivery Address</p>
                  <p className="text-sm text-neutral-600 mt-1">{order.deliveryAddress}</p>
                </div>
              </div>
              {order.deliveryDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Scheduled Delivery</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {formatDate(order.deliveryDate)}
                      {order.deliverySlot && ` • ${order.deliverySlot}`}
                    </p>
                  </div>
                </div>
              )}
              {order.notes && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Special Instructions</p>
                    <p className="text-sm text-neutral-600 mt-1">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating & Review */}
          {order.rating && (
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Customer Review</h2>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (order.rating || 0)
                        ? 'fill-[#FFC107] text-[#FFC107]'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium text-neutral-900 ml-2">
                  {order.rating}.0
                </span>
              </div>
              {order.reviewText && (
                <p className="text-sm text-neutral-600 mt-2">{order.reviewText}</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buyer Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Buyer Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{order.buyerName}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Buyer ID: {order.buyerId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-900">{order.buyerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-900">{order.buyerLocation}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate(`/admin/buyers/${order.buyerId}`)}
            >
              View Buyer Profile
            </Button>
          </div>

          {/* Vendor Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Vendor Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{order.vendorName}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{order.vendorType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-900">{order.vendorPhone}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate(`/admin/vendors/${order.vendorId}`)}
            >
              View Vendor Profile
            </Button>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Payment Status</span>
                <Badge
                  variant={
                    order.paymentStatus === 'paid'
                      ? 'default'
                      : order.paymentStatus === 'refunded'
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Payment Method</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {order.paymentMethod}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-neutral-200">
                <span className="text-sm font-medium text-neutral-900">Total Amount</span>
                <span className="text-sm font-semibold text-primary-700">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-700 mt-2" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Order Placed</p>
                  <p className="text-xs text-neutral-500">{formatDateTime(order.createdAt)}</p>
                </div>
              </div>
              {order.confirmedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-700 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Order Confirmed</p>
                    <p className="text-xs text-neutral-500">{formatDateTime(order.confirmedAt)}</p>
                  </div>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Order Delivered</p>
                    <p className="text-xs text-neutral-500">{formatDateTime(order.deliveredAt)}</p>
                  </div>
                </div>
              )}
              {order.cancelledAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-error-700 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Order Cancelled</p>
                    <p className="text-xs text-neutral-500">{formatDateTime(order.cancelledAt)}</p>
                    {order.cancellationReason && (
                      <p className="text-xs text-neutral-600 mt-1">
                        Reason: {order.cancellationReason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}