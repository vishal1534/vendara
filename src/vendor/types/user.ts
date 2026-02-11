/**
 * User types for multi-vendor authentication
 * A User can own/manage multiple Vendor entities
 */

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  
  // Vendors this user can access
  vendorIds: string[];
  
  // Metadata
  createdAt: string;
  lastLoginAt: string;
}

export interface UserAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
