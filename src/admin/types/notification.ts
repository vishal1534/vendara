/**
 * Admin Notification Types
 */

export enum NotificationType {
  // Orders
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_DISPUTED = 'order_disputed',
  
  // Vendors
  VENDOR_REGISTRATION = 'vendor_registration',
  VENDOR_APPROVED = 'vendor_approved',
  VENDOR_SUSPENDED = 'vendor_suspended',
  
  // Buyers
  BUYER_REGISTRATION = 'buyer_registration',
  BUYER_COMPLAINT = 'buyer_complaint',
  
  // Payments
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_FAILED = 'payment_failed',
  SETTLEMENT_DUE = 'settlement_due',
  
  // Support
  SUPPORT_TICKET = 'support_ticket',
  ESCALATION = 'escalation',
  
  // System
  SYSTEM_ALERT = 'system_alert',
  SYSTEM_UPDATE = 'system_update',
  PERFORMANCE_ALERT = 'performance_alert',
}

export enum NotificationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface AdminNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  readAt?: string;
  isRead: boolean;
  isArchived: boolean;
  metadata?: {
    orderId?: string;
    vendorId?: string;
    buyerId?: string;
    ticketId?: string;
    [key: string]: any;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}
