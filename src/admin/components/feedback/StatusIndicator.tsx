/**
 * Status Indicator Component - Vendara Design System
 * Standardized status indicators for system states, availability, and processes
 * Construction-native colors with infrastructure-grade UI
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '../../../app/components/ui/utils';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'available';

interface StatusIndicatorProps {
  type: StatusType;
  label: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    dotClass: 'bg-success',
    containerClass: 'bg-success-subtle text-success',
  },
  available: {
    dotClass: 'bg-available',
    containerClass: 'bg-[#22C55E]/10 text-[#22C55E]',
  },
  warning: {
    dotClass: 'bg-warning',
    containerClass: 'bg-warning-subtle text-warning',
  },
  error: {
    dotClass: 'bg-error',
    containerClass: 'bg-error-subtle text-error',
  },
  info: {
    dotClass: 'bg-primary',
    containerClass: 'bg-primary-subtle text-primary',
  },
  neutral: {
    dotClass: 'bg-neutral-400',
    containerClass: 'bg-neutral-100 text-neutral-600',
  },
};

const sizeConfig = {
  sm: {
    containerClass: 'px-2 py-1 text-xs',
    dotClass: 'w-1.5 h-1.5',
    iconClass: 'w-3 h-3',
  },
  md: {
    containerClass: 'px-2.5 py-1.5 text-sm',
    dotClass: 'w-2 h-2',
    iconClass: 'w-3.5 h-3.5',
  },
  lg: {
    containerClass: 'px-3 py-2 text-sm',
    dotClass: 'w-2.5 h-2.5',
    iconClass: 'w-4 h-4',
  },
};

export function StatusIndicator({
  type,
  label,
  icon: Icon,
  size = 'md',
  showDot = true,
  className,
}: StatusIndicatorProps) {
  const status = statusConfig[type];
  const sizing = sizeConfig[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        status.containerClass,
        sizing.containerClass,
        className
      )}
    >
      {showDot && !Icon && (
        <span className={cn('rounded-full', status.dotClass, sizing.dotClass)} />
      )}
      {Icon && <Icon className={sizing.iconClass} />}
      {label}
    </span>
  );
}

/**
 * Pulsing Status Dot - For live status indicators
 */
interface StatusDotProps {
  type: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ type, size = 'md', pulse = false, className }: StatusDotProps) {
  const status = statusConfig[type];
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <span className={cn('rounded-full', status.dotClass, dotSizes[size])} />
      {pulse && (
        <span
          className={cn(
            'absolute top-0 left-0 rounded-full animate-ping',
            status.dotClass,
            dotSizes[size],
            'opacity-75'
          )}
        />
      )}
    </span>
  );
}