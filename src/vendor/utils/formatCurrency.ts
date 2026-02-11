/**
 * Format currency in Indian Rupee format
 * Examples: ₹1,500 or ₹45,000
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency without symbol
 * Examples: 1,500 or 45,000
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}
