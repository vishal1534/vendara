import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockSupportTickets, mockFAQs } from '../mocks/support.mock';
import type { SupportTicket, FAQ } from '../types/support';
import { SupportTicketCategory, SupportTicketPriority, SupportTicketStatus } from '../types/support';

interface CreateTicketInput {
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  subject: string;
  description: string;
  orderId?: string;
  orderNumber?: string;
  settlementId?: string;
}

interface VendorSupportContextType {
  tickets: SupportTicket[];
  faqs: FAQ[];
  openTicketsCount: number;
  createTicket: (input: CreateTicketInput) => Promise<{ success: boolean; ticketId?: string; error?: string }>;
  getTicketById: (ticketId: string) => SupportTicket | undefined;
  getTicketsByStatus: (status: SupportTicketStatus) => SupportTicket[];
  addReply: (ticketId: string, message: string) => Promise<{ success: boolean; error?: string }>;
}

const VendorSupportContext = createContext<VendorSupportContextType | undefined>(undefined);

export function VendorSupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [faqs] = useState<FAQ[]>(mockFAQs);

  const openTicketsCount = tickets.filter(
    t => t.status === SupportTicketStatus.OPEN || t.status === SupportTicketStatus.IN_PROGRESS
  ).length;

  const createTicket = async (input: CreateTicketInput): Promise<{ success: boolean; ticketId?: string; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate ticket number
      const ticketNumber = `SUP-${1250 + tickets.length}`;
      const newTicketId = `ticket_${Date.now()}`;

      const newTicket: SupportTicket = {
        id: newTicketId,
        ticketNumber,
        category: input.category,
        priority: input.priority,
        status: SupportTicketStatus.OPEN,
        subject: input.subject,
        description: input.description,
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        settlementId: input.settlementId,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTickets(prev => [newTicket, ...prev]);

      return { success: true, ticketId: newTicketId };
    } catch (error) {
      return { success: false, error: 'Failed to create support ticket. Please try again.' };
    }
  };

  const addReply = async (ticketId: string, message: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        return { success: false, error: 'Ticket not found' };
      }

      const newReply = {
        id: `reply_${Date.now()}`,
        ticketId,
        message,
        isVendorReply: true,
        authorName: 'Kumar (Vendor)',
        createdAt: new Date().toISOString(),
      };

      setTickets(prev =>
        prev.map(t =>
          t.id === ticketId
            ? {
                ...t,
                replies: [...(t.replies || []), newReply],
                updatedAt: new Date().toISOString(),
                status: SupportTicketStatus.IN_PROGRESS,
              }
            : t
        )
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to add reply. Please try again.' };
    }
  };

  const getTicketById = (ticketId: string): SupportTicket | undefined => {
    return tickets.find(t => t.id === ticketId);
  };

  const getTicketsByStatus = (status: SupportTicketStatus): SupportTicket[] => {
    return tickets.filter(t => t.status === status);
  };

  const value: VendorSupportContextType = {
    tickets,
    faqs,
    openTicketsCount,
    createTicket,
    getTicketById,
    getTicketsByStatus,
    addReply,
  };

  return (
    <VendorSupportContext.Provider value={value}>
      {children}
    </VendorSupportContext.Provider>
  );
}

export function useVendorSupport() {
  const context = useContext(VendorSupportContext);
  if (context === undefined) {
    throw new Error('useVendorSupport must be used within a VendorSupportProvider');
  }
  return context;
}
