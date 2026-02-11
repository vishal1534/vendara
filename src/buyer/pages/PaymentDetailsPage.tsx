/**
 * Payment Details Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  CreditCard,
  Wallet,
} from 'lucide-react';
import type { Payment, Refund } from '../types/payment';
import { toast } from 'sonner';
import { getMockPaymentById, getMockRefundsByPayment } from '../../mocks/payments.mock';
import { formatCurrency } from '../../shared/utils/formatCurrency';
import { formatDateTime, formatDate } from '../../shared/utils/formatDate';

export function PaymentDetailsPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
      fetchRefunds();
    }
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      const data = getMockPaymentById(paymentId!);
      setPayment(data || null);
    } catch (error) {
      toast.error('Failed to load payment details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefunds = async () => {
    try {
      const data = getMockRefundsByPayment(paymentId!);
      setRefunds(data);
    } catch (error) {
      console.error('Failed to load refunds:', error);
    }
  };

  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      toast.error('Please provide a reason for refund');
      return;
    }

    setProcessingRefund(true);
    try {
      // Mock refund request
      toast.success('Refund requested successfully (mock)');
      setShowRefundDialog(false);
      setRefundReason('');
      fetchRefunds();
      fetchPaymentDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request refund');
    } finally {
      setProcessingRefund(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Payment not found</h2>
          <Button onClick={() => navigate('/payments')} className="mt-4">
            Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  const canRequestRefund =
    payment.paymentStatus === 'success' &&
    payment.paymentMethod === 'online' &&
    refunds.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/payments')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge
                    className={
                      payment.paymentStatus === 'success'
                        ? 'bg-green-100 text-green-700'
                        : payment.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {payment.paymentStatus === 'success' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {payment.paymentStatus === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <div className="flex items-center gap-2">
                    {payment.paymentMethod === 'cod' ? (
                      <Wallet className="w-4 h-4" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <span className="font-medium capitalize">
                      {payment.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="font-medium">
                    {formatDateTime(payment.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {payment.razorpayPaymentId && (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <h2 className="font-semibold text-lg mb-4">Transaction Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-xs">{payment.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono text-xs">{payment.razorpayOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gateway</span>
                    <span className="font-medium capitalize">{payment.paymentGateway}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Refund History */}
            {refunds.length > 0 && (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <h2 className="font-semibold text-lg mb-4">Refund History</h2>
                <div className="space-y-3">
                  {refunds.map((refund) => (
                    <div key={refund.id} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge
                            className={
                              refund.refundStatus === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {refund.refundStatus}
                          </Badge>
                        </div>
                        <span className="font-semibold">
                          {formatCurrency(refund.amount)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Reason: {refund.refundReason}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(refund.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6 sticky top-6">
              <h2 className="font-semibold text-lg mb-4">Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>

                {canRequestRefund && (
                  <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-error-600 border-error-300 hover:bg-error-50">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Request Refund
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Refund</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for requesting a refund. Your request will be reviewed by our team.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="reason" className="mb-2">
                          Reason for refund
                        </Label>
                        <Textarea
                          id="reason"
                          placeholder="E.g., Product damaged, incorrect item delivered, etc."
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowRefundDialog(false)}
                          disabled={processingRefund}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleRefundRequest} disabled={processingRefund}>
                          {processingRefund ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Submit Request'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/orders/${payment.orderId}`)}
                >
                  View Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}