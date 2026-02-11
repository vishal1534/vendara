import type { SupportTicket, SupportTicketReply, FAQ } from '../types/support';
import {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../types/support';

/**
 * Mock Support Tickets
 */
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket_001',
    ticketNumber: 'SUP-1245',
    category: SupportTicketCategory.PAYMENT_ISSUE,
    priority: SupportTicketPriority.HIGH,
    status: SupportTicketStatus.IN_PROGRESS,
    subject: 'Payment not received for completed order',
    description: 'I completed order ORD-1246 on January 5th and marked it as complete. The settlement shows as "Processing" but it has been 3 days. When will I receive payment?',
    orderId: 'order_03HQKZX8Y9Z1A2B3C4D5E6F7H0',
    orderNumber: 'ORD-1246',
    settlementId: 'ST-2026-002',
    replies: [
      {
        id: 'reply_001',
        ticketId: 'ticket_001',
        message: 'Thank you for contacting Vendara support. I can see that settlement ST-2026-002 is currently being processed. As per our payment terms, settlements are processed within 7 business days of order completion. Your order was completed on January 5th, so payment should be credited by January 14th. I\'ve escalated this to our finance team for priority processing.',
        isVendorReply: false,
        authorName: 'Priya Sharma (Support)',
        createdAt: '2026-01-07T10:30:00Z',
      },
      {
        id: 'reply_002',
        ticketId: 'ticket_001',
        message: 'Thank you for the update. I appreciate the escalation. Please let me know once the payment is processed.',
        isVendorReply: true,
        authorName: 'Kumar (Vendor)',
        createdAt: '2026-01-07T14:15:00Z',
      },
    ],
    createdAt: '2026-01-07T09:00:00Z',
    updatedAt: '2026-01-07T14:15:00Z',
    assignedTo: 'Priya Sharma',
  },
  
  {
    id: 'ticket_002',
    ticketNumber: 'SUP-1243',
    category: SupportTicketCategory.ORDER_ISSUE,
    priority: SupportTicketPriority.URGENT,
    status: SupportTicketStatus.RESOLVED,
    subject: 'Buyer did not pick up order - what should I do?',
    description: 'I accepted order ORD-1248 and prepared 10 bags of cement. Marked it as ready at 2 PM. The buyer was supposed to pick up by 4 PM but never showed up. I called the number but no response. What is the next step?',
    orderId: 'order_01HQKZX8Y9Z1A2B3C4D5E6F7G8',
    orderNumber: 'ORD-1248',
    replies: [
      {
        id: 'reply_003',
        ticketId: 'ticket_002',
        message: 'I understand this is frustrating. Our team has contacted the buyer and they confirmed they will pick up the order by 6 PM today. They apologize for the delay - there was a vehicle breakdown. As per our vendor protection policy, if the buyer does not pick up within 24 hours of ready time, you can mark the order as cancelled and receive 50% cancellation fees. Thank you for your patience.',
        isVendorReply: false,
        authorName: 'Vishal Chauhan (Support)',
        createdAt: '2026-01-06T16:30:00Z',
      },
      {
        id: 'reply_004',
        ticketId: 'ticket_002',
        message: 'The buyer picked up the order at 5:45 PM. All good now. Thanks for the quick response!',
        isVendorReply: true,
        authorName: 'Kumar (Vendor)',
        createdAt: '2026-01-06T18:00:00Z',
      },
    ],
    createdAt: '2026-01-06T16:15:00Z',
    updatedAt: '2026-01-06T18:00:00Z',
    resolvedAt: '2026-01-06T18:00:00Z',
    assignedTo: 'Vishal Chauhan',
    resolution: 'Buyer picked up the order after a delay. No further action needed.',
  },
  
  {
    id: 'ticket_003',
    ticketNumber: 'SUP-1240',
    category: SupportTicketCategory.CATALOG_UPDATE,
    priority: SupportTicketPriority.MEDIUM,
    status: SupportTicketStatus.RESOLVED,
    subject: 'Add new item to my catalog - Ambuja Cement',
    description: 'I want to add Ambuja Cement 43 Grade (50kg bags) to my catalog. I can supply this at competitive prices. How do I add this item?',
    replies: [
      {
        id: 'reply_005',
        ticketId: 'ticket_003',
        message: 'Thank you for your interest in expanding your catalog. To add Ambuja Cement 43 Grade, I need the following information:\n\n1. Your selling price per bag (base price to Vendara)\n2. Current stock availability\n3. Lead time for procurement if out of stock\n4. Any quality certifications\n\nOnce you provide these details, I will add the item to your catalog within 24 hours.',
        isVendorReply: false,
        authorName: 'Priya Sharma (Support)',
        createdAt: '2026-01-04T11:00:00Z',
      },
      {
        id: 'reply_006',
        ticketId: 'ticket_003',
        message: 'Here are the details:\n1. ₹310 per bag\n2. 200 bags in stock\n3. Can procure within 2 days if needed\n4. I have ISI certification',
        isVendorReply: true,
        authorName: 'Kumar (Vendor)',
        createdAt: '2026-01-04T14:30:00Z',
      },
      {
        id: 'reply_007',
        ticketId: 'ticket_003',
        message: 'Perfect! I have added Ambuja Cement 43 Grade to your catalog. You should see it in your catalog page now. The item is marked as active and buyers in your service area will be able to see it.',
        isVendorReply: false,
        authorName: 'Priya Sharma (Support)',
        createdAt: '2026-01-05T09:00:00Z',
      },
    ],
    createdAt: '2026-01-04T10:45:00Z',
    updatedAt: '2026-01-05T09:00:00Z',
    resolvedAt: '2026-01-05T09:00:00Z',
    assignedTo: 'Priya Sharma',
    resolution: 'Ambuja Cement 43 Grade added to vendor catalog.',
  },
  
  {
    id: 'ticket_004',
    ticketNumber: 'SUP-1238',
    category: SupportTicketCategory.TECHNICAL_ISSUE,
    priority: SupportTicketPriority.LOW,
    status: SupportTicketStatus.CLOSED,
    subject: 'Cannot login to vendor portal',
    description: 'I am getting "Invalid credentials" error when trying to login even though I am using the correct phone number and password.',
    replies: [
      {
        id: 'reply_008',
        ticketId: 'ticket_004',
        message: 'I can see your account is active. The issue was that you were using an old password. I have sent a password reset link to your registered phone number via SMS. Please use that to reset your password and try logging in again.',
        isVendorReply: false,
        authorName: 'Tech Support',
        createdAt: '2026-01-03T15:30:00Z',
      },
      {
        id: 'reply_009',
        ticketId: 'ticket_004',
        message: 'I reset the password and I can login now. Thank you!',
        isVendorReply: true,
        authorName: 'Kumar (Vendor)',
        createdAt: '2026-01-03T16:00:00Z',
      },
    ],
    createdAt: '2026-01-03T15:00:00Z',
    updatedAt: '2026-01-03T16:00:00Z',
    resolvedAt: '2026-01-03T16:00:00Z',
    closedAt: '2026-01-03T16:00:00Z',
    assignedTo: 'Tech Support',
    resolution: 'Password reset link sent. Vendor able to login successfully.',
  },
];

