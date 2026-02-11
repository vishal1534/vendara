/**
 * Material Dialog Component
 * Add/Edit material items
 */

import { useState, useEffect } from 'react';
import { Material } from '../../../types/catalog';
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

interface MaterialDialogProps {
  material?: Material;
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Partial<Material>) => void;
}

export function MaterialDialog({ material, isOpen, onClose, onSave }: MaterialDialogProps) {
  const [formData, setFormData] = useState<Partial<Material>>({
    name: '',
    category: '',
    unit: '',
    basePrice: 0,
    description: '',
    brandName: '',
    status: 'active',
  });
  const [initialData, setInitialData] = useState<Partial<Material>>({});
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  useEffect(() => {
    if (material) {
      setFormData(material);
      setInitialData(material);
    } else {
      const emptyData = {
        name: '',
        category: '',
        unit: '',
        basePrice: 0,
        description: '',
        brandName: '',
        status: 'active',
      };
      setFormData(emptyData);
      setInitialData(emptyData);
    }
  }, [material, isOpen]);

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
    if (!formData.name || !formData.category || !formData.unit || !formData.basePrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave(formData);
    onClose();
    toast.success(material ? 'Material updated successfully' : 'Material added successfully');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              {material ? 'Edit Material' : 'Add New Material'}
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
              {/* Material Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Material Name <span className="text-error-600">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Portland Pozzolana Cement"
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
                    <SelectItem value="Cement & Concrete">Cement & Concrete</SelectItem>
                    <SelectItem value="Bricks & Blocks">Bricks & Blocks</SelectItem>
                    <SelectItem value="Steel & Metal">Steel & Metal</SelectItem>
                    <SelectItem value="Sand & Aggregates">Sand & Aggregates</SelectItem>
                    <SelectItem value="Paint & Coating">Paint & Coating</SelectItem>
                    <SelectItem value="Tiles & Flooring">Tiles & Flooring</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Brand Name
                </label>
                <Input
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="e.g., UltraTech"
                />
              </div>

              {/* Base Price and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Base Price (₹) <span className="text-error-600">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
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
                      <SelectItem value="bag">Bag</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="sq ft">Square Feet (sq ft)</SelectItem>
                      <SelectItem value="sq m">Square Meter (sq m)</SelectItem>
                      <SelectItem value="cu ft">Cubic Feet (cu ft)</SelectItem>
                      <SelectItem value="cu m">Cubic Meter (cu m)</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
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
                  placeholder="Enter material description..."
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
            <Button type="button" variant="outline" onClick={handleCloseAttempt}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {material ? 'Update Material' : 'Add Material'}
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