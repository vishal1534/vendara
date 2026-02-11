/**
 * Support Ticket Types for Admin Portal
 */

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory = 
  | 'order_issue'
  | 'payment_issue'
  | 'delivery_issue'
  | 'product_quality'
  | 'vendor_issue'
  | 'account_issue'
  | 'technical_issue'
  | 'other';

export type TicketSource = 'buyer' | 'vendor';

export type MessageType = 'customer' | 'admin' | 'system' | 'internal_note';

// Team member for assignment
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  activeTickets: number;
}

// Ticket message/conversation
export interface TicketMessage {
  id: string;
  ticketId: string;
  type: MessageType;
  sender: string;
  senderRole: 'buyer' | 'vendor' | 'admin' | 'system';
  message: string;
  timestamp: string;
  attachments?: string[];
  mentions?: string[]; // For @mentions in internal notes
}

// Canned response template
export interface CannedResponse {
  id: string;
  title: string;
  category: string;
  message: string;
  tags?: string[];
}

// SLA tracking
export interface SLATracking {
  firstResponseDue: string;
  firstResponseAt?: string;
  resolutionDue: string;
  isFirstResponseBreached: boolean;
  isResolutionBreached: boolean;
  hoursUntilDue: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  
  // Requester Info
  source: TicketSource;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string;
  
  // Ticket Details
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  
  // Related Entities
  orderId?: string;
  orderNumber?: string;
  vendorId?: string;
  vendorName?: string;
  
  // Assignment & Resolution
  assignedTo?: string;
  assignedToId?: string;
  assignedAt?: string;
  resolution?: string;
  resolvedAt?: string;
  
  // SLA Tracking
  sla: SLATracking;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
  closedAt?: string;
  
  // Conversation
  messageCount: number;
  unreadMessages: number;
  lastMessageAt: string;
  lastMessageBy: 'customer' | 'admin';
  
  // Additional
  attachments?: string[];
  tags?: string[];
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  unassigned: number;
  avgResolutionTime: number; // in hours
  avgFirstResponseTime: number; // in hours
  resolutionRate: number; // percentage
  slaBreached: number;
  highPriority: number;
  customerSatisfaction?: number; // CSAT score
}