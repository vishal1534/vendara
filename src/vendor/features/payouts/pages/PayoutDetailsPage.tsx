import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Separator } from '../../../../app/components/ui/separator';
import {
  ArrowLeft,
  Wallet,
  Package,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
  ArrowRight,
  TrendingDown,
  Info,
  CreditCard,
} from 'lucide-react';
import { mockPayoutTransactions, mockSettlements } from '../../../mocks/payouts.mock';
import { mockVendorOrders } from '../../../mocks/orders.mock';

export function PayoutDetailsPage() {
  const { payoutId } = useParams<{ payoutId: string }>();
  const navigate = useNavigate();

  const payout = useMemo(() => {
    return mockPayoutTransactions.find(p => p.id === payoutId);
  }, [payoutId]);

  const order = useMemo(() => {
    if (!payout) return null;
    return mockVendorOrders.find(o => o.id === payout.orderId);
  }, [payout]);

  const settlement = useMemo(() => {
    if (!payout?.settlementId) return null;
    return mockSettlements.find(s => s.id === payout.settlementId);
  }, [payout]);

  if (!payout) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Wallet className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Payout Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The payout transaction you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/vendor/payouts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payouts
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: 'pending' | 'settled') => {
    if (status === 'settled') {
      return (
        <Badge className="bg-success-100 text-success-700 border-success-200 hover:bg-success-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Settled
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning-100 text-warning-700 border-warning-200 hover:bg-warning-100">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const handleDownloadReceipt = () => {
    // In production, this would download a PDF receipt
    console.log('Downloading receipt for payout:', payout.id);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/vendor/payouts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payouts
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">Payout Details</h1>
              {getStatusBadge(payout.status)}
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Transaction ID: {payout.id}
            </p>
          </div>
        </div>
        
        {payout.status === 'settled' && (
          <Button variant="outline" size="sm" onClick={handleDownloadReceipt}>
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        )}
      </div>

      {/* Status Banner */}
      {payout.status === 'pending' && (
        <div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-warning-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-800 mb-1">
                Pending Settlement
              </p>
              <p className="text-sm text-warning-700">
                This payout will be included in the next settlement cycle. Settlements are processed weekly on Fridays.
                {settlement && ` Expected settlement date: ${formatDate(settlement.settlementDate)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {payout.status === 'settled' && settlement && (
        <div className="bg-success-50 border-2 border-success-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-success-800 mb-1">
                Successfully Settled
              </p>
              <p className="text-sm text-success-700">
                This payout was settled on {formatDate(settlement.settlementDate)} via settlement {settlement.id}.
                {settlement.paymentReferenceNumber && ` Reference: ${settlement.paymentReferenceNumber}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/vendor/settlements/${settlement.id}`)}
              className="border-success-300 text-success-700 hover:bg-success-100"
            >
              View Settlement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payout Amount Summary */}
          <Card className="border-2 border-neutral-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary-600" />
                Payout Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-neutral-600">Gross Amount</span>
                  <span className="text-lg font-semibold text-neutral-900">
                    {formatCurrency(payout.amount)}
                  </span>
                </div>

                {payout.deductions > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-error-600" />
                        <span className="text-sm text-neutral-600">Deductions</span>
                      </div>
                      <span className="text-lg font-semibold text-error-600">
                        -{formatCurrency(payout.deductions)}
                      </span>
                    </div>
                  </>
                )}

                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">Net Payout</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(payout.netAmount)}
                  </span>
                </div>
              </div>

              {payout.deductions > 0 && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-error-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-error-800 mb-1">
                        Deduction Applied
                      </p>
                      <p className="text-sm text-error-700">
                        A deduction of {formatCurrency(payout.deductions)} was applied to this payout. 
                        This may be due to late delivery penalties or other adjustments.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Associated Order */}
          {order && (
            <Card className="border-2 border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  Associated Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                    <p className="text-sm font-semibold text-neutral-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Order Status</p>
                    <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-neutral-600 mb-2">Items</p>
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{order.itemName}</p>
                        <p className="text-sm text-neutral-600 mt-1">
                          Quantity: {order.quantity} {order.unit}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Delivery Location</p>
                    <p className="text-sm text-neutral-900">{order.deliveryArea}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Delivery Date</p>
                    <p className="text-sm text-neutral-900">{formatDate(order.deliveryDate)}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/vendor/orders/${order.id}`, { state: { fromTab: 'my-orders' } })}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Order Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border-2 border-neutral-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Payout Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Completed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success-600" />
                    </div>
                    {payout.status === 'settled' && <div className="w-0.5 h-full bg-success-200 my-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold text-neutral-900 mb-1">
                      Payout Created
                    </p>
                    <p className="text-sm text-neutral-600">
                      {formatDate(payout.createdAt)} at {formatTime(payout.createdAt)}
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Payout transaction generated after order completion
                    </p>
                  </div>
                </div>

                {payout.status === 'settled' && settlement && (
                  <>
                    {/* Settlement Scheduled */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="w-0.5 h-full bg-primary-200 my-1" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold text-neutral-900 mb-1">
                          Settlement Scheduled
                        </p>
                        <p className="text-sm text-neutral-600">
                          {formatDate(settlement.cutoffDate)}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">
                          Included in settlement cycle {settlement.id}
                        </p>
                      </div>
                    </div>

                    {/* Payment Processed */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-4 h-4 text-success-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-900 mb-1">
                          Payment Settled
                        </p>
                        <p className="text-sm text-neutral-600">
                          {formatDate(payout.settledAt!)} at {formatTime(payout.settledAt!)}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">
                          Funds transferred to your bank account
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {payout.status === 'pending' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center flex-shrink-0 border-2 border-warning-200">
                        <Clock className="w-4 h-4 text-warning-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900 mb-1">
                        Awaiting Settlement
                      </p>
                      <p className="text-sm text-neutral-600">
                        {settlement ? `Expected: ${formatDate(settlement.settlementDate)}` : 'Processing'}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        Will be processed in the next settlement cycle
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Transaction Details */}
          <Card className="border-2 border-neutral-200">
            <CardHeader>
              <CardTitle className="text-base">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-neutral-900 break-all">{payout.id}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-neutral-600 mb-1">Status</p>
                {getStatusBadge(payout.status)}
              </div>

              <Separator />

              <div>
                <p className="text-sm text-neutral-600 mb-1">Created Date</p>
                <p className="text-sm text-neutral-900">{formatDate(payout.createdAt)}</p>
              </div>

              {payout.settledAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Settled Date</p>
                    <p className="text-sm text-neutral-900">{formatDate(payout.settledAt)}</p>
                  </div>
                </>
              )}

              {payout.settlementId && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Settlement ID</p>
                    <p className="text-sm font-mono text-neutral-900">{payout.settlementId}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Settlement Information */}
          {settlement && (
            <Card className="border-2 border-neutral-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  Settlement Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Settlement ID</p>
                  <p className="text-sm font-mono text-neutral-900">{settlement.id}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Transactions</p>
                  <p className="text-sm text-neutral-900">{settlement.transactionCount}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Settlement Amount</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(settlement.netAmount)}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-neutral-600 mb-1">Bank Account</p>
                  <p className="text-sm font-mono text-neutral-900">{settlement.bankAccountNumber}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-neutral-600 mb-1">IFSC Code</p>
                  <p className="text-sm font-mono text-neutral-900">{settlement.ifscCode}</p>
                </div>

                {settlement.paymentReferenceNumber && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Payment Reference</p>
                      <p className="text-sm font-mono text-neutral-900 break-all">
                        {settlement.paymentReferenceNumber}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          <Card className="border-2 border-primary-200 bg-primary-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary-900 mb-2">
                    Need Help?
                  </p>
                  <p className="text-sm text-primary-800 mb-3">
                    If you have questions about this payout or notice any discrepancies, our support team is here to help.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams({
                        category: 'payment',
                        ...(payout.orderId && { orderId: payout.orderId }),
                        ...(order?.orderNumber && { orderNumber: order.orderNumber }),
                      });
                      navigate(`/vendor/support/create-ticket?${params.toString()}`);
                    }}
                    className="w-full border-primary-300 text-primary-700 hover:bg-primary-100"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}