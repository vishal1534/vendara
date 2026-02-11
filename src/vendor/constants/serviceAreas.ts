export const HYDERABAD_SERVICE_AREAS = [
  'Miyapur',
  'Kukatpally',
  'KPHB',
  'Gachibowli',
  'Madhapur',
  'Hitech City',
  'Kondapur',
  'Manikonda',
  'Narsingi',
  'Kokapet',
  'Financial District',
  'Jubilee Hills',
  'Banjara Hills',
  'Begumpet',
  'Secunderabad',
  'Ameerpet',
  'SR Nagar',
  'Erragadda',
  'Panjagutta',
  'Somajiguda',
  'Lakdikapul',
  'Masab Tank',
  'Mehdipatnam',
  'Tolichowki',
  'Attapur',
  'Rajendra Nagar',
  'Lingampally',
  'Bachupally',
  'Nizampet',
  'Pragathi Nagar',
] as const;

export type ServiceArea = typeof HYDERABAD_SERVICE_AREAS[number];

/**
 * Service area zones based on geographic proximity
 * Vendors can only select areas within their zone (determined by business location)
 * To serve areas outside their zone, vendors must contact Vendara support
 */
export const SERVICE_AREA_ZONES = {
  // West Zone (15km diameter)
  west: [
    'Miyapur',
    'Kukatpally',
    'KPHB',
    'Bachupally',
    'Nizampet',
    'Pragathi Nagar',
    'Kondapur',
    'Lingampally',
  ],
  
  // Central-West Zone (15km diameter)
  centralWest: [
    'Gachibowli',
    'Madhapur',
    'Hitech City',
    'Kondapur',
    'Manikonda',
    'Narsingi',
    'Kokapet',
    'Financial District',
  ],
  
  // Central Zone (15km diameter)
  central: [
    'Jubilee Hills',
    'Banjara Hills',
    'Begumpet',
    'Secunderabad',
    'Ameerpet',
    'SR Nagar',
    'Erragadda',
    'Panjagutta',
    'Somajiguda',
    'Lakdikapul',
  ],
  
  // South Zone (15km diameter)
  south: [
    'Masab Tank',
    'Mehdipatnam',
    'Tolichowki',
    'Attapur',
    'Rajendra Nagar',
    'Gachibowli',
    'Financial District',
    'Narsingi',
  ],
} as const;

export type ServiceZone = keyof typeof SERVICE_AREA_ZONES;

/**
 * Get allowed service areas for a vendor based on their business location
 * @param businessLocation - Primary area where business is located
 * @returns Array of allowed service areas
 */
export function getAllowedServiceAreas(businessLocation: string): string[] {
  // Find which zone the business location belongs to
  for (const [zone, areas] of Object.entries(SERVICE_AREA_ZONES)) {
    if (areas.includes(businessLocation as any)) {
      return [...areas];
    }
  }
  
  // Fallback: if location not found in any zone, return empty array
  return [];
}

/**
 * Check if a service area is within the vendor's allowed zone
 * @param area - Service area to check
 * @param businessLocation - Vendor's business location
 * @returns true if area is allowed, false otherwise
 */
export function isAreaAllowed(area: string, businessLocation: string): boolean {
  const allowedAreas = getAllowedServiceAreas(businessLocation);
  return allowedAreas.includes(area);
}