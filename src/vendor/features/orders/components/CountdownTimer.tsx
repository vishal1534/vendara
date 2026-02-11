import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: string;
  className?: string;
}

export function CountdownTimer({ expiresAt, className = '' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining(0);
        return;
      }

      setTimeRemaining(diff);
      setIsExpired(false);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTimeRemaining = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getUrgencyLevel = (): 'critical' | 'warning' | 'normal' => {
    const totalMinutes = Math.floor(timeRemaining / 60000);
    
    if (totalMinutes <= 5) return 'critical';
    if (totalMinutes <= 10) return 'warning';
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  const urgencyStyles = {
    critical: {
      bg: 'bg-error-50',
      border: 'border-error-300',
      text: 'text-error-700',
      icon: 'text-error-600',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-300',
      text: 'text-warning-700',
      icon: 'text-warning-600',
    },
    normal: {
      bg: 'bg-success-50',
      border: 'border-success-300',
      text: 'text-success-700',
      icon: 'text-success-600',
    },
  };

  const styles = urgencyStyles[urgencyLevel];

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-300 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-neutral-500" />
        <span className="text-xs font-semibold text-neutral-600">Expired</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${styles.bg} border ${styles.border} ${className}`}>
      <Clock className={`w-3.5 h-3.5 ${styles.icon}`} />
      <span className={`text-xs font-semibold ${styles.text}`}>
        {formatTimeRemaining(timeRemaining)}
      </span>
    </div>
  );
}
