/**
 * Payment Types - Shared across all portals
 */

export type PaymentMethod = 'online' | 'cod';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'success' 
  | 'failed' 
  | 'refunded';

export type RefundStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed';

export type SettlementStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'on_hold';

export interface Payment {
  id: string;
  orderId: string;
  buyerId: string;
  vendorId?: string | null;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paymentGateway?: string | null;
  transactionId?: string | null;
  paymentErrorCode?: string | null;
  paymentErrorMessage?: string | null;
  metadata?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  failedAt?: string | null;
}

export interface CreatePaymentRequest {
  orderId: string;
  buyerId: string;
  vendorId?: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  metadata?: string;
  notes?: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  refundReason: string;
  refundStatus: RefundStatus;
  razorpayRefundId?: string | null;
  refundErrorCode?: string | null;
  refundErrorMessage?: string | null;
  initiatedBy?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface CreateRefundRequest {
  paymentId: string;
  amount?: number; // Full refund if not specified
  reason: string;
  notes?: string;
}

export interface Settlement {
  id: string;
  vendorId: string;
  vendorName: string;
  totalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  taxAmount: number;
  adjustmentAmount: number;
  settlementAmount: number;
  paymentCount: number;
  periodStart: string;
  periodEnd: string;
  status: SettlementStatus;
  accountNumber?: string | null;
  ifscCode?: string | null;
  accountHolderName?: string | null;
  utrNumber?: string | null;
  settlementMethod?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt?: string | null;
  payments?: Payment[]; // Included payments in this settlement
}

export interface GenerateSettlementRequest {
  vendorId: string;
  periodStart: string;
  periodEnd: string;
  commissionPercentage?: number;
  adjustmentAmount?: number;
  notes?: string;
}

export interface SettlementLineItem {
  id: string;
  settlementId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  commissionAmount: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaymentFilters {
  status?: PaymentStatus | 'all';
  paymentMethod?: PaymentMethod | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface SettlementFilters {
  status?: SettlementStatus | 'all';
  vendorId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}