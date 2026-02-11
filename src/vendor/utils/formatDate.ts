import { format, parseISO, isValid } from 'date-fns';

/**
 * Format date to readable format
 * Example: "Jan 8, 2026"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Format date to short format
 * Example: "08 Jan"
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, 'dd MMM');
}

/**
 * Format time to 12-hour format
 * Example: "2:30 PM"
 */
export function formatTime(time: string): string {
  // time can be in format "HH:mm" or a full ISO timestamp
  if (!time) return 'Invalid time';
  
  // If it's a full ISO timestamp, extract just the time
  if (time.includes('T') || time.includes('Z')) {
    const dateObj = parseISO(time);
    if (!isValid(dateObj)) {
      return 'Invalid time';
    }
    return format(dateObj, 'h:mm a');
  }
  
  // Otherwise treat it as "HH:mm" format
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return 'Invalid time';
  }
  const date = new Date();
  date.setHours(hours, minutes);
  if (!isValid(date)) {
    return 'Invalid time';
  }
  return format(date, 'h:mm a');
}

/**
 * Format date and time
 * Example: "Jan 8, 2026 at 2:30 PM"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, 'MMM d, yyyy \'at\' h:mm a');
}

/**
 * Get relative time
 * Example: "2 hours ago" or "Just now"
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  return formatDate(dateObj);
}