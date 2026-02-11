/**
 * Empty State Component - Vendara Design System
 * Standardized empty states for tables, lists, and content areas
 * Infrastructure-grade UI with clear messaging
 */

import { LucideIcon } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className || ''}`}>
      {/* Icon */}
      <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-neutral-900 mb-2 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 text-center max-w-md mb-6">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} variant={action.variant || 'default'}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
