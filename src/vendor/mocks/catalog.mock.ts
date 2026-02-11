/**
 * Mock Catalog Data
 * Vendara-approved construction materials catalog
 */

export interface CatalogItemMaster {
  id: string;
  name: string;
  category: 'cement' | 'sand' | 'aggregate' | 'steel' | 'bricks';
  unit: string;
  payoutPerUnit: number;
  description?: string;
  specifications?: string;
  imageUrl?: string;
  brandName?: string;
  hsn?: string;
  gstRate?: number;
}

export interface CatalogItem extends CatalogItemMaster {
  isAvailable: boolean;
}

/**
 * Service Catalog Types
 */
export interface ServiceItemMaster {
  id: string;
  name: string;
  skillType: 'mason' | 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'welder' | 'helper';
  rateType: 'hourly' | 'daily';
  payoutPerUnit: number;
  description?: string;
  unit: string; // 'hour' or 'day'
}

export interface ServiceItem extends ServiceItemMaster {
  isAvailable: boolean;
}

/**
 * Master Catalog - All items available in Vendara
 * Vendors can choose from these items
 */
export const masterCatalog: CatalogItemMaster[] = [
  // Cement (5 items)
  {
    id: 'item_cement_ultratech_50kg',
    name: 'UltraTech Cement 50kgs',
    category: 'cement',
    unit: 'bag',
    payoutPerUnit: 360,
    description: 'UltraTech OPC 53 Grade Cement',
    specifications: '50kg bag',
    imageUrl: 'https://example.com/images/cement_ultratech_50kg.jpg',
    brandName: 'UltraTech',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_cement_acc_50kg',
    name: 'ACC Cement 50kg',
    category: 'cement',
    unit: 'bag',
    payoutPerUnit: 355,
    description: 'ACC OPC 53 Grade Cement',
    specifications: '50kg bag',
    imageUrl: 'https://example.com/images/cement_acc_50kg.jpg',
    brandName: 'ACC',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_cement_ambuja_50kg',
    name: 'Ambuja Cement 50kg',
    category: 'cement',
    unit: 'bag',
    payoutPerUnit: 358,
    description: 'Ambuja OPC 53 Grade Cement',
    specifications: '50kg bag',
    imageUrl: 'https://example.com/images/cement_ambuja_50kg.jpg',
    brandName: 'Ambuja',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_cement_birla_50kg',
    name: 'Birla A1 Cement 50kg',
    category: 'cement',
    unit: 'bag',
    payoutPerUnit: 352,
    description: 'Birla A1 Premium Cement',
    specifications: '50kg bag',
    imageUrl: 'https://example.com/images/cement_birla_50kg.jpg',
    brandName: 'Birla',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_cement_ppc_50kg',
    name: 'PPC Cement 50kg',
    category: 'cement',
    unit: 'bag',
    payoutPerUnit: 340,
    description: 'Portland Pozzolana Cement',
    specifications: '50kg bag',
    imageUrl: 'https://example.com/images/cement_ppc_50kg.jpg',
    brandName: 'PPC',
    hsn: '123456789',
    gstRate: 18,
  },
  
  // Sand (3 items)
  {
    id: 'item_sand_msand',
    name: 'M-Sand (Manufactured Sand)',
    category: 'sand',
    unit: 'trolley',
    payoutPerUnit: 1200,
    description: 'Manufactured sand for construction',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/sand_msand.jpg',
    brandName: 'M-Sand',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_sand_river',
    name: 'River Sand',
    category: 'sand',
    unit: 'trolley',
    payoutPerUnit: 1400,
    description: 'Natural river sand',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/sand_river.jpg',
    brandName: 'River Sand',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_sand_plaster',
    name: 'Plaster Sand',
    category: 'sand',
    unit: 'trolley',
    payoutPerUnit: 1300,
    description: 'Fine sand for plastering',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/sand_plaster.jpg',
    brandName: 'Plaster Sand',
    hsn: '123456789',
    gstRate: 18,
  },
  
  // Aggregate (4 items)
  {
    id: 'item_aggregate_20mm',
    name: '20mm Aggregate',
    category: 'aggregate',
    unit: 'trolley',
    payoutPerUnit: 1400,
    description: '20mm blue metal aggregate',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/aggregate_20mm.jpg',
    brandName: '20mm Aggregate',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_aggregate_40mm',
    name: '40mm Aggregate',
    category: 'aggregate',
    unit: 'trolley',
    payoutPerUnit: 1350,
    description: '40mm blue metal aggregate',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/aggregate_40mm.jpg',
    brandName: '40mm Aggregate',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_aggregate_12mm',
    name: '12mm Aggregate',
    category: 'aggregate',
    unit: 'trolley',
    payoutPerUnit: 1450,
    description: '12mm chips for concrete',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/aggregate_12mm.jpg',
    brandName: '12mm Aggregate',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_aggregate_dust',
    name: 'Stone Dust',
    category: 'aggregate',
    unit: 'trolley',
    payoutPerUnit: 1100,
    description: 'Crushed stone dust',
    specifications: '1 trolley (approx 1.5 ton)',
    imageUrl: 'https://example.com/images/aggregate_dust.jpg',
    brandName: 'Stone Dust',
    hsn: '123456789',
    gstRate: 18,
  },
  
  // Steel (5 items)
  {
    id: 'item_steel_tmt_8mm',
    name: 'TMT Steel Bars 8mm',
    category: 'steel',
    unit: 'kg',
    payoutPerUnit: 58,
    description: 'TMT bars for construction',
    specifications: '8mm diameter',
    imageUrl: 'https://example.com/images/steel_tmt_8mm.jpg',
    brandName: 'TMT Steel',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_steel_tmt_10mm',
    name: 'TMT Steel Bars 10mm',
    category: 'steel',
    unit: 'kg',
    payoutPerUnit: 58,
    description: 'TMT bars for construction',
    specifications: '10mm diameter',
    imageUrl: 'https://example.com/images/steel_tmt_10mm.jpg',
    brandName: 'TMT Steel',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_steel_tmt_12mm',
    name: 'TMT Steel Bars 12mm',
    category: 'steel',
    unit: 'kg',
    payoutPerUnit: 58,
    description: 'TMT bars for construction',
    specifications: '12mm diameter',
    imageUrl: 'https://example.com/images/steel_tmt_12mm.jpg',
    brandName: 'TMT Steel',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_steel_tmt_16mm',
    name: 'TMT Steel Bars 16mm',
    category: 'steel',
    unit: 'kg',
    payoutPerUnit: 59,
    description: 'TMT bars for columns/beams',
    specifications: '16mm diameter',
    imageUrl: 'https://example.com/images/steel_tmt_16mm.jpg',
    brandName: 'TMT Steel',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_steel_tmt_20mm',
    name: 'TMT Steel Bars 20mm',
    category: 'steel',
    unit: 'kg',
    payoutPerUnit: 59,
    description: 'TMT bars for heavy structures',
    specifications: '20mm diameter',
    imageUrl: 'https://example.com/images/steel_tmt_20mm.jpg',
    brandName: 'TMT Steel',
    hsn: '123456789',
    gstRate: 18,
  },
  
  // Bricks (3 items)
  {
    id: 'item_bricks_red',
    name: 'Red Clay Bricks',
    category: 'bricks',
    unit: 'piece',
    payoutPerUnit: 8,
    description: 'Standard red clay bricks',
    specifications: '9" x 4" x 3"',
    imageUrl: 'https://example.com/images/bricks_red.jpg',
    brandName: 'Red Clay Bricks',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_bricks_fly_ash',
    name: 'Fly Ash Bricks',
    category: 'bricks',
    unit: 'piece',
    payoutPerUnit: 7,
    description: 'Eco-friendly fly ash bricks',
    specifications: '9" x 4" x 3"',
    imageUrl: 'https://example.com/images/bricks_fly_ash.jpg',
    brandName: 'Fly Ash Bricks',
    hsn: '123456789',
    gstRate: 18,
  },
  {
    id: 'item_bricks_concrete',
    name: 'Concrete Blocks',
    category: 'bricks',
    unit: 'piece',
    payoutPerUnit: 35,
    description: 'Hollow concrete blocks',
    specifications: '16" x 8" x 8"',
    imageUrl: 'https://example.com/images/bricks_concrete.jpg',
    brandName: 'Concrete Blocks',
    hsn: '123456789',
    gstRate: 18,
  },
];

