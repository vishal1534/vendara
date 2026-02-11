/**
 * Ticket Details Page - Admin Portal
 * Full-screen ticket viewer with conversation history
 * Using Vendara construction-native design system
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Textarea } from '../../../../app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Separator } from '../../../../app/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../app/components/ui/dropdown-menu';
import {
  MessageSquare,
  User,
  Clock,
  Send,
  Package,
  Building,
  Phone,
  Mail,
  Zap,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Hash,
  Tag,
  ArrowLeft,
  MoreVertical,
  Link2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Lock,
  X,
} from 'lucide-react';
import { TicketStatus, TicketPriority } from '../../../types/support';
import { mockTickets, mockTeamMembers, mockCannedResponses, mockTicketMessages } from '../../../data/mockTickets';
import { toast } from 'sonner';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';

const statusConfig: Record<TicketStatus, { label: string; icon: any; className: string }> = {
  open: { 
    label: 'Open', 
    icon: AlertCircle,
    className: 'bg-error-100 text-error-700 border-error-200'
  },
  in_progress: { 
    label: 'In Progress', 
    icon: Clock,
    className: 'bg-primary-100 text-primary-700 border-primary-200'
  },
  resolved: { 
    label: 'Resolved', 
    icon: CheckCircle2,
    className: 'bg-success-100 text-success-700 border-success-200'
  },
  closed: { 
    label: 'Closed', 
    icon: XCircle,
    className: 'bg-neutral-200 text-neutral-700 border-neutral-300'
  },
};

const priorityConfig: Record<TicketPriority, { label: string; className: string; icon: any }> = {
  low: { 
    label: 'Low', 
    className: 'bg-neutral-100 text-neutral-700 border-neutral-300',
    icon: ChevronDown
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    icon: null
  },
  high: { 
    label: 'High', 
    className: 'bg-error-100 text-error-700 border-error-200',
    icon: ChevronUp
  },
  urgent: { 
    label: 'Urgent', 
    className: 'bg-error text-error-foreground border-error',
    icon: AlertTriangle
  },
};

// Mock activity timeline data
const mockActivityTimeline = [
  {
    id: 'act_1',
    type: 'status_change' as const,
    user: 'Priya Sharma',
    timestamp: '2026-01-09T14:30:00',
    oldValue: 'open',
    newValue: 'in_progress',
  },
  {
    id: 'act_2',
    type: 'assignment' as const,
    user: 'System',
    timestamp: '2026-01-09T14:15:00',
    assignedTo: 'Priya Sharma',
  },
  {
    id: 'act_3',
    type: 'priority_change' as const,
    user: 'Raj Kumar',
    timestamp: '2026-01-09T13:45:00',
    oldValue: 'medium',
    newValue: 'high',
  },
  {
    id: 'act_4',
    type: 'created' as const,
    user: 'Amit Patel',
    timestamp: '2026-01-09T13:30:00',
  },
];

export function TicketDetailsPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const ticket = mockTickets.find(t => t.id === ticketId);

  const [newStatus, setNewStatus] = useState<TicketStatus>(ticket?.status || 'open');
  const [newPriority, setNewPriority] = useState<TicketPriority>(ticket?.priority || 'medium');
  const [assignedTo, setAssignedTo] = useState<string>(ticket?.assignedToId || 'unassigned');
  const [replyMessage, setReplyMessage] = useState('');
  const [showInternalNote, setShowInternalNote] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showNavigateConfirm, setShowNavigateConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Load initial values and draft when ticket changes
  useEffect(() => {
    if (ticketId && ticket) {
      setNewStatus(ticket.status);
      setNewPriority(ticket.priority);
      setAssignedTo(ticket.assignedToId || 'unassigned');
      
      // Load drafts from localStorage
      const draftKey = `ticket-draft-${ticketId}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setReplyMessage(savedDraft);
        setHasUnsavedChanges(true);
      }
    }
  }, [ticketId]);

  // Save draft to localStorage (debounced)
  useEffect(() => {
    if (ticketId && replyMessage) {
      const draftKey = `ticket-draft-${ticketId}`;
      const timer = setTimeout(() => {
        localStorage.setItem(draftKey, replyMessage);
        setHasUnsavedChanges(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [replyMessage, ticketId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to send
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && replyMessage.trim()) {
        e.preventDefault();
        handleSendReply();
      }
      
      // Cmd/Ctrl + Shift + I for internal note
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        setShowInternalNote(!showInternalNote);
      }
      
      // Cmd/Ctrl + / for shortcuts help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }

      // ESC to close shortcuts
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [replyMessage, showInternalNote, showShortcuts]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="mb-2">Ticket Not Found</h2>
          <p className="text-text-secondary mb-6">The ticket you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/support')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Button>
        </div>
      </div>
    );
  }

  // Get messages for this ticket
  const ticketMessages = mockTicketMessages.filter(m => m.ticketId === ticket.id);
  const allMessages = ticketMessages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(dateString);
  };

  const formatDuration = (hours: number) => {
    if (hours < 0) hours = Math.abs(hours);
    if (hours < 1) return 'Less than 1h';
    if (hours < 48) return `${hours.toFixed(0)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days}d`;
    return `${days}d ${remainingHours.toFixed(0)}h`;
  };

  const handleStatusChange = (status: TicketStatus) => {
    setNewStatus(status);
    toast.success(`Status updated to ${statusConfig[status].label}`);
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    setNewPriority(priority);
    toast.success(`Priority updated to ${priorityConfig[priority].label}`);
  };

  const handleAssignment = (memberId: string) => {
    setAssignedTo(memberId);
    if (memberId === 'unassigned') {
      toast.success('Ticket unassigned');
    } else {
      const teamMember = mockTeamMembers.find(m => m.id === memberId);
      toast.success(`Assigned to ${teamMember?.name}`);
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    toast.success(showInternalNote ? 'Internal note added' : 'Reply sent successfully');
    
    // Clear draft
    if (ticketId) {
      const draftKey = `ticket-draft-${ticketId}`;
      localStorage.removeItem(draftKey);
    }
    
    setReplyMessage('');
    setShowInternalNote(false);
    setHasUnsavedChanges(false);
  };

  const handleUseCannedResponse = (response: string) => {
    setReplyMessage(response);
    setShowCannedResponses(false);
    toast.success('Template applied');
  };

  const handleBackToSupport = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation('/admin/support');
      setShowNavigateConfirm(true);
    } else {
      navigate('/admin/support');
    }
  };

  const handleNavigateToOrder = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation(`/admin/orders/${ticket.relatedOrderId}`);
      setShowNavigateConfirm(true);
    } else {
      navigate(`/admin/orders/${ticket.relatedOrderId}`);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const toggleMessageExpand = (messageId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedMessages(newExpanded);
  };

  const isSLABreached = ticket.sla.isResolutionBreached || ticket.sla.isFirstResponseBreached;

  const MAX_CHARS = 2000;
  const charsLeft = MAX_CHARS - replyMessage.length;

  const StatusIcon = statusConfig[newStatus].icon;
  const PriorityIcon = priorityConfig[newPriority].icon;

  return (
    <div className="space-y-6">
      {/* Fixed Header */}
      <div className="bg-surface border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSupport}
              className="text-text-secondary hover:text-text-primary -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Hash className="w-4 h-4" />
              <span className="font-medium">{ticket.ticketNumber}</span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Quick Status Change */}
            <Select value={newStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className={`h-8 border ${statusConfig[newStatus].className} font-medium w-[140px]`}>
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-3.5 h-3.5" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([value, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Quick Priority Change */}
            <Select value={newPriority} onValueChange={handlePriorityChange}>
              <SelectTrigger className={`h-8 border ${priorityConfig[newPriority].className} font-medium w-[120px]`}>
                <div className="flex items-center gap-2">
                  {PriorityIcon && <PriorityIcon className="w-3.5 h-3.5" />}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(priorityConfig).map(([value, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* SLA Badge */}
            {isSLABreached && (
              <Badge variant="outline" className="bg-error-100 text-error-700 border-error-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                SLA Breach
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Assignment */}
            <Select value={assignedTo} onValueChange={handleAssignment}>
              <SelectTrigger className="h-8 w-[160px] bg-surface-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  <SelectValue placeholder="Unassigned" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">
                  <span className="text-text-muted">Unassigned</span>
                </SelectItem>
                {mockTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        member.isOnline ? 'bg-available' : 'bg-neutral-300'
                      }`} />
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowShortcuts(true)}>
                  <Hash className="w-4 h-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-error" onClick={() => handleStatusChange('closed')}>
                  <X className="w-4 h-4 mr-2" />
                  Close Ticket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Subject */}
        <h1 className="mb-1">{ticket.subject}</h1>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Created {formatRelativeTime(ticket.createdAt)}
          </span>
          {ticket.messageCount > 0 && (
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {ticket.messageCount} messages
            </span>
          )}
        </div>
      </div>

      {/* SLA Warning Banner */}
      {isSLABreached && (
        <div className="bg-error text-error-foreground px-6 py-3 flex items-center gap-3 border-b border-error flex-shrink-0">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">
            SLA Breach: This ticket is {formatDuration(Math.abs(ticket.sla.hoursUntilDue))} overdue
          </p>
          <Button 
            size="sm" 
            variant="secondary" 
            className="ml-auto h-7"
            onClick={() => handleStatusChange('in_progress')}
          >
            Take Action
          </Button>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Customer Context */}
        <div className="w-[280px] border-r border-border bg-surface overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                Customer
              </h3>
              <div className="space-y-3">
                <div 
                  className="flex items-start gap-3 cursor-pointer hover:bg-surface-2 -mx-2 px-2 py-1 rounded-lg transition-colors"
                  onClick={() => navigate(`/admin/${ticket.source === 'buyer' ? 'buyers' : 'vendors'}/${ticket.requesterId}`)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    ticket.source === 'buyer' ? 'bg-primary-subtle' : 'bg-secondary-subtle'
                  }`}>
                    {ticket.source === 'buyer' ? (
                      <User className="w-5 h-5 text-primary" />
                    ) : (
                      <Building className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{ticket.requesterName}</p>
                    <p className="text-xs text-text-secondary capitalize">{ticket.source}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <a
                    href={`tel:${ticket.requesterPhone}`}
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs">{ticket.requesterPhone}</span>
                  </a>
                  {ticket.requesterEmail && (
                    <a
                      href={`mailto:${ticket.requesterEmail}`}
                      className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs truncate">{ticket.requesterEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Related Order */}
            {ticket.orderId && (
              <>
                <div>
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                    Related Order
                  </h3>
                  <div className="bg-surface-2 rounded-lg p-3 border border-border">
                    <div className="flex items-start gap-2 mb-2">
                      <Package className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-text-primary truncate">
                          {ticket.orderNumber}
                        </p>
                        {ticket.vendorName && (
                          <p className="text-xs text-text-secondary mt-0.5 truncate">
                            {ticket.vendorName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={handleNavigateToOrder}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Order
                    </Button>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Properties */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                Properties
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-secondary mb-1.5">Category</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-text-primary text-xs">
                      {ticket.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-secondary mb-1.5">Created</p>
                  <div className="flex items-center gap-2 text-xs text-text-primary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    {formatDateTime(ticket.createdAt)}
                  </div>
                </div>

                {ticket.sla.firstResponseAt && (
                  <div>
                    <p className="text-xs text-text-secondary mb-1.5">First Response</p>
                    <div className="flex items-center gap-2 text-xs text-success">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {formatRelativeTime(ticket.sla.firstResponseAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* SLA Timeline */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                SLA Timeline
              </h3>
              <div className="space-y-3">
                {/* First Response */}
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      ticket.sla.firstResponseAt ? 'bg-success' : 
                      ticket.sla.isFirstResponseBreached ? 'bg-error' : 'bg-warning'
                    }`} />
                    <div className="w-px h-full bg-divider mt-1" />
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-medium text-text-primary">First Response</p>
                    {ticket.sla.firstResponseAt ? (
                      <p className="text-xs text-success mt-0.5">
                        ✓ {formatRelativeTime(ticket.sla.firstResponseAt)}
                      </p>
                    ) : (
                      <p className="text-xs text-text-secondary mt-0.5">
                        Due {formatRelativeTime(ticket.sla.firstResponseDue)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Resolution */}
                <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full mt-0.5 ${
                    ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-success' : 
                    ticket.sla.isResolutionBreached ? 'bg-error' : 'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-text-primary">Resolution</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Due {formatRelativeTime(ticket.sla.resolutionDue)}
                    </p>
                    {ticket.sla.hoursUntilDue > 0 ? (
                      <p className="text-xs text-warning mt-0.5">
                        {formatDuration(ticket.sla.hoursUntilDue)} left
                      </p>
                    ) : (
                      <p className="text-xs text-error mt-0.5 font-medium">
                        {formatDuration(Math.abs(ticket.sla.hoursUntilDue))} overdue
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Activity Timeline */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                Activity
              </h3>
              <div className="space-y-3">
                {mockActivityTimeline.map((activity, index) => {
                  const isLast = index === mockActivityTimeline.length - 1;
                  
                  return (
                    <div key={activity.id} className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'created' ? 'bg-primary' :
                          activity.type === 'status_change' ? 'bg-success' :
                          activity.type === 'assignment' ? 'bg-secondary' :
                          'bg-warning'
                        }`} />
                        {!isLast && <div className="w-px h-full bg-divider mt-1" />}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-xs text-text-primary">
                          {activity.type === 'created' && (
                            <>Ticket created by <span className="font-medium">{activity.user}</span></>
                          )}
                          {activity.type === 'status_change' && (
                            <>
                              <span className="font-medium">{activity.user}</span> changed status from{' '}
                              <span className="font-medium">{statusConfig[activity.oldValue as TicketStatus].label}</span> to{' '}
                              <span className="font-medium">{statusConfig[activity.newValue as TicketStatus].label}</span>
                            </>
                          )}
                          {activity.type === 'assignment' && (
                            <>Assigned to <span className="font-medium">{activity.assignedTo}</span></>
                          )}
                          {activity.type === 'priority_change' && (
                            <>
                              <span className="font-medium">{activity.user}</span> changed priority to{' '}
                              <span className="font-medium">{priorityConfig[activity.newValue as TicketPriority].label}</span>
                            </>
                          )}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Conversation */}
        <div className="flex-1 flex flex-col bg-surface overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {allMessages.map((msg, index) => {
                const isInternal = msg.type === 'internal_note';
                const isAdmin = msg.type === 'admin';
                const isSystem = msg.type === 'system';
                const isLongMessage = msg.message.length > 400;
                const isExpanded = expandedMessages.has(msg.id);
                const displayMessage = isLongMessage && !isExpanded 
                  ? msg.message.substring(0, 400) + '...' 
                  : msg.message;

                // Show date separator
                const showDateSeparator = index === 0 || 
                  new Date(msg.timestamp).toDateString() !== new Date(allMessages[index - 1].timestamp).toDateString();

                return (
                  <div key={msg.id}>
                    {showDateSeparator && (
                      <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-divider" />
                        <span className="text-xs font-medium text-text-secondary">
                          {new Date(msg.timestamp).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <div className="flex-1 h-px bg-divider" />
                      </div>
                    )}

                    {isInternal ? (
                      // Internal Note - Full width, warning background
                      <div className="bg-warning-subtle border-l-4 border-warning rounded-r-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-4 h-4 text-warning" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-text-primary">{msg.sender}</p>
                              <Badge variant="outline" className="text-xs bg-warning-subtle text-warning border-warning">
                                Internal Note
                              </Badge>
                              <span className="text-xs text-text-secondary">{formatRelativeTime(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                              {displayMessage}
                            </p>
                            {isLongMessage && (
                              <button
                                onClick={() => toggleMessageExpand(msg.id)}
                                className="text-xs text-warning hover:text-warning mt-2 flex items-center gap-1 font-medium"
                              >
                                {isExpanded ? (
                                  <>Show less <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                  <>Show more <ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : isSystem ? (
                      // System Message - Centered
                      <div className="flex justify-center">
                        <div className="bg-surface-2 rounded-full px-4 py-1.5 text-xs text-text-secondary flex items-center gap-2">
                          <Info className="w-3 h-3" />
                          {msg.message}
                        </div>
                      </div>
                    ) : (
                      // Customer/Admin Message
                      <div className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isAdmin ? 'bg-secondary-subtle' : 'bg-primary-subtle'
                        }`}>
                          <User className={`w-4 h-4 ${isAdmin ? 'text-secondary' : 'text-primary'}`} />
                        </div>
                        <div className={`flex-1 max-w-2xl`}>
                          <div className={`flex items-baseline gap-2 mb-1 ${isAdmin ? 'justify-end' : ''}`}>
                            <p className="text-sm font-medium text-text-primary">{msg.sender}</p>
                            <span className="text-xs text-text-secondary">{formatRelativeTime(msg.timestamp)}</span>
                          </div>
                          <div className={`rounded-lg p-3 ${
                            isAdmin ? 'bg-primary-subtle border border-primary-subtle' : 'bg-surface-2 border border-border'
                          }`}>
                            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">
                              {displayMessage}
                            </p>
                            {isLongMessage && (
                              <button
                                onClick={() => toggleMessageExpand(msg.id)}
                                className="text-xs text-primary hover:text-primary mt-2 flex items-center gap-1 font-medium"
                              >
                                {isExpanded ? (
                                  <>Show less <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                  <>Show more <ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply Area - Fixed at bottom */}
          {ticket.status !== 'closed' && (
            <div className="border-t border-border bg-surface-2 p-4 flex-shrink-0">
              <div className="max-w-3xl mx-auto space-y-3">
                {/* Canned Responses Dropdown */}
                {showCannedResponses && !showInternalNote && (
                  <Select onValueChange={handleUseCannedResponse}>
                    <SelectTrigger className="bg-surface h-9">
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCannedResponses
                        .filter(r => r.category === ticket.category || r.category === 'general')
                        .map((response) => (
                          <SelectItem key={response.id} value={response.message}>
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3" />
                              {response.title}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Reply Box */}
                <div className="relative">
                  {showInternalNote && (
                    <div className="absolute -top-8 left-0 right-0 bg-warning-subtle border border-warning rounded-t-lg px-3 py-1.5 flex items-center gap-2">
                      <Lock className="w-3 h-3 text-warning" />
                      <span className="text-xs font-medium text-warning">Internal Note - Only visible to team</span>
                      <button 
                        onClick={() => setShowInternalNote(false)}
                        className="ml-auto text-warning hover:text-warning"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <Textarea
                    placeholder={showInternalNote ? "Add internal note (only team can see)..." : "Type your reply to the customer..."}
                    value={replyMessage}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setReplyMessage(e.target.value);
                      }
                    }}
                    rows={3}
                    className={`resize-none bg-surface ${showInternalNote ? 'border-warning border-t-0 rounded-t-none' : ''}`}
                  />
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!showInternalNote && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCannedResponses(!showCannedResponses)}
                        className="h-8 text-xs"
                      >
                        <Zap className="w-3 h-3 mr-1.5" />
                        Template
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInternalNote(!showInternalNote)}
                      className={`h-8 text-xs ${showInternalNote ? 'bg-warning-subtle text-warning' : ''}`}
                    >
                      <Lock className="w-3 h-3 mr-1.5" />
                      Internal
                    </Button>
                    <span className={`text-xs ${charsLeft < 200 ? 'text-warning' : 'text-text-muted'}`}>
                      {charsLeft}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">
                      ⌘ + ↵ to send
                    </span>
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyMessage.trim()}
                      size="sm"
                      className="h-8"
                    >
                      <Send className="w-3 h-3 mr-1.5" />
                      {showInternalNote ? 'Add Note' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-surface-inverse/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4 shadow-lg border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Send reply</span>
                <kbd className="px-2 py-1 bg-surface-2 rounded text-xs font-mono border border-border">⌘ + ↵</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Toggle internal note</span>
                <kbd className="px-2 py-1 bg-surface-2 rounded text-xs font-mono border border-border">⌘ + Shift + I</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-surface-2 rounded text-xs font-mono border border-border">⌘ + /</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Confirmation Dialog */}
      <ConfirmationDialog
        open={showNavigateConfirm}
        onOpenChange={(open) => {
          setShowNavigateConfirm(open);
          if (!open) setPendingNavigation(null);
        }}
        onConfirm={handleConfirmNavigation}
        title="Unsaved Changes"
        description="You have an unsaved reply. Are you sure you want to navigate away?"
        confirmText="Leave Page"
        cancelText="Stay"
        variant="warning"
      />
    </div>
  );
}