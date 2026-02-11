import type { PayoutTransaction, Settlement } from '../types/payout';

/**
 * Mock Payout Transactions
 * Sample payout data for Chauhan Cement Suppliers
 */
export const mockPayoutTransactions: PayoutTransaction[] = [
  // Pending Payouts (Recent, not yet settled)
  {
    id: 'payout_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderId: 'order_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 2840,
    deductions: 0,
    netAmount: 2840,
    
    status: 'pending',
    
    createdAt: '2026-01-07T14:45:00Z',
  },
  
  {
    id: 'payout_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    orderId: 'order_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 2840,
    deductions: 0,
    netAmount: 2840,
    
    status: 'pending',
    
    createdAt: '2026-01-06T16:30:00Z',
  },
  
  {
    id: 'payout_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    orderId: 'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 3600,
    deductions: 0,
    netAmount: 3600,
    
    status: 'pending',
    
    createdAt: '2026-01-05T15:20:00Z',
  },
  
  {
    id: 'payout_04HQKZX8Y9Z1A2B3C4D5E6F7H1',
    orderId: 'order_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 1775,
    deductions: 0,
    netAmount: 1775,
    
    status: 'pending',
    
    createdAt: '2026-01-04T11:45:00Z',
  },
  
  // Settled Payouts (ST-2026-001)
  {
    id: 'payout_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
    orderId: 'order_04HQKZX8Y9Z1A2B3C4D5E6F7H1',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 1800,
    deductions: 0,
    netAmount: 1800,
    
    status: 'settled',
    
    settlementId: 'ST-2026-001',
    settlementDate: '2026-01-03T18:00:00Z',
    
    createdAt: '2026-01-03T14:30:00Z',
    settledAt: '2026-01-03T18:00:00Z',
  },
  
  {
    id: 'payout_06HQKZX8Y9Z1A2B3C4D5E6F7H3',
    orderId: 'order_06HQKZX8Y9Z1A2B3C4D5E6F7H3',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 2400,
    deductions: 0,
    netAmount: 2400,
    
    status: 'settled',
    
    settlementId: 'ST-2026-001',
    settlementDate: '2026-01-03T18:00:00Z',
    
    createdAt: '2026-01-02T16:00:00Z',
    settledAt: '2026-01-03T18:00:00Z',
  },
  
  // More settled payouts for December 2025
  {
    id: 'payout_07HQKZX8Y9Z1A2B3C4D5E6F7H4',
    orderId: 'order_07HQKZX8Y9Z1A2B3C4D5E6F7H4',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 4320,
    deductions: 0,
    netAmount: 4320,
    
    status: 'settled',
    
    settlementId: 'ST-2025-052',
    settlementDate: '2025-12-30T12:00:00Z',
    
    createdAt: '2025-12-28T14:00:00Z',
    settledAt: '2025-12-30T12:00:00Z',
  },
  
  {
    id: 'payout_08HQKZX8Y9Z1A2B3C4D5E6F7H5',
    orderId: 'order_vendor3_accepted_001',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 3600,
    deductions: 0,
    netAmount: 3600,
    
    status: 'settled',
    
    settlementId: 'ST-2025-052',
    settlementDate: '2025-12-30T12:00:00Z',
    
    createdAt: '2025-12-27T15:30:00Z',
    settledAt: '2025-12-30T12:00:00Z',
  },
  
  {
    id: 'payout_09HQKZX8Y9Z1A2B3C4D5E6F7H6',
    orderId: 'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 2840,
    deductions: 0,
    netAmount: 2840,
    
    status: 'settled',
    
    settlementId: 'ST-2025-051',
    settlementDate: '2025-12-23T12:00:00Z',
    
    createdAt: '2025-12-21T14:20:00Z',
    settledAt: '2025-12-23T12:00:00Z',
  },
  
  // Payout with deduction (late delivery)
  {
    id: 'payout_10HQKZX8Y9Z1A2B3C4D5E6F7H7',
    orderId: 'order_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    amount: 5800,
    deductions: 100, // Late delivery penalty
    netAmount: 5700,
    
    status: 'settled',
    
    settlementId: 'ST-2025-051',
    settlementDate: '2025-12-23T12:00:00Z',
    
    createdAt: '2025-12-20T16:00:00Z',
    settledAt: '2025-12-23T12:00:00Z',
  },
  
  // Additional settled payouts
  ...generateAdditionalPayouts(20),
];

