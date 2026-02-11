/**
 * Mock Order Data Generator
 * Generates large datasets for testing pagination
 */

import { Order } from '../types/order';

const buyers = [
  { id: 'buy_001', name: 'Ramesh Kumar', phone: '+917906441952', location: 'Kukatpally' },
  { id: 'buy_002', name: 'Suresh Reddy', phone: '+918393083836', location: 'Miyapur' },
  { id: 'buy_003', name: 'Venkat Rao', phone: '+918393083836', location: 'Madhapur' },
  { id: 'buy_004', name: 'Lakshmi Devi', phone: '+919012004150', location: 'Gachibowli' },
  { id: 'buy_005', name: 'Prakash Sharma', phone: '+919012004150', location: 'Kondapur' },
  { id: 'buy_006', name: 'Hari Krishna', phone: '+917906441952', location: 'Nizampet' },
  { id: 'buy_007', name: 'Anjali Mehta', phone: '+919997035170', location: 'Bachupally' },
  { id: 'buy_008', name: 'Sanjay Patel', phone: '+919997035170', location: 'Kompally' },
  { id: 'buy_009', name: 'Priya Nair', phone: '+917906441952', location: 'Shamshabad' },
  { id: 'buy_010', name: 'Karthik Raj', phone: '+917906441952', location: 'Uppal' },
  { id: 'buy_011', name: 'Deepak Singh', phone: '+917906441952', location: 'Secunderabad' },
  { id: 'buy_012', name: 'Meena Gupta', phone: '+917906441952', location: 'Banjara Hills' },
  { id: 'buy_013', name: 'Vijay Kumar', phone: '+917906441952', location: 'Jubilee Hills' },
  { id: 'buy_014', name: 'Sita Reddy', phone: '+917906441952', location: 'Ameerpet' },
  { id: 'buy_015', name: 'Ravi Shankar', phone: '+917906441952', location: 'Begumpet' },
];

const vendors = [
  { id: 'v_001', name: 'Sri Sai Suppliers', phone: '+917906441952', type: 'Material Supplier' },
  { id: 'v_002', name: 'Balaji Steel & Hardware', phone: '+918393083836', type: 'Material Supplier' },
  { id: 'v_003', name: 'Prime Bricks Co.', phone: '+918393083836', type: 'Material Supplier' },
  { id: 'v_004', name: 'Royal Paints & Hardware', phone: '+919012004150', type: 'Material Supplier' },
  { id: 'v_005', name: 'Hyderabad Skilled Workers', phone: '+919012004150', type: 'Labor Contractor' },
  { id: 'v_006', name: 'Expert Electricians', phone: '+917906441952', type: 'Labor Contractor' },
  { id: 'v_007', name: 'Metro Tiles & Sanitary', phone: '+919997035170', type: 'Material Supplier' },
  { id: 'v_008', name: 'Prime Plumbers', phone: '+919997035170', type: 'Labor Contractor' },
  { id: 'v_009', name: 'Apex Construction Materials', phone: '+917906441952', type: 'Material Supplier' },
  { id: 'v_010', name: 'Skilled Masons Group', phone: '+917906441952', type: 'Labor Contractor' },
];

const materials = [
  { name: 'Portland Cement (OPC 53)', category: 'Cement', unit: 'bags', unitPrice: 380 },
  { name: 'M-Sand (Fine)', category: 'Sand', unit: 'tons', unitPrice: 1800 },
  { name: 'TMT Steel Bars (12mm)', category: 'Steel', unit: 'kg', unitPrice: 65 },
  { name: 'Red Clay Bricks', category: 'Bricks', unit: 'pieces', unitPrice: 8 },
  { name: 'River Sand', category: 'Sand', unit: 'tons', unitPrice: 2000 },
  { name: 'Asian Paints Apex (White)', category: 'Paints', unit: 'liters', unitPrice: 450 },
  { name: 'Vitrified Tiles (2x2 ft)', category: 'Tiles', unit: 'pieces', unitPrice: 120 },
  { name: 'TMT Steel Bars (16mm)', category: 'Steel', unit: 'kg', unitPrice: 68 },
  { name: 'Concrete Blocks', category: 'Blocks', unit: 'pieces', unitPrice: 35 },
  { name: 'Granite Slabs', category: 'Granite', unit: 'sq ft', unitPrice: 180 },
];

