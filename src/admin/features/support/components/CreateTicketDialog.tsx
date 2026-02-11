/**
 * Create Ticket Dialog - Admin Portal
 * Allows admins to manually create support tickets on behalf of customers
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../../app/components/ui/dialog';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Textarea } from '../../../../app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Label } from '../../../../app/components/ui/label';
import {
  User,
  Building,
  Search,
  AlertCircle,
  Package,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { TicketPriority, TicketCategory } from '../../../types/support';
import { mockTeamMembers } from '../../../data/mockTickets';
import { toast } from 'sonner';
import { Badge } from '../../../../app/components/ui/badge';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';

interface CreateTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: () => void;
}

interface Customer {
  id: string;
  name: string;
  type: 'buyer' | 'vendor';
  phone: string;
  email?: string;
  location?: string;
  businessName?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// Mock data for customer search
const mockCustomers: Customer[] = [
  {
    id: 'buyer_001',
    name: 'Vishal Chauhan',
    type: 'buyer',
    phone: '+91 7906441952',
    email: 'rajesh.kumar@email.com',
    location: 'Madhapur, Hyderabad',
  },
  {
    id: 'buyer_002',
    name: 'Priya Sharma',
    type: 'buyer',
    phone: '+91 98765 43211',
    email: 'priya.sharma@email.com',
    location: 'Gachibowli, Hyderabad',
  },
  {
    id: 'buyer_003',
    name: 'Amit Patel',
    type: 'buyer',
    phone: '+91 98765 43212',
    email: 'amit.patel@email.com',
    location: 'Kondapur, Hyderabad',
  },
  {
    id: 'vendor_001',
    name: 'Srinivas Rao',
    type: 'vendor',
    phone: '+91 98765 43213',
    email: 'srinivas@steelsuppliers.com',
    businessName: 'Hyderabad Steel Suppliers',
    location: 'Kukatpally, Hyderabad',
  },
  {
    id: 'vendor_002',
    name: 'Lakshmi Devi',
    type: 'vendor',
    phone: '+91 98765 43214',
    email: 'lakshmi@cementworks.com',
    businessName: 'Premium Cement Works',
    location: 'Miyapur, Hyderabad',
  },
];

// Mock orders
const mockOrders: Order[] = [
  {
    id: 'order_001',
    orderNumber: 'ORD-2024-0123',
    customerId: 'buyer_001',
    vendorName: 'Hyderabad Steel Suppliers',
    totalAmount: 45000,
    status: 'Delivered',
    createdAt: '2024-01-05T10:30:00Z',
  },
  {
    id: 'order_002',
    orderNumber: 'ORD-2024-0124',
    customerId: 'buyer_001',
    vendorName: 'Premium Cement Works',
    totalAmount: 32000,
    status: 'In Transit',
    createdAt: '2024-01-08T14:20:00Z',
  },
  {
    id: 'order_003',
    orderNumber: 'ORD-2024-0125',
    customerId: 'buyer_002',
    vendorName: 'Hyderabad Steel Suppliers',
    totalAmount: 58000,
    status: 'Processing',
    createdAt: '2024-01-09T09:15:00Z',
  },
];

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

const priorityLabels: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export function CreateTicketDialog({
  isOpen,
  onClose,
  onTicketCreated,
}: CreateTicketDialogProps) {
  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('other');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [relatedOrderId, setRelatedOrderId] = useState<string>('');
  
  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return mockCustomers;
    
    const search = customerSearch.toLowerCase();
    return mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search) ||
        customer.phone.includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.businessName?.toLowerCase().includes(search)
    );
  }, [customerSearch]);

  // Get orders for selected customer
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return mockOrders.filter(order => order.customerId === selectedCustomer.id);
  }, [selectedCustomer]);

  // Character limits
  const MAX_SUBJECT_CHARS = 200;
  const MAX_DESC_CHARS = 2000;

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearch('');
    setErrors({ ...errors, customer: '' });
  };

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
    setRelatedOrderId('');
  };

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (subject.length > MAX_SUBJECT_CHARS) {
      newErrors.subject = `Subject must be less than ${MAX_SUBJECT_CHARS} characters`;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > MAX_DESC_CHARS) {
      newErrors.description = `Description must be less than ${MAX_DESC_CHARS} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedCustomer, subject, description]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    // Simulate API call
    try {
      const relatedOrder = relatedOrderId && relatedOrderId !== 'none'
        ? mockOrders.find(o => o.id === relatedOrderId) 
        : null;

      const ticketData = {
        customerId: selectedCustomer!.id,
        customerName: selectedCustomer!.name,
        customerType: selectedCustomer!.type,
        customerPhone: selectedCustomer!.phone,
        customerEmail: selectedCustomer!.email,
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
        assignedTo: assignedTo && assignedTo !== 'unassigned' ? assignedTo : null,
        relatedOrderId: relatedOrderId && relatedOrderId !== 'none' ? relatedOrderId : null,
        relatedOrderNumber: relatedOrder?.orderNumber || null,
        createdBy: 'admin', // Current user
        createdAt: new Date().toISOString(),
      };

      console.log('Creating ticket:', ticketData);

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('Support ticket created successfully', {
        description: `Ticket created for ${selectedCustomer!.name}`,
      });

      // Reset form
      setSelectedCustomer(null);
      setSubject('');
      setDescription('');
      setCategory('other');
      setPriority('medium');
      setAssignedTo('');
      setRelatedOrderId('');
      setErrors({});

      onTicketCreated?.();
      onClose();
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    }
  };

  const handleReset = () => {
    // Reset form
    setSelectedCustomer(null);
    setSubject('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
    setAssignedTo('');
    setRelatedOrderId('');
    setErrors({});
  };

  const handleCloseAttempt = () => {
    // Check if form has unsaved data
    if (selectedCustomer || subject || description) {
      setShowCloseConfirm(true);
    } else {
      handleReset();
      onClose();
    }
  };

  const handleConfirmClose = () => {
    handleReset();
    onClose();
  };

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Support Ticket</DialogTitle>
          <DialogDescription>
            Manually create a support ticket on behalf of a customer
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">
              Customer <span className="text-error-600">*</span>
            </Label>
            
            {selectedCustomer ? (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedCustomer.type === 'buyer' ? 'bg-primary-100' : 'bg-secondary-100'
                    }`}>
                      {selectedCustomer.type === 'buyer' ? (
                        <User className="w-5 h-5 text-primary-700" />
                      ) : (
                        <Building className="w-5 h-5 text-secondary-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-neutral-900 truncate">
                          {selectedCustomer.name}
                        </p>
                        <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                          {selectedCustomer.type}
                        </Badge>
                      </div>
                      {selectedCustomer.businessName && (
                        <p className="text-sm text-neutral-700 truncate mb-1">
                          {selectedCustomer.businessName}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          {selectedCustomer.phone}
                        </span>
                        {selectedCustomer.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{selectedCustomer.email}</span>
                          </span>
                        )}
                      </div>
                      {selectedCustomer.location && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {selectedCustomer.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCustomer}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="customer"
                    placeholder="Search by name, phone, or email..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerSearch(true);
                    }}
                    onFocus={() => setShowCustomerSearch(true)}
                    className="pl-9"
                  />
                </div>

                {showCustomerSearch && customerSearch.trim() && (
                  <div className="bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      <div className="divide-y divide-neutral-200">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            onClick={() => handleSelectCustomer(customer)}
                            className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                customer.type === 'buyer' ? 'bg-primary-100' : 'bg-secondary-100'
                              }`}>
                                {customer.type === 'buyer' ? (
                                  <User className="w-4 h-4 text-primary-700" />
                                ) : (
                                  <Building className="w-4 h-4 text-secondary-700" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="text-sm font-medium text-neutral-900 truncate">
                                    {customer.name}
                                  </p>
                                  <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                                    {customer.type}
                                  </Badge>
                                </div>
                                {customer.businessName && (
                                  <p className="text-xs text-neutral-600 truncate mb-1">
                                    {customer.businessName}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                                  <span>{customer.phone}</span>
                                  {customer.email && (
                                    <span className="truncate">{customer.email}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <User className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                        <p className="text-sm text-neutral-600">No customers found</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Try a different search term
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {errors.customer && (
              <div className="flex items-center gap-2 text-sm text-error-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.customer}</span>
              </div>
            )}
          </div>

          {/* Related Order (Optional) */}
          {selectedCustomer && customerOrders.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="order">Related Order (Optional)</Label>
              <Select value={relatedOrderId} onValueChange={setRelatedOrderId}>
                <SelectTrigger id="order">
                  <SelectValue placeholder="Select an order (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No related order</SelectItem>
                  {customerOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <span className="font-medium">{order.orderNumber}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-600 truncate">{order.vendorName}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500">
                Link this ticket to a specific order for better context
              </p>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-error-600">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue..."
              value={subject}
              onChange={(e) => {
                if (e.target.value.length <= MAX_SUBJECT_CHARS) {
                  setSubject(e.target.value);
                  setErrors({ ...errors, subject: '' });
                }
              }}
              className={errors.subject ? 'border-error-600' : ''}
            />
            <div className="flex justify-between items-center">
              {errors.subject ? (
                <div className="flex items-center gap-2 text-sm text-error-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.subject}</span>
                </div>
              ) : (
                <div />
              )}
              <span className={`text-xs ${
                subject.length > MAX_SUBJECT_CHARS * 0.9 ? 'text-warning-600' : 'text-neutral-500'
              }`}>
                {subject.length} / {MAX_SUBJECT_CHARS}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-error-600">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue and any relevant context..."
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESC_CHARS) {
                  setDescription(e.target.value);
                  setErrors({ ...errors, description: '' });
                }
              }}
              rows={6}
              className={`resize-y ${errors.description ? 'border-error-600' : ''}`}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <div className="flex items-center gap-2 text-sm text-error-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.description}</span>
                </div>
              ) : (
                <div />
              )}
              <span className={`text-xs ${
                description.length > MAX_DESC_CHARS * 0.9 ? 'text-warning-600' : 'text-neutral-500'
              }`}>
                {description.length} / {MAX_DESC_CHARS}
              </span>
            </div>
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-error-600">*</span>
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-error-600">*</span>
              </Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-2">
            <Label htmlFor="assign">Assign To (Optional)</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger id="assign">
                <SelectValue placeholder="Leave unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {mockTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        member.isOnline ? 'bg-success-600' : 'bg-neutral-300'
                      }`} />
                      <span>{member.name}</span>
                      <span className="text-xs text-neutral-500">
                        ({member.activeTickets} active)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-500">
              Ticket will go to unassigned queue if left empty
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-secondary-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-secondary-900">
                <p className="font-medium mb-1">Creating ticket on behalf of customer</p>
                <p className="text-secondary-700">
                  The customer will receive a notification about this ticket. You can add the first
                  response immediately after creation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseAttempt}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmationDialog
        open={showCloseConfirm}
        onOpenChange={setShowCloseConfirm}
        onConfirm={handleConfirmClose}
        title="Discard Changes"
        description="You have unsaved changes. Are you sure you want to close?"
        confirmText="Discard"
        cancelText="Keep Editing"
        variant="warning"
      />
    </Dialog>
  );
}