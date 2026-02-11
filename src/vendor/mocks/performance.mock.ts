import type { PerformanceMetrics, VendorIssue } from '../types/performance';

/**
 * Mock Performance Metrics
 * Sample performance data for Chauhan Cement Suppliers (last 30 days)
 */
export const mockPerformanceMetrics: PerformanceMetrics = {
  vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
  periodStart: '2025-12-09',
  periodEnd: '2026-01-08',
  
  // Overall Score (0-100)
  overallScore: 92,
  rating: 'excellent',
  
  // Acceptance Metrics
  offersReceived: 30,
  offersAccepted: 28,
  offersRejected: 1,
  offersTimedOut: 1,
  acceptanceRate: 93.3, // 28/30 * 100
  
  // On-Time Delivery Metrics
  ordersDelivered: 28,
  ordersOnTime: 27,
  ordersLate: 1,
  onTimeDeliveryRate: 96.4, // 27/28 * 100
  
  // Response Time Metrics (minutes)
  averageResponseTime: 3.5,
  fastestResponseTime: 1.2,
  slowestResponseTime: 12.8,
  
  // Volume Metrics
  totalOrdersCompleted: 28,
  totalRevenue: 78540,
  
  // Issues
  issueCount: 2,
  warningsIssued: 0,
  
  // Metadata
  calculatedAt: '2026-01-08T09:00:00Z',
};

/**
 * Mock Volume Trend (Last 3 Months)
 * Used for chart visualization
 */
export const mockVolumeTrend = [
  {
    month: 'November 2025',
    orderCount: 17,
    revenue: 42300,
  },
  {
    month: 'December 2025',
    orderCount: 24,
    revenue: 65820,
  },
  {
    month: 'January 2026',
    orderCount: 28,
    revenue: 78540,
    growth: 16.7, // % vs last month
  },
];

/**
 * Mock Issue Log
 * Recent issues and their resolutions
 */
export const mockVendorIssues: VendorIssue[] = [
  // Recent issue (resolved)
  {
    id: 'issue_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderId: 'order_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
    
    description: 'Customer site locked, unable to deliver',
    severity: 'minor',
    category: 'other',
    
    status: 'resolved',
    resolution: 'Rescheduled to next day by ops team. Delivered successfully on Jan 3.',
    
    reportedAt: '2026-01-02T15:30:00Z',
    resolvedAt: '2026-01-02T16:15:00Z',
    
    performanceImpact: 0, // No penalty as vendor reported proactively
    
    createdAt: '2026-01-02T15:30:00Z',
    updatedAt: '2026-01-02T16:15:00Z',
  },
  
  // Late delivery (warning)
  {
    id: 'issue_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderId: 'order_07HQKZX8Y9Z1A2B3C4D5E6F7H4',
    
    description: 'Late delivery - 45 minutes past delivery window',
    severity: 'warning',
    category: 'late_delivery',
    
    status: 'resolved',
    resolution: 'Acknowledged. Minor traffic delay. ₹100 deduction applied.',
    
    reportedAt: '2025-12-20T15:45:00Z',
    resolvedAt: '2025-12-20T16:00:00Z',
    
    performanceImpact: -1, // 1 point deducted from score
    
    createdAt: '2025-12-20T15:45:00Z',
    updatedAt: '2025-12-20T16:00:00Z',
  },
  
  // Old issue (resolved) - Quality
  {
    id: 'issue_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderId: 'order_gen_008',
    
    description: 'Customer reported 1 damaged cement bag',
    severity: 'minor',
    category: 'quality',
    
    status: 'resolved',
    resolution: 'Replacement bag provided same day. Issue resolved to customer satisfaction.',
    
    reportedAt: '2025-12-15T16:20:00Z',
    resolvedAt: '2025-12-15T18:30:00Z',
    
    performanceImpact: 0, // No penalty as replacement provided promptly
    
    createdAt: '2025-12-15T16:20:00Z',
    updatedAt: '2025-12-15T18:30:00Z',
  },
  
  // Very old issue (November) - Resolved
  {
    id: 'issue_04HQKZX8Y9Z1A2B3C4D5E6F7H1',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderId: 'order_gen_001',
    
    description: 'Wrong item delivered (M-Sand instead of 20mm aggregate)',
    severity: 'major',
    category: 'other',
    
    status: 'resolved',
    resolution: 'Correct item delivered within 2 hours. No penalty as new vendor (learning period).',
    
    reportedAt: '2025-11-25T14:00:00Z',
    resolvedAt: '2025-11-25T16:30:00Z',
    
    performanceImpact: 0, // Learning period, no penalty
    
    createdAt: '2025-11-25T14:00:00Z',
    updatedAt: '2025-11-25T16:30:00Z',
  },
  
  // System issue (not vendor fault)
  {
    id: 'issue_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderId: 'order_gen_003',
    
    description: 'Customer phone number incorrect in system',
    severity: 'minor',
    category: 'other',
    
    status: 'resolved',
    resolution: 'Ops team provided correct number. Delivery completed successfully.',
    
    reportedAt: '2025-11-28T11:15:00Z',
    resolvedAt: '2025-11-28T12:00:00Z',
    
    performanceImpact: 0, // System error, not vendor fault
    
    createdAt: '2025-11-28T11:15:00Z',
    updatedAt: '2025-11-28T12:00:00Z',
  },
];

