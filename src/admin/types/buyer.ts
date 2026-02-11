/**
 * Buyer Types for Admin Portal
 */

export type BuyerStatus = 'active' | 'inactive' | 'suspended';

export type BuyerType = 'individual' | 'contractor' | 'builder';

export interface Buyer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: BuyerType;
  status: BuyerStatus;
  
  // Location
  primaryLocation: string;
  secondaryLocations?: string[];
  
  // Profile
  registeredAt: string;
  lastActiveAt: string;
  
  // Activity Metrics
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  
  // Ratings
  averageRating?: number;
  totalReviews?: number;
  
  // Additional Info
  notes?: string;
  tags?: string[];
}

export interface BuyerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  totalSpent: number;
  averageLifetimeValue: number;
}

export interface BuyerFilters {
  status?: BuyerStatus | 'all';
  type?: BuyerType | 'all';
  location?: string;
  search?: string;
}