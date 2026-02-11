/**
 * Confirmation Dialog Component - Vendara Design System
 * Standardized modal for destructive and important actions
 * Infrastructure-grade UI with clear action hierarchy
 */

import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../app/components/ui/alert-dialog';

export type ConfirmationVariant = 'default' | 'destructive' | 'warning' | 'success' | 'danger';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ConfirmationVariant;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Aliases for backward compatibility
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: 'text-primary-700 bg-primary-50',
    confirmClass: 'bg-primary hover:bg-primary-pressed',
  },
  destructive: {
    icon: AlertTriangle,
    iconClass: 'text-error bg-error-subtle',
    confirmClass: 'bg-error hover:bg-error/90',
  },
  danger: { // Alias for destructive
    icon: AlertTriangle,
    iconClass: 'text-error bg-error-subtle',
    confirmClass: 'bg-error hover:bg-error/90',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-warning bg-warning-subtle',
    confirmClass: 'bg-warning hover:bg-warning/90',
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-success bg-success-subtle',
    confirmClass: 'bg-success hover:bg-success/90',
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  variant = 'default',
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  
  // Use confirmText/cancelText if provided, otherwise use confirmLabel/cancelLabel
  const finalConfirmLabel = confirmText || confirmLabel || 'Confirm';
  const finalCancelLabel = cancelText || cancelLabel || 'Cancel';

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconClass}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-neutral-900 mb-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-neutral-600">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {finalCancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={config.confirmClass}
          >
            {loading ? 'Processing...' : finalConfirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}