import type { VendorNotification } from '../types/notification';
import { NotificationType, NotificationPriority } from '../types/notification';

/**
 * Mock Vendor Notifications
 * Sample notifications for Chauhan Cement Suppliers
 */
export const mockVendorNotifications: VendorNotification[] = [
  // Unread - New Order Request 1 (HIGH PRIORITY) - Matches order_req_01
  {
    id: 'notif_001',
    type: NotificationType.ORDER_REQUEST,
    priority: NotificationPriority.HIGH,
    title: 'New Order Request',
    message: 'ORD-1251: 15 bags of UltraTech Cement 50kg - ₹4,860 payout. Respond within 15 minutes.',
    orderId: 'order_req_01',
    orderNumber: 'ORD-1251',
    amount: 4860,
    metadata: {
      offerExpiresAt: new Date(Date.now() + 14 * 60 * 1000).toISOString(), // Matches order expiration
    },
    isRead: false,
    isArchived: false,
    ctaLabel: 'View Order',
    ctaLink: '/vendor/orders/order_req_01',
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
  },
  
  // Unread - New Order Request 2 (HIGH PRIORITY) - Matches order_req_02
  {
    id: 'notif_002',
    type: NotificationType.ORDER_REQUEST,
    priority: NotificationPriority.HIGH,
    title: 'New Order Request',
    message: 'ORD-1250: 3 trolleys of M-Sand - ₹3,240 payout. Respond within 15 minutes.',
    orderId: 'order_req_02',
    orderNumber: 'ORD-1250',
    amount: 3240,
    metadata: {
      offerExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // Matches order expiration
    },
    isRead: false,
    isArchived: false,
    ctaLabel: 'View Order',
    ctaLink: '/vendor/orders/order_req_02',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  
  // Unread - New Order Request 3 (HIGH PRIORITY) - Matches order_req_03
  {
    id: 'notif_003',
    type: NotificationType.ORDER_REQUEST,
    priority: NotificationPriority.HIGH,
    title: 'New Order Request',
    message: 'ORD-1249: 5 trolleys of 20mm Aggregate - ₹4,950 payout. Respond within 15 minutes.',
    orderId: 'order_req_03',
    orderNumber: 'ORD-1249',
    amount: 4950,
    metadata: {
      offerExpiresAt: new Date(Date.now() + 13 * 60 * 1000).toISOString(), // Matches order expiration
    },
    isRead: false,
    isArchived: false,
    ctaLabel: 'View Order',
    ctaLink: '/vendor/orders/order_req_03',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  
  // Unread - Payment Processed
  {
    id: 'notif_004',
    type: NotificationType.PAYMENT_PROCESSED,
    priority: NotificationPriority.MEDIUM,
    title: 'Payment Processing',
    message: 'Settlement ST-2026-002 for ₹2,556 is being processed. Expected in 2-3 business days.',
    settlementId: 'ST-2026-002',
    amount: 2556,
    isRead: false,
    isArchived: false,
    ctaLabel: 'View Payouts',
    ctaLink: '/vendor/payouts',
    createdAt: '2026-01-08T08:00:00Z',
  },
  
  // Read - Order Completed
  {
    id: 'notif_005',
    type: NotificationType.ORDER_COMPLETED,
    priority: NotificationPriority.LOW,
    title: 'Order Completed',
    message: 'ORD-1246 marked as complete. Settlement will be processed within 7 days.',
    orderId: 'order_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    orderNumber: 'ORD-1246',
    amount: 2556,
    isRead: true,
    isArchived: false,
    ctaLabel: 'View Order',
    ctaLink: '/vendor/orders/order_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    createdAt: '2026-01-07T14:45:00Z',
    readAt: '2026-01-07T15:00:00Z',
  },
  
  // Read - Payment Settled
  {
    id: 'notif_006',
    type: NotificationType.PAYMENT_SETTLED,
    priority: NotificationPriority.MEDIUM,
    title: 'Payment Settled',
    message: 'Settlement ST-2026-001 for ₹1,620 has been credited to your account.',
    settlementId: 'ST-2026-001',
    amount: 1620,
    isRead: true,
    isArchived: false,
    ctaLabel: 'View Payouts',
    ctaLink: '/vendor/payouts',
    createdAt: '2026-01-03T18:00:00Z',
    readAt: '2026-01-03T18:30:00Z',
  },
  
  // Read - Order Accepted
  {
    id: 'notif_007',
    type: NotificationType.ORDER_ACCEPTED,
    priority: NotificationPriority.LOW,
    title: 'Order Accepted',
    message: 'You accepted ORD-1248 for 10 bags of UltraTech Cement 50kg. Prepare for delivery by 14:00.',
    orderId: 'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderNumber: 'ORD-1248',
    amount: 3240,
    isRead: true,
    isArchived: false,
    ctaLabel: 'View Order',
    ctaLink: '/vendor/orders/order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    createdAt: '2026-01-08T07:32:00Z',
    readAt: '2026-01-08T07:35:00Z',
  },
  
  // Read - System Alert
  {
    id: 'notif_008',
    type: NotificationType.SYSTEM_ALERT,
    priority: NotificationPriority.LOW,
    title: 'New Feature: In-App Notifications',
    message: 'You can now view all your notifications right here in the portal. No more relying on WhatsApp!',
    isRead: true,
    isArchived: false,
    createdAt: '2026-01-08T00:00:00Z',
    readAt: '2026-01-08T07:00:00Z',
  },
  
  // Read - Order Ready
  {
    id: 'notif_009',
    type: NotificationType.ORDER_READY,
    priority: NotificationPriority.MEDIUM,
    title: 'Order Ready',
    message: 'ORD-1247 marked as ready. Buyer has been notified for pickup.',
    orderId: 'order_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    orderNumber: 'ORD-1247',
    isRead: true,
    isArchived: false,
    ctaLabel: 'View Order',
    ctaLink: '/vendor/orders/order_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    createdAt: '2026-01-08T09:45:00Z',
    readAt: '2026-01-08T09:50:00Z',
  },
  
  // Read - Performance Alert
  {
    id: 'notif_010',
    type: NotificationType.PERFORMANCE_ALERT,
    priority: NotificationPriority.MEDIUM,
    title: 'Maintain Your Response Time',
    message: 'Your average response time is 4.5 minutes. Keep it under 5 minutes to maintain premium status!',
    isRead: true,
    isArchived: false,
    ctaLabel: 'View Performance',
    ctaLink: '/vendor/performance',
    createdAt: '2026-01-07T08:00:00Z',
    readAt: '2026-01-07T09:00:00Z',
  },
  
  // Read - Order Cancelled
  {
    id: 'notif_011',
    type: NotificationType.ORDER_CANCELLED,
    priority: NotificationPriority.MEDIUM,
    title: 'Order Cancelled by Buyer',
    message: 'ORD-1243 has been cancelled by the buyer. No action needed.',
    orderNumber: 'ORD-1243',
    isRead: true,
    isArchived: false,
    createdAt: '2026-01-06T16:30:00Z',
    readAt: '2026-01-06T17:00:00Z',
  },
];

/**
 * Helper function to get unread notifications
 */
export function getUnreadNotifications(): VendorNotification[] {
  return mockVendorNotifications.filter(n => !n.isRead);
}

/**
 * Helper function to get notification count by type
 */
export function getNotificationCountByType(type: NotificationType): number {
  return mockVendorNotifications.filter(n => n.type === type).length;
}

/**
 * Helper function to get unread count
 */
export function getUnreadCount(): number {
  return mockVendorNotifications.filter(n => !n.isRead).length;
}