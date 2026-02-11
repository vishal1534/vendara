import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useVendorNotifications } from '../../../context/VendorNotificationsContext';
import { NotificationType, NotificationPriority } from '../../../types/notification';
import type { VendorNotification } from '../../../types/notification';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Separator } from '../../../../app/components/ui/separator';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import { CountdownTimer } from '../../orders/components/CountdownTimer';
import {
  Bell,
  Package,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Settings as SettingsIcon,
  Check,
  CheckCheck,
  Archive,
  Filter,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';

interface NotificationsPageProps {
  onAcceptOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
}

export function NotificationsPage({ onAcceptOrder: onAcceptOrderProp, onRejectOrder: onRejectOrderProp }: NotificationsPageProps) {
  const { notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead } = useVendorNotifications();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get handlers from context (passed from VendorLayout via Outlet)
  const context = useOutletContext<{ onAcceptOrder?: (orderId: string) => void; onRejectOrder?: (orderId: string) => void }>();
  const onAcceptOrder = onAcceptOrderProp || context?.onAcceptOrder;
  const onRejectOrder = onRejectOrderProp || context?.onRejectOrder;

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(n => !n.isArchived);

    // Filter by read/unread
    if (selectedFilter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }

    // Sort by newest first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, selectedFilter, selectedType, searchQuery]);

  const handleNotificationClick = (notification: VendorNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.ctaLink) {
      navigate(notification.ctaLink);
    }
  };

  const toggleReadStatus = (e: React.MouseEvent, notificationId: string, isCurrentlyRead: boolean) => {
    e.stopPropagation();
    if (isCurrentlyRead) {
      markAsUnread(notificationId);
    } else {
      markAsRead(notificationId);
    }
  };

  // Active filters for chips
  const activeFilters = [];
  if (selectedFilter === 'unread') {
    activeFilters.push({
      type: 'read',
      label: 'Read Status',
      value: 'Unread',
      onRemove: () => setSelectedFilter('all'),
    });
  }
  if (selectedType !== 'all') {
    const typeLabels: Record<NotificationType, string> = {
      [NotificationType.ORDER_REQUEST]: 'Order Requests',
      [NotificationType.ORDER_ACCEPTED]: 'Order Accepted',
      [NotificationType.ORDER_REJECTED]: 'Order Rejected',
      [NotificationType.ORDER_CANCELLED]: 'Order Cancelled',
      [NotificationType.ORDER_READY]: 'Order Ready',
      [NotificationType.ORDER_COMPLETED]: 'Order Completed',
      [NotificationType.PAYMENT_PROCESSED]: 'Payment Processing',
      [NotificationType.PAYMENT_SETTLED]: 'Payment Settled',
      [NotificationType.SYSTEM_ALERT]: 'System Alerts',
      [NotificationType.PERFORMANCE_ALERT]: 'Performance',
      [NotificationType.PROFILE_UPDATE]: 'Profile Updates',
    };
    activeFilters.push({
      type: 'type',
      label: 'Type',
      value: typeLabels[selectedType],
      onRemove: () => setSelectedType('all'),
    });
  }

  const clearAllFilters = () => {
    setSelectedFilter('all');
    setSelectedType('all');
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case NotificationType.ORDER_REQUEST:
        return <Package className={`${iconClass} text-warning-600`} />;
      case NotificationType.ORDER_ACCEPTED:
        return <CheckCircle2 className={`${iconClass} text-success-600`} />;
      case NotificationType.ORDER_REJECTED:
      case NotificationType.ORDER_CANCELLED:
        return <XCircle className={`${iconClass} text-error-600`} />;
      case NotificationType.PAYMENT_PROCESSED:
      case NotificationType.PAYMENT_SETTLED:
        return <Wallet className={`${iconClass} text-primary-600`} />;
      case NotificationType.PERFORMANCE_ALERT:
        return <TrendingUp className={`${iconClass} text-blue-600`} />;
      case NotificationType.SYSTEM_ALERT:
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

  const typeLabels: Record<NotificationType, string> = {
    [NotificationType.ORDER_REQUEST]: 'Order Requests',
    [NotificationType.ORDER_ACCEPTED]: 'Order Accepted',
    [NotificationType.ORDER_REJECTED]: 'Order Rejected',
    [NotificationType.ORDER_CANCELLED]: 'Order Cancelled',
    [NotificationType.ORDER_READY]: 'Order Ready',
    [NotificationType.ORDER_COMPLETED]: 'Order Completed',
    [NotificationType.PAYMENT_PROCESSED]: 'Payment Processing',
    [NotificationType.PAYMENT_SETTLED]: 'Payment Settled',
    [NotificationType.SYSTEM_ALERT]: 'System Alerts',
    [NotificationType.PERFORMANCE_ALERT]: 'Performance',
    [NotificationType.PROFILE_UPDATE]: 'Profile Updates',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="border-primary-300 text-primary-700 hover:bg-primary-50"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <SearchFilterSection
        searchPlaceholder="Search notifications by title or message..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
      >
        <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as 'all' | 'unread')}>
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="Read status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({notifications.filter(n => !n.isArchived).length})</SelectItem>
            <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={(value) => setSelectedType(value as NotificationType | 'all')}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(typeLabels).map(([type, label]) => (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold text-neutral-900">{filteredNotifications.length}</span> notification{filteredNotifications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Notifications List */}
      <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {selectedFilter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </h3>
            <p className="text-sm text-neutral-500">
              {selectedFilter === 'unread' 
                ? 'You\'re all caught up!' 
                : searchQuery || selectedType !== 'all'
                ? 'No notifications match your search criteria.'
                : 'Notifications will appear here when you receive them.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const isOrderRequest = notification.type === NotificationType.ORDER_REQUEST;
            
            return (
            <div key={notification.id}>
              <div
                className={`w-full p-5 transition-colors ${
                  !notification.isRead ? 'bg-primary-50/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                      !notification.isRead 
                        ? getPriorityColor(notification.priority)
                        : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-semibold ${
                            !notification.isRead ? 'text-neutral-900' : 'text-neutral-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full" />
                          )}
                          {/* Show countdown timer for order requests */}
                          {isOrderRequest && notification.metadata?.offerExpiresAt && (
                            <CountdownTimer expiresAt={notification.metadata.offerExpiresAt} />
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-500">
                            {formatDate(notification.createdAt)} at {formatTime(notification.createdAt)}
                          </span>
                          {notification.priority === NotificationPriority.HIGH && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0 h-5 bg-error-50 text-error-700 border-error-200"
                            >
                              Urgent
                            </Badge>
                          )}
                          {!isOrderRequest && notification.ctaLabel && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0 h-5 bg-primary-50 text-primary-700 border-primary-200"
                            >
                              {notification.ctaLabel} →
                            </Badge>
                          )}
                        </div>

                        {/* Show Accept button for order requests */}
                        {isOrderRequest && notification.orderId && onAcceptOrder && (
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAcceptOrder(notification.orderId!);
                              }}
                              className="bg-success-600 hover:bg-success-700 text-white h-8 px-3 border-2 border-success-600"
                            >
                              <Check className="w-4 h-4 mr-1.5" />
                              Accept
                            </Button>
                            {notification.ctaLink && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleNotificationClick(notification)}
                                className="text-sm text-primary-600 hover:text-primary-700 h-8 px-3"
                              >
                                View Details →
                              </Button>
                            )}
                          </div>
                        )}

                        {/* For non-order-request notifications with CTA, make row clickable */}
                        {!isOrderRequest && notification.ctaLink && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleNotificationClick(notification)}
                            className="text-sm text-primary-600 hover:text-primary-700 h-auto px-0 mt-2"
                          >
                            {notification.ctaLabel || 'View Details'} →
                          </Button>
                        )}
                      </div>

                      {/* Mark Read/Unread Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleReadStatus(e, notification.id, notification.isRead)}
                        className="flex-shrink-0 h-8 px-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                      >
                        {notification.isRead ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <CheckCheck className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {index < filteredNotifications.length - 1 && <Separator />}
            </div>
          );
          })
        )}
      </div>
    </div>
  );
}