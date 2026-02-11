import { DollarSign, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Separator } from '../../../../app/components/ui/separator';
import { Badge } from '../../../../app/components/ui/badge';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

interface PaymentPayoutCardProps {
  // Payment Information (what buyer paid)
  orderTotal: number;
  deliveryCharges?: number;
  platformFee?: number;
  totalPaidByBuyer: number;
  paymentMethod?: string;
  paymentStatus: 'received' | 'pending' | 'failed';
  
  // Payout Information (what vendor receives)
  basePayoutAmount: number;
  vendaraFee: number;
  logisticsFee?: number;
  totalPayoutAmount: number;
  
  // Settlement Information
  settlementStatus?: string;
  settlementId?: string;
  showSettlementLink?: boolean;
}

export function PaymentPayoutCard({
  orderTotal,
  deliveryCharges = 0,
  platformFee = 0,
  totalPaidByBuyer,
  paymentMethod = 'UPI',
  paymentStatus,
  basePayoutAmount,
  vendaraFee,
  logisticsFee = 0,
  totalPayoutAmount,
  settlementStatus,
  settlementId,
  showSettlementLink = false,
}: PaymentPayoutCardProps) {
  const navigate = useNavigate();

  const getPaymentStatusBadge = () => {
    if (paymentStatus === 'received') {
      return (
        <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Received
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getSettlementBadge = () => {
    if (!settlementStatus || settlementStatus === 'pending') {
      return (
        <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }
    if (settlementStatus === 'processing') {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Settled
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Payment Information */}
      <Card className="border-neutral-200">
        <CardHeader className="border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Payment Information
          </CardTitle>
          <p className="text-xs text-neutral-500 mt-1">What the buyer paid</p>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Order Total</span>
            <span className="text-sm font-semibold text-neutral-900">
              {formatCurrency(orderTotal)}
            </span>
          </div>

          {deliveryCharges > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Delivery Charges</span>
              <span className="text-sm font-semibold text-neutral-900">
                {formatCurrency(deliveryCharges)}
              </span>
            </div>
          )}

          {platformFee > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Platform Fee</span>
              <span className="text-sm font-semibold text-neutral-900">
                {formatCurrency(platformFee)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-neutral-900">Total Paid by Buyer</span>
            <span className="text-lg font-bold text-neutral-900">
              {formatCurrency(totalPaidByBuyer)}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Payment Method</span>
            <span className="text-sm font-medium text-neutral-900">{paymentMethod}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Payment Status</span>
            {getPaymentStatusBadge()}
          </div>
        </CardContent>
      </Card>

      {/* Payout Breakdown */}
      <Card className="border-primary-200 bg-primary-50/30">
        <CardHeader className="border-b border-primary-200">
          <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            Your Payout Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Base Amount</span>
            <span className="text-sm font-semibold text-neutral-900">
              {formatCurrency(basePayoutAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Vendara Fee</span>
            <span className="text-sm font-semibold text-error-600">
              - {formatCurrency(vendaraFee)}
            </span>
          </div>

          {logisticsFee > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Logistics Fee</span>
              <span className="text-sm font-semibold text-error-600">
                - {formatCurrency(logisticsFee)}
              </span>
            </div>
          )}

          <Separator className="bg-primary-200" />

          <div className="flex items-center justify-between pt-2">
            <span className="text-base font-semibold text-neutral-900">Your Total Payout</span>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(totalPayoutAmount)}
            </span>
          </div>

          <Separator className="bg-primary-200" />

          {/* Settlement Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Settlement Status</span>
            {getSettlementBadge()}
          </div>

          {(!settlementStatus || settlementStatus === 'pending') && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mt-2">
              <p className="text-xs text-warning-800">
                <strong>Expected Settlement:</strong> Within 7 days of order completion
              </p>
            </div>
          )}

          {/* Settlement Link */}
          {showSettlementLink && settlementId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/vendor/payouts/${settlementId}`)}
              className="w-full justify-between border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 mt-2"
            >
              <span className="text-primary-700 font-medium">View Settlement Details</span>
              <ExternalLink className="w-4 h-4 text-primary-600" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
