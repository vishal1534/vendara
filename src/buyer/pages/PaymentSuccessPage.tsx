/**
 * Payment Success Page
 */

import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle2, Download, ArrowRight, Loader2 } from 'lucide-react';
import type { Payment } from '../types/payment';
import { toast } from 'sonner';
import { getMockPaymentById } from '../../mocks/payments.mock';
import { formatCurrency } from '../../shared/utils/formatCurrency';
import { formatDateTime } from '../../shared/utils/formatDate';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      const data = getMockPaymentById(paymentId!);
      setPayment(data || null);
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg border-2 border-gray-300 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-success-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
          </p>

          {/* Payment Details */}
          {payment && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {payment.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </span>
                </div>
                {payment.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-xs text-gray-900">
                      {payment.razorpayPaymentId.slice(0, 20)}...
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(payment.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate(`/orders/${payment?.orderId}`)}
              className="w-full"
            >
              View Order Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/orders')}
              className="w-full"
            >
              Go to Orders
            </Button>
          </div>

          {/* Download Receipt */}
          <button
            className="mt-4 text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-2 mx-auto"
            onClick={() => {
              // TODO: Implement receipt download
              console.log('Download receipt');
            }}
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}