/**
 * Mock FAQs
 */
export const mockFAQs: FAQ[] = [
  {
    id: 'faq_001',
    category: 'Orders',
    question: 'How long do I have to accept or reject an order request?',
    answer: 'You have 15 minutes to respond to an order request. If you do not accept or reject within this time, the order will automatically expire and be offered to another vendor. We recommend keeping the vendor portal open or enabling notifications to respond quickly.',
    helpful: 45,
    views: 120,
    relatedLinks: [
      { label: 'View Orders', url: '/vendor/orders' },
    ],
  },
  {
    id: 'faq_002',
    category: 'Orders',
    question: 'What happens if I accept an order but cannot fulfill it?',
    answer: 'If you accept an order but cannot fulfill it due to stock unavailability or other reasons, please contact support immediately via the Help section. Repeated cancellations after acceptance will negatively impact your vendor rating and may lead to account suspension. Only accept orders you can confidently fulfill.',
    helpful: 38,
    views: 95,
  },
  {
    id: 'faq_003',
    category: 'Payments',
    question: 'When will I receive payment for completed orders?',
    answer: 'Payments are processed within 7 business days of marking an order as complete. Settlements are grouped weekly and transferred to your registered bank account. You can track all settlements in the Payouts section of the portal.',
    helpful: 67,
    views: 180,
    relatedLinks: [
      { label: 'View Payouts', url: '/vendor/payouts' },
    ],
  },
  {
    id: 'faq_004',
    category: 'Payments',
    question: 'How is my payout calculated?',
    answer: 'Your payout is calculated as: Base Price (your catalog price) minus Vendara Commission (15-18% depending on category and volume). The exact breakdown is shown in each order details page. Higher order volumes may qualify you for reduced commission rates.',
    helpful: 52,
    views: 145,
  },
  {
    id: 'faq_005',
    category: 'Catalog',
    question: 'How do I add new items to my catalog?',
    answer: 'To add new items, create a support ticket under "Catalog Update Request" with details about the item, your pricing, stock availability, and any certifications. Our team will review and add the item within 24 hours if approved. Not all items can be added - they must meet Vendara quality standards.',
    helpful: 29,
    views: 75,
    relatedLinks: [
      { label: 'View Catalog', url: '/vendor/catalog' },
      { label: 'Create Ticket', url: '/vendor/support' },
    ],
  },
  {
    id: 'faq_006',
    category: 'Catalog',
    question: 'Can I change prices for items in my catalog?',
    answer: 'Yes, you can request price changes by creating a support ticket. Price changes are reviewed by our pricing team and typically processed within 48 hours. Frequent price changes may be rejected to maintain pricing stability for buyers.',
    helpful: 41,
    views: 110,
  },
  {
    id: 'faq_007',
    category: 'Performance',
    question: 'How is my vendor rating calculated?',
    answer: 'Your rating is based on: Order Acceptance Rate (30%), Response Time (25%), Order Fulfillment Rate (25%), Buyer Ratings (15%), and Delivery Timeliness (5%). Maintaining high ratings gives you priority for order offers and access to premium buyers.',
    helpful: 58,
    views: 160,
    relatedLinks: [
      { label: 'View Performance', url: '/vendor/performance' },
    ],
  },
  {
    id: 'faq_008',
    category: 'Account',
    question: 'How do I update my business details or bank account?',
    answer: 'You can update most business details in the Settings page. For bank account changes, you need to create a support ticket with supporting documents (cancelled cheque or bank statement) for verification. Bank account changes are processed within 3-5 business days.',
    helpful: 33,
    views: 88,
    relatedLinks: [
      { label: 'Settings', url: '/vendor/settings' },
    ],
  },
  {
    id: 'faq_009',
    category: 'Technical',
    question: 'I am not receiving order notifications. What should I do?',
    answer: 'First, check your notification settings in the Settings page. Make sure your phone number is correct and you have enabled notifications. If issues persist, try logging out and logging back in. For continued issues, create a technical support ticket.',
    helpful: 25,
    views: 65,
  },
  {
    id: 'faq_010',
    category: 'Delivery',
    question: 'What if the buyer does not pick up the order on time?',
    answer: 'If a buyer does not pick up a ready order within 24 hours of the scheduled time, you can mark the order as cancelled and receive 50% cancellation fees as compensation. Always contact support before cancelling to ensure proper documentation.',
    helpful: 44,
    views: 98,
  },
];

/**
 * Helper functions
 */
export function getTicketsByStatus(status: SupportTicketStatus): SupportTicket[] {
  return mockSupportTickets.filter(t => t.status === status);
}

export function getOpenTicketsCount(): number {
  return mockSupportTickets.filter(
    t => t.status === SupportTicketStatus.OPEN || t.status === SupportTicketStatus.IN_PROGRESS
  ).length;
}

export function getFAQsByCategory(category: string): FAQ[] {
  return mockFAQs.filter(f => f.category === category);
}
