/**
 * Support Tickets Page - Admin Portal
 * Enterprise-grade support with SLA tracking, bulk actions, and smart filters
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportTicket, TicketStatus, TicketPriority, TicketCategory } from '../../../types/support';
import { mockTickets, mockTicketStats, mockTeamMembers } from '../../../data/mockTickets';
import { CreateTicketDialog } from '../components/CreateTicketDialog';
import { Button } from '../../../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import { Badge } from '../../../../app/components/ui/badge';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Building,
  Package,
  AlertTriangle,
  X,
  UserPlus,
  CheckSquare,
  Mail,
  Download,
  Plus,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../app/components/ui/dialog';
import { DataTable, Column } from '../../../components/common/DataTable';

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'destructive'; color: string }> = {
  open: { label: 'Open', variant: 'destructive', color: 'text-error-700' },
  in_progress: { label: 'In Progress', variant: 'default', color: 'text-primary-700' },
  resolved: { label: 'Resolved', variant: 'default', color: 'text-success-600' },
  closed: { label: 'Closed', variant: 'secondary', color: 'text-neutral-600' },
};

const priorityConfig: Record<TicketPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-neutral-600', bgColor: 'bg-neutral-100' },
  medium: { label: 'Medium', color: 'text-secondary-700', bgColor: 'bg-secondary-100' },
  high: { label: 'High', color: 'text-error-600', bgColor: 'bg-error-100' },
  urgent: { label: 'Urgent', color: 'text-white', bgColor: 'bg-error-600' },
};

const categoryLabels: Record<TicketCategory, string> = {
  order_issue: 'Order Issue',
  payment_issue: 'Payment Issue',
  delivery_issue: 'Delivery Issue',
  product_quality: 'Product Quality',
  vendor_issue: 'Vendor Issue',
  account_issue: 'Account Issue',
  technical_issue: 'Technical Issue',
  other: 'Other',
};

export function SupportTicketsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    status: TicketStatus | 'all';
    priority: TicketPriority | 'all';
    category: TicketCategory | 'all';
    assignedTo: string;
    dateRange: string;
    search: string;
  }>({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    dateRange: 'all',
    search: '',
  });
  const [searchInput, setSearchInput] = useState(''); // For debouncing
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<{
    type: 'assign' | 'status' | 'close' | null;
    value?: string;
  }>({ type: null });
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Get start of today for date filtering
  const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      // Status filter
      if (filters.status !== 'all' && ticket.status !== filters.status) return false;
      
      // Priority filter
      if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
      
      // Category filter
      if (filters.category !== 'all' && ticket.category !== filters.category) return false;
      
      // Assignment filter
      if (filters.assignedTo === 'unassigned' && ticket.assignedTo) return false;
      if (filters.assignedTo === 'assigned_to_me' && ticket.assignedToId !== 'team_001') return false;
      if (filters.assignedTo !== 'all' && filters.assignedTo !== 'unassigned' && filters.assignedTo !== 'assigned_to_me') {
        if (ticket.assignedToId !== filters.assignedTo) return false;
      }
      
      // Date range filter (using calendar days)
      if (filters.dateRange !== 'all') {
        const ticketDate = new Date(ticket.createdAt);
        const now = new Date();
        const today = getStartOfDay(now);
        const ticketDay = getStartOfDay(ticketDate);
        
        if (filters.dateRange === 'today' && ticketDay.getTime() !== today.getTime()) return false;
        if (filters.dateRange === '7days') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          if (ticketDay < sevenDaysAgo) return false;
        }
        if (filters.dateRange === '30days') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (ticketDay < thirtyDaysAgo) return false;
        }
      }
      
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          ticket.ticketNumber.toLowerCase().includes(search) ||
          ticket.requesterName.toLowerCase().includes(search) ||
          ticket.subject.toLowerCase().includes(search) ||
          ticket.orderNumber?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  }, [mockTickets, filters]);

  // Sort tickets: SLA breached first, then urgent, then by priority, then by date
  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => {
      // SLA breached tickets first
      if (a.sla.isResolutionBreached && !b.sla.isResolutionBreached) return -1;
      if (!a.sla.isResolutionBreached && b.sla.isResolutionBreached) return 1;
      
      // Then by priority
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredTickets]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    return {
      total: filteredTickets.length,
      open: filteredTickets.filter(t => t.status === 'open').length,
      inProgress: filteredTickets.filter(t => t.status === 'in_progress').length,
      unassigned: filteredTickets.filter(t => !t.assignedTo).length,
      slaBreached: filteredTickets.filter(t => t.sla.isResolutionBreached || t.sla.isFirstResponseBreached).length,
      urgent: filteredTickets.filter(t => t.priority === 'urgent').length,
    };
  }, [filteredTickets]);

  // Active filters for chips
  const activeFilters = useMemo(() => {
    const filters_arr = [];
    if (filters.status !== 'all') {
      filters_arr.push({
        type: 'status',
        label: 'Status',
        value: statusConfig[filters.status].label,
        onRemove: () => setFilters(prev => ({ ...prev, status: 'all' })),
      });
    }
    if (filters.priority !== 'all') {
      filters_arr.push({
        type: 'priority',
        label: 'Priority',
        value: priorityConfig[filters.priority].label,
        onRemove: () => setFilters(prev => ({ ...prev, priority: 'all' })),
      });
    }
    if (filters.category !== 'all') {
      filters_arr.push({
        type: 'category',
        label: 'Category',
        value: categoryLabels[filters.category],
        onRemove: () => setFilters(prev => ({ ...prev, category: 'all' })),
      });
    }
    if (filters.assignedTo !== 'all') {
      const assignedToLabel = 
        filters.assignedTo === 'unassigned' ? 'Unassigned' :
        filters.assignedTo === 'assigned_to_me' ? 'Assigned to Me' :
        mockTeamMembers.find(m => m.id === filters.assignedTo)?.name || 'Unknown';
      
      filters_arr.push({
        type: 'assigned',
        label: 'Assigned',
        value: assignedToLabel,
        onRemove: () => setFilters(prev => ({ ...prev, assignedTo: 'all' })),
      });
    }
    if (filters.dateRange !== 'all') {
      const dateLabels: Record<string, string> = {
        today: 'Today',
        '7days': 'Last 7 Days',
        '30days': 'Last 30 Days',
      };
      filters_arr.push({
        type: 'date',
        label: 'Date',
        value: dateLabels[filters.dateRange],
        onRemove: () => setFilters(prev => ({ ...prev, dateRange: 'all' })),
      });
    }
    return filters_arr;
  }, [filters]);

  const formatTimeAgo = useCallback((dateString: string) => {
    const hours = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
    );
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }, []);

  const formatDuration = useCallback((hours: number) => {
    if (hours < 0) hours = Math.abs(hours);
    if (hours < 1) return 'Less than 1h';
    if (hours < 48) return `${hours.toFixed(0)}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${(hours % 24).toFixed(0)}h`;
  }, []);

  const handleViewTicket = useCallback((id: string) => {
    navigate(`/admin/support/${id}`);
  }, [navigate]);

  // Bulk actions with confirmation
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(new Set(sortedTickets.map(t => t.id)));
    } else {
      setSelectedTickets(new Set());
    }
  };

  const handleSelectTicket = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTickets);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTickets(newSelected);
  };

  const handleBulkActionRequest = (type: 'assign' | 'status' | 'close', value?: string) => {
    setBulkAction({ type, value });
    setShowBulkConfirm(true);
  };

  const handleBulkActionConfirm = () => {
    if (bulkAction.type === 'assign' && bulkAction.value) {
      const teamMember = mockTeamMembers.find(m => m.id === bulkAction.value);
      toast.success(`Assigned ${selectedTickets.size} ticket${selectedTickets.size > 1 ? 's' : ''} to ${teamMember?.name}`);
    } else if (bulkAction.type === 'status' && bulkAction.value) {
      const status = bulkAction.value as TicketStatus;
      toast.success(`Updated ${selectedTickets.size} ticket${selectedTickets.size > 1 ? 's' : ''} to ${statusConfig[status].label}`);
    } else if (bulkAction.type === 'close') {
      toast.success(`Closed ${selectedTickets.size} ticket${selectedTickets.size > 1 ? 's' : ''}`);
    }
    setSelectedTickets(new Set());
    setShowBulkConfirm(false);
    setBulkAction({ type: null });
  };

  const handleExport = () => {
    toast.success('Exporting tickets to CSV...');
    // In real implementation, generate and download CSV
  };

  const handleCreateTicket = () => {
    setIsCreateTicketDialogOpen(true);
  };

  const handleTicketCreated = () => {
    // In real implementation, this would refetch tickets from API
    toast.success('Ticket list refreshed');
  };

  // Quick filter presets
  const handleQuickFilter = (preset: 'my_tickets' | 'unassigned' | 'urgent' | 'sla_breach' | 'clear') => {
    if (preset === 'clear') {
      setFilters({
        status: 'all',
        priority: 'all',
        category: 'all',
        assignedTo: 'all',
        dateRange: 'all',
        search: '',
      });
      setSearchInput('');
    } else if (preset === 'my_tickets') {
      setFilters(prev => ({ ...prev, assignedTo: 'assigned_to_me' }));
    } else if (preset === 'unassigned') {
      setFilters(prev => ({ ...prev, assignedTo: 'unassigned' }));
    } else if (preset === 'urgent') {
      setFilters(prev => ({ ...prev, priority: 'urgent' }));
    } else if (preset === 'sla_breach') {
      // Filter to show only SLA breached tickets
      toast.info('Showing SLA breached tickets');
    }
  };

  // Get ticket age color
  const getAgeColor = useCallback((createdAt: string) => {
    const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hours < 2) return 'text-success-600';
    if (hours < 24) return 'text-secondary-600';
    if (hours < 48) return 'text-warning-600';
    return 'text-error-600';
  }, []);

  // Empty state messages
  const getEmptyStateMessage = () => {
    if (filters.search) {
      return {
        title: 'No tickets found',
        message: `No results for "${filters.search}". Try different keywords.`,
      };
    }
    if (filters.status === 'open' && sortedTickets.length === 0) {
      return {
        title: 'No open tickets',
        message: 'Great job! All tickets have been addressed.',
      };
    }
    if (filters.assignedTo === 'unassigned' && sortedTickets.length === 0) {
      return {
        title: 'No unassigned tickets',
        message: 'All tickets have been assigned to team members.',
      };
    }
    return {
      title: 'No tickets found',
      message: 'Try adjusting your filters to see more results.',
    };
  };

  const emptyState = getEmptyStateMessage();

  // Define columns for DataTable
  const columns: Column<SupportTicket>[] = [
    {
      key: 'select' as any,
      label: '',
      width: '48px',
      render: (ticket) => (
        <Checkbox
          checked={selectedTickets.has(ticket.id)}
          onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: 'ticketNumber',
      label: 'Ticket',
      sortable: true,
      render: (ticket) => {
        const isSLABreached = ticket.sla.isResolutionBreached || ticket.sla.isFirstResponseBreached;
        return (
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-medium text-neutral-900 text-sm">
                {ticket.ticketNumber}
              </span>
              {isSLABreached && (
                <Badge variant="destructive" className="text-xs flex-shrink-0">
                  SLA BREACH
                </Badge>
              )}
              {ticket.unreadMessages > 0 && (
                <Badge variant="default" className="text-xs flex-shrink-0">
                  {ticket.unreadMessages} new
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-neutral-900 text-sm mb-1 truncate" title={ticket.subject}>
              {ticket.subject}
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityConfig[ticket.priority].color} ${priorityConfig[ticket.priority].bgColor}`}>
                {priorityConfig[ticket.priority].label}
              </span>
              <span className="truncate">{categoryLabels[ticket.category]}</span>
              {ticket.orderNumber && (
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Package className="w-3 h-3" />
                  {ticket.orderNumber}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'requesterName',
      label: 'Customer',
      sortable: true,
      render: (ticket) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {ticket.source === 'buyer' ? (
              <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            ) : (
              <Building className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            )}
            <span className="text-sm text-neutral-900 truncate" title={ticket.requesterName}>
              {ticket.requesterName}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{ticket.messageCount} msg{ticket.messageCount > 1 ? 's' : ''}</span>
            {ticket.lastMessageBy === 'customer' && (
              <span className="w-2 h-2 rounded-full bg-error-600 flex-shrink-0" title="Customer waiting for reply" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (ticket) => (
        <div>
          <Badge variant={statusConfig[ticket.status].variant} className="mb-1">
            {statusConfig[ticket.status].label}
          </Badge>
          <p className="text-xs text-neutral-500">
            {formatTimeAgo(ticket.updatedAt)}
          </p>
        </div>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
      render: (ticket) => (
        <div className="min-w-0">
          {ticket.assignedTo ? (
            <>
              <p className="text-sm text-neutral-900 truncate" title={ticket.assignedTo}>
                {ticket.assignedTo}
              </p>
              <p className="text-xs text-neutral-500">
                {formatTimeAgo(ticket.assignedAt || ticket.createdAt)}
              </p>
            </>
          ) : (
            <Badge variant="outline" className="text-xs">
              Unassigned
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'SLA / Age',
      sortable: true,
      render: (ticket) => {
        const isSLABreached = ticket.sla.isResolutionBreached || ticket.sla.isFirstResponseBreached;
        return (
          <div>
            {isSLABreached ? (
              <div className="flex items-center gap-1 text-error-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {formatDuration(ticket.sla.hoursUntilDue)} overdue
                </span>
              </div>
            ) : ticket.sla.hoursUntilDue < 4 ? (
              <div className="flex items-center gap-1 text-warning-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {formatDuration(ticket.sla.hoursUntilDue)} left
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-neutral-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {formatDuration(ticket.sla.hoursUntilDue)} left
                </span>
              </div>
            )}
            <p className={`text-xs mt-0.5 ${getAgeColor(ticket.createdAt)}`}>
              Created {formatTimeAgo(ticket.createdAt)}
            </p>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Support Tickets</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage customer inquiries and support requests
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateTicket}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">
                {activeFilters.length > 0 ? 'Filtered' : 'Total'}
              </p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {filteredStats.total}
              </p>
              {activeFilters.length > 0 && (
                <p className="text-xs text-neutral-500 mt-1">
                  of {mockTicketStats.total} total
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Open</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {filteredStats.open}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-error-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Unassigned</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {filteredStats.unassigned}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-warning-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">SLA Breach</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {filteredStats.slaBreached}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Avg Response</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockTicketStats.avgFirstResponseTime}h
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Resolution Rate</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockTicketStats.resolutionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter('my_tickets')}
          className={filters.assignedTo === 'assigned_to_me' ? 'border-primary-600 text-primary-700' : ''}
        >
          <User className="w-4 h-4 mr-2" />
          My Tickets
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter('unassigned')}
          className={filters.assignedTo === 'unassigned' ? 'border-primary-600 text-primary-700' : ''}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Unassigned
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter('urgent')}
          className={filters.priority === 'urgent' ? 'border-error-600 text-error-700' : ''}
        >
          <Zap className="w-4 h-4 mr-2" />
          Urgent
        </Button>
        {(activeFilters.length > 0 || filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuickFilter('clear')}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search & Filter Section */}
      <SearchFilterSection
        searchPlaceholder="Search by ticket #, customer, subject, or order..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        activeFilters={activeFilters}
        onClearAll={() => {
          setFilters({ 
            status: 'all', 
            priority: 'all', 
            category: 'all', 
            assignedTo: 'all',
            dateRange: 'all',
            search: '' 
          });
          setSearchInput('');
        }}
      >
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters(prev => ({ ...prev, status: value as TicketStatus | 'all' }))
          }
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) =>
            setFilters(prev => ({ ...prev, priority: value as TicketPriority | 'all' }))
          }
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) =>
            setFilters(prev => ({ ...prev, category: value as TicketCategory | 'all' }))
          }
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="order_issue">Order Issue</SelectItem>
            <SelectItem value="payment_issue">Payment Issue</SelectItem>
            <SelectItem value="delivery_issue">Delivery Issue</SelectItem>
            <SelectItem value="product_quality">Product Quality</SelectItem>
            <SelectItem value="vendor_issue">Vendor Issue</SelectItem>
            <SelectItem value="account_issue">Account Issue</SelectItem>
            <SelectItem value="technical_issue">Technical Issue</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.assignedTo}
          onValueChange={(value) => setFilters(prev => ({ ...prev, assignedTo: value }))}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            <SelectItem value="assigned_to_me">Assigned to Me</SelectItem>
            {mockTeamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.dateRange}
          onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Bulk Actions Bar */}
      {selectedTickets.size > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-primary-700" />
              <span className="font-medium text-primary-900">
                {selectedTickets.size} ticket{selectedTickets.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select onValueChange={(value) => handleBulkActionRequest('assign', value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleBulkActionRequest('status', value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Change status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => handleBulkActionRequest('close')}>
                <XCircle className="w-4 h-4 mr-2" />
                Close Selected
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTickets(new Set())}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <DataTable
        data={sortedTickets}
        columns={columns}
        searchable={false}
        pageSize={15}
        emptyMessage={emptyState.message}
        onRowClick={(ticket) => handleViewTicket(ticket.id)}
        loading={isLoading}
        getRowClassName={(ticket) => {
          const isSLABreached = ticket.sla.isResolutionBreached || ticket.sla.isFirstResponseBreached;
          const isUrgent = ticket.priority === 'urgent';
          if (isSLABreached) {
            return 'border-l-4 border-l-error-700 bg-error-50/30';
          }
          if (isUrgent && !isSLABreached) {
            return 'border-l-4 border-l-error-600 bg-error-50/20';
          }
          return '';
        }}
      />

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-neutral-700">
              {bulkAction.type === 'assign' && bulkAction.value && (
                <>
                  Assign <span className="font-medium">{selectedTickets.size}</span> ticket
                  {selectedTickets.size > 1 ? 's' : ''} to{' '}
                  <span className="font-medium">
                    {mockTeamMembers.find(m => m.id === bulkAction.value)?.name}
                  </span>
                  ?
                </>
              )}
              {bulkAction.type === 'status' && bulkAction.value && (
                <>
                  Change status of <span className="font-medium">{selectedTickets.size}</span> ticket
                  {selectedTickets.size > 1 ? 's' : ''} to{' '}
                  <span className="font-medium">
                    {statusConfig[bulkAction.value as TicketStatus]?.label}
                  </span>
                  ?
                </>
              )}
              {bulkAction.type === 'close' && (
                <>
                  Close <span className="font-medium">{selectedTickets.size}</span> ticket
                  {selectedTickets.size > 1 ? 's' : ''}? This action will mark them as closed.
                </>
              )}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkActionConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        isOpen={isCreateTicketDialogOpen}
        onClose={() => setIsCreateTicketDialogOpen(false)}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}