/**
 * Mock Payment Data Generator
 * Based on real vendor and order data from the Vendara platform
 */

import type { Payment, Refund, Settlement, PaginatedResponse } from '../types/payment';

/**
 * VENDOR IDs - Using Vendor Portal IDs:
 * - vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8: Chauhan Cement Suppliers (Miyapur)
 * - vendor_02HQKZX8Y9Z1A2B3C4D5E6F7G9: Sharma Building Materials (Gachibowli) 
 * - vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0: Chauhan Steel & Hardware (Bachupally)
 * 
 * Admin Portal also has:
 * - V001: Sri Sai Cement Suppliers
 * - V002: Balaji Steel & TMT
 * - V003: Mahalakshmi Aggregates
 */

/**
 * Mock Payments - Realistic payment history across all vendors
 */
export const mockPayments: Payment[] = [
  // VENDOR PORTAL: vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8 (Chauhan Cement Suppliers)
  {
    id: 'pay_VP2026011301',
    orderId: 'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8', // Maps to ORD-1248
    buyerId: 'buyer_hb_20250815_021',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    amount: 52000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjZyGh8K7zN4M',
    razorpayPaymentId: 'pay_VPjZyGh8K7zN4M',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-13T08:20:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T08:20:32Z').toISOString(),
    completedAt: new Date('2026-01-13T08:20:32Z').toISOString(),
  },
  {
    id: 'pay_VP2026011201',
    orderId: 'order_02HQKZX8Y9Z1A2B3C4D5E6F7G9', // Maps to ORD-1247
    buyerId: 'buyer_hb_20250820_022',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    amount: 38500,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjXyFg7J6yM3L',
    razorpayPaymentId: 'pay_VPjXyFg7J6yM3L',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-12T10:45:00Z').toISOString(),
    updatedAt: new Date('2026-01-12T10:45:28Z').toISOString(),
    completedAt: new Date('2026-01-12T10:45:28Z').toISOString(),
  },
  {
    id: 'pay_VP2026011101',
    orderId: 'order_03HQKZX8Y9Z1A2B3C4D5E6F7H0', // Maps to ORD-1246
    buyerId: 'buyer_hb_20250825_023',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    amount: 29000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjWxEf6I5xL2K',
    razorpayPaymentId: 'pay_VPjWxEf6I5xL2K',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-11T13:15:00Z').toISOString(),
    updatedAt: new Date('2026-01-11T13:15:25Z').toISOString(),
    completedAt: new Date('2026-01-11T13:15:25Z').toISOString(),
  },
  {
    id: 'pay_VP2026010601',
    orderId: 'order_04HQKZX8Y9Z1A2B3C4D5E6F7H1', // Maps to ORD-1245
    buyerId: 'buyer_hb_20250810_024',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    amount: 46000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjVwDe5H4wK1J',
    razorpayPaymentId: 'pay_VPjVwDe5H4wK1J',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-06T09:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T09:30:29Z').toISOString(),
    completedAt: new Date('2026-01-06T09:30:29Z').toISOString(),
  },
  {
    id: 'pay_VP2026010501',
    orderId: 'order_05HQKZX8Y9Z1A2B3C4D5E6F7H2', // Maps to ORD-1244
    buyerId: 'buyer_hb_20250812_025',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    amount: 34000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjUvCd4G3vJ0I',
    razorpayPaymentId: 'pay_VPjUvCd4G3vJ0I',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-05T15:20:00Z').toISOString(),
    updatedAt: new Date('2026-01-05T15:20:24Z').toISOString(),
    completedAt: new Date('2026-01-05T15:20:24Z').toISOString(),
  },

  // VENDOR PORTAL: vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0 (Chauhan Steel & Hardware)
  {
    id: 'pay_VP2026011303',
    orderId: 'order_vendor3_accepted_001', // RK Steel order
    buyerId: 'buyer_hb_20250815_026',
    vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    amount: 72000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjZzGi9L8zO5N',
    razorpayPaymentId: 'pay_VPjZzGi9L8zO5N',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-13T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T11:00:38Z').toISOString(),
    completedAt: new Date('2026-01-13T11:00:38Z').toISOString(),
  },
  {
    id: 'pay_VP2026011203',
    orderId: 'order_06HQKZX8Y9Z1A2B3C4D5E6F7H3', // Maps to ORD-1240
    buyerId: 'buyer_hb_20250820_027',
    vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    amount: 58000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_VPjYyGh8K7yN4M',
    razorpayPaymentId: 'pay_VPjYyGh8K7yN4M',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-12T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-12T09:00:31Z').toISOString(),
    completedAt: new Date('2026-01-12T09:00:31Z').toISOString(),
  },

  // ADMIN PORTAL vendors below
  // V001: Sri Sai Cement Suppliers - Recent successful payments
  {
    id: 'pay_RS2026011301',
    orderId: 'ORD-20260113-V001-001',
    buyerId: 'buyer_hb_20250815_001',
    vendorId: 'V001',
    amount: 45000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjZyGh8K7zN4M',
    razorpayPaymentId: 'pay_NRjZyGh8K7zN4M',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-13T09:15:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T09:15:30Z').toISOString(),
    completedAt: new Date('2026-01-13T09:15:30Z').toISOString(),
  },
  {
    id: 'pay_RS2026011201',
    orderId: 'ORD-20260112-V001-002',
    buyerId: 'buyer_hb_20250820_003',
    vendorId: 'V001',
    amount: 32500,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjXyFg7J6yM3L',
    razorpayPaymentId: 'pay_NRjXyFg7J6yM3L',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-12T14:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-12T14:30:25Z').toISOString(),
    completedAt: new Date('2026-01-12T14:30:25Z').toISOString(),
  },
  {
    id: 'pay_RS2026011101',
    orderId: 'ORD-20260111-V001-003',
    buyerId: 'buyer_hb_20250825_007',
    vendorId: 'V001',
    amount: 28000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjWxEf6I5xL2K',
    razorpayPaymentId: 'pay_NRjWxEf6I5xL2K',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-11T11:20:00Z').toISOString(),
    updatedAt: new Date('2026-01-11T11:20:18Z').toISOString(),
    completedAt: new Date('2026-01-11T11:20:18Z').toISOString(),
  },
  {
    id: 'pay_RS2026011001',
    orderId: 'ORD-20260110-V001-004',
    buyerId: 'buyer_hb_20250830_012',
    vendorId: 'V001',
    amount: 15000,
    currency: 'INR',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: new Date('2026-01-10T16:45:00Z').toISOString(),
    updatedAt: new Date('2026-01-10T16:45:00Z').toISOString(),
    notes: 'Cash on Delivery - Payment pending collection',
  },

  // V002: Balaji Steel & TMT - High-value steel orders
  {
    id: 'pay_RS2026011302',
    orderId: 'ORD-20260113-V002-001',
    buyerId: 'buyer_hb_20250815_002',
    vendorId: 'V002',
    amount: 125000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjZzGi9L8zO5N',
    razorpayPaymentId: 'pay_NRjZzGi9L8zO5N',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-13T10:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T10:30:42Z').toISOString(),
    completedAt: new Date('2026-01-13T10:30:42Z').toISOString(),
  },
  {
    id: 'pay_RS2026011202',
    orderId: 'ORD-20260112-V002-002',
    buyerId: 'buyer_hb_20250820_005',
    vendorId: 'V002',
    amount: 85000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjYyGh8K7yN4M',
    razorpayPaymentId: 'pay_NRjYyGh8K7yN4M',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-12T08:15:00Z').toISOString(),
    updatedAt: new Date('2026-01-12T08:15:35Z').toISOString(),
    completedAt: new Date('2026-01-12T08:15:35Z').toISOString(),
  },
  {
    id: 'pay_RS2026011102',
    orderId: 'ORD-20260111-V002-003',
    buyerId: 'buyer_hb_20250825_009',
    vendorId: 'V002',
    amount: 67000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'failed',
    razorpayOrderId: 'order_NRjXxFg7J6xM3L',
    paymentGateway: 'razorpay',
    paymentErrorCode: 'BAD_REQUEST_ERROR',
    paymentErrorMessage: 'Payment failed - Insufficient funds in bank account',
    createdAt: new Date('2026-01-11T15:40:00Z').toISOString(),
    updatedAt: new Date('2026-01-11T15:40:12Z').toISOString(),
    failedAt: new Date('2026-01-11T15:40:12Z').toISOString(),
  },

  // V003: Mahalakshmi Aggregates - Aggregates and sand orders
  {
    id: 'pay_RS2026011303',
    orderId: 'ORD-20260113-V003-001',
    buyerId: 'buyer_hb_20250815_004',
    vendorId: 'V003',
    amount: 38000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjZAHj0M9aP6O',
    razorpayPaymentId: 'pay_NRjZAHj0M9aP6O',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-13T12:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T12:00:28Z').toISOString(),
    completedAt: new Date('2026-01-13T12:00:28Z').toISOString(),
  },
  {
    id: 'pay_RS2026011203',
    orderId: 'ORD-20260112-V003-002',
    buyerId: 'buyer_hb_20250820_008',
    vendorId: 'V003',
    amount: 42000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjYzHi9L8zO5N',
    razorpayPaymentId: 'pay_NRjYzHi9L8zO5N',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-12T13:25:00Z').toISOString(),
    updatedAt: new Date('2026-01-12T13:25:31Z').toISOString(),
    completedAt: new Date('2026-01-12T13:25:31Z').toISOString(),
  },
  {
    id: 'pay_RS2026011103',
    orderId: 'ORD-20260111-V003-003',
    buyerId: 'buyer_hb_20250825_011',
    vendorId: 'V003',
    amount: 29500,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'refunded',
    razorpayOrderId: 'order_NRjXyGh8K7yN4M',
    razorpayPaymentId: 'pay_NRjXyGh8K7yN4M',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-11T09:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-11T17:20:00Z').toISOString(),
    completedAt: new Date('2026-01-11T09:30:22Z').toISOString(),
    notes: 'Refunded - Material quality issue reported by buyer',
  },

  // Older payments for V001 (for settlement history)
  {
    id: 'pay_RS2026010601',
    orderId: 'ORD-20260106-V001-005',
    buyerId: 'buyer_hb_20250810_015',
    vendorId: 'V001',
    amount: 52000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjVwDe5H4wK1J',
    razorpayPaymentId: 'pay_NRjVwDe5H4wK1J',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-06T10:15:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T10:15:28Z').toISOString(),
    completedAt: new Date('2026-01-06T10:15:28Z').toISOString(),
  },
  {
    id: 'pay_RS2026010501',
    orderId: 'ORD-20260105-V001-006',
    buyerId: 'buyer_hb_20250812_018',
    vendorId: 'V001',
    amount: 38000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjUvCd4G3vJ0I',
    razorpayPaymentId: 'pay_NRjUvCd4G3vJ0I',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-05T14:40:00Z').toISOString(),
    updatedAt: new Date('2026-01-05T14:40:19Z').toISOString(),
    completedAt: new Date('2026-01-05T14:40:19Z').toISOString(),
  },

  // Older payments for V002
  {
    id: 'pay_RS2026010602',
    orderId: 'ORD-20260106-V002-004',
    buyerId: 'buyer_hb_20250810_016',
    vendorId: 'V002',
    amount: 98000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjVxEf6I5xL2K',
    razorpayPaymentId: 'pay_NRjVxEf6I5xL2K',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-06T11:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T11:30:45Z').toISOString(),
    completedAt: new Date('2026-01-06T11:30:45Z').toISOString(),
  },
  {
    id: 'pay_RS2026010502',
    orderId: 'ORD-20260105-V002-005',
    buyerId: 'buyer_hb_20250812_019',
    vendorId: 'V002',
    amount: 112000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjUwDe5H4wK1J',
    razorpayPaymentId: 'pay_NRjUwDe5H4wK1J',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-05T09:20:00Z').toISOString(),
    updatedAt: new Date('2026-01-05T09:20:38Z').toISOString(),
    completedAt: new Date('2026-01-05T09:20:38Z').toISOString(),
  },

  // Older payments for V003
  {
    id: 'pay_RS2026010603',
    orderId: 'ORD-20260106-V003-004',
    buyerId: 'buyer_hb_20250810_017',
    vendorId: 'V003',
    amount: 35000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjVyFg7J6yM3L',
    razorpayPaymentId: 'pay_NRjVyFg7J6yM3L',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-06T15:10:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T15:10:24Z').toISOString(),
    completedAt: new Date('2026-01-06T15:10:24Z').toISOString(),
  },
  {
    id: 'pay_RS2026010503',
    orderId: 'ORD-20260105-V003-005',
    buyerId: 'buyer_hb_20250812_020',
    vendorId: 'V003',
    amount: 44500,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'success',
    razorpayOrderId: 'order_NRjUxEf6I5xL2K',
    razorpayPaymentId: 'pay_NRjUxEf6I5xL2K',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-05T16:35:00Z').toISOString(),
    updatedAt: new Date('2026-01-05T16:35:27Z').toISOString(),
    completedAt: new Date('2026-01-05T16:35:27Z').toISOString(),
  },

  // Processing payment
  {
    id: 'pay_RS2026011304',
    orderId: 'ORD-20260113-V001-007',
    buyerId: 'buyer_hb_20250815_006',
    vendorId: 'V001',
    amount: 24000,
    currency: 'INR',
    paymentMethod: 'online',
    paymentStatus: 'processing',
    razorpayOrderId: 'order_NRjZBIk1N0bQ7P',
    paymentGateway: 'razorpay',
    createdAt: new Date('2026-01-13T17:45:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T17:45:10Z').toISOString(),
    notes: 'Payment verification in progress',
  },
];

