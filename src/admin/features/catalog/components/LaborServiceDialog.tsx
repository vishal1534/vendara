/**
 * Labor Service Dialog Component
 * Add/Edit labor service items
 */

import { useState, useEffect } from 'react';
import { LaborService } from '../../../types/catalog';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';

interface LaborServiceDialogProps {
  service?: LaborService;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<LaborService>) => void;
}

export function LaborServiceDialog({ service, isOpen, onClose, onSave }: LaborServiceDialogProps) {
  const [formData, setFormData] = useState<Partial<LaborService>>({
    serviceName: '',
    category: '',
    skillLevel: '',
    baseRate: 0,
    unit: '',
    description: '',
    status: 'active',
  });
  const [initialData, setInitialData] = useState<Partial<LaborService>>({});
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData(service);
      setInitialData(service);
    } else {
      const emptyData = {
        serviceName: '',
        category: '',
        skillLevel: '',
        baseRate: 0,
        unit: '',
        description: '',
        status: 'active',
      };
      setFormData(emptyData);
      setInitialData(emptyData);
    }
  }, [service, isOpen]);

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
    
    // Validation
    if (!formData.serviceName || !formData.category || !formData.skillLevel || !formData.baseRate || !formData.unit) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave(formData);
    onClose();
    toast.success(service ? 'Service updated successfully' : 'Service added successfully');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              {service ? 'Edit Labor Service' : 'Add New Labor Service'}
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
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Service Name <span className="text-error-600">*</span>
                </label>
                <Input
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  placeholder="e.g., Mason (Skilled)"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category <span className="text-error-600">*</span>
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masonry">Masonry</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Welding">Welding</SelectItem>
                    <SelectItem value="General Labor">General Labor</SelectItem>
                    <SelectItem value="Tiling">Tiling</SelectItem>
                    <SelectItem value="Flooring">Flooring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Skill Level <span className="text-error-600">*</span>
                </label>
                <Select
                  value={formData.skillLevel}
                  onValueChange={(value) => setFormData({ ...formData, skillLevel: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unskilled">Unskilled</SelectItem>
                    <SelectItem value="semi-skilled">Semi-Skilled</SelectItem>
                    <SelectItem value="skilled">Skilled</SelectItem>
                    <SelectItem value="highly-skilled">Highly Skilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Base Rate (₹) <span className="text-error-600">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.baseRate}
                    onChange={(e) => setFormData({ ...formData, baseRate: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Unit <span className="text-error-600">*</span>
                  </label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Hour</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
            <Button variant="outline" onClick={handleCloseAttempt}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {service ? 'Update Service' : 'Add Service'}
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