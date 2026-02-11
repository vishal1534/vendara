import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVendorSupport } from '../../../context/VendorSupportContext';
import { useVendorOrders } from '../../../context/VendorOrdersContext';
import {
  SupportTicketCategory,
  SupportTicketPriority,
  SUPPORT_CATEGORY_LABELS,
  SUPPORT_PRIORITY_LABELS,
} from '../../../types/support';
import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Pre-fill logic based on context (Industry Best Practices)
 */
interface PreFillContext {
  category?: SupportTicketCategory;
  priority?: SupportTicketPriority;
  subject?: string;
  orderId?: string;
  settlementId?: string;
}

function getPreFillFromParams(searchParams: URLSearchParams): PreFillContext {
  const context: PreFillContext = {};
  
  // Settlement-related issues
  const settlementId = searchParams.get('settlementId');
  if (settlementId) {
    context.settlementId = settlementId;
    context.category = SupportTicketCategory.PAYMENT_ISSUE;
    context.priority = SupportTicketPriority.HIGH;
    context.subject = `Settlement Dispute - Settlement ID: ${settlementId}`;
    return context;
  }
  
  // Order-related issues
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');
  if (orderId || orderNumber) {
    context.orderId = orderId || undefined;
    const orderRef = orderNumber || orderId;
    
    // Check if it's a delivery issue
    const issueType = searchParams.get('issueType');
    if (issueType === 'delivery') {
      context.category = SupportTicketCategory.DELIVERY_ISSUE;
      context.priority = SupportTicketPriority.HIGH;
      context.subject = `Delivery Issue - Order ${orderRef}`;
    } else {
      context.category = SupportTicketCategory.ORDER_ISSUE;
      context.priority = SupportTicketPriority.HIGH;
      context.subject = `Order Issue - Order ${orderRef}`;
    }
    return context;
  }
  
  // Category-specific pre-fills (from dashboard quick links)
  const category = searchParams.get('category');
  const question = searchParams.get('question');
  
  if (category === 'settlement' || question === 'payment') {
    context.category = SupportTicketCategory.PAYMENT_ISSUE;
    context.priority = SupportTicketPriority.HIGH;
    context.subject = 'Payment & Settlement Query';
    return context;
  }
  
  if (category === 'order' || question === 'delivery') {
    context.category = SupportTicketCategory.ORDER_ISSUE;
    context.priority = SupportTicketPriority.MEDIUM;
    context.subject = 'Order Related Query';
    return context;
  }
  
  if (category === 'catalog' || question === 'catalog') {
    context.category = SupportTicketCategory.CATALOG_UPDATE;
    context.priority = SupportTicketPriority.MEDIUM;
    context.subject = 'Catalog Update Request';
    return context;
  }
  
  if (question === 'offers') {
    context.category = SupportTicketCategory.GENERAL_INQUIRY;
    context.priority = SupportTicketPriority.LOW;
    context.subject = 'Question About Offers';
    return context;
  }
  
  // Technical issues
  const technical = searchParams.get('technical');
  if (technical) {
    context.category = SupportTicketCategory.TECHNICAL_ISSUE;
    context.priority = SupportTicketPriority.MEDIUM;
    context.subject = 'Technical Issue Report';
    return context;
  }
  
  return context;
}

export function CreateTicketPage() {
  const { createTicket } = useVendorSupport();
  const { orders } = useVendorOrders();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    category: SupportTicketCategory.GENERAL_INQUIRY,
    priority: SupportTicketPriority.MEDIUM,
    subject: '',
    description: '',
    orderId: '',
    orderNumber: '',
    settlementId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form based on URL parameters
  useEffect(() => {
    const preFill = getPreFillFromParams(searchParams);
    
    if (Object.keys(preFill).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...(preFill.category && { category: preFill.category }),
        ...(preFill.priority && { priority: preFill.priority }),
        ...(preFill.subject && { subject: preFill.subject }),
        ...(preFill.orderId && { orderId: preFill.orderId }),
        ...(preFill.settlementId && { settlementId: preFill.settlementId }),
      }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-fill order number when order is selected
    if (field === 'orderId' && value) {
      const order = orders.find(o => o.id === value);
      if (order) {
        setFormData(prev => ({ ...prev, orderNumber: order.orderNumber }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 10) {
      newErrors.subject = 'Subject must be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const result = await createTicket({
      category: formData.category,
      priority: formData.priority,
      subject: formData.subject,
      description: formData.description,
      orderId: formData.orderId || undefined,
      orderNumber: formData.orderNumber || undefined,
      settlementId: formData.settlementId || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success('Support ticket created successfully');
      navigate('/vendor/support/tickets');
    } else {
      toast.error(result.error || 'Failed to create ticket');
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Create Support Ticket</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Describe your issue and our support team will help you resolve it
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="border-neutral-200">
          <CardContent className="p-6 space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Issue Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
              >
                {Object.entries(SUPPORT_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
              >
                {Object.entries(SUPPORT_PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-2">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Choose "Urgent" only if the issue is blocking your business operations
              </p>
            </div>

            {/* Related Order (Optional) */}
            {(formData.category === SupportTicketCategory.ORDER_ISSUE ||
              formData.category === SupportTicketCategory.DELIVERY_ISSUE) && (
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Related Order (Optional)
                </label>
                <select
                  value={formData.orderId}
                  onChange={(e) => handleChange('orderId', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
                >
                  <option value="">Select an order (optional)</option>
                  {orders.slice(0, 20).map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.itemName} ({order.quantity} {order.unit})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Brief summary of your issue (e.g., Payment not received for order ORD-1234)"
                className={`w-full px-4 py-3 border-2 rounded-lg text-sm focus:outline-none focus:border-primary-300 ${
                  errors.subject ? 'border-error-300' : 'border-neutral-200'
                }`}
              />
              {errors.subject && (
                <p className="text-xs text-error-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide detailed information about your issue. Include order numbers, dates, amounts, and any other relevant details that will help us resolve your issue faster."
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-lg text-sm focus:outline-none focus:border-primary-300 resize-none ${
                  errors.description ? 'border-error-300' : 'border-neutral-200'
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-error-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500">
                    Minimum 20 characters
                  </p>
                )}
                <p className="text-xs text-neutral-500">
                  {formData.description.length} characters
                </p>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-primary-900 mb-1">
                    Tips for faster resolution:
                  </p>
                  <ul className="text-xs text-primary-800 space-y-1 list-disc list-inside">
                    <li>Include relevant order numbers, dates, and amounts</li>
                    <li>Describe what you expected vs. what actually happened</li>
                    <li>For technical issues, mention your device and browser</li>
                    <li>Attach screenshots if applicable (coming soon)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-primary-600 hover:bg-primary-700 text-white border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Ticket
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/vendor/support')}
                disabled={isSubmitting}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}