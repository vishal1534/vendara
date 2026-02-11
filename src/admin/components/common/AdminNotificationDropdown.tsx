/**
 * Admin Notification Dropdown Component
 * Bell icon dropdown with recent notifications
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminNotifications } from '../../context/AdminNotificationsContext';
import { NotificationType, NotificationPriority } from '../../types/notification';
import { formatDate, formatTime } from '../../../vendor/utils/formatDate';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';
import { Separator } from '../../../app/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../app/components/ui/dropdown-menu';
import {
  Bell,
  Package,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  UserCircle,
  MessageSquare,
  Check,
  AlertTriangle,
} from 'lucide-react';

export function AdminNotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAdminNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Get only non-archived notifications, sorted by newest first
  const visibleNotifications = notifications
    .filter(n => !n.isArchived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // Show only latest 10

  const handleNotificationClick = (notificationId: string, link?: string) => {
    markAsRead(notificationId);
    if (link) {
      setIsOpen(false);
      navigate(link);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case NotificationType.ORDER_PLACED:
      case NotificationType.ORDER_CONFIRMED:
        return <Package className={`${iconClass} text-primary-600`} />;
      case NotificationType.ORDER_CANCELLED:
      case NotificationType.ORDER_DISPUTED:
        return <XCircle className={`${iconClass} text-error-600`} />;
      case NotificationType.VENDOR_REGISTRATION:
      case NotificationType.VENDOR_APPROVED:
        return <Users className={`${iconClass} text-success-600`} />;
      case NotificationType.VENDOR_SUSPENDED:
        return <AlertTriangle className={`${iconClass} text-warning-600`} />;
      case NotificationType.BUYER_REGISTRATION:
      case NotificationType.BUYER_COMPLAINT:
        return <UserCircle className={`${iconClass} text-blue-600`} />;
      case NotificationType.PAYMENT_PENDING:
      case NotificationType.PAYMENT_FAILED:
      case NotificationType.SETTLEMENT_DUE:
        return <Wallet className={`${iconClass} text-warning-600`} />;
      case NotificationType.SUPPORT_TICKET:
      case NotificationType.ESCALATION:
        return <MessageSquare className={`${iconClass} text-error-600`} />;
      case NotificationType.PERFORMANCE_ALERT:
        return <TrendingUp className={`${iconClass} text-blue-600`} />;
      case NotificationType.SYSTEM_ALERT:
      case NotificationType.SYSTEM_UPDATE:
        return <AlertCircle className={`${iconClass} text-neutral-600`} />;
      default:
        return <Bell className={`${iconClass} text-neutral-600`} />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 'bg-error-50 border-error-200';
      case NotificationPriority.MEDIUM:
        return 'bg-warning-50 border-warning-200';
      case NotificationPriority.LOW:
        return 'bg-neutral-50 border-neutral-200';
      default:
        return 'bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 p-0 hover:bg-neutral-100"
        >
          <Bell className="w-5 h-5 text-neutral-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-600 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs text-error-600 hover:text-error-700 h-auto px-2 py-1"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {visibleNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-900 mb-1">No notifications</p>
              <p className="text-xs text-neutral-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            visibleNotifications.map((notification, index) => (
              <div key={notification.id}>
                <button
                  onClick={() => handleNotificationClick(notification.id, notification.ctaLink)}
                  className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${
                    !notification.isRead ? 'bg-error-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                        !notification.isRead 
                          ? getPriorityColor(notification.priority)
                          : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm font-medium ${
                          !notification.isRead ? 'text-neutral-900' : 'text-neutral-700'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 bg-error-600 rounded-full mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">
                          {formatTime(notification.createdAt)}
                        </span>
                        {notification.priority === NotificationPriority.HIGH && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] px-1.5 py-0 h-4 bg-error-50 text-error-700 border-error-200"
                          >
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                {index < visibleNotifications.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {visibleNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/notifications');
                }}
                className="w-full text-xs text-error-600 hover:text-error-700 hover:bg-error-50"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
