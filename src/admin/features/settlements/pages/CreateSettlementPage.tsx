/**
 * Create Settlement Page - Admin Portal
 * Real Payment Service Integration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Calculator, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { GenerateSettlementRequest } from '../../../../types/payment';
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

export function CreateSettlementPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<GenerateSettlementRequest>({
    vendorId: '',
    periodStart: '',
    periodEnd: '',
    commissionPercentage: 5, // Default 5%
    adjustmentAmount: 0,
    notes: '',
  });

  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock vendor list (replace with real vendor data fetch)
  const [vendors] = useState([
    { id: 'vendor-001', name: 'Sri Lakshmi Cement Suppliers' },
    { id: 'vendor-002', name: 'Hyderabad Steel & Rods Pvt Ltd' },
    { id: 'vendor-003', name: 'RK Building Materials' },
  ]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendorId) {
      newErrors.vendorId = 'Please select a vendor';
    }

    if (!formData.periodStart) {
      newErrors.periodStart = 'Start date is required';
    }

    if (!formData.periodEnd) {
      newErrors.periodEnd = 'End date is required';
    }

    if (formData.periodStart && formData.periodEnd) {
      const start = new Date(formData.periodStart);
      const end = new Date(formData.periodEnd);
      if (end <= start) {
        newErrors.periodEnd = 'End date must be after start date';
      }
    }

    if (formData.commissionPercentage! < 0 || formData.commissionPercentage! > 100) {
      newErrors.commissionPercentage = 'Commission must be between 0-100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateSettlement = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    setGenerating(true);
    try {
      // Mock implementation - settlement generation would be handled by backend
      const mockSettlementId = `settlement_${Date.now()}`;
      toast.success('Settlement generated successfully (mock)');
      navigate(`/admin/settlements/${mockSettlementId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate settlement');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/settlements')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Settlement</h1>
            <p className="text-sm text-gray-600 mt-1">Create a new vendor settlement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h2 className="font-semibold text-lg mb-4">Settlement Details</h2>

              <div className="space-y-4">
                {/* Vendor Selection */}
                <div>
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Select
                    value={formData.vendorId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, vendorId: value }))
                    }
                  >
                    <SelectTrigger id="vendor" className={errors.vendorId ? 'border-error-500' : ''}>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vendorId && (
                    <p className="text-xs text-error-600 mt-1">{errors.vendorId}</p>
                  )}
                </div>

                {/* Period Start */}
                <div>
                  <Label htmlFor="periodStart">Period Start Date *</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, periodStart: e.target.value }))
                    }
                    className={errors.periodStart ? 'border-error-500' : ''}
                  />
                  {errors.periodStart && (
                    <p className="text-xs text-error-600 mt-1">{errors.periodStart}</p>
                  )}
                </div>

                {/* Period End */}
                <div>
                  <Label htmlFor="periodEnd">Period End Date *</Label>
                  <Input
                    id="periodEnd"
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, periodEnd: e.target.value }))
                    }
                    className={errors.periodEnd ? 'border-error-500' : ''}
                  />
                  {errors.periodEnd && (
                    <p className="text-xs text-error-600 mt-1">{errors.periodEnd}</p>
                  )}
                </div>

                {/* Commission Percentage */}
                <div>
                  <Label htmlFor="commission">Commission Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commissionPercentage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          commissionPercentage: parseFloat(e.target.value),
                        }))
                      }
                      className={errors.commissionPercentage ? 'border-error-500' : ''}
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  {errors.commissionPercentage && (
                    <p className="text-xs text-error-600 mt-1">{errors.commissionPercentage}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Default: 5% - Platform commission on gross sales
                  </p>
                </div>

                {/* Adjustment Amount */}
                <div>
                  <Label htmlFor="adjustment">Adjustment Amount (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">₹</span>
                    <Input
                      id="adjustment"
                      type="number"
                      step="0.01"
                      value={formData.adjustmentAmount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          adjustmentAmount: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Positive for additional charges, negative for discounts
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes about this settlement..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 sticky top-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How Settlements Work</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        The system will fetch all successful payments for the vendor in the selected period
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Commission is calculated as: Total Amount × Commission %
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Settlement Amount = Total Amount - Commission - Tax + Adjustments
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Vendor's bank details will be auto-fetched from Vendor Service
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-blue-300">
                <Button
                  onClick={handleGenerateSettlement}
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Generate Settlement
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}