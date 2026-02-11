import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendorSupport } from '../../../context/VendorSupportContext';
import { SupportTicketStatus } from '../../../types/support';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Separator } from '../../../../app/components/ui/separator';
import {
  ArrowLeft,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Loader2,
  Send,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { getTicketById, addReply } = useVendorSupport();
  const navigate = useNavigate();

  const ticket = ticketId ? getTicketById(ticketId) : undefined;
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) {
    return (
      <div className="p-6">
        <Card className="border-neutral-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ticket not found</h3>
            <p className="text-sm text-neutral-500 mb-4">
              The support ticket you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate('/vendor/support/tickets')}
              className="bg-primary-600 hover:bg-primary-700 text-white border-0"
            >
              View All Tickets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);

    const result = await addReply(ticket.id, replyMessage);

    setIsSubmitting(false);

    if (result.success) {
      toast.success('Reply sent successfully');
      setReplyMessage('');
    } else {
      toast.error(result.error || 'Failed to send reply');
    }
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

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/vendor/support/tickets')}
        className="text-neutral-600 hover:text-neutral-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tickets
      </Button>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-neutral-900">{ticket.ticketNumber}</h1>
            {getStatusBadge(ticket.status)}
          </div>
          <p className="text-sm text-neutral-600">
            Created on {formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Conversation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Original Ticket */}
          <Card className="border-neutral-200">
            <CardHeader className="border-b border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">You (Vendor)</p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-3">{ticket.subject}</h2>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Replies */}
          {ticket.replies && ticket.replies.length > 0 && (
            <>
              {ticket.replies.map((reply) => (
                <Card key={reply.id} className={`border-neutral-200 ${reply.isVendorReply ? 'bg-primary-50/30' : ''}`}>
                  <CardHeader className="border-b border-neutral-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        reply.isVendorReply ? 'bg-primary-100' : 'bg-success-100'
                      }`}>
                        <User className={`w-5 h-5 ${reply.isVendorReply ? 'text-primary-600' : 'text-success-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-900">{reply.authorName}</p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(reply.createdAt)} at {formatTime(reply.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">{reply.message}</p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Reply Form */}
          {ticket.status !== SupportTicketStatus.CLOSED && (
            <Card className="border-primary-200">
              <CardHeader className="border-b border-neutral-200">
                <CardTitle className="text-base font-semibold text-neutral-900">Add a Reply</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReply}>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-neutral-500">
                      Our support team will respond within 24 hours
                    </p>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting || !replyMessage.trim()}
                      className="bg-primary-600 hover:bg-primary-700 text-white border-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Ticket Details */}
        <div className="space-y-4">
          {/* Ticket Information */}
          <Card className="border-neutral-200">
            <CardHeader className="border-b border-neutral-200">
              <CardTitle className="text-base font-semibold text-neutral-900">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1">Category</p>
                <p className="text-sm text-neutral-900">{ticket.category.replace(/_/g, ' ')}</p>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1">Priority</p>
                <div className="mt-1">
                  {ticket.priority === 'URGENT' && (
                    <Badge className="bg-error-600 text-white">Urgent</Badge>
                  )}
                  {ticket.priority === 'HIGH' && (
                    <Badge variant="outline" className="bg-warning-50 text-warning-700 border-warning-200">High</Badge>
                  )}
                  {ticket.priority === 'MEDIUM' && (
                    <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">Medium</Badge>
                  )}
                  {ticket.priority === 'LOW' && (
                    <Badge variant="outline" className="bg-neutral-50 text-neutral-500 border-neutral-200">Low</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1">Status</p>
                <div className="mt-1">
                  {getStatusBadge(ticket.status)}
                </div>
              </div>

              {ticket.assignedTo && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1">Assigned To</p>
                    <p className="text-sm text-neutral-900">{ticket.assignedTo}</p>
                  </div>
                </>
              )}

              {ticket.orderNumber && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1">Related Order</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(`/vendor/orders/${ticket.orderId}`)}
                      className="text-sm text-primary-600 p-0 h-auto"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      {ticket.orderNumber} →
                    </Button>
                  </div>
                </>
              )}

              {ticket.resolvedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1">Resolved At</p>
                    <p className="text-sm text-neutral-900">
                      {formatDate(ticket.resolvedAt)} at {formatTime(ticket.resolvedAt)}
                    </p>
                  </div>
                </>
              )}

              {ticket.resolution && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-2">Resolution</p>
                    <p className="text-sm text-neutral-700 bg-success-50 border border-success-200 rounded-lg p-3">
                      {ticket.resolution}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Need More Help */}
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Need Urgent Help?</h3>
              <p className="text-xs text-neutral-600 mb-3">
                For critical issues, contact us directly via WhatsApp
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/917906441952?text=Urgent: Ticket ${ticket.ticketNumber}`, '_blank')}
                className="w-full border-success-300 text-success-700 hover:bg-success-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
