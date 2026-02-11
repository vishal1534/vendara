/**
 * Notifications Center Page - Admin Portal
 * Real-time alerts and activity feed
 */

import { useState } from 'react';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  TrendingUp,
  Clock,
  XCircle,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'vendor' | 'buyer' | 'payment' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'order',
    title: 'New Order Placed',
    message: 'Order RS2024001242 placed by Ramesh Kumar for ₹15,450',
    timestamp: '2024-01-09T16:30:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/admin/orders/ord_009',
  },
  {
    id: 'notif_002',
    type: 'alert',
    title: 'High Priority Support Ticket',
    message: 'TKT2024001 requires immediate attention - delayed delivery',
    timestamp: '2024-01-09T15:45:00Z',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif_003',
    type: 'vendor',
    title: 'New Vendor Registration',
    message: 'Shiva Construction Materials submitted registration for approval',
    timestamp: '2024-01-09T14:20:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/admin/vendors/pending',
  },
  {
    id: 'notif_004',
    type: 'payment',
    title: 'Settlement Processed',
    message: 'Settlement SET2024002 (₹3,69,600) completed for Balaji Steel',
    timestamp: '2024-01-09T13:15:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: 'notif_005',
    type: 'buyer',
    title: 'New Buyer Registration',
    message: 'Kiran Patel registered as Individual buyer from Madhapur',
    timestamp: '2024-01-09T12:00:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: 'notif_006',
    type: 'system',
    title: 'Daily Report Generated',
    message: 'Platform performance report for Jan 8 is ready to view',
    timestamp: '2024-01-09T09:00:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: 'notif_007',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Portland Cement inventory below 100 units - restock needed',
    timestamp: '2024-01-09T08:30:00Z',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif_008',
    type: 'order',
    title: 'Order Cancelled',
    message: 'Order RS2024001238 cancelled by Prakash Sharma',
    timestamp: '2024-01-08T15:30:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: 'notif_009',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ₹13,380 received for Order RS2024001234',
    timestamp: '2024-01-09T08:45:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: 'notif_010',
    type: 'vendor',
    title: 'Vendor Performance Alert',
    message: 'Sri Sai Suppliers rating dropped to 4.2 - review needed',
    timestamp: '2024-01-08T18:00:00Z',
    read: true,
    priority: 'medium',
  },
];

const typeConfig = {
  order: { icon: ShoppingCart, color: 'bg-primary-50 text-primary-700' },
  vendor: { icon: Users, color: 'bg-secondary-50 text-secondary-700' },
  buyer: { icon: Users, color: 'bg-[#22C55E]/10 text-[#22C55E]' },
  payment: { icon: CreditCard, color: 'bg-error-50 text-error-700' },
  system: { icon: TrendingUp, color: 'bg-neutral-100 text-neutral-700' },
  alert: { icon: AlertCircle, color: 'bg-error-100 text-error-700' },
};

const priorityColors = {
  low: 'text-neutral-500',
  medium: 'text-secondary-700',
  high: 'text-error-700',
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Stay updated with platform activities and alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
          >
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Notifications</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {notifications.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Unread</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {unreadCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-error-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">High Priority</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {notifications.filter(n => n.priority === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-error-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600">No notifications</p>
            <p className="text-sm text-neutral-500 mt-1">
              {filter === 'unread' ? 'All caught up!' : 'No notifications to display'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredNotifications.map((notification) => {
              const Icon = typeConfig[notification.type].icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-primary-50/30' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeConfig[notification.type].color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-neutral-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-700 rounded-full" />
                        )}
                        {notification.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-xs text-neutral-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className={`text-xs capitalize ${priorityColors[notification.priority]}`}>
                          {notification.priority} priority
                        </span>
                      </div>
                    </div>

                    {notification.actionUrl && (
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}