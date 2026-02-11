/**
 * Admin Portal Type Definitions
 */

export type AdminRole = 'super_admin' | 'operations' | 'support';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  permissions: string[];
}

export interface AdminAuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
