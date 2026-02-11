/**
 * Shared Utilities Index
 * 
 * Central export point for all shared utility functions.
 * 
 * @shared Used by: Admin Portal, Vendor Portal
 */

// Currency formatting utilities
export {
  formatCurrency,
  formatAmount,
  formatCurrencyWithDecimals,
  formatCurrencyCompact,
} from './formatCurrency';

// Date and time formatting utilities
export {
  formatDate,
  formatDateShort,
  formatDateFull,
  formatTime,
  formatDateTime,
  formatDateTimeShort,
  getRelativeTime,
  formatDateForInput,
} from './formatDate';
