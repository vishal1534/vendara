/**
 * Vendor Support & Help System Types
 * Defines the structure for support tickets, FAQs, and help resources
 */

export enum SupportTicketCategory {
  ORDER_ISSUE = 'ORDER_ISSUE',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  ACCOUNT_ISSUE = 'ACCOUNT_ISSUE',
  CATALOG_UPDATE = 'CATALOG_UPDATE',
  DELIVERY_ISSUE = 'DELIVERY_ISSUE',
  GENERAL_INQUIRY = 'GENERAL_INQUIRY',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
}

export enum SupportTicketPriority {
  URGENT = 'URGENT',       // Blocking business operations
  HIGH = 'HIGH',           // Significant impact
  MEDIUM = 'MEDIUM',       // Moderate impact
  LOW = 'LOW',             // Minor issue or inquiry
}

export enum SupportTicketStatus {
  OPEN = 'OPEN',                 // Just created
  IN_PROGRESS = 'IN_PROGRESS',   // Support team working on it
  WAITING_VENDOR = 'WAITING_VENDOR', // Waiting for vendor response
  RESOLVED = 'RESOLVED',         // Issue resolved
  CLOSED = 'CLOSED',             // Ticket closed
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  
  // Related entities
  orderId?: string;
  orderNumber?: string;
  settlementId?: string;
  
  // Attachments
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  
  // Communication
  replies?: SupportTicketReply[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  
  // Assignment
  assignedTo?: string;
  
  // Resolution
  resolution?: string;
}

export interface SupportTicketReply {
  id: string;
  ticketId: string;
  message: string;
  isVendorReply: boolean;
  authorName: string;
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  views: number;
  relatedLinks?: {
    label: string;
    url: string;
  }[];
}

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const SUPPORT_CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  [SupportTicketCategory.ORDER_ISSUE]: 'Order Issue',
  [SupportTicketCategory.PAYMENT_ISSUE]: 'Payment/Payout Issue',
  [SupportTicketCategory.TECHNICAL_ISSUE]: 'Technical Problem',
  [SupportTicketCategory.ACCOUNT_ISSUE]: 'Account/Profile Issue',
  [SupportTicketCategory.CATALOG_UPDATE]: 'Catalog Update Request',
  [SupportTicketCategory.DELIVERY_ISSUE]: 'Delivery Issue',
  [SupportTicketCategory.GENERAL_INQUIRY]: 'General Question',
  [SupportTicketCategory.FEATURE_REQUEST]: 'Feature Request',
};

export const SUPPORT_PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  [SupportTicketPriority.URGENT]: 'Urgent - Blocking Operations',
  [SupportTicketPriority.HIGH]: 'High - Significant Impact',
  [SupportTicketPriority.MEDIUM]: 'Medium - Moderate Impact',
  [SupportTicketPriority.LOW]: 'Low - Minor Issue',
};
