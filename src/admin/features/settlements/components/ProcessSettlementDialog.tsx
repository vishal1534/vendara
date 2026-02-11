/**
 * Process Settlement Dialog - Admin Portal
 * Confirm and process vendor settlement payment
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../app/components/ui/dialog';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Label } from '../../../../app/components/ui/label';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
} from 'lucide-react';
import { Settlement, PaymentMethod } from '../../../types/settlement';
import { toast } from 'sonner';

interface ProcessSettlementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement | null;
  onSuccess?: () => void;
}

export function ProcessSettlementDialog({
  isOpen,
  onClose,
  settlement,
  onSuccess,
}: ProcessSettlementDialogProps) {
  const [step, setStep] = useState<'confirm' | 'payment' | 'processing' | 'success'>('confirm');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [transactionId, setTransactionId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  if (!settlement) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirm = () => {
    setStep('payment');
  };

  const handleProcess = () => {
    if (!transactionId) {
      toast.error('Please enter transaction ID');
      return;
    }

    setStep('processing');

    // Simulate API call
    setTimeout(() => {
      setStep('success');
      toast.success('Settlement processed successfully');
      
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    setStep('confirm');
    setTransactionId('');
    setUtrNumber('');
    setRemarks('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'confirm' && 'Confirm Settlement Processing'}
            {step === 'payment' && 'Enter Payment Details'}
            {step === 'processing' && 'Processing Settlement...'}
            {step === 'success' && 'Settlement Processed Successfully'}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Confirmation */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-secondary-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Please verify all details before processing
                </p>
                <p className="text-xs text-secondary-700 mt-1">
                  This action will initiate the payment transfer to the vendor's bank account.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600">Settlement Number</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {settlement.settlementNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Vendor</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {settlement.vendorName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Bank Account</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1 font-mono">
                    {settlement.accountNumber}
                  </p>
                  <p className="text-xs text-neutral-500">{settlement.ifscCode}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Account Holder</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {settlement.accountHolderName}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Order Value:</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(settlement.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Platform Fee ({settlement.platformFeePercentage}%):</span>
                  <span className="text-error-600">
                    - {formatCurrency(settlement.platformFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">TDS ({settlement.tdsPercentage}%):</span>
                  <span className="text-error-600">
                    - {formatCurrency(settlement.tds)}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between">
                  <span className="text-base font-semibold text-neutral-900">Amount to Transfer:</span>
                  <span className="text-xl font-bold text-primary-700">
                    {formatCurrency(settlement.netAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment Details */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</SelectItem>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-id">Transaction ID *</Label>
                <Input
                  id="transaction-id"
                  placeholder="Enter transaction/reference ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </div>

              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-2">
                  <Label htmlFor="utr-number">UTR Number (Optional)</Label>
                  <Input
                    id="utr-number"
                    placeholder="Enter UTR/unique transaction reference"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Input
                  id="remarks"
                  placeholder="Add any additional notes"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-600">Amount to transfer</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    to {settlement.vendorName}
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary-700">
                  {formatCurrency(settlement.netAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-16 h-16 text-primary-700 animate-spin mb-4" />
            <p className="text-lg font-medium text-neutral-900">Processing Settlement...</p>
            <p className="text-sm text-neutral-600 mt-2">Please wait while we process the payment</p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
            </div>
            <p className="text-lg font-semibold text-neutral-900">Settlement Processed!</p>
            <p className="text-sm text-neutral-600 mt-2">Payment has been initiated successfully</p>
            <div className="bg-neutral-50 rounded-lg p-4 mt-6 w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Settlement #:</span>
                <span className="font-medium text-neutral-900">{settlement.settlementNumber}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Transaction ID:</span>
                <span className="font-medium text-neutral-900 font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Amount:</span>
                <span className="font-semibold text-primary-700">{formatCurrency(settlement.netAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {step !== 'processing' && step !== 'success' && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step === 'confirm' && (
              <Button onClick={handleConfirm}>
                <CreditCard className="w-4 h-4 mr-2" />
                Continue to Payment
              </Button>
            )}
            {step === 'payment' && (
              <Button onClick={handleProcess} disabled={!transactionId}>
                <IndianRupee className="w-4 h-4 mr-2" />
                Process Payment
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
