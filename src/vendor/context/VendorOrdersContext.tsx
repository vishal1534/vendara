import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockVendorOrders } from '../mocks/orders.mock';
import { VendorOrderStatus } from '../constants/vendorOrderStates';
import type { VendorOrder } from '../types/vendorOrder';
import { useVendorNotifications } from './VendorNotificationsContext';
import { NotificationType, NotificationPriority } from '../types/notification';
import { useVendorAuth } from './VendorAuthContext';

interface VendorOrdersContextType {
  orders: VendorOrder[];
  acceptOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  rejectOrder: (orderId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  markAsReady: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  markAsDelivered: (orderId: string, verificationType: 'otp' | 'image', verificationData: string) => Promise<{ success: boolean; error?: string }>;
  getOrderById: (orderId: string) => VendorOrder | undefined;
}

const VendorOrdersContext = createContext<VendorOrdersContextType | undefined>(undefined);

export function VendorOrdersProvider({ children }: { children: ReactNode }) {
  const [allOrders, setAllOrders] = useState<VendorOrder[]>(mockVendorOrders);
  const { vendor } = useVendorAuth();
  const { addNotification } = useVendorNotifications();
  
  // Filter orders by current vendor
  const orders = useMemo(() => {
    if (!vendor) return [];
    return allOrders.filter(order => order.vendorId === vendor.id);
  }, [allOrders, vendor]);

  const acceptOrder = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the order
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.status !== VendorOrderStatus.OFFERED) {
        return { success: false, error: 'Can only accept orders with OFFERED status' };
      }

      // Update order status
      setAllOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === orderId
            ? { ...o, status: VendorOrderStatus.ACCEPTED, acceptedAt: new Date().toISOString() }
            : o
        )
      );

      // Add notification
      if (addNotification) {
        addNotification({
          type: NotificationType.ORDER_ACCEPTED,
          priority: NotificationPriority.LOW,
          title: 'Order Accepted',
          message: `You accepted ${order.orderNumber} for ${order.quantity} ${order.unit} of ${order.itemName}. Prepare for delivery by ${order.deliveryTimeSlot.startTime}.`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          amount: order.totalPayoutAmount,
          ctaLabel: 'View Order',
          ctaLink: `/vendor/orders/${order.id}`,
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to accept order. Please try again.' };
    }
  };

  const rejectOrder = async (orderId: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the order
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.status !== VendorOrderStatus.OFFERED) {
        return { success: false, error: 'Can only reject orders with OFFERED status' };
      }

      // Update order status
      setAllOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === orderId
            ? { 
                ...o, 
                status: VendorOrderStatus.REJECTED, 
                rejectedAt: new Date().toISOString(),
                rejectionReason: reason 
              }
            : o
        )
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to reject order. Please try again.' };
    }
  };

  const markAsReady = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the order
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.status !== VendorOrderStatus.ACCEPTED && order.status !== VendorOrderStatus.IN_PROGRESS) {
        return { success: false, error: 'Can only mark ACCEPTED or IN_PROGRESS orders as ready' };
      }

      // Update order status
      setAllOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === orderId
            ? { ...o, status: VendorOrderStatus.READY, readyAt: new Date().toISOString() }
            : o
        )
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to mark order as ready. Please try again.' };
    }
  };

  const markAsDelivered = async (orderId: string, verificationType: 'otp' | 'image', verificationData: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the order
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.status !== VendorOrderStatus.READY) {
        return { success: false, error: 'Can only mark READY orders as delivered' };
      }

      // Workflow 1: OTP verification - Buyer is present, mark as COMPLETED immediately
      if (verificationType === 'otp') {
        // In real implementation, validate OTP against backend
        // For now, simulate validation (mock OTPs: 123456, 789012, etc.)
        const isValidOtp = /^\d{6}$/.test(verificationData);
        
        if (!isValidOtp) {
          return { success: false, error: 'Invalid OTP format' };
        }

        // Mark order as COMPLETED immediately since buyer confirmed by providing OTP
        setAllOrders(prevOrders =>
          prevOrders.map(o =>
            o.id === orderId
              ? { 
                  ...o, 
                  status: VendorOrderStatus.COMPLETED, 
                  deliveredAt: new Date().toISOString(),
                  completedAt: new Date().toISOString(),
                  verificationMethod: 'otp',
                  verificationData: 'OTP verified'
                }
              : o
          )
        );

        // Add notification
        if (addNotification) {
          addNotification({
            type: NotificationType.ORDER_COMPLETED,
            priority: NotificationPriority.MEDIUM,
            title: 'Order Completed',
            message: `${order.orderNumber} has been completed successfully with OTP verification. Payment settlement will be processed within 3-5 business days.`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.totalPayoutAmount,
            ctaLabel: 'View Order',
            ctaLink: `/vendor/orders/${order.id}`,
          });
        }

        return { success: true };
      }

      // Workflow 2: Image verification - Buyer not present, mark as DELIVERED (awaiting buyer confirmation)
      if (verificationType === 'image') {
        // In real implementation, upload image to storage and get URL
        setAllOrders(prevOrders =>
          prevOrders.map(o =>
            o.id === orderId
              ? { 
                  ...o, 
                  status: VendorOrderStatus.DELIVERED, 
                  deliveredAt: new Date().toISOString(),
                  verificationMethod: 'image',
                  verificationData: verificationData
                }
              : o
          )
        );

        // Add notification
        if (addNotification) {
          addNotification({
            type: NotificationType.ORDER_UPDATE,
            priority: NotificationPriority.MEDIUM,
            title: 'Order Marked as Delivered',
            message: `${order.orderNumber} has been marked as delivered with image proof. Awaiting buyer confirmation.`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.totalPayoutAmount,
            ctaLabel: 'View Order',
            ctaLink: `/vendor/orders/${order.id}`,
          });
        }

        return { success: true };
      }

      return { success: false, error: 'Invalid verification type' };
    } catch (error) {
      return { success: false, error: 'Failed to mark order as delivered. Please try again.' };
    }
  };

  const getOrderById = (orderId: string): VendorOrder | undefined => {
    return orders.find(o => o.id === orderId);
  };

  const value: VendorOrdersContextType = {
    orders,
    acceptOrder,
    rejectOrder,
    markAsReady,
    markAsDelivered,
    getOrderById,
  };

  return (
    <VendorOrdersContext.Provider value={value}>
      {children}
    </VendorOrdersContext.Provider>
  );
}

export function useVendorOrders() {
  const context = useContext(VendorOrdersContext);
  if (context === undefined) {
    throw new Error('useVendorOrders must be used within a VendorOrdersProvider');
  }
  return context;
}