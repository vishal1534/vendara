/**
 * Loading State Component - Vendara Design System
 * Standardized loading indicators for data fetching and async operations
 * Infrastructure-grade UI with clear feedback
 */

import { Loader2 } from 'lucide-react';
import { cn } from '../../../app/components/ui/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    spinnerClass: 'w-4 h-4',
    textClass: 'text-xs',
    padding: 'py-4',
  },
  md: {
    spinnerClass: 'w-6 h-6',
    textClass: 'text-sm',
    padding: 'py-8',
  },
  lg: {
    spinnerClass: 'w-8 h-8',
    textClass: 'text-base',
    padding: 'py-12',
  },
};

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  className,
}: LoadingStateProps) {
  const config = sizeConfig[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center', config.padding, className)}>
      <Loader2 className={cn('animate-spin text-primary mb-3', config.spinnerClass)} />
      <p className={cn('text-neutral-600 font-medium', config.textClass)}>{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Inline Spinner - For button loading states
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />;
}

/**
 * Skeleton Loader - For content placeholders
 */
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ width = 'w-full', height = 'h-4', className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-200 rounded',
        width,
        height,
        className
      )}
    />
  );
}