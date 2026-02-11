import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockVendorNotifications } from '../mocks/notifications.mock';
import type { VendorNotification, NotificationStats } from '../types/notification';
import { NotificationType, NotificationPriority } from '../types/notification';

interface VendorNotificationsContextType {
  notifications: VendorNotification[];
  unreadCount: number;
  stats: NotificationStats;
  markAsRead: (notificationId: string) => void;
  markAsUnread: (notificationId: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (notificationId: string) => void;
  getNotificationById: (notificationId: string) => VendorNotification | undefined;
  addNotification: (notification: Omit<VendorNotification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => void;
}

const VendorNotificationsContext = createContext<VendorNotificationsContextType | undefined>(undefined);

export function VendorNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<VendorNotification[]>(mockVendorNotifications);

  // Filter out expired order request notifications
  const activeNotifications = useMemo(() => {
    const now = new Date();
    return notifications.filter(notification => {
      // If it's an order request notification with expiration metadata
      if (
        notification.type === NotificationType.ORDER_REQUEST &&
        notification.metadata?.offerExpiresAt
      ) {
        const expiresAt = new Date(notification.metadata.offerExpiresAt);
        return expiresAt > now; // Only show non-expired offers
      }
      // Keep all other notification types
      return true;
    });
  }, [notifications]);

  // Calculate stats using active notifications
  const stats = useMemo((): NotificationStats => {
    const unread = activeNotifications.filter(n => !n.isRead).length;
    
    const byType = activeNotifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<NotificationType, number>);
    
    const byPriority = activeNotifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {} as Record<NotificationPriority, number>);

    return {
      total: activeNotifications.length,
      unread,
      byType,
      byPriority,
    };
  }, [activeNotifications]);

  const unreadCount = useMemo(() => {
    return activeNotifications.filter(n => !n.isRead && !n.isArchived).length;
  }, [activeNotifications]);

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

  const getNotificationById = (notificationId: string): VendorNotification | undefined => {
    return notifications.find(n => n.id === notificationId);
  };

  const addNotification = (notification: Omit<VendorNotification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => {
    const newNotification: VendorNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      isArchived: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const value: VendorNotificationsContextType = {
    notifications: activeNotifications,
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
    <VendorNotificationsContext.Provider value={value}>
      {children}
    </VendorNotificationsContext.Provider>
  );
}

export function useVendorNotifications() {
  const context = useContext(VendorNotificationsContext);
  if (context === undefined) {
    throw new Error('useVendorNotifications must be used within a VendorNotificationsProvider');
  }
  return context;
}