/**
 * Chauhan Cement Suppliers - Active Catalog
 * Items currently in vendor's catalog (from vendorProfile.mock.ts)
 */
export const vendorActiveCatalog = [
  'item_cement_ultratech_50kg',
  'item_cement_acc_50kg',
  'item_sand_msand',
  'item_aggregate_20mm',
  'item_steel_tmt_8mm',
];

/**
 * Mock Catalog for Vendor Dashboard
 * Active catalog with availability status
 */
export const mockCatalog: CatalogItem[] = masterCatalog.map(item => ({
  ...item,
  isAvailable: vendorActiveCatalog.includes(item.id),
}));

/**
 * Get active catalog items for vendor
 */
export function getActiveCatalogItems(): CatalogItemMaster[] {
  return masterCatalog.filter(item => vendorActiveCatalog.includes(item.id));
}

/**
 * Get available items (not in vendor's catalog)
 */
export function getAvailableCatalogItems(): CatalogItemMaster[] {
  return masterCatalog.filter(item => !vendorActiveCatalog.includes(item.id));
}

/**
 * Get items by category
 */
export function getItemsByCategory(category: string): CatalogItemMaster[] {
  return masterCatalog.filter(item => item.category === category);
}

/**
 * Get item by ID
 */
export function getCatalogItemById(id: string): CatalogItemMaster | undefined {
  return masterCatalog.find(item => item.id === id);
}

