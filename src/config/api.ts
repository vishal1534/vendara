/**
 * API Configuration for Vendara Services
 */

export const API_CONFIG = {
  // Service URLs
  IDENTITY_SERVICE: import.meta.env.VITE_IDENTITY_SERVICE_URL || 'http://localhost:5001',
  VENDOR_SERVICE: import.meta.env.VITE_VENDOR_SERVICE_URL || 'http://localhost:5002',
  CATALOG_SERVICE: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://localhost:5005',
  ORDER_SERVICE: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5004',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:5007',

  // API Timeouts
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  PAYMENT_TIMEOUT: 60000, // 60 seconds for payment operations

  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const getApiUrl = (service: keyof typeof API_CONFIG): string => {
  const url = API_CONFIG[service];
  if (typeof url === 'string') {
    return url;
  }
  return '';
};
