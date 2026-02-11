/**
 * Admin Notifications Context
 * Manages admin notification state and operations
 */

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { AdminNotification, NotificationStats } from '../types/notification';
import { NotificationType, NotificationPriority } from '../types/notification';

// Mock notifications for development
const mockAdminNotifications: AdminNotification[] = [
  {
    id: 'notif_001',
    type: NotificationType.VENDOR_REGISTRATION,
    priority: NotificationPriority.HIGH,
    title: 'New Vendor Registration',
    message: 'Sri Sai Suppliers has submitted registration for review',
    ctaText: 'Review Application',
    ctaLink: '/admin/vendors/pending',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    isRead: false,
    isArchived: false,
    metadata: { vendorId: 'vendor_123' },
  },
  {
    id: 'notif_002',
    type: NotificationType.ORDER_DISPUTED,
    priority: NotificationPriority.HIGH,
    title: 'Order Dispute Raised',
    message: 'Order #ORD-2024-0245 has been disputed by buyer',
    ctaText: 'View Order',
    ctaLink: '/admin/orders/ord_245',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    isRead: false,
    isArchived: false,
    metadata: { orderId: 'ord_245' },
  },
  {
    id: 'notif_003',
    type: NotificationType.SUPPORT_TICKET,
    priority: NotificationPriority.MEDIUM,
    title: 'New Support Ticket',
    message: 'Payment issue reported - Ticket #TKT-892',
    ctaText: 'View Ticket',
    ctaLink: '/admin/support',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    isRead: true,
    readAt: new Date(Date.now() - 45 * 60000).toISOString(),
    isArchived: false,
    metadata: { ticketId: 'tkt_892' },
  },
  {
    id: 'notif_004',
    type: NotificationType.SETTLEMENT_DUE,
    priority: NotificationPriority.HIGH,
    title: 'Settlements Due',
    message: '₹3,45,000 in settlements due for processing',
    ctaText: 'Process Settlements',
    ctaLink: '/admin/settlements',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    isRead: false,
    isArchived: false,
  },
  {
    id: 'notif_005',
    type: NotificationType.PERFORMANCE_ALERT,
    priority: NotificationPriority.MEDIUM,
    title: 'Vendor Performance Alert',
    message: 'Krishna Cement Works has 3 pending complaints',
    ctaText: 'Review Vendor',
    ctaLink: '/admin/vendors/vendor_456',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    isRead: true,
    readAt: new Date(Date.now() - 90 * 60000).toISOString(),
    isArchived: false,
    metadata: { vendorId: 'vendor_456' },
  },
];

interface AdminNotificationsContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  stats: NotificationStats;
  markAsRead: (notificationId: string) => void;
  markAsUnread: (notificationId: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (notificationId: string) => void;
  getNotificationById: (notificationId: string) => AdminNotification | undefined;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => void;
}

const AdminNotificationsContext = createContext<AdminNotificationsContextType | undefined>(undefined);

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);

  // Calculate stats
  const stats = useMemo((): NotificationStats => {
    const unread = notifications.filter(n => !n.isRead).length;
    
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<NotificationType, number>);
    
    const byPriority = notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {} as Record<NotificationPriority, number>);

    return {
      total: notifications.length,
      unread,
      byType,
      byPriority,
    };
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead && !n.isArchived).length;
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      )
    );
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, isRead: false, readAt: undefined }
          : n
      )
    );
  };

  const markAllAsRead = () => {
    const now = new Date().toISOString();
    setNotifications(prev =>
      prev.map(n =>
        n.isRead ? n : { ...n, isRead: true, readAt: now }
      )
    );
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, isArchived: true }
          : n
      )
    );
  };

  const getNotificationById = (notificationId: string): AdminNotification | undefined => {
    return notifications.find(n => n.id === notificationId);
  };

  const addNotification = (notification: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      isArchived: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const value: AdminNotificationsContextType = {
    notifications,
    unreadCount,
    stats,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    archiveNotification,
    getNotificationById,
    addNotification,
  };

  return (
    <AdminNotificationsContext.Provider value={value}>
      {children}
    </AdminNotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const context = useContext(AdminNotificationsContext);
  if (context === undefined) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationsProvider');
  }
  return context;
}