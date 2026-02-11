/**
 * Mock Support Tickets Data Generator
 * Generates large datasets for testing pagination
 */

import { SupportTicket, TicketStatus, TicketPriority, TicketCategory } from '../types/support';

const subjects = [
  'Order delivery delayed by 2 days',
  'Wrong items delivered in my order',
  'Payment not reflecting after UPI transfer',
  'Workers did not show up for work',
  'Damaged cement bags received',
  'Need to modify delivery address',
  'Quality issue with TMT steel bars',
  'Vendor charging extra for delivery',
  'Unable to track my order',
  'Request for invoice correction',
  'Refund not processed after cancellation',
  'Late delivery fee dispute',
  'Material quantity mismatch',
  'Labor workers left job incomplete',
  'Platform fee calculation query',
  'Account verification pending',
  'Password reset not working',
  'Order confirmation not received',
  'Duplicate payment charged',
  'Vendor contact not responding',
];

const firstNames = [
  'Ramesh', 'Suresh', 'Venkat', 'Lakshmi', 'Prakash', 'Hari', 'Anjali', 'Sanjay',
  'Priya', 'Karthik', 'Deepak', 'Meena', 'Vijay', 'Sita', 'Ravi'
];

const lastNames = [
  'Kumar', 'Reddy', 'Rao', 'Devi', 'Sharma', 'Krishna', 'Mehta', 'Patel',
  'Nair', 'Raj', 'Singh', 'Gupta'
];

const statuses: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
const categories: TicketCategory[] = [
  'order_issue',
  'payment_issue',
  'delivery_issue',
  'product_quality',
  'vendor_issue',
  'account_issue',
  'technical_issue',
  'other',
];

const teamMembers = [
  { id: 'team_001', name: 'Support Team A' },
  { id: 'team_002', name: 'Support Team B' },
  { id: 'team_003', name: 'Support Team C' },
  { id: 'team_004', name: 'Support Team D' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

export function generateMockTickets(count: number = 150): SupportTicket[] {
  const tickets: SupportTicket[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const requesterName = `${firstName} ${lastName}`;
    const status = randomItem(statuses);
    const priority = randomItem(priorities);
    const category = randomItem(categories);
    const createdAt = randomDate(60);
    const messageCount = Math.floor(Math.random() * 15) + 1;
    const unreadMessages = status === 'open' || status === 'in_progress' ? Math.floor(Math.random() * 3) : 0;
    
    // Assign to team member (80% assigned, 20% unassigned)
    const isAssigned = Math.random() > 0.2;
    const assignedMember = isAssigned ? randomItem(teamMembers) : null;
    
    // Calculate SLA based on priority
    const slaHours = priority === 'urgent' ? 4 : priority === 'high' ? 8 : priority === 'medium' ? 24 : 48;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    const hoursUntilDue = slaHours - hoursElapsed;
    const isResolutionBreached = hoursUntilDue < 0 && (status === 'open' || status === 'in_progress');
    const isFirstResponseBreached = hoursUntilDue < -2 && status === 'open';

    const ticket: SupportTicket = {
      id: `ticket_${String(i + 1).padStart(3, '0')}`,
      ticketNumber: `TKT-${String(10000 + i + 1)}`,
      status,
      priority,
      category,
      subject: randomItem(subjects),
      description: `Customer reported: ${randomItem(subjects).toLowerCase()}. Additional details provided in follow-up messages.`,
      source: Math.random() > 0.5 ? 'buyer' : 'vendor',
      requesterId: `user_${String(i + 1).padStart(3, '0')}`,
      requesterName,
      requesterEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      requesterPhone: `+919${String(Math.floor(Math.random() * 100000000)).padStart(9, '0')}`,
      orderNumber: Math.random() > 0.3 ? `RS2024${String(Math.floor(Math.random() * 10000) + 1000).padStart(6, '0')}` : undefined,
      assignedTo: assignedMember?.name,
      assignedToId: assignedMember?.id,
      assignedAt: assignedMember ? new Date(createdDate.getTime() + Math.random() * 3600000).toISOString() : undefined,
      messageCount,
      unreadMessages,
      lastMessageBy: unreadMessages > 0 ? 'customer' : (Math.random() > 0.5 ? 'customer' : 'support'),
      lastMessageAt: new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt,
      updatedAt: new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: status === 'resolved' || status === 'closed' ? new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      closedAt: status === 'closed' ? new Date(createdDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      sla: {
        firstResponseTime: Math.floor(Math.random() * 120) + 15,
        resolutionTime: status === 'resolved' || status === 'closed' ? Math.floor(Math.random() * 48) + 2 : undefined,
        hoursUntilDue: Math.round(hoursUntilDue * 10) / 10,
        isFirstResponseBreached,
        isResolutionBreached,
      },
      tags: Math.random() > 0.5 ? [randomItem(['urgent', 'vip', 'escalated', 'follow-up'])] : [],
    };

    tickets.push(ticket);
  }

  return tickets;
}
