/**
 * Vendor-side order states and constants
 */

export enum VendorOrderStatus {
  OFFERED = 'offered',           // Received offer, not responded yet
  ACCEPTED = 'accepted',         // Accepted the order
  REJECTED = 'rejected',         // Rejected the order
  IN_PROGRESS = 'in_progress',   // Currently fulfilling
  READY = 'ready',               // Ready for delivery
  DELIVERED = 'delivered',       // Delivered, awaiting buyer confirmation
  COMPLETED = 'completed',       // Buyer confirmed delivery (OTP/Image validated)
  ISSUE = 'issue',               // Issue reported
  CANCELLED = 'cancelled',       // Cancelled after acceptance
}

export const VENDOR_ORDER_STATUS_LABELS: Record<VendorOrderStatus, string> = {
  [VendorOrderStatus.OFFERED]: 'Offered',
  [VendorOrderStatus.ACCEPTED]: 'Accepted',
  [VendorOrderStatus.REJECTED]: 'Rejected',
  [VendorOrderStatus.IN_PROGRESS]: 'In Progress',
  [VendorOrderStatus.READY]: 'Ready',
  [VendorOrderStatus.DELIVERED]: 'Delivered',
  [VendorOrderStatus.COMPLETED]: 'Completed',
  [VendorOrderStatus.ISSUE]: 'Issue',
  [VendorOrderStatus.CANCELLED]: 'Cancelled',
};

export const VENDOR_ORDER_STATUS_COLORS: Record<VendorOrderStatus, string> = {
  [VendorOrderStatus.OFFERED]: 'bg-blue-100 text-blue-800',
  [VendorOrderStatus.ACCEPTED]: 'bg-green-100 text-green-800',
  [VendorOrderStatus.REJECTED]: 'bg-gray-100 text-gray-800',
  [VendorOrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [VendorOrderStatus.READY]: 'bg-green-100 text-green-800',
  [VendorOrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [VendorOrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [VendorOrderStatus.ISSUE]: 'bg-red-100 text-red-800',
  [VendorOrderStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

export enum PayoutStatus {
  PENDING = 'pending',
  SETTLED = 'settled',
}

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  [PayoutStatus.PENDING]: 'Pending',
  [PayoutStatus.SETTLED]: 'Settled',
};

export const PAYOUT_STATUS_COLORS: Record<PayoutStatus, string> = {
  [PayoutStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [PayoutStatus.SETTLED]: 'bg-green-100 text-green-800',
};