/**
 * Currency Formatting Utilities
 * 
 * Shared utilities for formatting currency values in Indian Rupee (INR) format.
 * 
 * @shared Used by: Admin Portal, Vendor Portal
 * 
 * @example
 * formatCurrency(1500) // "₹1,500"
 * formatCurrency(45000) // "₹45,000"
 * formatAmount(1500) // "1,500"
 * formatCurrencyCompact(150000) // "₹1.5L"
 */

/**
 * Format currency in Indian Rupee format with symbol
 * 
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "₹1,500")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format amount without currency symbol
 * 
 * @param amount - Amount to format
 * @returns Formatted amount string (e.g., "1,500")
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency with 2 decimal places
 * 
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "₹1,500.50")
 */
export function formatCurrencyWithDecimals(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency in compact notation (K for thousands, L for lakhs, Cr for crores)
 * 
 * @param amount - Amount to format
 * @returns Compact currency string (e.g., "₹1.5L", "₹2.3Cr")
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    // Crores (1 Crore = 10 million)
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    // Lakhs (1 Lakh = 100 thousand)
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    // Thousands
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}
