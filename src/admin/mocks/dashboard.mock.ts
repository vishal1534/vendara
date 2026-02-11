/**
 * Mock Dashboard Data
 */

import { DashboardMetrics, Alert, OrderTrend } from '../types/vendor';

export const mockDashboardMetrics: DashboardMetrics = {
  todayOrders: {
    count: 47,
    gmv: 345000,
    trend: 12.5,
  },
  activeVendors: {
    count: 32,
    trend: 3.2,
  },
  pendingApprovals: {
    count: 5,
  },
  openTickets: {
    count: 12,
    trend: -8.3,
  },
  pendingSettlements: {
    count: 8,
    amount: 125000,
  },
  commissionEarned: {
    today: 17250,
    thisMonth: 285000,
    trend: 15.7,
  },
};

export const mockAlerts: Alert[] = [
  {
    id: 'A001',
    type: 'order_stuck',
    severity: 'high',
    title: 'Order stuck for 3 hours',
    description: 'Order #ORD-2026-0145 has been in "confirmed" state for 3+ hours',
    createdAt: '2026-01-09T05:30:00Z',
    orderId: 'ORD-2026-0145',
    vendorId: 'V001',
  },
  {
    id: 'A002',
    type: 'payment_failed',
    severity: 'high',
    title: 'Payment gateway failure',
    description: '3 payments failed in the last hour due to gateway timeout',
    createdAt: '2026-01-09T07:15:00Z',
  },
  {
    id: 'A003',
    type: 'sla_breach',
    severity: 'medium',
    title: 'Delivery SLA breach',
    description: 'Order #ORD-2026-0132 missed delivery SLA by 2 hours',
    createdAt: '2026-01-09T06:45:00Z',
    orderId: 'ORD-2026-0132',
    vendorId: 'V002',
  },
  {
    id: 'A004',
    type: 'vendor_issue',
    severity: 'low',
    title: 'Vendor unresponsive',
    description: 'Balaji Steel has not responded to 2 order confirmations',
    createdAt: '2026-01-09T04:20:00Z',
    vendorId: 'V002',
  },
];

export const mockOrderTrends: OrderTrend[] = [
  { date: '2025-12-10', orders: 28, gmv: 198000 },
  { date: '2025-12-11', orders: 32, gmv: 245000 },
  { date: '2025-12-12', orders: 25, gmv: 187000 },
  { date: '2025-12-13', orders: 35, gmv: 268000 },
  { date: '2025-12-14', orders: 30, gmv: 221000 },
  { date: '2025-12-15', orders: 22, gmv: 165000 },
  { date: '2025-12-16', orders: 38, gmv: 295000 },
  { date: '2025-12-17', orders: 41, gmv: 312000 },
  { date: '2025-12-18', orders: 36, gmv: 278000 },
  { date: '2025-12-19', orders: 33, gmv: 256000 },
  { date: '2025-12-20', orders: 29, gmv: 218000 },
  { date: '2025-12-21', orders: 31, gmv: 234000 },
  { date: '2025-12-22', orders: 27, gmv: 201000 },
  { date: '2025-12-23', orders: 39, gmv: 298000 },
  { date: '2025-12-24', orders: 44, gmv: 335000 },
  { date: '2025-12-25', orders: 18, gmv: 142000 },
  { date: '2025-12-26', orders: 42, gmv: 321000 },
  { date: '2025-12-27', orders: 37, gmv: 285000 },
  { date: '2025-12-28', orders: 34, gmv: 262000 },
  { date: '2025-12-29', orders: 28, gmv: 215000 },
  { date: '2025-12-30', orders: 40, gmv: 308000 },
  { date: '2025-12-31', orders: 35, gmv: 271000 },
  { date: '2026-01-01', orders: 21, gmv: 168000 },
  { date: '2026-01-02', orders: 45, gmv: 348000 },
  { date: '2026-01-03', orders: 39, gmv: 301000 },
  { date: '2026-01-04', orders: 36, gmv: 279000 },
  { date: '2026-01-05', orders: 29, gmv: 224000 },
  { date: '2026-01-06', orders: 43, gmv: 332000 },
  { date: '2026-01-07', orders: 41, gmv: 318000 },
  { date: '2026-01-08', orders: 38, gmv: 294000 },
];

export const mockCategorySales = [
  { category: 'Cement', sales: 3200000, orders: 145 },
  { category: 'Steel & TMT Bars', sales: 2800000, orders: 98 },
  { category: 'Aggregates', sales: 1800000, orders: 67 },
  { category: 'Bricks & Blocks', sales: 950000, orders: 54 },
  { category: 'Sand', sales: 720000, orders: 43 },
  { category: 'Plumbing', sales: 580000, orders: 38 },
  { category: 'Paint & Hardware', sales: 420000, orders: 31 },
];
