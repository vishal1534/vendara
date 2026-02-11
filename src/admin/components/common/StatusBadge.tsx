/**
 * Status Badge Component
 * Display status with appropriate colors
 */

import { Badge } from '../../../app/components/ui/badge';

type StatusVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'suspended'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'delivered'
  | 'confirmed';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
}

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-success-100 text-success-700 border-success-200' },
  inactive: { label: 'Inactive', className: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
  pending: { label: 'Pending', className: 'bg-warning-100 text-warning-700 border-warning-200' },
  completed: { label: 'Completed', className: 'bg-success-100 text-success-700 border-success-200' },
  cancelled: { label: 'Cancelled', className: 'bg-error-100 text-error-700 border-error-200' },
  suspended: { label: 'Suspended', className: 'bg-error-100 text-error-700 border-error-200' },
  approved: { label: 'Approved', className: 'bg-success-100 text-success-700 border-success-200' },
  rejected: { label: 'Rejected', className: 'bg-error-100 text-error-700 border-error-200' },
  processing: { label: 'Processing', className: 'bg-primary-100 text-primary-700 border-primary-200' },
  delivered: { label: 'Delivered', className: 'bg-success-100 text-success-700 border-success-200' },
  confirmed: { label: 'Confirmed', className: 'bg-success-100 text-success-700 border-success-200' },
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const config = variant ? statusConfig[variant] : statusConfig[status as StatusVariant];
  
  if (!config) {
    return (
      <Badge variant="outline" className="capitalize">
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
