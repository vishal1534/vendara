import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorSupport } from '../../../context/VendorSupportContext';
import { SupportTicketStatus } from '../../../types/support';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { Separator } from '../../../../app/components/ui/separator';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import {
  ArrowLeft,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';

export function TicketsPage() {
  const { tickets } = useVendorSupport();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | SupportTicketStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.status === selectedFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.ticketNumber.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.orderNumber && t.orderNumber.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [tickets, selectedFilter, searchQuery]);

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      all: tickets.length,
      [SupportTicketStatus.OPEN]: tickets.filter(t => t.status === SupportTicketStatus.OPEN).length,
      [SupportTicketStatus.IN_PROGRESS]: tickets.filter(t => t.status === SupportTicketStatus.IN_PROGRESS).length,
      [SupportTicketStatus.WAITING_VENDOR]: tickets.filter(t => t.status === SupportTicketStatus.WAITING_VENDOR).length,
      [SupportTicketStatus.RESOLVED]: tickets.filter(t => t.status === SupportTicketStatus.RESOLVED).length,
      [SupportTicketStatus.CLOSED]: tickets.filter(t => t.status === SupportTicketStatus.CLOSED).length,
    };
  }, [tickets]);

  // Active filters for chips
  const activeFilters = [];
  if (selectedFilter !== 'all') {
    const statusLabels: Record<SupportTicketStatus, string> = {
      [SupportTicketStatus.OPEN]: 'Open',
      [SupportTicketStatus.IN_PROGRESS]: 'In Progress',
      [SupportTicketStatus.WAITING_VENDOR]: 'Waiting for You',
      [SupportTicketStatus.RESOLVED]: 'Resolved',
      [SupportTicketStatus.CLOSED]: 'Closed',
    };
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusLabels[selectedFilter],
      onRemove: () => setSelectedFilter('all'),
    });
  }

  const clearAllFilters = () => {
    setSelectedFilter('all');
  };

  const getStatusBadge = (status: SupportTicketStatus) => {
    switch (status) {
      case SupportTicketStatus.OPEN:
        return (
          <Badge variant="outline" className="bg-warning-50 text-warning-700 border-warning-200">
            <Clock className="w-3 h-3 mr-1" />
            Open
          </Badge>
        );
      case SupportTicketStatus.IN_PROGRESS:
        return (
          <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
            <MessageCircle className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case SupportTicketStatus.WAITING_VENDOR:
        return (
          <Badge variant="outline" className="bg-error-50 text-error-700 border-error-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Waiting for You
          </Badge>
        );
      case SupportTicketStatus.RESOLVED:
        return (
          <Badge variant="outline" className="bg-success-50 text-success-700 border-success-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case SupportTicketStatus.CLOSED:
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">
            <XCircle className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge className="bg-error-600 text-white text-xs">Urgent</Badge>;
      case 'HIGH':
        return <Badge variant="outline" className="bg-warning-50 text-warning-700 border-warning-200 text-xs">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300 text-xs">Medium</Badge>;
      case 'LOW':
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-500 border-neutral-200 text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/vendor/support')}
        className="text-neutral-600 hover:text-neutral-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Support
      </Button>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Support Tickets</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Track and manage your support requests
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/vendor/support/create-ticket')}
          className="bg-primary-600 hover:bg-primary-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Search and Filter */}
      <SearchFilterSection
        searchPlaceholder="Search by ticket number, subject, description, or order number..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
      >
        <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as 'all' | SupportTicketStatus)}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({statusCounts.all})</SelectItem>
            <SelectItem value={SupportTicketStatus.OPEN}>Open ({statusCounts[SupportTicketStatus.OPEN]})</SelectItem>
            <SelectItem value={SupportTicketStatus.IN_PROGRESS}>In Progress ({statusCounts[SupportTicketStatus.IN_PROGRESS]})</SelectItem>
            <SelectItem value={SupportTicketStatus.WAITING_VENDOR}>Waiting for You ({statusCounts[SupportTicketStatus.WAITING_VENDOR]})</SelectItem>
            <SelectItem value={SupportTicketStatus.RESOLVED}>Resolved ({statusCounts[SupportTicketStatus.RESOLVED]})</SelectItem>
            <SelectItem value={SupportTicketStatus.CLOSED}>Closed ({statusCounts[SupportTicketStatus.CLOSED]})</SelectItem>
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold text-neutral-900">{filteredTickets.length}</span> of{' '}
          <span className="font-semibold text-neutral-900">{tickets.length}</span> ticket{tickets.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <Card className="border-neutral-200">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {selectedFilter === 'all' ? 'No support tickets' : `No ${selectedFilter.toLowerCase().replace('_', ' ')} tickets`}
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                {selectedFilter === 'all' 
                  ? 'You haven\'t created any support tickets yet.' 
                  : searchQuery 
                  ? 'No tickets match your search criteria.'
                  : 'No tickets match this filter.'}
              </p>
              {selectedFilter === 'all' && !searchQuery && (
                <Button
                  size="sm"
                  onClick={() => navigate('/vendor/support/create-ticket')}
                  className="bg-primary-600 hover:bg-primary-700 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket, index) => (
            <Card
              key={ticket.id}
              className="border-neutral-200 hover:border-primary-200 transition-colors cursor-pointer"
              onClick={() => navigate(`/vendor/support/tickets/${ticket.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Left: Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-neutral-900">
                            {ticket.ticketNumber}
                          </h3>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm font-medium text-neutral-700 mb-1">
                          {ticket.subject}
                        </p>
                        <p className="text-xs text-neutral-500 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>Created {formatDate(ticket.createdAt)}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <span>Updated {formatTime(ticket.updatedAt)}</span>
                      {ticket.replies && ticket.replies.length > 0 && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                          </span>
                        </>
                      )}
                      {ticket.orderNumber && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span>Order: {ticket.orderNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
