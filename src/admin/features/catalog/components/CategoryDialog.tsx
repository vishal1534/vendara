/**
 * Category Dialog Component - Admin Portal
 * Create and edit material categories
 */

import { useState, useEffect } from 'react';
import { CategoryFormData } from '../../../types/catalog';
import { categoryIconOptions } from '../../../data/mockCategories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../app/components/ui/dialog';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Textarea } from '../../../../app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { toast } from 'sonner';
import { Package } from 'lucide-react';

interface CategoryDialogProps {
  category?: CategoryFormData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CategoryFormData) => void;
}

export function CategoryDialog({ category, isOpen, onClose, onSave }: CategoryDialogProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    iconName: 'Package',
  });
  const [initialData, setInitialData] = useState<CategoryFormData>({
    name: '',
    description: '',
    iconName: 'Package',
  });
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        iconName: category.iconName,
      });
      setInitialData({
        name: category.name,
        description: category.description,
        iconName: category.iconName,
      });
    } else {
      const emptyData = {
        name: '',
        description: '',
        iconName: 'Package',
      };
      setFormData(emptyData);
      setInitialData(emptyData);
    }
  }, [category, isOpen]);

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

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.iconName) {
      newErrors.iconName = 'Please select an icon';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    onSave(formData);
    toast.success(
      category 
        ? 'Category updated successfully' 
        : 'Category created successfully'
    );
    onClose();
  };

  const selectedIconOption = categoryIconOptions.find(opt => opt.value === formData.iconName);
  const SelectedIcon = selectedIconOption?.Icon || Package;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {category ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {category
                ? 'Update category details and settings'
                : 'Add a new material category to organize your catalog'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-error-600">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Cement, Steel, Bricks"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={errors.name ? 'border-error-600' : ''}
              />
              {errors.name && (
                <p className="text-xs text-error-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <Label htmlFor="icon">
                Icon <span className="text-error-600">*</span>
              </Label>
              <Select
                value={formData.iconName}
                onValueChange={(value) => setFormData({ ...formData, iconName: value })}
              >
                <SelectTrigger className={errors.iconName ? 'border-error-600' : ''}>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <SelectedIcon className="w-4 h-4" />
                      <span>{selectedIconOption?.label || 'Select icon'}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoryIconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.iconName && (
                <p className="text-xs text-error-600">{errors.iconName}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {category ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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