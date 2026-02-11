/**
 * Mock Admin Users for Development
 */

import { Admin } from '../types/admin';

export const mockAdmins: Admin[] = [
  {
    id: 'admin_001',
    name: 'Vishal Chauhan',
    email: 'admin@realserv.com',
    role: 'super_admin',
    permissions: ['*'], // All permissions
  },
  {
    id: 'admin_002',
    name: 'Priya Sharma',
    email: 'ops@realserv.com',
    role: 'operations',
    permissions: [
      'vendors.view',
      'vendors.approve',
      'vendors.suspend',
      'orders.view',
      'orders.update',
      'orders.assign',
      'buyers.view',
      'catalog.view',
      'catalog.update',
      'settlements.view',
      'settlements.process',
      'reports.view',
    ],
  },
  {
    id: 'admin_003',
    name: 'Amit Patel',
    email: 'support@realserv.com',
    role: 'support',
    permissions: [
      'vendors.view',
      'orders.view',
      'orders.update',
      'buyers.view',
      'support.view',
      'support.respond',
      'refunds.process_small', // Up to ₹2000
    ],
  },
];

// Mock credentials for demo (email: password)
export const mockCredentials: Record<string, string> = {
  'admin@realserv.com': 'Admin@123',
  'ops@realserv.com': 'Ops@123',
  'support@realserv.com': 'Support@123',
};
