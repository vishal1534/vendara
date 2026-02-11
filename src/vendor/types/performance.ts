/**
 * Vendor performance and analytics types
 */

export interface PerformanceMetrics {
  // Vendor info
  vendorId?: string;
  periodStart?: string;
  periodEnd?: string;
  
  // Overall Score (0-100)
  overallScore: number;
  rating: 'poor' | 'fair' | 'good' | 'excellent';
  
  // Acceptance Metrics
  offersReceived: number;
  offersAccepted: number;
  offersRejected: number;
  offersTimedOut: number;
  acceptanceRate: number; // percentage
  
  // On-Time Delivery Metrics
  ordersDelivered: number;
  ordersOnTime: number;
  ordersLate: number;
  onTimeDeliveryRate: number; // percentage
  
  // Response Time Metrics (minutes)
  averageResponseTime: number;
  fastestResponseTime: number;
  slowestResponseTime: number;
  
  // Volume Metrics
  totalOrdersCompleted: number;
  totalRevenue: number;
  
  // Issues
  issueCount: number;
  warningsIssued: number;
  
  // Metadata
  calculatedAt?: string;
}

export interface OrderVolumeTrend {
  month: string; // "January 2026"
  orderCount: number;
  revenue: number;
  growth?: number; // Growth percentage vs previous month
}

export interface VendorIssue {
  id: string;
  vendorId?: string;
  orderId: string;
  
  description: string;
  severity: 'warning' | 'minor' | 'major';
  category?: string;
  
  status: 'open' | 'resolved';
  resolution?: string;
  
  reportedAt: string;
  resolvedAt?: string;
  
  performanceImpact?: number;
  
  createdAt?: string;
  updatedAt?: string;
}