/**
 * WhatsApp catalog update instructions
 */
export const catalogUpdateInstructions = {
  title: 'How to Update Your Catalog',
  steps: [
    'Send "CATALOG" to Vendara WhatsApp',
    'You will receive a numbered list of all available items',
    'Reply with the numbers of items you want to add/remove',
    'Example: "1, 2, 5, 8" to select items 1, 2, 5, and 8',
    'Your catalog will be updated within 1 hour',
    'Changes will appear in this portal automatically',
  ],
  whatsappNumber: '+917906441952',
  whatsappMessage: 'CATALOG',
};

/**
 * Master Services Catalog - All services available in Vendara
 */
export const masterServicesCatalog: ServiceItemMaster[] = [
  // Masonry
  {
    id: 'service_mason_expert',
    name: 'Expert Mason',
    skillType: 'mason',
    rateType: 'daily',
    payoutPerUnit: 1200,
    unit: 'day',
    description: 'Experienced mason for brick/block work, plastering, and flooring',
  },
  {
    id: 'service_mason_standard',
    name: 'Standard Mason',
    skillType: 'mason',
    rateType: 'daily',
    payoutPerUnit: 900,
    unit: 'day',
    description: 'Mason for general construction work',
  },
  
  // Electrician
  {
    id: 'service_electrician_expert',
    name: 'Expert Electrician',
    skillType: 'electrician',
    rateType: 'daily',
    payoutPerUnit: 1400,
    unit: 'day',
    description: 'Licensed electrician for wiring, installation, and maintenance',
  },
  {
    id: 'service_electrician_hourly',
    name: 'Electrician (Hourly)',
    skillType: 'electrician',
    rateType: 'hourly',
    payoutPerUnit: 200,
    unit: 'hour',
    description: 'Electrician for small repairs and installations',
  },
  
  // Plumber
  {
    id: 'service_plumber_expert',
    name: 'Expert Plumber',
    skillType: 'plumber',
    rateType: 'daily',
    payoutPerUnit: 1300,
    unit: 'day',
    description: 'Licensed plumber for piping, drainage, and fixture installation',
  },
  {
    id: 'service_plumber_hourly',
    name: 'Plumber (Hourly)',
    skillType: 'plumber',
    rateType: 'hourly',
    payoutPerUnit: 180,
    unit: 'hour',
    description: 'Plumber for repairs and maintenance',
  },
  
  // Carpenter
  {
    id: 'service_carpenter_expert',
    name: 'Expert Carpenter',
    skillType: 'carpenter',
    rateType: 'daily',
    payoutPerUnit: 1100,
    unit: 'day',
    description: 'Skilled carpenter for doors, windows, furniture, and formwork',
  },
  {
    id: 'service_carpenter_standard',
    name: 'Standard Carpenter',
    skillType: 'carpenter',
    rateType: 'daily',
    payoutPerUnit: 850,
    unit: 'day',
    description: 'Carpenter for general woodwork',
  },
  
  // Painter
  {
    id: 'service_painter_expert',
    name: 'Expert Painter',
    skillType: 'painter',
    rateType: 'daily',
    payoutPerUnit: 1000,
    unit: 'day',
    description: 'Professional painter for interior and exterior work',
  },
  {
    id: 'service_painter_standard',
    name: 'Standard Painter',
    skillType: 'painter',
    rateType: 'daily',
    payoutPerUnit: 750,
    unit: 'day',
    description: 'Painter for general painting work',
  },
  
  // Welder
  {
    id: 'service_welder_expert',
    name: 'Expert Welder',
    skillType: 'welder',
    rateType: 'daily',
    payoutPerUnit: 1500,
    unit: 'day',
    description: 'Certified welder for steel structures and metal work',
  },
  {
    id: 'service_welder_hourly',
    name: 'Welder (Hourly)',
    skillType: 'welder',
    rateType: 'hourly',
    payoutPerUnit: 220,
    unit: 'hour',
    description: 'Welder for small welding jobs',
  },
  
  // Helper
  {
    id: 'service_helper_daily',
    name: 'Construction Helper',
    skillType: 'helper',
    rateType: 'daily',
    payoutPerUnit: 600,
    unit: 'day',
    description: 'General construction helper for site work',
  },
  {
    id: 'service_helper_hourly',
    name: 'Helper (Hourly)',
    skillType: 'helper',
    rateType: 'hourly',
    payoutPerUnit: 80,
    unit: 'hour',
    description: 'Helper for miscellaneous tasks',
  },
];

/**
 * Chauhan Cement Suppliers - Active Services
 */
export const vendorActiveServices = [
  'service_mason_expert',
  'service_helper_daily',
];

/**
 * Mock Services Catalog with availability status
 */
export const mockServicesCatalog: ServiceItem[] = masterServicesCatalog.map(item => ({
  ...item,
  isAvailable: vendorActiveServices.includes(item.id),
}));

/**
 * Get active service items for vendor
 */
export function getActiveServiceItems(): ServiceItemMaster[] {
  return masterServicesCatalog.filter(item => vendorActiveServices.includes(item.id));
}

/**
 * Get available services (not in vendor's catalog)
 */
export function getAvailableServiceItems(): ServiceItemMaster[] {
  return masterServicesCatalog.filter(item => !vendorActiveServices.includes(item.id));
}

/**
 * Get services by skill type
 */
export function getServicesBySkillType(skillType: string): ServiceItemMaster[] {
  return masterServicesCatalog.filter(item => item.skillType === skillType);
}

/**
 * Get service by ID
 */
export function getServiceItemById(id: string): ServiceItemMaster | undefined {
  return masterServicesCatalog.find(item => item.id === id);
}