import type { VendorOrder } from '../types/vendorOrder';
import { VendorOrderStatus } from '../constants/vendorOrderStates';

/**
 * Mock Vendor Orders
 * Sample orders for Chauhan Cement Suppliers
 */
export const mockVendorOrders: VendorOrder[] = [
  // New Order Requests (OFFERED status) - Active requests with future expiration
  {
    id: 'order_req_01',
    orderNumber: 'ORD-1251',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_cement_ultratech_50kg',
    itemName: 'UltraTech Cement 50kgs',
    itemCategory: 'cement',
    quantity: 15,
    unit: 'bags',
    
    payoutPerUnit: 360,
    basePayoutAmount: 5400,
    vendaraFee: 540,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 4860,
    
    status: VendorOrderStatus.OFFERED,
    
    offeredAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    offerExpiresAt: new Date(Date.now() + 14 * 60 * 1000).toISOString(), // Expires in 14 minutes
    
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    deliveryTimeSlot: {
      startTime: '16:00',
      endTime: '19:00',
    },
    deliveryArea: 'Miyapur',
    deliveryPincode: '500049',
    deliveryAddress: 'Plot No. 45, Sector 12, HITEC City\nHyderabad, Telangana - 500081\nLandmark: Near Cyber Towers',
    deliveryInstructions: 'Please deliver before 11 AM. Contact site supervisor on arrival. Unload at basement level.',
    
    buyerPhone: '+91 7906441952',
    buyerEmail: 'rajesh@construction.com',
    
    settlementStatus: 'pending',
    
    hasIssue: false,
    
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  
  {
    id: 'order_req_02',
    orderNumber: 'ORD-1250',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_sand_msand',
    itemName: 'M-Sand (Manufactured Sand)',
    itemCategory: 'sand',
    quantity: 3,
    unit: 'trolleys',
    
    payoutPerUnit: 1200,
    basePayoutAmount: 3600,
    vendaraFee: 360,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 3240,
    
    status: VendorOrderStatus.OFFERED,
    
    offeredAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    offerExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // Expires in 10 minutes
    
    deliveryDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    deliveryTimeSlot: {
      startTime: '08:00',
      endTime: '11:00',
    },
    deliveryArea: 'Kukatpally',
    deliveryPincode: '500072',
    
    buyerPhone: '+91 98123 45678',
    
    settlementStatus: 'pending',
    
    hasIssue: false,
    
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  
  {
    id: 'order_req_03',
    orderNumber: 'ORD-1249',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_aggregate_20mm',
    itemName: '20mm Aggregate',
    itemCategory: 'aggregate',
    quantity: 5,
    unit: 'trolleys',
    
    payoutPerUnit: 1100,
    basePayoutAmount: 5500,
    vendaraFee: 550,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 4950,
    
    status: VendorOrderStatus.OFFERED,
    
    offeredAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    offerExpiresAt: new Date(Date.now() + 13 * 60 * 1000).toISOString(), // Expires in 13 minutes
    
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    deliveryTimeSlot: {
      startTime: '10:00',
      endTime: '13:00',
    },
    deliveryArea: 'Gachibowli',
    deliveryPincode: '500032',
    deliveryAddress: 'Building No. 7, Phase 2, DLF Cyber City\nGachibowli, Hyderabad - 500032\nLandmark: Behind Inorbit Mall',
    
    buyerPhone: '+91 99887 76655',
    
    settlementStatus: 'pending',
    
    hasIssue: false,
    
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  
  // Active Order 1 - Accepted (needs to be marked as ready)
  {
    id: 'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderNumber: 'ORD-1248',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_cement_ultratech_50kg',
    itemName: 'UltraTech Cement 50kg',
    itemCategory: 'cement',
    quantity: 10,
    unit: 'bags',
    
    payoutPerUnit: 360,
    basePayoutAmount: 3600,
    vendaraFee: 360,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 3240,
    
    status: VendorOrderStatus.ACCEPTED,
    
    offeredAt: '2026-01-08T07:30:00Z',
    offerExpiresAt: '2026-01-08T07:45:00Z',
    respondedAt: '2026-01-08T07:32:00Z',
    acceptedAt: '2026-01-08T07:32:00Z',
    
    deliveryDate: '2026-01-08',
    deliveryTimeSlot: {
      startTime: '14:00',
      endTime: '17:00',
    },
    deliveryArea: 'Miyapur',
    deliveryPincode: '500049',
    
    buyerPhone: '+91 98234 56789',
    
    settlementStatus: 'pending',
    
    hasIssue: false,
    
    createdAt: '2026-01-08T07:30:00Z',
    updatedAt: '2026-01-08T07:32:00Z',
  },
  
  // Active Order 2
  {
    id: 'order_02HQKZX8Y9Z1A2B3C4D5E6F7G9',
    orderNumber: 'ORD-1247',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_sand_msand',
    itemName: 'M-Sand (Manufactured Sand)',
    itemCategory: 'sand',
    quantity: 2,
    unit: 'trolleys',
    
    payoutPerUnit: 1200,
    basePayoutAmount: 2400,
    vendaraFee: 240,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 2160,
    
    status: VendorOrderStatus.READY,
    
    offeredAt: '2026-01-07T16:00:00Z',
    offerExpiresAt: '2026-01-07T16:15:00Z',
    respondedAt: '2026-01-07T16:03:00Z',
    acceptedAt: '2026-01-07T16:03:00Z',
    
    deliveryDate: '2026-01-08',
    deliveryTimeSlot: {
      startTime: '10:00',
      endTime: '13:00',
    },
    deliveryArea: 'Kukatpally',
    deliveryPincode: '500072',
    
    settlementStatus: 'pending',
    
    hasIssue: false,
    
    createdAt: '2026-01-07T16:00:00Z',
    updatedAt: '2026-01-08T09:45:00Z',
  },
  
  // Completed Order - Today
  {
    id: 'order_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    orderNumber: 'ORD-1246',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_cement_acc_50kg',
    itemName: 'ACC Cement 50kg',
    itemCategory: 'cement',
    quantity: 8,
    unit: 'bags',
    
    payoutPerUnit: 355,
    basePayoutAmount: 2840,
    vendaraFee: 284,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 2556,
    
    status: VendorOrderStatus.COMPLETED,
    
    offeredAt: '2026-01-07T09:00:00Z',
    offerExpiresAt: '2026-01-07T09:15:00Z',
    respondedAt: '2026-01-07T09:05:00Z',
    acceptedAt: '2026-01-07T09:05:00Z',
    deliveredAt: '2026-01-07T14:30:00Z',
    completedAt: '2026-01-07T14:45:00Z',
    
    deliveryDate: '2026-01-07',
    deliveryTimeSlot: {
      startTime: '12:00',
      endTime: '15:00',
    },
    deliveryArea: 'Miyapur',
    deliveryPincode: '500049',
    
    settlementStatus: 'pending',
    
    hasIssue: false,
    
    createdAt: '2026-01-07T09:00:00Z',
    updatedAt: '2026-01-07T14:45:00Z',
  },
  
  // Completed Order with Settlement
  {
    id: 'order_04HQKZX8Y9Z1A2B3C4D5E6F7H1',
    orderNumber: 'ORD-1245',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_cement_ultratech_50kg',
    itemName: 'UltraTech Cement 50kg',
    itemCategory: 'cement',
    quantity: 5,
    unit: 'bags',
    
    payoutPerUnit: 360,
    basePayoutAmount: 1800,
    vendaraFee: 180,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 1620,
    
    status: VendorOrderStatus.COMPLETED,
    
    offeredAt: '2026-01-03T08:30:00Z',
    offerExpiresAt: '2026-01-03T08:45:00Z',
    respondedAt: '2026-01-03T08:33:00Z',
    acceptedAt: '2026-01-03T08:33:00Z',
    deliveredAt: '2026-01-03T14:20:00Z',
    completedAt: '2026-01-03T14:30:00Z',
    
    deliveryDate: '2026-01-03',
    deliveryTimeSlot: {
      startTime: '12:00',
      endTime: '15:00',
    },
    deliveryArea: 'KPHB',
    deliveryPincode: '500085',
    
    settlementId: 'ST-2026-001',
    settlementStatus: 'settled',
    settlementDate: '2026-01-03T18:00:00Z',
    
    hasIssue: false,
    
    createdAt: '2026-01-03T08:30:00Z',
    updatedAt: '2026-01-03T18:00:00Z',
  },
  
  // Order with Issue
  {
    id: 'order_05HQKZX8Y9Z1A2B3C4D5E6F7H2',
    orderNumber: 'ORD-1244',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_aggregate_20mm',
    itemName: '20mm Aggregate',
    itemCategory: 'aggregate',
    quantity: 1,
    unit: 'trolley',
    
    payoutPerUnit: 1400,
    basePayoutAmount: 1400,
    vendaraFee: 140,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 1260,
    
    status: VendorOrderStatus.ISSUE,
    
    offeredAt: '2026-01-02T10:00:00Z',
    offerExpiresAt: '2026-01-02T10:15:00Z',
    respondedAt: '2026-01-02T10:04:00Z',
    acceptedAt: '2026-01-02T10:04:00Z',
    
    deliveryDate: '2026-01-02',
    deliveryTimeSlot: {
      startTime: '15:00',
      endTime: '18:00',
    },
    deliveryArea: 'Miyapur',
    deliveryPincode: '500049',
    
    settlementStatus: 'pending',
    
    hasIssue: true,
    issueDescription: 'Customer site locked, unable to deliver',
    issueReportedAt: '2026-01-02T15:30:00Z',
    issueResolvedAt: '2026-01-02T16:15:00Z',
    issueResolution: 'Rescheduled to next day, delivered successfully',
    
    createdAt: '2026-01-02T10:00:00Z',
    updatedAt: '2026-01-02T16:15:00Z',
  },
  
  // More completed orders for history (December 2025)
  {
    id: 'order_06HQKZX8Y9Z1A2B3C4D5E6F7H3',
    orderNumber: 'ORD-1240',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_cement_ultratech_50kg',
    itemName: 'UltraTech Cement 50kg',
    itemCategory: 'cement',
    quantity: 12,
    unit: 'bags',
    
    payoutPerUnit: 360,
    basePayoutAmount: 4320,
    vendaraFee: 432,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 3888,
    
    status: VendorOrderStatus.COMPLETED,
    
    offeredAt: '2025-12-28T09:00:00Z',
    offerExpiresAt: '2025-12-28T09:15:00Z',
    respondedAt: '2025-12-28T09:06:00Z',
    acceptedAt: '2025-12-28T09:06:00Z',
    deliveredAt: '2025-12-28T13:45:00Z',
    completedAt: '2025-12-28T14:00:00Z',
    
    deliveryDate: '2025-12-28',
    deliveryTimeSlot: {
      startTime: '11:00',
      endTime: '14:00',
    },
    deliveryArea: 'Kukatpally',
    deliveryPincode: '500072',
    
    settlementId: 'ST-2025-052',
    settlementStatus: 'settled',
    settlementDate: '2025-12-30T12:00:00Z',
    
    hasIssue: false,
    
    createdAt: '2025-12-28T09:00:00Z',
    updatedAt: '2025-12-30T12:00:00Z',
  },
  
  // Late delivery example
  {
    id: 'order_07HQKZX8Y9Z1A2B3C4D5E6F7H4',
    orderNumber: 'ORD-1238',
    vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    
    itemId: 'item_steel_tmt_8mm',
    itemName: 'TMT Steel Bars 8mm',
    itemCategory: 'steel',
    quantity: 100,
    unit: 'kg',
    
    payoutPerUnit: 58,
    basePayoutAmount: 5800,
vendaraFee: 580,
    logisticsFee: 100,
    deductions: 100, // Late delivery penalty
    totalPayoutAmount: 5020,
    
    status: VendorOrderStatus.COMPLETED,
    
    offeredAt: '2025-12-20T08:00:00Z',
    offerExpiresAt: '2025-12-20T08:15:00Z',
    respondedAt: '2025-12-20T08:08:00Z',
    acceptedAt: '2025-12-20T08:08:00Z',
    deliveredAt: '2025-12-20T15:45:00Z', // 45 min late
    completedAt: '2025-12-20T16:00:00Z',
    
    deliveryDate: '2025-12-20',
    deliveryTimeSlot: {
      startTime: '12:00',
      endTime: '15:00',
    },
    deliveryArea: 'KPHB',
    deliveryPincode: '500085',
    
    settlementId: 'ST-2025-051',
    settlementStatus: 'settled',
    settlementDate: '2025-12-23T12:00:00Z',
    
    hasIssue: false,
    
    createdAt: '2025-12-20T08:00:00Z',
    updatedAt: '2025-12-23T12:00:00Z',
  },
  
  // Additional completed orders for statistics
  ...generateAdditionalOrders(3), // Reduced from 15
  ...generateRecentOrders(2), // Reduced from 10
  ...generateMoreActiveOrders(1), // Reduced from 5
  ...generateRejectedOrders(1), // Reduced from 3
  
  // Orders for Chauhan Steel & Hardware (vendor_03)
  ...generateVendor3Orders(),
];

/**
 * Helper function to generate additional orders for volume
 */
function generateAdditionalOrders(count: number): VendorOrder[] {
  const orders: VendorOrder[] = [];
  const items = [
    { id: 'item_cement_ultratech_50kg', name: 'UltraTech Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 360, qty: [5, 8, 10, 12] },
    { id: 'item_cement_acc_50kg', name: 'ACC Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 355, qty: [5, 8, 10] },
    { id: 'item_sand_msand', name: 'M-Sand', category: 'sand' as const, unit: 'trolleys', payout: 1200, qty: [1, 2, 3] },
    { id: 'item_aggregate_20mm', name: '20mm Aggregate', category: 'aggregate' as const, unit: 'trolley', payout: 1400, qty: [1, 2] },
  ];
  
  const areas = ['Miyapur', 'Kukatpally', 'KPHB'];
  const pincodes = ['500049', '500072', '500085'];
  
  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const quantity = item.qty[Math.floor(Math.random() * item.qty.length)];
    const baseAmount = quantity * item.payout;
    const orderNum = 1237 - i;
    const daysAgo = 5 + i;
    const date = new Date('2025-12-15');
    date.setDate(date.getDate() + daysAgo);
    
    const areaIndex = i % areas.length;
    
    orders.push({
      id: `order_gen_${i.toString().padStart(3, '0')}`,
      orderNumber: `ORD-${orderNum}`,
      vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      quantity,
      unit: item.unit,
      
      payoutPerUnit: item.payout,
      basePayoutAmount: baseAmount,
      vendaraFee: baseAmount * 0.1,
      logisticsFee: 0,
      deductions: 0,
      totalPayoutAmount: baseAmount * 0.9,
      
      status: VendorOrderStatus.COMPLETED,
      
      offeredAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      offerExpiresAt: new Date(date.getTime() - 5.75 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(date.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      completedAt: date.toISOString(),
      
      deliveryDate: date.toISOString().split('T')[0],
      deliveryTimeSlot: {
        startTime: '12:00',
        endTime: '15:00',
      },
      deliveryArea: areas[areaIndex],
      deliveryPincode: pincodes[areaIndex],
      
      settlementId: i < 10 ? `ST-2025-${(42 + i).toString().padStart(3, '0')}` : undefined,
      settlementStatus: i < 10 ? 'settled' : 'pending',
      settlementDate: i < 10 ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      hasIssue: false,
      
      createdAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return orders;
}

/**
 * Helper function to generate recent orders
 */
function generateRecentOrders(count: number): VendorOrder[] {
  const orders: VendorOrder[] = [];
  const items = [
    { id: 'item_cement_ultratech_50kg', name: 'UltraTech Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 360, qty: [5, 8, 10, 12] },
    { id: 'item_cement_acc_50kg', name: 'ACC Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 355, qty: [5, 8, 10] },
    { id: 'item_sand_msand', name: 'M-Sand', category: 'sand' as const, unit: 'trolleys', payout: 1200, qty: [1, 2, 3] },
    { id: 'item_aggregate_20mm', name: '20mm Aggregate', category: 'aggregate' as const, unit: 'trolley', payout: 1400, qty: [1, 2] },
  ];
  
  const areas = ['Miyapur', 'Kukatpally', 'KPHB'];
  const pincodes = ['500049', '500072', '500085'];
  
  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const quantity = item.qty[Math.floor(Math.random() * item.qty.length)];
    const baseAmount = quantity * item.payout;
    const orderNum = 1237 - i;
    const daysAgo = 5 + i;
    const date = new Date('2026-01-01');
    date.setDate(date.getDate() + daysAgo);
    
    const areaIndex = i % areas.length;
    
    orders.push({
      id: `order_recent_${i.toString().padStart(3, '0')}`,
      orderNumber: `ORD-${orderNum}`,
      vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      quantity,
      unit: item.unit,
      
      payoutPerUnit: item.payout,
      basePayoutAmount: baseAmount,
      vendaraFee: baseAmount * 0.1,
      logisticsFee: 0,
      deductions: 0,
      totalPayoutAmount: baseAmount * 0.9,
      
      status: VendorOrderStatus.COMPLETED,
      
      offeredAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      offerExpiresAt: new Date(date.getTime() - 5.75 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(date.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      completedAt: date.toISOString(),
      
      deliveryDate: date.toISOString().split('T')[0],
      deliveryTimeSlot: {
        startTime: '12:00',
        endTime: '15:00',
      },
      deliveryArea: areas[areaIndex],
      deliveryPincode: pincodes[areaIndex],
      
      settlementId: i < 10 ? `ST-2026-${(42 + i).toString().padStart(3, '0')}` : undefined,
      settlementStatus: i < 10 ? 'settled' : 'pending',
      settlementDate: i < 10 ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      hasIssue: false,
      
      createdAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return orders;
}

/**
 * Helper function to generate more active orders
 */
function generateMoreActiveOrders(count: number): VendorOrder[] {
  const orders: VendorOrder[] = [];
  const items = [
    { id: 'item_cement_ultratech_50kg', name: 'UltraTech Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 360, qty: [5, 8, 10, 12] },
    { id: 'item_cement_acc_50kg', name: 'ACC Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 355, qty: [5, 8, 10] },
    { id: 'item_sand_msand', name: 'M-Sand', category: 'sand' as const, unit: 'trolleys', payout: 1200, qty: [1, 2, 3] },
    { id: 'item_aggregate_20mm', name: '20mm Aggregate', category: 'aggregate' as const, unit: 'trolley', payout: 1400, qty: [1, 2] },
  ];
  
  const areas = ['Miyapur', 'Kukatpally', 'KPHB'];
  const pincodes = ['500049', '500072', '500085'];
  
  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const quantity = item.qty[Math.floor(Math.random() * item.qty.length)];
    const baseAmount = quantity * item.payout;
    const orderNum = 1237 - i;
    const daysAgo = 5 + i;
    const date = new Date('2026-01-01');
    date.setDate(date.getDate() + daysAgo);
    
    const areaIndex = i % areas.length;
    
    orders.push({
      id: `order_active_${i.toString().padStart(3, '0')}`,
      orderNumber: `ORD-${orderNum}`,
      vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      quantity,
      unit: item.unit,
      
      payoutPerUnit: item.payout,
      basePayoutAmount: baseAmount,
      vendaraFee: baseAmount * 0.1,
      logisticsFee: 0,
      deductions: 0,
      totalPayoutAmount: baseAmount * 0.9,
      
      status: VendorOrderStatus.READY,
      
      offeredAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      offerExpiresAt: new Date(date.getTime() - 5.75 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(date.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      completedAt: date.toISOString(),
      
      deliveryDate: date.toISOString().split('T')[0],
      deliveryTimeSlot: {
        startTime: '12:00',
        endTime: '15:00',
      },
      deliveryArea: areas[areaIndex],
      deliveryPincode: pincodes[areaIndex],
      
      settlementId: i < 10 ? `ST-2026-${(42 + i).toString().padStart(3, '0')}` : undefined,
      settlementStatus: i < 10 ? 'settled' : 'pending',
      settlementDate: i < 10 ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      hasIssue: false,
      
      createdAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return orders;
}

/**
 * Helper function to generate rejected orders
 */
function generateRejectedOrders(count: number): VendorOrder[] {
  const orders: VendorOrder[] = [];
  const items = [
    { id: 'item_cement_ultratech_50kg', name: 'UltraTech Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 360, qty: [5, 8, 10, 12] },
    { id: 'item_cement_acc_50kg', name: 'ACC Cement 50kg', category: 'cement' as const, unit: 'bags', payout: 355, qty: [5, 8, 10] },
    { id: 'item_sand_msand', name: 'M-Sand', category: 'sand' as const, unit: 'trolleys', payout: 1200, qty: [1, 2, 3] },
    { id: 'item_aggregate_20mm', name: '20mm Aggregate', category: 'aggregate' as const, unit: 'trolley', payout: 1400, qty: [1, 2] },
  ];
  
  const areas = ['Miyapur', 'Kukatpally', 'KPHB'];
  const pincodes = ['500049', '500072', '500085'];
  
  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const quantity = item.qty[Math.floor(Math.random() * item.qty.length)];
    const baseAmount = quantity * item.payout;
    const orderNum = 1237 - i;
    const daysAgo = 5 + i;
    const date = new Date('2026-01-01');
    date.setDate(date.getDate() + daysAgo);
    
    const areaIndex = i % areas.length;
    
    orders.push({
      id: `order_rejected_${i.toString().padStart(3, '0')}`,
      orderNumber: `ORD-${orderNum}`,
      vendorId: 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
      
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      quantity,
      unit: item.unit,
      
      payoutPerUnit: item.payout,
      basePayoutAmount: baseAmount,
      vendaraFee: baseAmount * 0.1,
      logisticsFee: 0,
      deductions: 0,
      totalPayoutAmount: baseAmount * 0.9,
      
      status: VendorOrderStatus.REJECTED,
      
      offeredAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      offerExpiresAt: new Date(date.getTime() - 5.75 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(date.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      completedAt: date.toISOString(),
      
      deliveryDate: date.toISOString().split('T')[0],
      deliveryTimeSlot: {
        startTime: '12:00',
        endTime: '15:00',
      },
      deliveryArea: areas[areaIndex],
      deliveryPincode: pincodes[areaIndex],
      
      settlementId: i < 10 ? `ST-2026-${(42 + i).toString().padStart(3, '0')}` : undefined,
      settlementStatus: i < 10 ? 'settled' : 'pending',
      settlementDate: i < 10 ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      hasIssue: false,
      
      createdAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return orders;
}

/**
 * Helper function to generate orders for Chauhan Steel & Hardware (vendor_03)
 */
function generateVendor3Orders(count: number = 5): VendorOrder[] {
  const orders: VendorOrder[] = [];
  const items = [
    { id: 'item_steel_tmt_8mm', name: 'TMT Steel Bars 8mm', category: 'steel' as const, unit: 'kg', payout: 58, qty: [50, 100, 150] },
    { id: 'item_steel_tmt_10mm', name: 'TMT Steel Bars 10mm', category: 'steel' as const, unit: 'kg', payout: 60, qty: [50, 100, 150] },
    { id: 'item_steel_tmt_12mm', name: 'TMT Steel Bars 12mm', category: 'steel' as const, unit: 'kg', payout: 62, qty: [50, 100, 150] },
    { id: 'item_hardware_nails', name: 'Steel Nails', category: 'hardware' as const, unit: 'kg', payout: 85, qty: [10, 20, 30] },
  ];
  
  const areas = ['Bachupally', 'Nizampet', 'Pragathi Nagar'];
  const pincodes = ['500090', '500090', '500072'];
  
  // Add 2 active orders (OFFERED status)
  orders.push({
    id: 'order_vendor3_offered_001',
    orderNumber: 'ORD-RK-1001',
    vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    
    itemId: 'item_steel_tmt_10mm',
    itemName: 'TMT Steel Bars 10mm',
    itemCategory: 'steel',
    quantity: 100,
    unit: 'kg',
    
    payoutPerUnit: 60,
    basePayoutAmount: 6000,
    vendaraFee: 600,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 5400,
    
    status: VendorOrderStatus.OFFERED,
    
    offeredAt: '2026-01-08T10:00:00Z',
    offerExpiresAt: '2026-01-08T10:15:00Z',
    
    deliveryDate: '2026-01-08',
    deliveryTimeSlot: {
      startTime: '15:00',
      endTime: '18:00',
    },
    deliveryArea: 'Bachupally',
    deliveryPincode: '500090',
    
    buyerPhone: '+91 98765 11111',
    
    settlementStatus: 'pending',
    hasIssue: false,
    
    createdAt: '2026-01-08T10:00:00Z',
    updatedAt: '2026-01-08T10:00:00Z',
  });
  
  orders.push({
    id: 'order_vendor3_offered_002',
    orderNumber: 'ORD-RK-1002',
    vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    
    itemId: 'item_hardware_nails',
    itemName: 'Steel Nails',
    itemCategory: 'hardware',
    quantity: 20,
    unit: 'kg',
    
    payoutPerUnit: 85,
    basePayoutAmount: 1700,
    vendaraFee: 170,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 1530,
    
    status: VendorOrderStatus.OFFERED,
    
    offeredAt: '2026-01-08T09:30:00Z',
    offerExpiresAt: '2026-01-08T09:45:00Z',
    
    deliveryDate: '2026-01-09',
    deliveryTimeSlot: {
      startTime: '10:00',
      endTime: '13:00',
    },
    deliveryArea: 'Nizampet',
    deliveryPincode: '500090',
    
    buyerPhone: '+91 98765 22222',
    
    settlementStatus: 'pending',
    hasIssue: false,
    
    createdAt: '2026-01-08T09:30:00Z',
    updatedAt: '2026-01-08T09:30:00Z',
  });
  
  // Add 1 accepted order
  orders.push({
    id: 'order_vendor3_accepted_001',
    orderNumber: 'ORD-RK-1000',
    vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    
    itemId: 'item_steel_tmt_12mm',
    itemName: 'TMT Steel Bars 12mm',
    itemCategory: 'steel',
    quantity: 150,
    unit: 'kg',
    
    payoutPerUnit: 62,
    basePayoutAmount: 9300,
    vendaraFee: 930,
    logisticsFee: 0,
    deductions: 0,
    totalPayoutAmount: 8370,
    
    status: VendorOrderStatus.ACCEPTED,
    
    offeredAt: '2026-01-08T08:00:00Z',
    offerExpiresAt: '2026-01-08T08:15:00Z',
    respondedAt: '2026-01-08T08:05:00Z',
    acceptedAt: '2026-01-08T08:05:00Z',
    
    deliveryDate: '2026-01-08',
    deliveryTimeSlot: {
      startTime: '14:00',
      endTime: '17:00',
    },
    deliveryArea: 'Pragathi Nagar',
    deliveryPincode: '500072',
    
    buyerPhone: '+91 98765 33333',
    
    settlementStatus: 'pending',
    hasIssue: false,
    
    createdAt: '2026-01-08T08:00:00Z',
    updatedAt: '2026-01-08T08:05:00Z',
  });
  
  // Add completed orders for history
  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const quantity = item.qty[Math.floor(Math.random() * item.qty.length)];
    const baseAmount = quantity * item.payout;
    const orderNum = 999 - i;
    const daysAgo = 3 + i;
    const date = new Date('2026-01-05');
    date.setDate(date.getDate() - daysAgo);
    
    const areaIndex = i % areas.length;
    
    orders.push({
      id: `order_vendor3_${i.toString().padStart(3, '0')}`,
      orderNumber: `ORD-RK-${orderNum}`,
      vendorId: 'vendor_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
      
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      quantity,
      unit: item.unit,
      
      payoutPerUnit: item.payout,
      basePayoutAmount: baseAmount,
      vendaraFee: baseAmount * 0.1,
      logisticsFee: 0,
      deductions: 0,
      totalPayoutAmount: baseAmount * 0.9,
      
      status: VendorOrderStatus.COMPLETED,
      
      offeredAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      offerExpiresAt: new Date(date.getTime() - 5.75 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(date.getTime() - 5.9 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(date.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      completedAt: date.toISOString(),
      
      deliveryDate: date.toISOString().split('T')[0],
      deliveryTimeSlot: {
        startTime: '12:00',
        endTime: '15:00',
      },
      deliveryArea: areas[areaIndex],
      deliveryPincode: pincodes[areaIndex],
      
      settlementId: i < 10 ? `ST-2026-${(42 + i).toString().padStart(3, '0')}` : undefined,
      settlementStatus: i < 10 ? 'settled' : 'pending',
      settlementDate: i < 10 ? new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      hasIssue: false,
      
      createdAt: new Date(date.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return orders;
}

/**
 * Get orders by status
 */
export function getOrdersByStatus(status: VendorOrderStatus): VendorOrder[] {
  return mockVendorOrders.filter(order => order.status === status);
}

/**
 * Get active orders (IN_PROGRESS or READY)
 */
export function getActiveOrders(): VendorOrder[] {
  return mockVendorOrders.filter(
    order => order.status === VendorOrderStatus.IN_PROGRESS || 
             order.status === VendorOrderStatus.READY
  );
}

/**
 * Get order by ID
 */
export function getOrderById(id: string): VendorOrder | undefined {
  return mockVendorOrders.find(order => order.id === id);
}

/**
 * Get order by order number
 */
export function getOrderByNumber(orderNumber: string): VendorOrder | undefined {
  return mockVendorOrders.find(order => order.orderNumber === orderNumber);
}