/**
 * Mock Settlement History
 * Weekly settlements for Chauhan Cement Suppliers
 */
export const mockSettlements: Settlement[] = [
  // Next settlement (pending)
  {
    id: 'ST-2026-002',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    totalAmount: 11055, // Sum of pending payouts
    transactionCount: 4,
    deductions: 0,
    netAmount: 11055,
    
    bankAccountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    
    status: 'pending',
    
    cutoffDate: '2026-01-09T23:59:59Z', // Thursday
    settlementDate: '2026-01-10', // Friday
    
    payoutTransactionIds: [
      'payout_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      'payout_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
      'payout_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
      'payout_04HQKZX8Y9Z1A2B3C4D5E6F7H1',
    ],
    
    createdAt: '2026-01-08T12:00:00Z',
    updatedAt: '2026-01-08T12:00:00Z',
  },
  
  // Last settlement (processed)
  {
    id: 'ST-2026-001',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    totalAmount: 4200,
    transactionCount: 2,
    deductions: 0,
    netAmount: 4200,
    
    bankAccountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    
    status: 'processed',
    
    cutoffDate: '2026-01-02T23:59:59Z',
    settlementDate: '2026-01-03',
    processedAt: '2026-01-03T18:00:00Z',
    
    paymentReferenceNumber: 'HDFC20260103001234',
    
    payoutTransactionIds: [
      'payout_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
      'payout_06HQKZX8Y9Z1A2B3C4D5E6F7H3',
    ],
    
    createdAt: '2026-01-03T12:00:00Z',
    updatedAt: '2026-01-03T18:00:00Z',
  },
  
  // December 2025 settlements
  {
    id: 'ST-2025-052',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    totalAmount: 7920,
    transactionCount: 2,
    deductions: 0,
    netAmount: 7920,
    
    bankAccountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    
    status: 'processed',
    
    cutoffDate: '2025-12-29T23:59:59Z',
    settlementDate: '2025-12-30',
    processedAt: '2025-12-30T16:30:00Z',
    
    paymentReferenceNumber: 'HDFC20251230001234',
    
    payoutTransactionIds: [
      'payout_07HQKZX8Y9Z1A2B3C4D5E6F7H4',
      'payout_08HQKZX8Y9Z1A2B3C4D5E6F7H5',
    ],
    
    createdAt: '2025-12-30T12:00:00Z',
    updatedAt: '2025-12-30T16:30:00Z',
  },
  
  {
    id: 'ST-2025-051',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    totalAmount: 8540,
    transactionCount: 2,
    deductions: 100,
    netAmount: 8440,
    
    bankAccountNumber: 'XXXXXX1234',
    ifscCode: 'HDFC0001234',
    
    status: 'processed',
    
    cutoffDate: '2025-12-22T23:59:59Z',
    settlementDate: '2025-12-23',
    processedAt: '2025-12-23T15:45:00Z',
    
    paymentReferenceNumber: 'HDFC20251223001234',
    
    payoutTransactionIds: [
      'payout_09HQKZX8Y9Z1A2B3C4D5E6F7H6',
      'payout_10HQKZX8Y9Z1A2B3C4D5E6F7H7',
    ],
    
    createdAt: '2025-12-23T12:00:00Z',
    updatedAt: '2025-12-23T15:45:00Z',
  },
  
  // More settlements for history
  ...generateAdditionalSettlements(6),
];

/**
 * Helper: Generate additional payout transactions
 */