/**
 * Mock Refunds
 */
export const mockRefunds: Refund[] = [
  {
    id: 'rfnd_RS2026011101',
    paymentId: 'pay_RS2026011103',
    amount: 29500,
    currency: 'INR',
    refundReason: 'Material quality issue - Buyer reported substandard aggregates',
    refundStatus: 'completed',
    razorpayRefundId: 'rfnd_NRjXyGh8K7yN4M',
    initiatedBy: 'admin_ops_001',
    notes: 'Full refund processed after quality inspection confirmed issue',
    createdAt: new Date('2026-01-11T14:30:00Z').toISOString(),
    updatedAt: new Date('2026-01-11T17:20:00Z').toISOString(),
    completedAt: new Date('2026-01-11T17:20:00Z').toISOString(),
  },
];

/**
 * Mock Settlements - Weekly settlement cycle (Every Monday)
 */
export const mockSettlements: Settlement[] = [
  // VENDOR PORTAL: vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8 (Chauhan Cement Suppliers)
  {
    id: 'settlement_VP2026W03_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2026-01-13',
    periodEnd: '2026-01-19',
    totalAmount: 119500, // pay_VP2026011301 + pay_VP2026011201 + pay_VP2026011101
    commissionPercentage: 5,
    commissionAmount: 5975,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 113525,
    paymentCount: 3,
    status: 'pending',
    notes: 'Current week - Settlement scheduled for Jan 20, 2026',
    createdAt: new Date('2026-01-13T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T18:00:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2026W02_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2026-01-06',
    periodEnd: '2026-01-12',
    totalAmount: 80000, // pay_VP2026010601 + pay_VP2026010501
    commissionPercentage: 5,
    commissionAmount: 4000,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 76000,
    paymentCount: 2,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202601130045678',
    settlementMethod: 'NEFT',
    notes: 'Settled successfully on Jan 13, 2026',
    createdAt: new Date('2026-01-06T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T11:30:00Z').toISOString(),
    processedAt: new Date('2026-01-13T11:30:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2025W52_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2025-12-30',
    periodEnd: '2026-01-05',
    totalAmount: 98000,
    commissionPercentage: 5,
    commissionAmount: 4900,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 93100,
    paymentCount: 3,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202601060045678',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-30T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T11:00:00Z').toISOString(),
    processedAt: new Date('2026-01-06T11:00:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2025W51_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2025-12-23',
    periodEnd: '2025-12-29',
    totalAmount: 124000,
    commissionPercentage: 5,
    commissionAmount: 6200,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 117800,
    paymentCount: 4,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202512300045678',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-23T18:00:00Z').toISOString(),
    updatedAt: new Date('2025-12-30T10:00:00Z').toISOString(),
    processedAt: new Date('2025-12-30T10:00:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2025W50_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2025-12-16',
    periodEnd: '2025-12-22',
    totalAmount: 87500,
    commissionPercentage: 5,
    commissionAmount: 4375,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 83125,
    paymentCount: 3,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202512230045678',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-16T18:00:00Z').toISOString(),
    updatedAt: new Date('2025-12-23T09:30:00Z').toISOString(),
    processedAt: new Date('2025-12-23T09:30:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2025W49_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2025-12-09',
    periodEnd: '2025-12-15',
    totalAmount: 142000,
    commissionPercentage: 5,
    commissionAmount: 7100,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 134900,
    paymentCount: 5,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202512160045678',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-09T18:00:00Z').toISOString(),
    updatedAt: new Date('2025-12-16T10:15:00Z').toISOString(),
    processedAt: new Date('2025-12-16T10:15:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2025W48_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2025-12-02',
    periodEnd: '2025-12-08',
    totalAmount: 96000,
    commissionPercentage: 5,
    commissionAmount: 4800,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 91200,
    paymentCount: 3,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202512090045678',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-02T18:00:00Z').toISOString(),
    updatedAt: new Date('2025-12-09T09:45:00Z').toISOString(),
    processedAt: new Date('2025-12-09T09:45:00Z').toISOString(),
  },
  {
    id: 'settlement_VP2025W47_V01',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorName: 'Chauhan Cement Suppliers',
    periodStart: '2025-11-25',
    periodEnd: '2025-12-01',
    totalAmount: 108500,
    commissionPercentage: 5,
    commissionAmount: 5425,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 103075,
    paymentCount: 4,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Vishal Chauhan',
    utrNumber: 'HDFC202512020045678',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-11-25T18:00:00Z').toISOString(),
    updatedAt: new Date('2025-12-02T10:00:00Z').toISOString(),
    processedAt: new Date('2025-12-02T10:00:00Z').toISOString(),
  },

  // VENDOR PORTAL: vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0 (Chauhan Steel & Hardware)  
  {
    id: 'settlement_VP2026W03_V03',
    vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    vendorName: 'Chauhan Steel & Hardware',
    periodStart: '2026-01-13',
    periodEnd: '2026-01-19',
    totalAmount: 130000, // pay_VP2026011303 + pay_VP2026011203
    commissionPercentage: 5,
    commissionAmount: 6500,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 123500,
    paymentCount: 2,
    status: 'pending',
    notes: 'Current week - Settlement scheduled for Jan 20, 2026',
    createdAt: new Date('2026-01-13T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T18:00:00Z').toISOString(),
  },

  // ADMIN PORTAL vendors below
  // Latest settlement (Pending) - Week of Jan 13-19, 2026
  {
    id: 'settlement_RS2026W03_V001',
    vendorId: 'V001',
    vendorName: 'Sri Sai Cement Suppliers',
    periodStart: '2026-01-13',
    periodEnd: '2026-01-19',
    totalAmount: 105500, // pay_RS2026011301 + pay_RS2026011201 + pay_RS2026011101
    commissionPercentage: 5,
    commissionAmount: 5275,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 100225,
    paymentCount: 3,
    status: 'pending',
    notes: 'Current week - Settlement scheduled for Jan 20, 2026',
    createdAt: new Date('2026-01-13T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T18:00:00Z').toISOString(),
  },
  {
    id: 'settlement_RS2026W03_V002',
    vendorId: 'V002',
    vendorName: 'Balaji Steel & TMT',
    periodStart: '2026-01-13',
    periodEnd: '2026-01-19',
    totalAmount: 210000, // pay_RS2026011302 + pay_RS2026011202
    commissionPercentage: 5,
    commissionAmount: 10500,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 199500,
    paymentCount: 2,
    status: 'pending',
    notes: 'Current week - Settlement scheduled for Jan 20, 2026',
    createdAt: new Date('2026-01-13T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T18:00:00Z').toISOString(),
  },
  {
    id: 'settlement_RS2026W03_V003',
    vendorId: 'V003',
    vendorName: 'Mahalakshmi Aggregates',
    periodStart: '2026-01-13',
    periodEnd: '2026-01-19',
    totalAmount: 80000, // pay_RS2026011303 + pay_RS2026011203
    commissionPercentage: 5,
    commissionAmount: 4000,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 76000,
    paymentCount: 2,
    status: 'pending',
    notes: 'Current week - Settlement scheduled for Jan 20, 2026',
    createdAt: new Date('2026-01-13T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T18:00:00Z').toISOString(),
  },

  // Previous settlement (Completed) - Week of Jan 6-12, 2026
  {
    id: 'settlement_RS2026W02_V001',
    vendorId: 'V001',
    vendorName: 'Sri Sai Cement Suppliers',
    periodStart: '2026-01-06',
    periodEnd: '2026-01-12',
    totalAmount: 90000, // pay_RS2026010601 + pay_RS2026010501
    commissionPercentage: 5,
    commissionAmount: 4500,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 85500,
    paymentCount: 2,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Ramesh Kumar',
    utrNumber: 'HDFC202601130012345',
    settlementMethod: 'NEFT',
    notes: 'Settled successfully on Jan 13, 2026',
    createdAt: new Date('2026-01-06T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T10:30:00Z').toISOString(),
    processedAt: new Date('2026-01-13T10:30:00Z').toISOString(),
  },
  {
    id: 'settlement_RS2026W02_V002',
    vendorId: 'V002',
    vendorName: 'Balaji Steel & TMT',
    periodStart: '2026-01-06',
    periodEnd: '2026-01-12',
    totalAmount: 210000, // pay_RS2026010602 + pay_RS2026010502
    commissionPercentage: 5,
    commissionAmount: 10500,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 199500,
    paymentCount: 2,
    status: 'completed',
    accountNumber: 'XXXXXX5678',
    ifscCode: 'ICIC0001234',
    accountHolderName: 'Suresh Reddy',
    utrNumber: 'ICIC202601130023456',
    settlementMethod: 'RTGS',
    notes: 'Settled successfully on Jan 13, 2026',
    createdAt: new Date('2026-01-06T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T10:45:00Z').toISOString(),
    processedAt: new Date('2026-01-13T10:45:00Z').toISOString(),
  },
  {
    id: 'settlement_RS2026W02_V003',
    vendorId: 'V003',
    vendorName: 'Mahalakshmi Aggregates',
    periodStart: '2026-01-06',
    periodEnd: '2026-01-12',
    totalAmount: 79500, // pay_RS2026010603 + pay_RS2026010503
    commissionPercentage: 5,
    commissionAmount: 3975,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 75525,
    paymentCount: 2,
    status: 'completed',
    accountNumber: 'XXXXXX5566',
    ifscCode: 'SBI0001234',
    accountHolderName: 'Lakshmi Devi',
    utrNumber: 'SBI202601130034567',
    settlementMethod: 'NEFT',
    notes: 'Settled successfully on Jan 13, 2026',
    createdAt: new Date('2026-01-06T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-13T11:00:00Z').toISOString(),
    processedAt: new Date('2026-01-13T11:00:00Z').toISOString(),
  },

  // Older settlements for history
  {
    id: 'settlement_RS2025W52_V001',
    vendorId: 'V001',
    vendorName: 'Sri Sai Cement Suppliers',
    periodStart: '2025-12-30',
    periodEnd: '2026-01-05',
    totalAmount: 125000,
    commissionPercentage: 5,
    commissionAmount: 6250,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 118750,
    paymentCount: 4,
    status: 'completed',
    accountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Ramesh Kumar',
    utrNumber: 'HDFC202601060012345',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-30T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T10:00:00Z').toISOString(),
    processedAt: new Date('2026-01-06T10:00:00Z').toISOString(),
  },
  {
    id: 'settlement_RS2025W52_V002',
    vendorId: 'V002',
    vendorName: 'Balaji Steel & TMT',
    periodStart: '2025-12-30',
    periodEnd: '2026-01-05',
    totalAmount: 285000,
    commissionPercentage: 5,
    commissionAmount: 14250,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 270750,
    paymentCount: 3,
    status: 'completed',
    accountNumber: 'XXXXXX5678',
    ifscCode: 'ICIC0001234',
    accountHolderName: 'Suresh Reddy',
    utrNumber: 'ICIC202601060023456',
    settlementMethod: 'RTGS',
    createdAt: new Date('2025-12-30T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T10:15:00Z').toISOString(),
    processedAt: new Date('2026-01-06T10:15:00Z').toISOString(),
  },
  {
    id: 'settlement_RS2025W52_V003',
    vendorId: 'V003',
    vendorName: 'Mahalakshmi Aggregates',
    periodStart: '2025-12-30',
    periodEnd: '2026-01-05',
    totalAmount: 95000,
    commissionPercentage: 5,
    commissionAmount: 4750,
    taxAmount: 0,
    adjustmentAmount: 0,
    settlementAmount: 90250,
    paymentCount: 3,
    status: 'completed',
    accountNumber: 'XXXXXX5566',
    ifscCode: 'SBI0001234',
    accountHolderName: 'Lakshmi Devi',
    utrNumber: 'SBI202601060034567',
    settlementMethod: 'NEFT',
    createdAt: new Date('2025-12-30T18:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-06T10:30:00Z').toISOString(),
    processedAt: new Date('2026-01-06T10:30:00Z').toISOString(),
  },
];

/**
 * Get paginated payments with optional status filter
 */
export function getMockPayments(
  page: number = 1,
  pageSize: number = 20,
  status?: string
): PaginatedResponse<Payment> {
  let filteredPayments = [...mockPayments];

  // Apply status filter
  if (status && status !== 'all') {
    filteredPayments = filteredPayments.filter((p) => p.paymentStatus === status);
  }

  // Sort by creation date (newest first)
  filteredPayments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredPayments.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get payments by vendor ID
 */
export function getMockPaymentsByVendor(
  vendorId: string,
  page: number = 1,
  pageSize: number = 20
): PaginatedResponse<Payment> {
  const vendorPayments = mockPayments.filter((p) => p.vendorId === vendorId);

  // Sort by creation date (newest first)
  vendorPayments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalItems = vendorPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = vendorPayments.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get paginated settlements with optional status filter
 */
export function getMockSettlements(
  page: number = 1,
  pageSize: number = 20,
  status?: string
): PaginatedResponse<Settlement> {
  let filteredSettlements = [...mockSettlements];

  // Apply status filter
  if (status && status !== 'all') {
    filteredSettlements = filteredSettlements.filter((s) => s.status === status);
  }

  // Sort by period end date (newest first)
  filteredSettlements.sort((a, b) => 
    new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime()
  );

  // Pagination
  const totalItems = filteredSettlements.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredSettlements.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get settlements by vendor ID
 */
export function getMockSettlementsByVendor(
  vendorId: string,
  page: number = 1,
  pageSize: number = 20
): PaginatedResponse<Settlement> {
  const vendorSettlements = mockSettlements.filter((s) => s.vendorId === vendorId);

  // Sort by period end date (newest first)
  vendorSettlements.sort((a, b) => 
    new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime()
  );

  const totalItems = vendorSettlements.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = vendorSettlements.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get payment by ID
 */
export function getMockPaymentById(paymentId: string): Payment | null {
  return mockPayments.find((p) => p.id === paymentId) || null;
}

/**
 * Get settlement by ID
 */
export function getMockSettlementById(settlementId: string): Settlement | null {
  return mockSettlements.find((s) => s.id === settlementId) || null;
}

/**
 * Get refunds for a payment
 */
export function getMockRefundsByPayment(paymentId: string): Refund[] {
  return mockRefunds.filter((r) => r.paymentId === paymentId);
}

/**
 * Calculate available balance for a vendor
 * This is the sum of all completed payments that haven't been settled yet
 */
export function calculateAvailableBalance(vendorId: string): number {
  // Get all successful payments for this vendor
  const vendorPayments = mockPayments.filter(
    (p) => p.vendorId === vendorId && p.paymentStatus === 'success'
  );

  // Get all payment IDs that have been settled
  const settledPaymentIds = new Set<string>();
  mockSettlements
    .filter((s) => s.vendorId === vendorId && s.status === 'completed')
    .forEach((settlement) => {
      if (settlement.payments) {
        settlement.payments.forEach((p) => settledPaymentIds.add(p.id));
      }
    });

  // Calculate sum of unsettled payments
  const unsettledTotal = vendorPayments
    .filter((p) => !settledPaymentIds.has(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  return unsettledTotal;
}