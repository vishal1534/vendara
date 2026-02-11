/**
 * Mock Support Ticket Data for Admin Portal
 */

import { 
  SupportTicket, 
  TicketStats, 
  TeamMember, 
  TicketMessage, 
  CannedResponse 
} from '../types/support';
import { generateMockTickets } from './mockTicketsGenerator';

// Generate 150 mock tickets for testing pagination
export const mockTickets: SupportTicket[] = generateMockTickets(150);

// Team members for assignment
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team_001',
    name: 'Priya Sharma',
    role: 'Senior Support',
    isOnline: true,
    activeTickets: 8,
  },
  {
    id: 'team_002',
    name: 'Ravi Kumar',
    role: 'Operations Lead',
    isOnline: true,
    activeTickets: 5,
  },
  {
    id: 'team_003',
    name: 'Anjali Patel',
    role: 'Support Specialist',
    isOnline: false,
    activeTickets: 12,
  },
  {
    id: 'team_004',
    name: 'Vikram Singh',
    role: 'Finance Team',
    isOnline: true,
    activeTickets: 3,
  },
];

// Canned responses
export const mockCannedResponses: CannedResponse[] = [
  {
    id: 'canned_001',
    title: 'Order Delay - Standard Response',
    category: 'delivery_issue',
    message: 'Thank you for contacting us. We sincerely apologize for the delay in your order delivery. Our operations team is actively tracking your shipment and will provide you with an updated ETA within the next 2 hours. We appreciate your patience.',
    tags: ['delivery', 'delay'],
  },
  {
    id: 'canned_002',
    title: 'Payment Confirmation',
    category: 'payment_issue',
    message: 'We have received your payment inquiry. Our finance team is verifying the transaction details. You will receive a confirmation email within 24 hours. For urgent matters, please call our finance helpline.',
    tags: ['payment', 'settlement'],
  },
  {
    id: 'canned_003',
    title: 'Quality Issue - Replacement',
    category: 'product_quality',
    message: 'We apologize for the quality issue with your order. We are arranging a replacement immediately. Our team will contact you within 4 hours to schedule pickup of the defective items and delivery of replacements.',
    tags: ['quality', 'replacement'],
  },
  {
    id: 'canned_004',
    title: 'Order Modification Request',
    category: 'order_issue',
    message: 'Thank you for your order modification request. If your order is still in "Pending" or "Confirmed" status, we can make the requested changes. Please confirm the modifications you need, and we will update your order immediately.',
    tags: ['order', 'modification'],
  },
  {
    id: 'canned_005',
    title: 'Technical Issue - Escalation',
    category: 'technical_issue',
    message: 'Thank you for reporting this technical issue. Our development team has been notified and is investigating. We will provide you with an update within 24 hours. If this is blocking your work, please let us know for priority handling.',
    tags: ['technical', 'escalation'],
  },
  {
    id: 'canned_006',
    title: 'Vendor Account Support',
    category: 'account_issue',
    message: 'We can help you with your vendor account. For security reasons, account modifications require verification. Please email us from your registered email address with the specific changes needed, along with a copy of your business registration document.',
    tags: ['vendor', 'account'],
  },
];

// Ticket messages (for conversation history)
export const mockTicketMessages: TicketMessage[] = [
  {
    id: 'msg_001',
    ticketId: 'tkt_001',
    type: 'customer',
    sender: 'Ramesh Kumar',
    senderRole: 'buyer',
    message: 'My cement order (20 bags OPC 53) was scheduled for delivery today at 10 AM but has not arrived yet. Construction work is completely stopped. Please expedite delivery urgently.',
    timestamp: '2026-01-10T14:30:00Z',
  },
  {
    id: 'msg_002',
    ticketId: 'tkt_001',
    type: 'internal_note',
    sender: 'Ravi Kumar',
    senderRole: 'admin',
    message: '@Priya Sharma - This is urgent. Customer has 5 workers waiting. Contacted delivery partner - vehicle breakdown. Arranging alternate vehicle.',
    timestamp: '2026-01-10T14:35:00Z',
    mentions: ['team_001'],
  },
  {
    id: 'msg_003',
    ticketId: 'tkt_001',
    type: 'admin',
    sender: 'Ravi Kumar',
    senderRole: 'admin',
    message: 'Dear Ramesh, we sincerely apologize for the delay. Our delivery vehicle had an unexpected breakdown. We have arranged an alternate vehicle and your cement will be delivered by 5 PM today. We are also providing a 10% discount on your next order for this inconvenience.',
    timestamp: '2026-01-10T14:40:00Z',
  },
  {
    id: 'msg_004',
    ticketId: 'tkt_001',
    type: 'customer',
    sender: 'Ramesh Kumar',
    senderRole: 'buyer',
    message: 'Thank you for the quick response. 5 PM works. Please ensure delivery happens as promised.',
    timestamp: '2026-01-10T15:45:00Z',
  },
];

export const mockTicketStats: TicketStats = {
  total: mockTickets.length,
  open: mockTickets.filter(t => t.status === 'open').length,
  inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
  resolved: mockTickets.filter(t => t.status === 'resolved').length,
  closed: mockTickets.filter(t => t.status === 'closed').length,
  unassigned: mockTickets.filter(t => !t.assignedTo).length,
  avgResolutionTime: Math.round(
    mockTickets
      .filter(t => t.sla.resolutionTime)
      .reduce((sum, t) => sum + (t.sla.resolutionTime || 0), 0) /
      mockTickets.filter(t => t.sla.resolutionTime).length * 10
  ) / 10,
  avgFirstResponseTime: Math.round(
    mockTickets.reduce((sum, t) => sum + t.sla.firstResponseTime, 0) / mockTickets.length * 10
  ) / 10,
  resolutionRate: Math.round(
    (mockTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length / mockTickets.length) * 100 * 10
  ) / 10,
  slaBreached: mockTickets.filter(t => t.sla.isResolutionBreached || t.sla.isFirstResponseBreached).length,
  highPriority: mockTickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
  customerSatisfaction: 4.2,
};