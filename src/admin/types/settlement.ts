/**
 * Settlement Types for Admin Portal
 */

export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'on_hold';

export type PaymentMethod = 'bank_transfer' | 'upi' | 'cheque';

export interface Settlement {
  id: string;
  settlementNumber: string;
  vendorId: string;
  vendorName: string;
  vendorType: string;
  
  // Financial Details
  totalAmount: number;
  platformFee: number;
  platformFeePercentage?: number;
  tds: number; // Tax Deducted at Source
  tdsPercentage?: number;
  adjustments?: number;
  netAmount: number;
  
  // Orders
  orderIds: string[];
  orderCount: number;
  periodStart: string;
  periodEnd: string;
  period?: string;
  
  // Payment
  status: SettlementStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  transactionId?: string;
  utrNumber?: string;
  paidAt?: string;
  
  // Bank Details
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  
  // Metadata
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
  processedBy?: string;
}

export interface SettlementStats {
  totalSettlements: number;
  pendingSettlements: number;
  completedSettlements: number;
  totalPending: number;
  totalProcessing: number;
  totalCompleted: number;
  averageSettlementAmount: number;
}

export interface SettlementFilters {
  status?: SettlementStatus | 'all';
  vendorId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}