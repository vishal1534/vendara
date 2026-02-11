import { Package, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';

interface OrderSummaryCardProps {
  itemName: string;
  quantity: number;
  unit: string;
  totalPayoutAmount: number;
  deliveryDate: string;
  deliveryTimeSlot: {
    startTime: string;
    endTime: string;
  };
  status: VendorOrderStatus;
}

export function OrderSummaryCard({
  itemName,
  quantity,
  unit,
  totalPayoutAmount,
  deliveryDate,
  deliveryTimeSlot,
  status,
}: OrderSummaryCardProps) {
  const getStatusMessage = (status: VendorOrderStatus): string => {
    const messages: Record<VendorOrderStatus, string> = {
      [VendorOrderStatus.OFFERED]: 'Review and respond to this offer',
      [VendorOrderStatus.ACCEPTED]: 'Order accepted - Prepare for delivery',
      [VendorOrderStatus.IN_PROGRESS]: 'Order in progress - Prepare for delivery',
      [VendorOrderStatus.READY]: 'Order ready - Awaiting delivery completion',
      [VendorOrderStatus.COMPLETED]: 'Order completed - Payment settlement in progress',
      [VendorOrderStatus.REJECTED]: 'Order rejected',
      [VendorOrderStatus.ISSUE]: 'Order has an issue',
      [VendorOrderStatus.CANCELLED]: 'Order cancelled',
    };
    return messages[status] || 'Order in progress';
  };

  return (
    <Card className="border-primary-200 bg-primary-50/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">
          Order Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Item</p>
              <p className="text-sm font-semibold text-neutral-900 truncate">{itemName}</p>
              <p className="text-xs text-neutral-600">{quantity} {unit}</p>
            </div>
          </div>

          {/* Your Payout */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-success-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Your Payout</p>
              <p className="text-lg font-bold text-success-700">{formatCurrency(totalPayoutAmount)}</p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Delivery</p>
              <p className="text-sm font-semibold text-neutral-900">{formatDate(deliveryDate)}</p>
              <p className="text-xs text-neutral-600">
                {deliveryTimeSlot.startTime} - {deliveryTimeSlot.endTime}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-warning-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Status</p>
              <p className="text-sm font-medium text-neutral-900">{getStatusMessage(status)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
