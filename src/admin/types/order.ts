/**
 * Order Types for Admin Portal
 */

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'active'
  | 'completed' 
  | 'cancelled'
  | 'disputed';

export type OrderType = 'material' | 'labor';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export type DisputeReason =
  | 'wrong_items'
  | 'damaged_items'
  | 'missing_items'
  | 'quality_issue'
  | 'quantity_mismatch'
  | 'late_delivery'
  | 'wrong_pricing'
  | 'vendor_no_show' // For labor orders
  | 'incomplete_work' // For labor orders
  | 'other';

export type DisputeStatus = 
  | 'open'
  | 'under_review'
  | 'resolved_refund'
  | 'resolved_replacement'
  | 'resolved_partial_refund'
  | 'rejected'
  | 'escalated';

export type DisputePriority = 'low' | 'medium' | 'high' | 'critical';

export interface DisputeEvidence {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  uploadedBy: 'buyer' | 'vendor' | 'admin';
  uploadedAt: string;
  description?: string;
}

export interface DisputeTimeline {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'buyer' | 'vendor' | 'admin';
  action: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  
  // Dispute Details
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  priority: DisputePriority;
  
  // Financial Impact
  disputedAmount: number;
  refundAmount?: number;
  
  // Evidence
  evidence: DisputeEvidence[];
  
  // Assignment
  assignedTo?: string; // Admin user ID
  assignedAt?: string;
  
  // Timeline
  timeline: DisputeTimeline[];
  
  // Resolution
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Auto-escalation
  escalatedAt?: string;
  escalationReason?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  
  // Buyer Information
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  
  // Vendor Information
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorType: string;
  
  // Order Details
  items: OrderItem[];
  subtotal: number;
  platformFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  settlementId?: string; // Link to settlement if order has been settled
  
  // Delivery
  deliveryAddress: string;
  deliveryDate?: string;
  deliverySlot?: string;
  
  // Timestamps
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  
  // Additional Info
  notes?: string;
  cancellationReason?: string;
  rating?: number;
  reviewText?: string;
  
  // Dispute Information
  dispute?: Dispute;
  hasActiveDispute?: boolean;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  active: number;
  completed: number;
  cancelled: number;
  disputed: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderFilters {
  status?: OrderStatus | 'all';
  type?: OrderType | 'all';
  vendorId?: string;
  buyerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}