const laborServices = [
  { name: 'Mason (Experienced)', category: 'Labor', unit: 'workers', unitPrice: 800 },
  { name: 'Helper', category: 'Labor', unit: 'workers', unitPrice: 500 },
  { name: 'Licensed Electrician', category: 'Labor', unit: 'workers', unitPrice: 1200 },
  { name: 'Licensed Plumber', category: 'Labor', unit: 'workers', unitPrice: 900 },
  { name: 'Carpenter', category: 'Labor', unit: 'workers', unitPrice: 850 },
  { name: 'Painter', category: 'Labor', unit: 'workers', unitPrice: 700 },
];

const statuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'] as const;
const paymentStatuses = ['pending', 'paid', 'partial', 'refunded'] as const;
const paymentMethods = ['UPI', 'Cash on Delivery', 'Bank Transfer'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

function generateOrderNumber(index: number): string {
  return `RS2024${String(1000 + index).padStart(6, '0')}`;
}

export function generateMockOrders(count: number = 120): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const buyer = randomItem(buyers);
    const vendor = randomItem(vendors);
    const isLabor = vendor.type === 'Labor Contractor';
    const status = randomItem(statuses);
    const isMaterial = !isLabor;

    // Generate items
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const item = isLabor ? randomItem(laborServices) : randomItem(materials);
      const quantity = isLabor 
        ? Math.floor(Math.random() * 4) + 1 
        : Math.floor(Math.random() * 100) + 10;
      const totalPrice = quantity * item.unitPrice;
      
      items.push({
        id: `item_${i}_${j}`,
        name: item.name,
        category: item.category,
        quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice,
        specifications: isLabor ? '8 hours/day' : undefined,
      });

      subtotal += totalPrice;
    }

    const platformFee = Math.round(subtotal * 0.03);
    const deliveryFee = isMaterial ? Math.floor(Math.random() * 1000) + 200 : 0;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + platformFee + deliveryFee + tax;

    const createdAt = randomDate(60);
    const createdDate = new Date(createdAt);

    const order: Order = {
      id: `ord_${String(i + 1).padStart(3, '0')}`,
      orderNumber: generateOrderNumber(i + 1),
      type: isLabor ? 'labor' : 'material',
      status,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      buyerLocation: buyer.location,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorPhone: vendor.phone,
      vendorType: vendor.type,
      items,
      subtotal,
      platformFee,
      deliveryFee,
      tax,
      total,
      paymentStatus: status === 'cancelled' ? 'refunded' : randomItem(paymentStatuses),
      paymentMethod: status !== 'pending' ? randomItem(paymentMethods) : undefined,
      deliveryAddress: `Plot ${Math.floor(Math.random() * 300) + 1}, ${buyer.location}, Hyderabad - 5000${Math.floor(Math.random() * 100)}`,
      deliveryDate: new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliverySlot: randomItem(['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM']),
      createdAt,
      confirmedAt: status !== 'pending' ? new Date(createdDate.getTime() + Math.random() * 3600000).toISOString() : undefined,
      deliveredAt: status === 'completed' ? new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      cancelledAt: status === 'cancelled' ? new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
      cancellationReason: status === 'cancelled' ? 'Changed project requirements' : undefined,
      rating: status === 'completed' && Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 3 : undefined,
      reviewText: status === 'completed' && Math.random() > 0.5 ? 'Good service' : undefined,
      notes: Math.random() > 0.7 ? 'Please call before delivery' : undefined,
    };

    orders.push(order);
  }

  return orders;
}
