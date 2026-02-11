import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';

interface TimelineEvent {
  title: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
}

interface OrderTimelineProps {
  status: VendorOrderStatus;
  createdAt: string;
  acceptedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export function OrderTimeline({
  status,
  createdAt,
  acceptedAt,
  readyAt,
  deliveredAt,
  completedAt,
  updatedAt,
}: OrderTimelineProps) {
  const events: TimelineEvent[] = [
    {
      title: 'Order Placed',
      timestamp: createdAt,
      completed: true,
    },
    {
      title: 'Payment Received',
      timestamp: createdAt, // In real scenario, this would be separate
      completed: true,
    },
    {
      title: 'Accepted by You',
      timestamp: acceptedAt,
      completed: status !== VendorOrderStatus.OFFERED && status !== VendorOrderStatus.REJECTED,
      current: status === VendorOrderStatus.ACCEPTED || status === VendorOrderStatus.IN_PROGRESS,
    },
    {
      title: 'Ready for Delivery',
      timestamp: readyAt,
      completed: status === VendorOrderStatus.READY || status === VendorOrderStatus.DELIVERED || status === VendorOrderStatus.COMPLETED,
      current: status === VendorOrderStatus.READY,
    },
    {
      title: 'Delivered to Buyer',
      timestamp: deliveredAt,
      completed: status === VendorOrderStatus.DELIVERED || status === VendorOrderStatus.COMPLETED,
      current: status === VendorOrderStatus.DELIVERED,
    },
    {
      title: 'Buyer Confirmed Delivery',
      timestamp: completedAt,
      completed: status === VendorOrderStatus.COMPLETED,
      current: false,
    },
    {
      title: 'Payment Settlement',
      timestamp: undefined,
      completed: false,
      current: false,
    },
  ];

  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <div key={index} className="flex items-start gap-3 pb-6 last:pb-0">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {event.completed ? (
              <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
              </div>
            ) : event.current ? (
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center ring-4 ring-primary-50">
                <Clock className="w-4 h-4 text-primary-600" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-neutral-300 flex items-center justify-center">
                <Circle className="w-3 h-3 text-neutral-300" />
              </div>
            )}
          </div>

          {/* Connecting Line */}
          {index < events.length - 1 && (
            <div className="absolute left-[11px] top-8 w-0.5 h-10 -ml-0.5" style={{
              backgroundColor: event.completed ? '#10B981' : '#E5E7EB',
            }} />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm font-medium ${
                  event.completed
                    ? 'text-neutral-900'
                    : event.current
                    ? 'text-primary-900'
                    : 'text-neutral-400'
                }`}
              >
                {event.title}
              </p>
              {event.timestamp && (
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-neutral-500">{formatDate(event.timestamp)}</p>
                  <p className="text-xs text-neutral-400">{formatTime(event.timestamp)}</p>
                </div>
              )}
              {!event.timestamp && !event.completed && (
                <p className="text-xs text-neutral-400 flex-shrink-0">Pending</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}