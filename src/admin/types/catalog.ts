/**
 * Catalog Types for Admin Portal
 */

export type MaterialCategory = 
  | 'cement' 
  | 'steel' 
  | 'bricks' 
  | 'sand' 
  | 'aggregates'
  | 'tiles'
  | 'paints'
  | 'plumbing'
  | 'electrical'
  | 'hardware';

export type MaterialStatus = 'active' | 'inactive' | 'out_of_stock';

export interface MaterialItem {
  id: string;
  name: string;
  category: MaterialCategory;
  description?: string;
  specifications?: string;
  
  // Pricing
  basePrice: number;
  unit: string;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  
  // Availability
  status: MaterialStatus;
  inStock: boolean;
  stockLevel?: number;
  
  // Vendors
  availableVendors: number;
  averageVendorPrice?: number;
  
  // Metadata
  imageUrl?: string;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Additional Info
  tags?: string[];
  hsn?: string; // HSN code for GST
  gstRate?: number;
}

// Type alias for convenience
export type Material = MaterialItem;

export interface MaterialCategoryInfo {
  category: MaterialCategory;
  label: string;
  itemCount: number;
  totalValue: number;
  activeItems: number;
  icon: string;
}

// Category Management (Admin-defined categories)
export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  id: string;
  key: string; // URL-safe key (e.g., 'cement', 'steel')
  name: string; // Display name
  description?: string;
  icon: string; // Lucide icon name
  status: CategoryStatus;
  displayOrder: number;
  materialCount: number; // Number of materials in this category
  createdAt: string;
  updatedAt: string;
}

export type LaborCategory = 
  | 'masonry'
  | 'carpentry'
  | 'plumbing'
  | 'electrical'
  | 'painting'
  | 'tile_work'
  | 'steel_fixing'
  | 'general';

export type LaborStatus = 'active' | 'inactive';

export interface LaborService {
  id: string;
  name: string;
  category: LaborCategory;
  description?: string;
  skillLevel: 'entry' | 'intermediate' | 'expert';
  
  // Pricing
  baseRate: number;
  unit: string; // 'per_day', 'per_hour', 'per_sqft'
  
  // Availability
  status: LaborStatus;
  availableVendors: number;
  
  // Vendors providing this service
  registeredVendors: number;
  averageVendorRate?: number;
  
  // Metadata
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Requirements
  minimumExperience?: number; // in years
  certificationRequired?: boolean;
  tags?: string[];
}

export interface LaborCategoryInfo {
  category: LaborCategory;
  label: string;
  serviceCount: number;
  totalWorkers: number;
  activeServices: number;
  icon: string;
}

export interface CatalogStats {
  totalMaterials: number;
  activeMaterials: number;
  totalCategories: number;
  totalValue: number;
  totalLabor: number;
  activeLabor: number;
  totalWorkers: number;
  averageRate: number;
}