/**
 * Vendor profile and business types
 */

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  businessLocation: string; // Primary location (e.g., 'Miyapur') - used for zone determination
  serviceAreas: string[];
  isAvailable: boolean;
  
  // KYC
  kycStatus: 'pending' | 'verified';
  kycDocuments: KYCDocument[];
  
  // Bank
  bankDetails: BankDetails;
  
  // Metadata
  createdAt: string;
  lastActiveAt: string;
  onboardingCompletedAt?: string;
}

// Type alias for vendor profile (used in components)
export type VendorProfile = Vendor;

export interface KYCDocument {
  type: 'aadhaar' | 'pan' | 'driving_license' | 'voter_id';
  number: string; // Masked
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string; // Masked
  ifscCode: string;
  bankName: string;
  verified: boolean;
  verifiedAt?: string;
}