function generateAdditionalPayouts(count: number): PayoutTransaction[] {
  const payouts: PayoutTransaction[] = [];
  const amounts = [1800, 2400, 2840, 3600, 4320, 5700];
  
  // Cycle through existing order IDs to avoid N/A data
  const existingOrderIds = [
    'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    'order_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    'order_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    'order_04HQKZX8Y9Z1A2B3C4D5E6F7H1',
    'order_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
    'order_06HQKZX8Y9Z1A2B3C4D5E6F7H3',
    'order_07HQKZX8Y9Z1A2B3C4D5E6F7H4',
    'order_vendor3_accepted_001',
  ];
  
  for (let i = 0; i < count; i++) {
    const amount = amounts[i % amounts.length];
    const daysAgo = 10 + i;
    const date = new Date('2025-12-15');
    date.setDate(date.getDate() + daysAgo);
    
    const isSettled = i < 15;
    const settlementNum = 50 - Math.floor(i / 2);
    
    payouts.push({
      id: `payout_gen_${i.toString().padStart(3, '0')}`,
      orderId: existingOrderIds[i % existingOrderIds.length], // Cycle through existing orders
      vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      
      amount,
      deductions: 0,
      netAmount: amount,
      
      status: isSettled ? 'settled' : 'pending',
      
      settlementId: isSettled ? `ST-2025-${settlementNum.toString().padStart(3, '0')}` : undefined,
      settlementDate: isSettled ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      createdAt: date.toISOString(),
      settledAt: isSettled ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    });
  }
  
  return payouts;
}

/**
 * Helper: Generate additional settlements
 */
function generateAdditionalSettlements(count: number): Settlement[] {
  const settlements: Settlement[] = [];
  
  for (let i = 0; i < count; i++) {
    const settlementNum = 50 - i;
    const weeksAgo = i + 2;
    const cutoffDate = new Date('2025-12-22');
    cutoffDate.setDate(cutoffDate.getDate() - (weeksAgo * 7));
    
    const settlementDate = new Date(cutoffDate);
    settlementDate.setDate(settlementDate.getDate() + 1);
    
    const amount = 6000 + (i * 500);
    const txCount = 2 + (i % 2);
    
    settlements.push({
      id: `ST-2025-${settlementNum.toString().padStart(3, '0')}`,
      vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      
      totalAmount: amount,
      transactionCount: txCount,
      deductions: 0,
      netAmount: amount,
      
      bankAccountNumber: 'XXXXXX1234',
      ifscCode: 'HDFC0001234',
      
      status: 'processed',
      
      cutoffDate: cutoffDate.toISOString(),
      settlementDate: settlementDate.toISOString().split('T')[0],
      processedAt: new Date(settlementDate.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      
      paymentReferenceNumber: `HDFC${settlementDate.toISOString().split('T')[0].replace(/-/g, '')}001234`,
      
      payoutTransactionIds: [],
      
      createdAt: new Date(settlementDate.getTime()).toISOString(),
      updatedAt: new Date(settlementDate.getTime() + 6 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return settlements;
}

/**
 * Get pending payout amount
 */
export function getPendingPayoutAmount(): number {
  return mockPayoutTransactions
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.netAmount, 0);
}

/**
 * Get this month's earnings
 */
export function getThisMonthEarnings(): number {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  return mockPayoutTransactions
    .filter(p => {
      const date = new Date(p.createdAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, p) => sum + p.netAmount, 0);
}

/**
 * Get total earnings (all time)
 */
export function getTotalEarnings(): number {
  return mockPayoutTransactions
    .filter(p => p.status === 'settled')
    .reduce((sum, p) => sum + p.netAmount, 0);
}

/**
 * Get last settlement
 */
export function getLastSettlement(): Settlement | undefined {
  return mockSettlements
    .filter(s => s.status === 'processed')
    .sort((a, b) => new Date(b.settlementDate).getTime() - new Date(a.settlementDate).getTime())[0];
}

/**
 * Get next settlement
 */
export function getNextSettlement(): Settlement | undefined {
  return mockSettlements.find(s => s.status === 'pending');
}

/**
 * Alias for mockPayoutTransactions (for backward compatibility)
 */
export const mockPayouts = mockPayoutTransactions;