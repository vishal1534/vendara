import { toast } from 'sonner';
import { ConfirmationDialog } from '../../../../admin/components/feedback/ConfirmationDialog';
import { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useVendorOrders } from '../../../context/VendorOrdersContext';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Separator } from '../../../../app/components/ui/separator';
import {
  ArrowLeft,
  Package,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { generateInvoice, generateDeliveryChallan } from '../../../utils/documentDownload';
import { OrderTimeline } from '../components/OrderTimeline';
import { OrderSummaryCard } from '../components/OrderSummaryCard';
import { BuyerInformationCard } from '../components/BuyerInformationCard';
import { DeliveryInformationCard } from '../components/DeliveryInformationCard';
import { PaymentPayoutCard } from '../components/PaymentPayoutCard';
import { ContextualHelpCard } from '../components/ContextualHelpCard';
import { QuickActionsCard } from '../components/QuickActionsCard';
import { DeliveryVerificationDialog } from '../components/DeliveryVerificationDialog';

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getOrderById, acceptOrder, rejectOrder, markAsReady, markAsDelivered } = useVendorOrders();
  
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isMarkingReady, setIsMarkingReady] = useState(false);
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showReadyConfirm, setShowReadyConfirm] = useState(false);
  const [showDeliveryVerification, setShowDeliveryVerification] = useState(false);

  const order = useMemo(() => {
    return orderId ? getOrderById(orderId) : undefined;
  }, [orderId, getOrderById]);
  
  // Get the tab to return to from navigation state
  const fromTab = (location.state as { fromTab?: 'requests' | 'my-orders' })?.fromTab;
  
  const handleBackToOrders = () => {
    // Navigate back to orders with the correct tab
    if (fromTab) {
      navigate('/vendor/orders', { state: { activeTab: fromTab } });
    } else {
      navigate('/vendor/orders');
    }
  };

  const handleAcceptOrder = async () => {
    if (!order) return;
    
    setIsAccepting(true);
    setActionError(null);
    
    const result = await acceptOrder(order.id);
    
    setIsAccepting(false);
    
    if (result.success) {
      // Navigate to My Orders tab
      handleBackToOrders();
    } else {
      setActionError(result.error || 'Failed to accept order');
    }
  };

  const handleRejectOrder = () => {
    setShowRejectConfirm(true);
  };

  const handleConfirmReject = async () => {
    if (!order) return;
    
    setIsRejecting(true);
    const result = await rejectOrder(order.id);
    setIsRejecting(false);
    
    if (result.success) {
      toast.success('Order rejected');
      navigate('/vendor/orders');
    } else {
      setActionError(result.error || 'Failed to reject order');
    }
    setShowRejectConfirm(false);
  };

  const handleMarkReady = () => {
    setShowReadyConfirm(true);
  };

  const handleConfirmReady = async () => {
    if (!order) return;
    
    setIsMarkingReady(true);
    const result = await markAsReady(order.id);
    setIsMarkingReady(false);
    
    if (result.success) {
      toast.success('Order marked as ready for pickup/delivery');
    } else {
      setActionError(result.error || 'Failed to mark order as ready');
    }
    setShowReadyConfirm(false);
  };

  const handleCompleteOrder = () => {
    setShowDeliveryVerification(true);
  };

  const handleDeliveryVerified = async (verificationType: 'otp' | 'image', data: string) => {
    if (!order) return;
    
    setIsMarkingDelivered(true);
    
    // Pass verification type and data to the backend
    const result = await markAsDelivered(order.id, verificationType, data);
    
    setIsMarkingDelivered(false);
    
    if (result.success) {
      if (verificationType === 'otp') {
        toast.success('Order completed successfully with OTP verification');
      } else {
        toast.success('Order marked as delivered with image proof. Awaiting buyer confirmation.');
      }
      setShowDeliveryVerification(false);
    } else {
      setActionError(result.error || 'Failed to complete order');
    }
  };

  if (!order) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Order Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/vendor/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: VendorOrderStatus) => {
    const variants: Record<VendorOrderStatus, { label: string; className: string }> = {
      [VendorOrderStatus.OFFERED]: {
        label: 'New Offer',
        className: 'bg-warning-100 text-warning-700 border-warning-200',
      },
      [VendorOrderStatus.ACCEPTED]: {
        label: 'Accepted',
        className: 'bg-primary-100 text-primary-700 border-primary-200',
      },
      [VendorOrderStatus.IN_PROGRESS]: {
        label: 'In Progress',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      [VendorOrderStatus.READY]: {
        label: 'Ready',
        className: 'bg-success-100 text-success-700 border-success-200',
      },
      [VendorOrderStatus.DELIVERED]: {
        label: 'Delivered - Awaiting Confirmation',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      [VendorOrderStatus.COMPLETED]: {
        label: 'Completed',
        className: 'bg-success-100 text-success-700 border-success-200',
      },
      [VendorOrderStatus.REJECTED]: {
        label: 'Rejected',
        className: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      },
      [VendorOrderStatus.ISSUE]: {
        label: 'Issue',
        className: 'bg-error-100 text-error-700 border-error-200',
      },
      [VendorOrderStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-error-100 text-error-700 border-error-200',
      },
    };

    const variant = variants[status];
    if (!variant) {
      // Fallback for unexpected status values
      return (
        <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToOrders}
        className="text-neutral-600 hover:text-neutral-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-neutral-900">{order.orderNumber}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-neutral-600">
            Order placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Order Summary Card */}
      <OrderSummaryCard
        itemName={order.itemName}
        quantity={order.quantity}
        unit={order.unit}
        totalPayoutAmount={order.totalPayoutAmount}
        deliveryDate={order.deliveryDate}
        deliveryTimeSlot={order.deliveryTimeSlot}
        status={order.status}
      />

      {/* Action Buttons - OFFERED orders (Time-sensitive - at top) */}
      {order.status === VendorOrderStatus.OFFERED && (
        <div className="bg-warning-50 border-2 border-warning-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-warning-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-warning-900 mb-1">
                Action Required - Respond Before Offer Expires
              </p>
              <p className="text-sm text-warning-800">
                Review the order details below and accept or reject this request. Once accepted, it will move to your active orders.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              onClick={handleAcceptOrder}
              disabled={isAccepting || isRejecting}
              className="bg-success-600 hover:bg-success-700 text-white border-0 flex-1 sm:flex-none"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept Order
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleRejectOrder}
              disabled={isAccepting || isRejecting}
              className="border-error-300 text-error-700 hover:bg-error-50 flex-1 sm:flex-none"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Order
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Action Buttons - ACCEPTED/IN_PROGRESS orders */}
      {(order.status === VendorOrderStatus.ACCEPTED || order.status === VendorOrderStatus.IN_PROGRESS) && (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <Package className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary-900 mb-1">
                Next Step: Prepare Order
              </p>
              <p className="text-sm text-primary-800">
                Once you have prepared the order and it's ready for pickup/delivery, click the button below to notify the buyer.
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleMarkReady}
            disabled={isMarkingReady}
            className="bg-primary-600 hover:bg-primary-700 text-white border-0"
          >
            {isMarkingReady ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Ready
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Action Buttons - READY orders */}
      {order.status === VendorOrderStatus.READY && (
        <div className="bg-success-50 border-2 border-success-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-success-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-success-900 mb-1">
                Final Step: Mark as Delivered
              </p>
              <p className="text-sm text-success-800">
                After you deliver the order to the buyer, mark it as delivered. The buyer will then confirm delivery via OTP or image validation before the order is marked as complete and payout is initiated.
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleCompleteOrder}
            disabled={isMarkingDelivered}
            className="bg-success-600 hover:bg-success-700 text-white border-0"
          >
            {isMarkingDelivered ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Delivered
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Info Banner - DELIVERED orders (awaiting buyer confirmation) */}
      {order.status === VendorOrderStatus.DELIVERED && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Awaiting Buyer Confirmation
              </p>
              <p className="text-sm text-blue-800">
                You've marked this order as delivered. The buyer needs to confirm delivery via OTP or image validation. Once confirmed, the order will be marked as complete and your payout will be processed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Error */}
      {actionError && (
        <div className="bg-error-50 border-2 border-error-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-error-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-error-700 font-medium">
              {actionError}
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (60%) - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card className="border-neutral-200">
            <CardHeader className="border-b border-neutral-200">
              <CardTitle className="text-lg font-semibold text-neutral-900">
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <OrderTimeline
                  status={order.status}
                  createdAt={order.createdAt}
                  acceptedAt={order.status !== VendorOrderStatus.OFFERED ? order.createdAt : undefined}
                  readyAt={order.status === VendorOrderStatus.READY || order.status === VendorOrderStatus.DELIVERED || order.status === VendorOrderStatus.COMPLETED ? order.updatedAt : undefined}
                  deliveredAt={order.status === VendorOrderStatus.DELIVERED || order.status === VendorOrderStatus.COMPLETED ? order.deliveredAt : undefined}
                  completedAt={order.status === VendorOrderStatus.COMPLETED ? order.updatedAt : undefined}
                  updatedAt={order.updatedAt}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-neutral-200">
            <CardHeader className="border-b border-neutral-200">
              <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Item Details */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Item Name
                </label>
                <p className="text-base font-semibold text-neutral-900 mt-1">
                  {order.itemName}
                </p>
              </div>

              <Separator />

              {/* Quantity & Unit Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Quantity
                  </label>
                  <p className="text-base font-semibold text-neutral-900 mt-1">
                    {order.quantity} {order.unit}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Unit Price
                  </label>
                  <p className="text-base font-semibold text-neutral-900 mt-1">
                    {formatCurrency(order.payoutPerUnit)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Subtotal
                  </label>
                  <p className="text-base font-semibold text-primary-600 mt-1">
                    {formatCurrency(order.basePayoutAmount)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Category
                </label>
                <p className="text-base text-neutral-900 mt-1">
                  {order.category || 'Construction Materials'}
                </p>
              </div>

              {/* Specifications (if available) */}
              {order.deliveryInstructions && (
                <>
                  <Separator />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-xs font-semibold text-blue-900 uppercase tracking-wide block mb-2">
                      Specifications / Notes
                    </label>
                    <p className="text-sm text-blue-800 whitespace-pre-line leading-relaxed">
                      {order.deliveryInstructions}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <DeliveryInformationCard
            deliveryDate={order.deliveryDate}
            deliveryTimeSlot={order.deliveryTimeSlot}
            deliveryArea={order.deliveryArea}
            deliveryAddress={order.deliveryAddress}
            deliveryInstructions={order.deliveryInstructions}
            deliveryMethod="vendor"
          />

          {/* Buyer Information */}
          <BuyerInformationCard
            buyerName="Vendara Buyer"
            buyerPhone={order.buyerPhone}
            buyerEmail={order.buyerEmail}
            buyerCompany="Rajesh Construction"
            orderNumber={order.orderNumber}
          />
        </div>

        {/* Right Column (40%) - Sidebar */}
        <div className="space-y-6">
          {/* Payment & Payout */}
          <PaymentPayoutCard
            orderTotal={order.basePayoutAmount}
            deliveryCharges={0}
            platformFee={0}
            totalPaidByBuyer={order.basePayoutAmount}
            paymentMethod="UPI"
            paymentStatus="received"
            basePayoutAmount={order.basePayoutAmount}
            vendaraFee={order.vendara}
            logisticsFee={order.logisticsFee}
            totalPayoutAmount={order.totalPayoutAmount}
            settlementStatus={order.settlementStatus}
            settlementId={order.settlementId}
            showSettlementLink={!!order.settlementId}
          />

          {/* Quick Actions & Documents */}
          <QuickActionsCard
            orderNumber={order.orderNumber}
            onDownloadInvoice={() => generateInvoice({
              orderNumber: order.orderNumber,
              orderDate: order.createdAt,
              itemName: order.itemName,
              quantity: order.quantity,
              unit: order.unit,
              unitPrice: order.payoutPerUnit,
              totalAmount: order.basePayoutAmount,
              deliveryAddress: order.deliveryAddress || `Delivery to ${order.deliveryArea}`,
              deliveryArea: order.deliveryArea,
              buyerName: 'Vendara Buyer',
              vendorName: 'Chauhan Cement Suppliers',
              vendorGST: '29ABCDE1234F1Z5',
              vendorAddress: 'Miyapur, Hyderabad - 500049',
            })}
            onDownloadDeliveryChallan={() => generateDeliveryChallan({
              orderNumber: order.orderNumber,
              orderDate: order.createdAt,
              deliveryDate: order.deliveryDate,
              itemName: order.itemName,
              quantity: order.quantity,
              unit: order.unit,
              deliveryAddress: order.deliveryAddress || `Delivery to ${order.deliveryArea}`,
              deliveryArea: order.deliveryArea,
              buyerName: 'Vendara Buyer',
              vendorName: 'Chauhan Cement Suppliers',
              deliveryInstructions: order.deliveryInstructions,
            })}
          />

          {/* Contextual Help */}
          <ContextualHelpCard
            status={order.status}
            orderId={order.id}
            orderNumber={order.orderNumber}
          />
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={showRejectConfirm}
        onOpenChange={setShowRejectConfirm}
        onConfirm={handleConfirmReject}
        title="Reject Order"
        description="Are you sure you want to reject this order? This action cannot be undone."
        confirmText="Reject Order"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        open={showReadyConfirm}
        onOpenChange={setShowReadyConfirm}
        onConfirm={handleConfirmReady}
        title="Mark as Ready"
        description="Confirm that this order is ready for pickup/delivery?"
        confirmText="Mark as Ready"
        cancelText="Cancel"
        variant="default"
      />

      <DeliveryVerificationDialog
        open={showDeliveryVerification}
        onOpenChange={setShowDeliveryVerification}
        onVerify={handleDeliveryVerified}
        isVerifying={isMarkingDelivered}
        orderId={order?.orderNumber || ''}
      />
    </div>
  );
}