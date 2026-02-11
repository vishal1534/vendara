import { HelpCircle, MessageCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';

interface ContextualHelpCardProps {
  status: VendorOrderStatus;
  orderId: string;
  orderNumber: string;
}

export function ContextualHelpCard({ status, orderId, orderNumber }: ContextualHelpCardProps) {
  const navigate = useNavigate();

  const getContextualQuestions = (status: VendorOrderStatus): string[] => {
    switch (status) {
      case VendorOrderStatus.OFFERED:
        return [
          "What if I can't fulfill this order?",
          "How long do I have to respond?",
          "Can I modify the quoted price?",
        ];
      case VendorOrderStatus.ACCEPTED:
      case VendorOrderStatus.IN_PROGRESS:
        return [
          "What if I can't deliver on time?",
          "How do I change the delivery date?",
          "What if I have quality issues?",
        ];
      case VendorOrderStatus.READY:
        return [
          "What if the buyer doesn't pick up?",
          "How do I confirm delivery?",
          "Can I reschedule delivery?",
        ];
      case VendorOrderStatus.COMPLETED:
        return [
          "When will I receive payment?",
          "How do I track my settlement?",
          "What if there's a payment issue?",
        ];
      default:
        return [
          "How do I contact the buyer?",
          "What are my payment terms?",
          "How do I report an issue?",
        ];
    }
  };

  const handleRaiseTicket = () => {
    const params = new URLSearchParams({
      category: 'order',
      orderId,
      orderNumber,
    });
    navigate(`/vendor/support/create-ticket?${params.toString()}`);
  };

  const questions = getContextualQuestions(status);

  return (
    <Card className="border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          Need Help?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
            Common Questions
          </p>
          <div className="space-y-2">
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={handleRaiseTicket}
                className="w-full text-left text-sm text-neutral-700 hover:text-primary-700 hover:underline cursor-pointer flex items-start gap-2 group"
              >
                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-400 group-hover:text-primary-600" />
                <span>{question}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRaiseTicket}
            className="w-full justify-start border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300"
          >
            <MessageCircle className="w-4 h-4 mr-2 text-primary-600" />
            Create Support Ticket
          </Button>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-600">
            Our support team typically responds within 2-4 hours during business hours (9 AM - 6 PM).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
