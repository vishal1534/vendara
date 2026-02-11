import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { VendorHeader } from './VendorHeader';
import { VendorSidebar } from './VendorSidebar';
import { RejectOrderModal } from '../../features/orders/components/RejectOrderModal';
import { useVendorOrders } from '../../context/VendorOrdersContext';
import { toast } from 'sonner';

export function VendorLayout() {
  const { orders } = useVendorOrders();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOrderForReject, setSelectedOrderForReject] = useState<{ id: string; orderNumber: string; itemName: string } | null>(null);

  // Handle accepting an order
  const handleAcceptOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // TODO: Call API to accept order
    console.log('Accepting order:', orderId);
    
    toast.success(
      `Order ${order.orderNumber} accepted!`,
      {
        description: `You've accepted the order for ${order.itemName}`,
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => {
            console.log('Undo accept:', orderId);
            toast.info('Order acceptance cancelled');
          },
        },
      }
    );
  };

  // Handle rejecting an order (opens modal)
  const handleRejectOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrderForReject({
      id: order.id,
      orderNumber: order.orderNumber,
      itemName: order.itemName,
    });
    setRejectModalOpen(true);
  };

  // Handle reject confirmation from modal
  const handleConfirmReject = (reason: string, additionalNotes?: string) => {
    if (!selectedOrderForReject) return;

    // TODO: Call API to reject order with reason
    console.log('Rejecting order:', selectedOrderForReject.id, 'Reason:', reason, 'Notes:', additionalNotes);
    
    toast.error(
      `Order ${selectedOrderForReject.orderNumber} rejected`,
      {
        description: `Reason: ${reason}`,
        duration: 5000,
      }
    );

    // Close modal
    setRejectModalOpen(false);
    setSelectedOrderForReject(null);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <VendorHeader onAcceptOrder={handleAcceptOrder} onRejectOrder={handleRejectOrder} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <VendorSidebar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ onAcceptOrder: handleAcceptOrder, onRejectOrder: handleRejectOrder }} />
        </main>
      </div>

      {/* Reject Order Modal */}
      {selectedOrderForReject && (
        <RejectOrderModal
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            setSelectedOrderForReject(null);
          }}
          onConfirm={handleConfirmReject}
          orderNumber={selectedOrderForReject.orderNumber}
          itemName={selectedOrderForReject.itemName}
        />
      )}
    </div>
  );
}