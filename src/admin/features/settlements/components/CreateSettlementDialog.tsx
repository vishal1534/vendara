/**
 * Create Settlement Dialog
 */

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../app/components/ui/dialog';
import { Button } from '../../../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Label } from '../../../../app/components/ui/label';
import { Input } from '../../../../app/components/ui/input';
import { Textarea } from '../../../../app/components/ui/textarea';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import { Badge } from '../../../../app/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  FileText,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockVendors } from '../../../mocks/vendors.mock';
import { mockOrders } from '../../../data/mockOrders';
import { mockSettlements } from '../../../data/mockSettlements';
import { Order } from '../../../types/order';
import { Settlement, SettlementStatus, PaymentMethod } from '../../../types/settlement';
import { DateRangePicker, DateRange } from '../../../../vendor/components/common/DateRangePicker';

interface CreateSettlementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (settlement: Settlement) => void;
}

export function CreateSettlementDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateSettlementDialogProps) {
  // Get initial date range (last 7 days)
  const getInitialDateRange = (): DateRange => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange());
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Payment details
  const [status, setStatus] = useState<SettlementStatus>('pending');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Get selected vendor
  const selectedVendor = useMemo(
    () => mockVendors.find((v) => v.id === selectedVendorId),
    [selectedVendorId]
  );

  // Get eligible orders for selected vendor
  const eligibleOrders = useMemo(() => {
    if (!selectedVendorId) return [];
    
    return mockOrders.filter((order) => {
      // Must be for selected vendor
      if (order.vendorId !== selectedVendorId) return false;
      
      // Must be completed
      if (order.status !== 'completed') return false;
      
      // Must NOT be paid yet (this is what needs settlement)
      if (order.paymentStatus === 'paid') return false;
      
      // Must not be already settled
      if (order.settlementId) return false;
      
      // Must be within date range
      const orderDate = new Date(order.createdAt);
      if (orderDate < dateRange.from || orderDate > dateRange.to) return false;
      
      return true;
    });
  }, [selectedVendorId, dateRange]);

  // Get selected orders
  const selectedOrders = useMemo(
    () => eligibleOrders.filter((order) => selectedOrderIds.includes(order.id)),
    [eligibleOrders, selectedOrderIds]
  );

  // Calculate settlement amounts
  const calculations = useMemo(() => {
    const totalAmount = selectedOrders.reduce((sum, order) => sum + order.total, 0);
    const platformFee = selectedOrders.reduce((sum, order) => sum + order.platformFee, 0);
    const tdsPercentage = 1; // 1% TDS
    const tds = Math.round(totalAmount * (tdsPercentage / 100));
    const netAmount = totalAmount - platformFee - tds;
    
    return {
      totalAmount,
      platformFee,
      platformFeePercentage: platformFee > 0 ? ((platformFee / totalAmount) * 100).toFixed(1) : '0',
      tds,
      tdsPercentage,
      netAmount,
      orderCount: selectedOrders.length,
    };
  }, [selectedOrders]);

  // Generate settlement number
  const generateSettlementNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = mockSettlements.length + 1;
    return `SET${year}${String(nextNumber).padStart(3, '0')}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Toggle all orders
  const toggleAllOrders = () => {
    if (selectedOrderIds.length === eligibleOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(eligibleOrders.map((o) => o.id));
    }
  };

  // Validate current step
  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return selectedVendorId !== '';
    }
    if (currentStep === 2) {
      return selectedOrderIds.length > 0;
    }
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (canProceedToNextStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle create settlement
  const handleCreate = () => {
    if (!selectedVendor) return;

    // Create new settlement
    const newSettlement: Settlement = {
      id: `set_${Date.now()}`,
      settlementNumber: generateSettlementNumber(),
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.businessName,
      vendorType: selectedVendor.category,
      totalAmount: calculations.totalAmount,
      platformFee: calculations.platformFee,
      platformFeePercentage: parseFloat(calculations.platformFeePercentage),
      tds: calculations.tds,
      tdsPercentage: calculations.tdsPercentage,
      netAmount: calculations.netAmount,
      orderIds: selectedOrderIds,
      orderCount: calculations.orderCount,
      periodStart: dateRange.from.toISOString().split('T')[0],
      periodEnd: dateRange.to.toISOString().split('T')[0],
      status,
      paymentMethod,
      paymentDate: paymentDate || undefined,
      transactionId: transactionId || undefined,
      utrNumber: utrNumber || undefined,
      accountNumber: selectedVendor.bankAccount?.accountNumber || undefined,
      ifscCode: selectedVendor.bankAccount?.ifscCode || undefined,
      accountHolderName: selectedVendor.bankAccount?.accountHolderName || undefined,
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
      processedBy: 'Admin User', // In real app, use logged-in admin
      ...(status === 'completed' && { completedAt: new Date().toISOString() }),
      ...(status === 'processing' && { processedAt: new Date().toISOString() }),
    };

    // In real app, this would be an API call
    mockSettlements.unshift(newSettlement);
    
    // Mark orders as settled and update payment status
    selectedOrders.forEach((order) => {
      order.settlementId = newSettlement.id;
      // Update payment status based on settlement status
      if (status === 'completed') {
        order.paymentStatus = 'paid';
        order.paymentMethod = paymentMethod;
      }
    });

    toast.success(`Settlement ${newSettlement.settlementNumber} created successfully`);
    onSuccess(newSettlement);
    handleClose();
  };

  // Reset and close
  const handleClose = () => {
    setCurrentStep(1);
    setSelectedVendorId('');
    setDateRange(getInitialDateRange());
    setSelectedOrderIds([]);
    setStatus('pending');
    setPaymentMethod('bank_transfer');
    setPaymentDate('');
    setTransactionId('');
    setUtrNumber('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Settlement</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium">Vendor & Period</span>
          </div>
          <div className="w-12 h-0.5 bg-neutral-200" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Select Orders</span>
          </div>
          <div className="w-12 h-0.5 bg-neutral-200" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              3
            </div>
            <span className="text-sm font-medium">Payment Details</span>
          </div>
        </div>

        {/* Step 1: Vendor & Period Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary-700 mt-0.5" />
                <div>
                  <h3 className="font-medium text-neutral-900">Select Vendor & Settlement Period</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Choose the vendor and date range to find unpaid completed orders that need settlement
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                  <SelectTrigger id="vendor" className="mt-1.5">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVendors
                      .filter((v) => v.status === 'active')
                      .map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          <div className="flex items-center justify-between gap-2">
                            <span>{vendor.businessName}</span>
                            <span className="text-xs text-neutral-500">({vendor.category})</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedVendor && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-600">Owner</p>
                      <p className="font-medium text-neutral-900">{selectedVendor.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Category</p>
                      <p className="font-medium text-neutral-900">{selectedVendor.category}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Phone</p>
                      <p className="font-medium text-neutral-900">{selectedVendor.phone}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Pending Payouts</p>
                      <p className="font-medium text-neutral-900">
                        {formatCurrency(selectedVendor.financials?.pendingPayouts || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>Settlement Period *</Label>
                <div className="mt-1.5">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    label=""
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1.5">
                  Only completed orders that haven't been paid yet will be eligible
                </p>
              </div>

              {selectedVendorId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <strong>{eligibleOrders.length}</strong> unpaid order(s) awaiting settlement
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Order Selection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary-700 mt-0.5" />
                <div>
                  <h3 className="font-medium text-neutral-900">Select Orders to Include</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Choose which unpaid orders will be settled in this payment
                  </p>
                </div>
              </div>
            </div>

            {eligibleOrders.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="font-medium text-neutral-900">No Eligible Orders Found</p>
                <p className="text-sm text-neutral-600 mt-1">
                  No completed unpaid orders found for this vendor in the selected period
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedOrderIds.length === eligibleOrders.length}
                      onCheckedChange={toggleAllOrders}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      Select All ({eligibleOrders.length} orders)
                    </label>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {selectedOrderIds.length} selected
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200 max-h-[400px] overflow-y-auto">
                  {eligibleOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 hover:bg-neutral-50 cursor-pointer"
                      onClick={() => toggleOrderSelection(order.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedOrderIds.includes(order.id)}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                              <p className="text-sm text-neutral-600">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-neutral-900">
                                {formatCurrency(order.total)}
                              </p>
                              <p className="text-xs text-neutral-500">
                                Platform Fee: {formatCurrency(order.platformFee)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">
                              {order.type === 'material' ? 'Material' : 'Labor'}
                            </Badge>
                            <Badge variant="secondary" className="bg-warning-50 text-warning-700 border-warning-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending Payment
                            </Badge>
                            <span className="text-xs text-neutral-500">
                              {order.items.length} item(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Preview */}
                {selectedOrderIds.length > 0 && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-3">Settlement Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Selected Orders</span>
                        <span className="font-medium">{calculations.orderCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Total Order Value</span>
                        <span className="font-medium">{formatCurrency(calculations.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-error-700">
                        <span>Platform Fee ({calculations.platformFeePercentage}%)</span>
                        <span>- {formatCurrency(calculations.platformFee)}</span>
                      </div>
                      <div className="flex justify-between text-error-700">
                        <span>TDS ({calculations.tdsPercentage}%)</span>
                        <span>- {formatCurrency(calculations.tds)}</span>
                      </div>
                      <div className="border-t border-neutral-300 pt-2 mt-2">
                        <div className="flex justify-between text-base">
                          <span className="font-semibold text-neutral-900">Net Payout</span>
                          <span className="font-semibold text-[#22C55E]">
                            {formatCurrency(calculations.netAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Payment Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <IndianRupee className="w-5 h-5 text-primary-700 mt-0.5" />
                <div>
                  <h3 className="font-medium text-neutral-900">Enter Payment Details</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Add payment information for this settlement
                  </p>
                </div>
              </div>
            </div>

            {/* Settlement Summary */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">Vendor</p>
                  <p className="font-medium text-neutral-900">{selectedVendor?.businessName}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Settlement Number</p>
                  <p className="font-medium text-neutral-900">{generateSettlementNumber()}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Period</p>
                  <p className="font-medium text-neutral-900">
                    {formatDate(dateRange.from.toISOString())} - {formatDate(dateRange.to.toISOString())}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-600">Net Payout</p>
                  <p className="text-lg font-semibold text-[#22C55E]">
                    {formatCurrency(calculations.netAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Settlement Status *</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as SettlementStatus)}>
                  <SelectTrigger id="status" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
                >
                  <SelectTrigger id="paymentMethod" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(status === 'completed' || status === 'processing') && (
              <>
                <div>
                  <Label htmlFor="paymentDate">
                    Payment Date {status === 'completed' ? '*' : ''}
                  </Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="TXN2026001234"
                      className="mt-1.5"
                    />
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div>
                      <Label htmlFor="utrNumber">UTR Number</Label>
                      <Input
                        id="utrNumber"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="UTR402601234567"
                        className="mt-1.5"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Bank Details Display */}
            {selectedVendor?.bankAccount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Vendor Bank Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-neutral-600">Account Number</p>
                    <p className="font-medium text-neutral-900">
                      {selectedVendor.bankAccount.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600">IFSC Code</p>
                    <p className="font-medium text-neutral-900">
                      {selectedVendor.bankAccount.ifscCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Account Holder</p>
                    <p className="font-medium text-neutral-900">
                      {selectedVendor.bankAccount.accountHolderName}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Bank Name</p>
                    <p className="font-medium text-neutral-900">
                      {selectedVendor.bankAccount.bankName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
                className="mt-1.5"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext} disabled={!canProceedToNextStep()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={selectedOrderIds.length === 0}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Create Settlement
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}