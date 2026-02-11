/**
 * Mock Buyer Data for Admin Portal
 */

import { Buyer, BuyerStats } from '../types/buyer';
import { generateMockBuyers } from './mockBuyersGenerator';

// Generate 100 mock buyers for testing pagination
export const mockBuyers: Buyer[] = generateMockBuyers(100);

export const mockBuyerStats: BuyerStats = {
  total: mockBuyers.length,
  active: mockBuyers.filter(b => b.status === 'active').length,
  inactive: mockBuyers.filter(b => b.status === 'inactive').length,
  suspended: mockBuyers.filter(b => b.status === 'suspended').length,
  newThisMonth: mockBuyers.filter(b => {
    const joinDate = new Date(b.joinedAt);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length,
  totalRevenue: mockBuyers.reduce((sum, b) => sum + b.totalSpent, 0),
  averageLifetimeValue: Math.round(
    mockBuyers.reduce((sum, b) => sum + b.totalSpent, 0) / mockBuyers.length
  ),
};
