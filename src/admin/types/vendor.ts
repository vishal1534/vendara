/**
 * Vendor Type Definitions for Admin Portal
 */

export type VendorStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export type VendorCategory = 
  | 'Cement'
  | 'Steel & TMT Bars'
  | 'Aggregates'
  | 'Bricks & Blocks'
  | 'Sand'
  | 'Plumbing'
  | 'Electrical'
  | 'Paint & Hardware';

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  category: VendorCategory;
  status: VendorStatus;
  serviceAreas: string[];
  gstNumber: string;
  panNumber: string;
  bankAccount: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  businessAddress: {
    line1: string;
    line2?: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  registeredDate: string;
  approvedDate?: string;
  kycDocuments: {
    gstCertificate?: string;
    panCard?: string;
    cancelledCheque?: string;
    shopLicense?: string;
  };
  performance: {
    totalOrders: number;
    completedOrders: number;
    avgRating: number;
    onTimeDeliveryRate: number;
  };
  financials: {
    totalRevenue: number;
    totalCommission: number;
    pendingPayouts: number;
  };
  lastActive?: string;
  notes?: string;
}

export interface DashboardMetrics {
  todayOrders: {
    count: number;
    gmv: number;
    trend: number;
  };
  activeVendors: {
    count: number;
    trend: number;
  };
  pendingApprovals: {
    count: number;
  };
  openTickets: {
    count: number;
    trend: number;
  };
  pendingSettlements: {
    count: number;
    amount: number;
  };
  commissionEarned: {
    today: number;
    thisMonth: number;
    trend: number;
  };
}

export interface Alert {
  id: string;
  type: 'order_stuck' | 'payment_failed' | 'sla_breach' | 'vendor_issue';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  createdAt: string;
  orderId?: string;
  vendorId?: string;
}

export interface OrderTrend {
  date: string;
  orders: number;
  gmv: number;
}
