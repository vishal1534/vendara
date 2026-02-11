import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../app/components/ui/dialog';
import { Button } from '../../../../app/components/ui/button';
import { Label } from '../../../../app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../app/components/ui/radio-group';
import { Textarea } from '../../../../app/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface RejectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, additionalNotes?: string) => void;
  orderNumber: string;
  itemName: string;
}

const REJECTION_REASONS = [
  {
    id: 'out-of-stock',
    label: 'Out of stock',
    description: 'Item is currently unavailable',
  },
  {
    id: 'delivery-area',
    label: 'Cannot deliver to this area',
    description: 'Outside my service area',
  },
  {
    id: 'delivery-time',
    label: 'Delivery time not feasible',
    description: 'Cannot meet the delivery schedule',
  },
  {
    id: 'price-too-low',
    label: 'Price too low',
    description: 'Payout is not acceptable',
  },
  {
    id: 'capacity',
    label: 'At full capacity',
    description: 'Too busy to take on more orders',
  },
  {
    id: 'other',
    label: 'Other reason',
    description: 'Please provide details below',
  },
];

export function RejectOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  itemName,
}: RejectOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);

    try {
      const reasonLabel = REJECTION_REASONS.find(r => r.id === selectedReason)?.label || selectedReason;
      await onConfirm(reasonLabel, additionalNotes.trim() || undefined);
      
      // Reset form
      setSelectedReason('');
      setAdditionalNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setAdditionalNotes('');
      onClose();
    }
  };

  const isOtherSelected = selectedReason === 'other';
  const canSubmit = selectedReason && (!isOtherSelected || additionalNotes.trim().length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-error-600" />
            Reject Order Request
          </DialogTitle>
          <DialogDescription>
            You are rejecting order <strong>{orderNumber}</strong> for <strong>{itemName}</strong>.
            Please select a reason below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-neutral-900">
              Reason for rejection <span className="text-error-600">*</span>
            </Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {REJECTION_REASONS.map((reason) => (
                <div
                  key={reason.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border-2 border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedReason(reason.id)}
                >
                  <RadioGroupItem value={reason.id} id={reason.id} className="mt-0.5" />
                  <div className="flex-1 cursor-pointer">
                    <Label
                      htmlFor={reason.id}
                      className="text-sm font-medium text-neutral-900 cursor-pointer"
                    >
                      {reason.label}
                    </Label>
                    <p className="text-xs text-neutral-500 mt-0.5">{reason.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Notes - shown always but required only for "Other" */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-neutral-900">
              Additional notes {isOtherSelected && <span className="text-error-600">*</span>}
              {!isOtherSelected && <span className="text-neutral-500 font-normal">(optional)</span>}
            </Label>
            <Textarea
              id="notes"
              placeholder={isOtherSelected ? 'Please provide details...' : 'Any additional information...'}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="bg-warning-50 border-2 border-warning-200 rounded-lg p-3">
            <p className="text-xs text-warning-800">
              <strong>Note:</strong> Frequent rejections may affect your vendor rating and future order allocation.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-error-600 hover:bg-error-700 text-white"
          >
            {isSubmitting ? 'Rejecting...' : 'Reject Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
