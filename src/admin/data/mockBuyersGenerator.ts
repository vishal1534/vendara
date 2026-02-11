/**
 * Mock Buyer Data Generator
 * Generates large datasets for testing pagination
 */

import { Buyer, BuyerType } from '../types/buyer';

const firstNames = [
  'Ramesh', 'Suresh', 'Venkat', 'Lakshmi', 'Prakash', 'Hari', 'Anjali', 'Sanjay',
  'Priya', 'Karthik', 'Deepak', 'Meena', 'Vijay', 'Sita', 'Ravi', 'Geeta',
  'Arun', 'Kavita', 'Rajesh', 'Sangeeta', 'Mohan', 'Divya', 'Sunil', 'Pooja',
  'Mahesh', 'Rekha', 'Ashok', 'Sunita', 'Naveen', 'Shweta'
];

const lastNames = [
  'Kumar', 'Reddy', 'Rao', 'Devi', 'Sharma', 'Krishna', 'Mehta', 'Patel',
  'Nair', 'Raj', 'Singh', 'Gupta', 'Shankar', 'Prasad', 'Iyer', 'Nair',
  'Verma', 'Agarwal', 'Jain', 'Pillai'
];

const locations = [
  'Kukatpally', 'Miyapur', 'Madhapur', 'Gachibowli', 'Kondapur', 'Nizampet',
  'Bachupally', 'Kompally', 'Shamshabad', 'Uppal', 'Secunderabad', 'Banjara Hills',
  'Jubilee Hills', 'Ameerpet', 'Begumpet', 'Mehdipatnam', 'Dilsukhnagar', 'LB Nagar',
  'Manikonda', 'Kokapet', 'Financial District', 'Lingampally', 'Patancheru',
  'Hafeezpet', 'Nallagandla', 'Tellapur', 'Kollur', 'Gopanpally'
];

const statuses = ['active', 'inactive', 'suspended'] as const;
const types: BuyerType[] = ['individual', 'contractor', 'builder'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

export function generateMockBuyers(count: number = 100): Buyer[] {
  const buyers: Buyer[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const location = randomItem(locations);
    const status = randomItem(statuses);
    const type = randomItem(types);
    const registeredAt = randomDate(365);
    const lastActiveDaysAgo = status === 'active' ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 90) + 30;
    
    const totalOrders = status === 'active' 
      ? Math.floor(Math.random() * 50) + 5
      : status === 'inactive'
      ? Math.floor(Math.random() * 3)
      : Math.floor(Math.random() * 20) + 1;
    
    const completedOrders = Math.floor(totalOrders * (0.7 + Math.random() * 0.25));
    const cancelledOrders = totalOrders - completedOrders;
    
    const averageOrderValue = Math.floor(Math.random() * 40000) + 5000;
    const totalSpent = completedOrders * averageOrderValue;

    const buyer: Buyer = {
      id: `buy_${String(i + 1).padStart(3, '0')}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+919${String(Math.floor(Math.random() * 100000000)).padStart(9, '0')}`,
      type,
      primaryLocation: location,
      status,
      registeredAt,
      lastActiveAt: randomDate(lastActiveDaysAgo),
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalSpent,
      averageOrderValue,
      notes: Math.random() > 0.7 ? 'Regular customer, prefers morning deliveries' : undefined,
    };

    buyers.push(buyer);
  }

  return buyers;
}