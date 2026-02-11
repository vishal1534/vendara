/**
 * Error State Component - Vendara Design System
 * Standardized error states for failed data loading, API errors, and system issues
 * Infrastructure-grade UI with clear recovery actions
 */

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  showDetails?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  error,
  showDetails = false,
  onRetry,
  onGoHome,
  className,
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className || ''}`}>
      {/* Icon */}
      <div className="w-16 h-16 bg-error-subtle rounded-lg flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-error" />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-neutral-900 mb-2 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 text-center max-w-md mb-4">
        {description}
      </p>

      {/* Error Details (dev mode) */}
      {showDetails && errorMessage && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 mb-6 max-w-md w-full">
          <p className="text-xs font-mono text-neutral-600 break-all">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
}
