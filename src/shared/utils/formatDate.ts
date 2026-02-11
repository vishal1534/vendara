/**
 * Date and Time Formatting Utilities
 * 
 * Shared utilities for formatting dates, times, and timestamps.
 * 
 * @shared Used by: Admin Portal, Vendor Portal
 * 
 * @example
 * formatDate('2026-01-08') // "Jan 8, 2026"
 * formatDateShort('2026-01-08') // "08 Jan"
 * formatTime('14:30') // "2:30 PM"
 * formatDateTime(new Date()) // "Jan 8, 2026 at 2:30 PM"
 * getRelativeTime(new Date()) // "Just now"
 */

import { format, parseISO, isValid } from 'date-fns';

/**
 * Format date to readable format
 * 
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 8, 2026")
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
 * 
 * @param date - Date string or Date object
 * @returns Short formatted date string (e.g., "08 Jan")
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, 'dd MMM');
}

/**
 * Format date in full format
 * 
 * @param date - Date string or Date object
 * @returns Full formatted date string (e.g., "Wednesday, January 8, 2026")
 */
export function formatDateFull(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, 'EEEE, MMMM d, yyyy');
}

/**
 * Format time to 12-hour format
 * 
 * @param time - Time string in "HH:mm" format or ISO timestamp
 * @returns Formatted time string (e.g., "2:30 PM")
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
 * Format date and time together
 * 
 * @param date - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 8, 2026 at 2:30 PM")
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Format date and time in short format
 * 
 * @param date - Date string or Date object
 * @returns Short formatted date and time (e.g., "08 Jan, 2:30 PM")
 */
export function formatDateTimeShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(dateObj, 'dd MMM, h:mm a');
}

/**
 * Get relative time from now
 * 
 * @param date - Date string or Date object
 * @returns Relative time string (e.g., "2 hours ago", "Just now")
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

/**
 * Format date for input fields (YYYY-MM-DD)
 * 
 * @param date - Date string or Date object
 * @returns ISO date string (e.g., "2026-01-08")
 */
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return '';
  }
  return format(dateObj, 'yyyy-MM-dd');
}