/**
 * Vendor Notification Types
 * Defines the structure and types of notifications for vendors
 */

export enum NotificationType {
  ORDER_REQUEST = 'ORDER_REQUEST',           // New order offer
  ORDER_ACCEPTED = 'ORDER_ACCEPTED',         // Order accepted by vendor
  ORDER_REJECTED = 'ORDER_REJECTED',         // Order rejected by vendor
  ORDER_CANCELLED = 'ORDER_CANCELLED',       // Order cancelled by buyer
  ORDER_READY = 'ORDER_READY',              // Order marked as ready
  ORDER_COMPLETED = 'ORDER_COMPLETED',       // Order completed
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',   // Payment settlement processed
  PAYMENT_SETTLED = 'PAYMENT_SETTLED',       // Payment settled to account
  SYSTEM_ALERT = 'SYSTEM_ALERT',            // System announcements
  PERFORMANCE_ALERT = 'PERFORMANCE_ALERT',   // Performance issues (low rating, etc)
  PROFILE_UPDATE = 'PROFILE_UPDATE',         // Profile changes verified
}

export enum NotificationPriority {
  HIGH = 'HIGH',       // Urgent - requires immediate action
  MEDIUM = 'MEDIUM',   // Important - action needed soon
  LOW = 'LOW',         // Informational - no action needed
}

export interface VendorNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  
  // Optional metadata
  orderId?: string;
  orderNumber?: string;
  settlementId?: string;
  amount?: number;
  metadata?: {
    offerExpiresAt?: string;
    [key: string]: any;
  };
  
  // Status
  isRead: boolean;
  isArchived: boolean;
  
  // CTA (Call to Action)
  ctaLabel?: string;
  ctaLink?: string;
  
  // Timestamps
  createdAt: string;
  readAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}