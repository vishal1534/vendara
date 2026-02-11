/**
 * Vendor-specific order types
 */

import { VendorOrderStatus } from '../constants/vendorOrderStates';

export interface VendorOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  
  // Item details
  itemId?: string;
  itemName: string;
  itemCategory?: 'cement' | 'sand' | 'aggregate' | 'steel';
  category?: string;
  quantity: number;
  unit: string;
  
  // Financial
  payoutPerUnit?: number;
  basePayoutAmount: number;
  vendaraFee?: number;
  logisticsFee?: number;
  deductions?: number;
  totalPayoutAmount: number;
  
  // Legacy fields (for backward compatibility)
  payoutAmount?: number;
  totalPayout?: number;
  
  // Status
  status: VendorOrderStatus;
  
  // Timeline
  offeredAt: string;
  offerExpiresAt?: string;
  respondedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  
  // Delivery
  deliveryDate: string;
  deliveryTimeSlot: {
    startTime: string;
    endTime: string;
  };
  deliverySlot?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  deliveryArea: string;
  deliveryPincode: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  
  // Buyer contact (optional)
  buyerPhone?: string;
  buyerEmail?: string;
  
  // Settlement
  settlementId?: string;
  settlementDate?: string;
  settlementStatus?: 'pending' | 'processing' | 'settled';
  
  // Issues
  hasIssue?: boolean;
  issueReported?: boolean;
  issueDescription?: string;
  issueReportedAt?: string;
  issueResolvedAt?: string;
  issueResolution?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrderListItem {
  id: string;
  orderNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  payoutAmount: number;
  status: VendorOrderStatus;
  deliverySlot?: {
    date: string;
    timeRange: string;
  };
  settlementStatus: 'pending' | 'settled';
  acceptedAt?: string;
  completedAt?: string;
}