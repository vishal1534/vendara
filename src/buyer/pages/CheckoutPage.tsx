/**
 * Buyer Checkout Page
 * Complete payment flow with Razorpay integration
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { CreditCard, Wallet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { RAZORPAY_CONFIG, loadRazorpayScript, type RazorpayOptions } from '../config/razorpay';
import type { Payment } from '../types/payment';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Mock buyer info (replace with real data from context/auth)
  const buyerId = 'buyer-123'; // TODO: Get from auth context

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      // TODO: Fetch real order from Order Service
      // For now, using mock data
      setOrder({
        id: orderId!,
        orderNumber: 'RS2024001234',
        items: [
          { name: '50kg Cement Bags (UltraTech)', quantity: 20, price: 380 },
          { name: '10mm Steel Rods (TMT)', quantity: 10, price: 520 },
        ],
        subtotal: 12800,
        deliveryFee: 500,
        tax: 1597,
        total: 14897,
        deliveryAddress: 'Plot 45, Miyapur, Hyderabad - 500049',
      });
    } catch (error) {
      toast.error('Failed to load order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    setProcessingPayment(true);

    try {
      if (paymentMethod === 'cod') {
        await handleCODPayment();
      } else {
        await handleOnlinePayment();
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
      console.error(error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCODPayment = async () => {
    try {
      // Mock COD payment creation
      const payment: Payment = {
        id: `pay_cod_${Date.now()}`,
        orderId: order!.id,
        buyerId: buyerId,
        vendorId: 'vendor_001',
        amount: order!.total,
        currency: 'INR',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      toast.success('Order confirmed! Pay cash on delivery.');
      navigate(`/payment-success?paymentId=${payment.id}`);
    } catch (error: any) {
      throw new Error('Failed to create COD payment');
    }
  };

  const handleOnlinePayment = async () => {
    try {
      // Step 1: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please try again.');
      }

      // Step 2: Create mock payment
      const payment: Payment = {
        id: `pay_online_${Date.now()}`,
        orderId: order!.id,
        buyerId: buyerId,
        vendorId: 'vendor_001',
        amount: order!.total,
        currency: 'INR',
        paymentMethod: 'upi',
        paymentStatus: 'created',
        razorpayOrderId: `order_mock_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!payment.razorpayOrderId) {
        throw new Error('Failed to create Razorpay order');
      }

      // Step 3: Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: RAZORPAY_CONFIG.keyId,
        amount: order!.total * 100, // Convert to paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: `Order ${order!.orderNumber}`,
        image: RAZORPAY_CONFIG.image,
        order_id: payment.razorpayOrderId,
        handler: async (response) => {
          await verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
        },
        prefill: {
          name: 'Buyer Name', // TODO: Get from user profile
          email: 'buyer@example.com',
          contact: '9876543210',
        },
        notes: {
          order_id: order!.id,
          order_number: order!.orderNumber,
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ...RAZORPAY_CONFIG.modal,
          ondismiss: () => {
            setProcessingPayment(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setProcessingPayment(false);
        toast.error(response.error.description || 'Payment failed');
      });
      razorpay.open();
    } catch (error: any) {
      throw error;
    }
  };

  const verifyPayment = async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
    try {
      // Mock payment verification
      const payment: Payment = {
        id: `pay_verified_${Date.now()}`,
        orderId: order!.id,
        buyerId: buyerId,
        vendorId: 'vendor_001',
        amount: order!.total,
        currency: 'INR',
        paymentMethod: 'upi',
        paymentStatus: 'captured',
        razorpayOrderId,
        razorpayPaymentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      toast.success('Payment successful!');
      navigate(`/payment-success?paymentId=${payment.id}`);
    } catch (error: any) {
      toast.error('Payment verification failed');
      navigate(`/payment-failed?orderId=${order!.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
          <Button onClick={() => navigate('/orders')} className="mt-4">
            View Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-2">Delivery Address</h2>
              <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="space-y-3">
                  {/* Online Payment */}
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <RadioGroupItem value="online" id="online" />
                    <Label
                      htmlFor="online"
                      className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Online Payment</div>
                          <div className="text-xs text-gray-600">UPI, Cards, Net Banking</div>
                        </div>
                      </div>
                      {paymentMethod === 'online' && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </Label>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-xs text-gray-600">Pay when you receive</div>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Price Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6 sticky top-6">
              <h2 className="font-semibold text-lg mb-4">Price Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delivery Fee</span>
                  <span className="font-medium">₹{order.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">GST (12%)</span>
                  <span className="font-medium">₹{order.tax.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">₹{order.total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full mt-6 h-12 text-base font-semibold"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                  </>
                )}
              </Button>

              {paymentMethod === 'online' && (
                <div className="mt-4 text-xs text-gray-600 text-center">
                  Secured by <span className="font-semibold">Razorpay</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}