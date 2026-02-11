import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockVendorProfile, mockUser, getAllVendorsForUser, getVendorById } from '../mocks/vendorProfile.mock';
import type { Vendor } from '../types/vendor';
import type { User } from '../types/user';

interface VendorAuthContextType {
  // User (authentication level)
  user: User | null;
  
  // Current selected vendor
  vendor: Vendor | null;
  
  // All vendors this user can access
  availableVendors: Vendor[];
  
  // State
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchVendor: (vendorId: string) => void;
  toggleAvailability: () => void;
  updateServiceAreas: (areas: string[]) => void;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-initialize with mock data on mount (no backend, no login required)
  useEffect(() => {
    const initializeMockData = () => {
      try {
        // Use mock user data
        const authenticatedUser = mockUser;
        
        // Get all vendors for this user
        const vendors = getAllVendorsForUser(authenticatedUser.id);
        
        // Default to first vendor (Sri Sai Suppliers)
        const defaultVendor = vendors[0] || mockVendorProfile;

        setUser(authenticatedUser);
        setAvailableVendors(vendors);
        setVendor(defaultVendor);
      } catch (error) {
        console.error('Mock data initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize immediately - no session check needed for mock mode
    initializeMockData();
  }, []);

  const login = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    // For future use - currently auto-authenticated
    return { success: true };
  };

  const logout = () => {
    // Clear state if needed, but for demo mode, we could just reload
    window.location.href = '/vendor/login';
  };

  const switchVendor = (vendorId: string) => {
    const newVendor = getVendorById(vendorId);
    if (newVendor && user) {
      setVendor(newVendor);
    }
  };

  const toggleAvailability = () => {
    if (vendor) {
      const updatedVendor = {
        ...vendor,
        isAvailable: !vendor.isAvailable,
      };
      setVendor(updatedVendor);
      
      // Update in availableVendors array
      setAvailableVendors(prev => 
        prev.map(v => v.id === vendor.id ? updatedVendor : v)
      );
    }
  };

  const updateServiceAreas = (areas: string[]) => {
    if (vendor) {
      const updatedVendor = {
        ...vendor,
        serviceAreas: areas,
      };
      setVendor(updatedVendor);
      
      // Update in availableVendors array
      setAvailableVendors(prev => 
        prev.map(v => v.id === vendor.id ? updatedVendor : v)
      );
    }
  };

  const value: VendorAuthContextType = {
    user,
    vendor,
    availableVendors,
    isLoading,
    isAuthenticated: !!user && !!vendor,
    login,
    logout,
    switchVendor,
    toggleAvailability,
    updateServiceAreas,
  };

  return (
    <VendorAuthContext.Provider value={value}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
}