/**
 * Performance Score Breakdown
 * Shows how the overall score is calculated
 */
export const mockPerformanceBreakdown = {
  acceptanceScore: {
    weight: 0.3,
    rawScore: 93.3,
    weightedScore: 28.0, // 93.3 * 0.3
  },
  onTimeScore: {
    weight: 0.4,
    rawScore: 96.4,
    weightedScore: 38.6, // 96.4 * 0.4
  },
  responseTimeScore: {
    weight: 0.3,
    rawScore: 85.0, // Calculated from avg response time
    weightedScore: 25.5, // 85.0 * 0.3
  },
  totalScore: 92.1, // Sum of weighted scores, rounded to 92
};

/**
 * Response Time Score Calculation
 * <5 min: 100, 5-10 min: 80, 10-15 min: 60, >15 min: 40
 */
export function calculateResponseTimeScore(avgResponseTime: number): number {
  if (avgResponseTime < 5) return 100;
  if (avgResponseTime < 10) return 80;
  if (avgResponseTime < 15) return 60;
  return 40;
}

/**
 * Get rating from score
 */
export function getRatingFromScore(score: number): 'poor' | 'fair' | 'good' | 'excellent' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

/**
 * Get performance metrics summary (for dashboard)
 */
export function getPerformanceSummary() {
  return {
    score: mockPerformanceMetrics.overallScore,
    rating: mockPerformanceMetrics.rating,
    acceptanceRate: mockPerformanceMetrics.acceptanceRate,
    onTimeRate: mockPerformanceMetrics.onTimeDeliveryRate,
    responseTime: mockPerformanceMetrics.averageResponseTime,
    thisMonthOrders: mockPerformanceMetrics.totalOrdersCompleted,
  };
}

/**
 * Get recent issues (last 10)
 */
export function getRecentIssues(limit: number = 10): VendorIssue[] {
  return mockVendorIssues
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, limit);
}

/**
 * Get open issues count
 */
export function getOpenIssuesCount(): number {
  return mockVendorIssues.filter(issue => issue.status !== 'resolved').length;
}

/**
 * Sample performance for different vendor states
 */
export const mockPerformanceScenarios = {
  excellent: {
    score: 92,
    rating: 'excellent' as const,
    acceptanceRate: 93.3,
    onTimeRate: 96.4,
    responseTime: 3.5,
  },
  
  good: {
    score: 82,
    rating: 'good' as const,
    acceptanceRate: 85.0,
    onTimeRate: 88.0,
    responseTime: 6.2,
  },
  
  fair: {
    score: 68,
    rating: 'fair' as const,
    acceptanceRate: 70.0,
    onTimeRate: 75.0,
    responseTime: 9.5,
  },
  
  poor: {
    score: 52,
    rating: 'poor' as const,
    acceptanceRate: 55.0,
    onTimeRate: 60.0,
    responseTime: 14.2,
  },
  
  newVendor: {
    score: null, // Not enough data
    rating: null,
    ordersCompleted: 8, // < 10 threshold
    message: 'Complete 10 orders to see performance metrics',
  },
};
