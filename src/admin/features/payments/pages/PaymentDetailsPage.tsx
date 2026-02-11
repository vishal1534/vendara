/**
 * Admin Payment Details Page
 * Complete payment management with status updates
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Textarea } from '../../../../app/components/ui/textarea';
import { Label } from '../../../../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../app/components/ui/dialog';
import {
  ArrowLeft,
  Download,
  Edit,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Wallet,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import type { Payment, Refund } from '../../../../types/payment';
import { toast } from 'sonner';
import { getMockPaymentById, getMockRefundsByPayment } from '../../../../mocks/payments.mock';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../../shared/utils/formatDate';

export function PaymentDetailsPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
      fetchRefunds();
    }
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      // Use mock data for demo
      const data = getMockPaymentById(paymentId!);
      if (data) {
        setPayment(data);
        setNewStatus(data.paymentStatus);
      } else {
        toast.error('Payment not found');
        navigate('/admin/payments');
      }
    } catch (error: any) {
      console.error('Failed to load payment:', error);
      // Don't show error toast if it's a network error (backend not running)
      if (error?.code !== 'ERR_NETWORK') {
        toast.error('Failed to load payment details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRefunds = async () => {
    try {
      // Use mock data for demo
      const data = getMockRefundsByPayment(paymentId!);
      setRefunds(data);
    } catch (error: any) {
      console.error('Failed to load refunds:', error);
      // Silently fail if backend is not available
      setRefunds([]);
    }
  };

  const handleStatusUpdate = async () => {
    if (!payment) return;

    setUpdating(true);
    try {
      // Mock implementation - status update would be handled by backend
      toast.success('Payment status updated successfully (mock)');
      setShowStatusDialog(false);
      fetchPaymentDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
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
          <Button onClick={() => navigate('/admin/payments')} className="mt-4">
            Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/payments')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
              <p className="text-sm text-gray-600 mt-1">Admin view</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Status</DialogTitle>
                  <DialogDescription>Change the status of this payment</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <Label htmlFor="status">New Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Reason for status change..."
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowStatusDialog(false)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleStatusUpdate} disabled={updating}>
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                  <p className="font-mono text-sm font-medium">{payment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge
                    className={
                      payment.paymentStatus === 'success'
                        ? 'bg-green-100 text-green-700'
                        : payment.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {payment.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Currency</p>
                  <p className="font-medium">{payment.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    {payment.paymentMethod === 'cod' ? (
                      <Wallet className="w-4 h-4" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <p className="font-medium capitalize">
                      {payment.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created At</p>
                  <p className="font-medium">{formatDateTime(payment.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-4">User Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Buyer ID</p>
                  <p className="font-mono text-sm font-medium">{payment.buyerId}</p>
                </div>
                {payment.vendorId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vendor ID</p>
                    <p className="font-mono text-sm font-medium">{payment.vendorId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium">{payment.orderId.slice(0, 20)}...</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${payment.orderId}`)}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {payment.razorpayPaymentId && (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <h2 className="font-semibold text-lg mb-4">Transaction Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Razorpay Payment ID</span>
                    <span className="font-mono text-xs">{payment.razorpayPaymentId}</span>
                  </div>
                  {payment.razorpayOrderId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Razorpay Order ID</span>
                      <span className="font-mono text-xs">{payment.razorpayOrderId}</span>
                    </div>
                  )}
                  {payment.paymentGateway && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Gateway</span>
                      <span className="font-medium capitalize">{payment.paymentGateway}</span>
                    </div>
                  )}
                  {payment.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-xs">{payment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Details */}
            {payment.paymentStatus === 'failed' && payment.paymentErrorMessage && (
              <div className="bg-error-50 border-2 border-error-300 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-error-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-error-900 mb-1">Payment Failed</h3>
                    <p className="text-sm text-error-700">{payment.paymentErrorMessage}</p>
                    {payment.paymentErrorCode && (
                      <p className="text-xs text-error-600 mt-1">Code: {payment.paymentErrorCode}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Refunds */}
            {refunds.length > 0 && (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <h2 className="font-semibold text-lg mb-4">Refund History</h2>
                <div className="space-y-3">
                  {refunds.map((refund) => (
                    <div key={refund.id} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          className={
                            refund.refundStatus === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {refund.refundStatus.toUpperCase()}
                        </Badge>
                        <span className="font-semibold">
                          {formatCurrency(refund.amount)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Reason:</span> {refund.refundReason}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(refund.createdAt)}
                      </p>
                      {refund.razorpayRefundId && (
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          Refund ID: {refund.razorpayRefundId}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => navigate(`/admin/refunds/${refund.id}`)}
                      >
                        View Details
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6 sticky top-6 space-y-4">
              <h2 className="font-semibold text-lg">Quick Actions</h2>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/admin/orders/${payment.orderId}`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Order
              </Button>
              {payment.paymentMethod === 'online' && payment.paymentStatus === 'success' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/admin/refunds/create?paymentId=${payment.id}`)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Initiate Refund
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}