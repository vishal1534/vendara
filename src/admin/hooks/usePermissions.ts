/**
 * Permissions Hook
 * Check if admin has required permissions
 */

import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminRole } from '../types/admin';

export function usePermissions() {
  const { admin } = useAdminAuth();

  /**
   * Check if admin can access a feature based on roles
   */
  const canAccess = (allowedRoles: AdminRole[]): boolean => {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true; // Super admin has all access
    return allowedRoles.includes(admin.role);
  };

  /**
   * Check if admin has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.permissions.includes('*')) return true; // All permissions
    return admin.permissions.includes(permission);
  };

  /**
   * Check if admin can perform action with amount limit
   */
  const checkLimit = (action: string, amount?: number): boolean => {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;

    const limits: Record<string, Record<string, number>> = {
      refund: { operations: 10000, support: 2000 },
      settlement: { operations: 50000 },
      credit: { operations: 5000, support: 500 },
    };

    const limit = limits[action]?.[admin.role];
    return !amount || !limit || amount <= limit;
  };

  return {
    canAccess,
    hasPermission,
    checkLimit,
    role: admin?.role,
  };
}
