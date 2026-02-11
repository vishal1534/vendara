/**
 * Vendor Portal Route Constants
 */

export const VENDOR_ROUTES = {
  ROOT: '/vendor',
  DASHBOARD: '/vendor/dashboard',
  
  // Orders
  ORDERS: '/vendor/orders',
  ORDER_DETAILS: '/vendor/orders/:id',
  
  // Payouts
  PAYOUT_LEDGER: '/vendor/payouts/ledger',
  SETTLEMENT_SUMMARY: '/vendor/payouts/settlement',
  
  // Catalog
  CATALOG: '/vendor/catalog',
  
  // Performance
  PERFORMANCE: '/vendor/performance',
  
  // Settings
  SETTINGS: '/vendor/settings',
} as const;

/**
 * Helper to build route with params
 */
export function buildVendorRoute(route: string, params: Record<string, string>): string {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
}
