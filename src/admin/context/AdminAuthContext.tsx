/**
 * Admin Authentication Context
 * Manages admin user authentication and session state
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Admin, AdminAuthState } from '../types/admin';
import { mockAdmins, mockCredentials } from '../mocks/admins.mock';

interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  quickLogin: (email: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-initialize with mock super admin data on mount (no backend, no login required)
  useEffect(() => {
    const initializeMockData = () => {
      try {
        // Default to super admin for demo
        const defaultAdmin = mockAdmins.find(a => a.role === 'super_admin') || mockAdmins[0];
        setAdmin(defaultAdmin);
      } catch (error) {
        console.error('Mock data initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize immediately - no session check needed for mock mode
    initializeMockData();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // For future use - currently auto-authenticated
    return true;
  }, []);

  const quickLogin = useCallback(async (email: string) => {
    const foundAdmin = mockAdmins.find(a => a.email === email);
    if (foundAdmin) {
      setAdmin(foundAdmin);
    }
  }, []);

  const logout = useCallback(() => {
    // Redirect to portal selector
    window.location.href = '/';
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}