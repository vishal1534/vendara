/**
 * Payout and settlement types
 */

export interface PayoutTransaction {
  id: string;
  orderId: string;
  vendorId: string;
  
  amount: number;
  deductions: number;
  netAmount: number;
  
  status: 'pending' | 'settled';
  
  settlementId?: string;
  settlementDate?: string;
  
  createdAt: string;
  settledAt?: string;
}

export interface Settlement {
  id: string;
  vendorId: string;
  
  totalAmount: number;
  transactionCount: number;
  deductions: number;
  netAmount: number;
  
  bankAccountNumber: string;
  ifscCode: string;
  
  status: 'pending' | 'processed' | 'failed';
  
  cutoffDate: string;
  settlementDate: string;
  processedAt?: string;
  
  paymentReferenceNumber?: string;
  
  payoutTransactionIds: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface PayoutSummary {
  pendingPayout: number;
  pendingOrderCount: number;
  thisMonthEarnings: number;
  thisMonthOrderCount: number;
  lastSettledAmount: number;
  lastSettledDate: string;
  totalEarnings: number;
  nextSettlementDate: string;
  nextSettlementAmount: number;
}
