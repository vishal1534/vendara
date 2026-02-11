/**
 * Delivery Zone Dialog Component
 * Add/Edit delivery zones
 */

import { useState, useEffect } from 'react';
import { DeliveryZone } from '../../../types/delivery';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';

interface DeliveryZoneDialogProps {
  zone?: DeliveryZone;
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: Partial<DeliveryZone>) => void;
}

export function DeliveryZoneDialog({ zone, isOpen, onClose, onSave }: DeliveryZoneDialogProps) {
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({
    zoneName: '',
    areas: [],
    baseDeliveryFee: 0,
    freeDeliveryThreshold: 0,
    estimatedDeliveryTime: '',
    status: 'active',
  });
  const [initialData, setInitialData] = useState<Partial<DeliveryZone>>({});
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [newArea, setNewArea] = useState('');

  useEffect(() => {
    if (zone) {
      setFormData(zone);
      setInitialData(zone);
    } else {
      const emptyData = {
        zoneName: '',
        areas: [],
        baseDeliveryFee: 0,
        freeDeliveryThreshold: 0,
        estimatedDeliveryTime: '',
        status: 'active' as const,
      };
      setFormData(emptyData);
      setInitialData(emptyData);
    }
  }, [zone, isOpen]);

  const hasUnsavedChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.zoneName || !formData.areas.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedData = {
      ...formData,
      areas: formData.areas.map(a => a.trim()).filter(a => a),
    };

    onSave(updatedData);
    onClose();
    toast.success(zone ? 'Delivery zone updated successfully' : 'Delivery zone added successfully');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              {zone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
            </h2>
            <button
              onClick={handleCloseAttempt}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-4">
              {/* Zone Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Zone Name <span className="text-error-600">*</span>
                </label>
                <Input
                  value={formData.zoneName}
                  onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                  placeholder="e.g., Central Hyderabad"
                  required
                />
              </div>

              {/* Areas */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Areas (comma separated) <span className="text-error-600">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  rows={3}
                  value={formData.areas.join(', ')}
                  onChange={(e) => setFormData({ ...formData, areas: e.target.value.split(',').map(a => a.trim()).filter(a => a) })}
                  placeholder="e.g., Madhapur, HITEC City, Gachibowli"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Enter area names separated by commas
                </p>
              </div>

              {/* Delivery Fee and Min Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Base Delivery Fee (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.baseDeliveryFee}
                    onChange={(e) => setFormData({ ...formData, baseDeliveryFee: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Free Delivery Threshold (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.freeDeliveryThreshold}
                    onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Estimated Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Estimated Delivery Time
                </label>
                <Input
                  value={formData.estimatedDeliveryTime}
                  onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                  placeholder="e.g., Same day"
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
            <Button variant="outline" onClick={handleCloseAttempt}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {zone ? 'Update Zone' : 'Add Zone'}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={showCloseConfirm}
        onOpenChange={setShowCloseConfirm}
        onConfirm={handleConfirmClose}
        title="Discard Changes"
        description="You have unsaved changes. Are you sure you want to close without saving?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="warning"
      />
    </>
  );
}