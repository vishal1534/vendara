/**
 * Alert Component - Vendara Design System
 * Standardized feedback banners for info, warning, error, and success messages
 * Construction-native color palette with infrastructure-grade UI
 */

import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../../app/components/ui/utils';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    containerClass: 'bg-primary-50/30 border-primary-200',
    iconClass: 'text-primary-700',
    titleClass: 'text-primary-900',
    descriptionClass: 'text-primary-800',
    actionClass: 'text-primary-700 hover:text-primary-800',
  },
  success: {
    icon: CheckCircle2,
    containerClass: 'bg-success-subtle border-success',
    iconClass: 'text-success',
    titleClass: 'text-success',
    descriptionClass: 'text-neutral-700',
    actionClass: 'text-success hover:text-success/80',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-warning-subtle border-warning',
    iconClass: 'text-warning',
    titleClass: 'text-warning',
    descriptionClass: 'text-neutral-700',
    actionClass: 'text-warning hover:text-warning/80',
  },
  error: {
    icon: XCircle,
    containerClass: 'bg-error-subtle border-error',
    iconClass: 'text-error',
    titleClass: 'text-error',
    descriptionClass: 'text-neutral-700',
    actionClass: 'text-error hover:text-error/80',
  },
};

export function Alert({
  variant = 'info',
  title,
  description,
  icon: customIcon,
  dismissible = false,
  onDismiss,
  action,
  className,
}: AlertProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative rounded-lg border-l-4 p-4',
        config.containerClass,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', config.iconClass)}>
          {customIcon || <Icon className="w-5 h-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-semibold mb-1', config.titleClass)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm', config.descriptionClass)}>
            {description}
          </p>

          {/* Action Button */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'mt-3 text-sm font-medium underline',
                config.actionClass
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 rounded-md p-1.5 hover:bg-black/5 transition-colors',
              config.iconClass
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}