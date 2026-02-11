/**
 * Razorpay Configuration for Vendara
 */

export const RAZORPAY_CONFIG = {
  // Razorpay Key ID (public key - safe to expose)
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxx',

  // Company Details
  name: 'Vendara',
  description: 'Construction Materials & Labor Marketplace',
  image: '/logo.png', // Company logo URL

  // Currency
  currency: 'INR',

  // Theme
  theme: {
    color: '#F97316', // Vendara brand orange
    backdrop_color: '#FFFFFF',
  },

  // Modal Settings
  modal: {
    backdropclose: false,
    escape: false,
    handleback: false,
    confirm_close: true,
    ondismiss: () => {
      console.log('Payment cancelled by user');
    },
  },

  // Retry Settings
  retry: {
    enabled: true,
    max_count: 3,
  },

  // Timeout (in milliseconds)
  timeout: 300, // 5 minutes
};

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color: string;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

// Razorpay Test Cards
export const RAZORPAY_TEST_CARDS = {
  SUCCESS: {
    number: '4111 1111 1111 1111',
    cvv: '123',
    expiry: '12/25',
    name: 'Test Card',
  },
  FAILURE: {
    number: '4111 1111 1111 1112',
    cvv: '123',
    expiry: '12/25',
    name: 'Test Card Failure',
  },
};

// Helper to load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    Razorpay: any;
  }
}
