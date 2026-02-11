/**
 * Material Details Page - Vendor Portal
 * View detailed information about a specific material in the catalog
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card } from '../../../../app/components/ui/card';
import { Switch } from '../../../../app/components/ui/switch';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { mockCatalog } from '../../../mocks/catalog.mock';
import { formatCurrency } from '../../../utils/formatCurrency';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  cement: 'Cement',
  sand: 'Sand',
  aggregate: 'Aggregate',
  steel: 'Steel',
  bricks: 'Bricks',
};

export function MaterialDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find material from mock data
  const material = mockCatalog.find((m) => m.id === id);
  
  const [isInCatalog, setIsInCatalog] = useState(material?.isAvailable || false);

  if (!material) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900">Material not found</h2>
          <p className="text-neutral-600 mt-2">The material you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/vendor/catalog')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleCatalog = () => {
    setIsInCatalog(!isInCatalog);
    toast.success(
      !isInCatalog
        ? `${material.name} added to your catalog`
        : `${material.name} removed from your catalog`
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/vendor/catalog')}
        className="text-neutral-600 hover:text-neutral-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Button>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-neutral-900">{material.name}</h1>
            <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200">
              {categoryLabels[material.category] || material.category}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600">
            SKU: {material.id}
          </p>
        </div>

        {/* Add/Remove Toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${
            isInCatalog ? 'text-primary-700' : 'text-neutral-600'
          }`}>
            {isInCatalog ? 'In My Catalog' : 'Not in Catalog'}
          </span>
          <Switch
            checked={isInCatalog}
            onCheckedChange={handleToggleCatalog}
            className="data-[state=checked]:bg-primary-600"
          />
        </div>
      </div>

      {/* Information Banner */}
      {!isInCatalog && (
        <div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-900">Not in your catalog</p>
              <p className="text-sm text-warning-800 mt-1">
                Add this material to start receiving order requests from buyers in your service areas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            {/* Material Image */}
            {material.imageUrl && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Material Image</label>
                <div className="mt-2 w-32 h-32 bg-neutral-50 border-2 border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={material.imageUrl} 
                    alt={material.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-neutral-700">Material Name</label>
              <p className="text-sm text-neutral-900 mt-1">{material.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">Category</label>
              <p className="text-sm text-neutral-900 mt-1">
                {categoryLabels[material.category] || material.category}
              </p>
            </div>

            {material.brandName && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Brand Name</label>
                <p className="text-sm text-neutral-900 mt-1">{material.brandName}</p>
              </div>
            )}

            {material.description && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Description</label>
                <p className="text-sm text-neutral-900 mt-1">{material.description}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-neutral-700">Unit of Measurement</label>
              <p className="text-sm text-neutral-900 mt-1 capitalize">{material.unit}</p>
            </div>
          </div>
        </Card>

        {/* Pricing & Specifications */}
        <Card className="p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pricing & Specifications</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700">Your Payout Per Unit</label>
              <p className="text-2xl font-semibold text-primary-700 mt-1">
                {formatCurrency(material.payoutPerUnit)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                You earn this amount per {material.unit} sold
              </p>
            </div>

            {material.specifications && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Specifications</label>
                <p className="text-sm text-neutral-900 mt-1">{material.specifications}</p>
              </div>
            )}

            <div className="pt-4 border-t-2 border-neutral-200">
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">Payout Information</h4>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Fixed payout rate per unit delivered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>No price negotiation required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Payment settled after successful delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Metadata */}
      <Card className="p-6 border-2 border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-700">Material ID / SKU</label>
            <p className="text-sm text-neutral-900 mt-1 font-mono">{material.id}</p>
          </div>
          {material.hsn && (
            <div>
              <label className="text-sm font-medium text-neutral-700">HSN Code</label>
              <p className="text-sm text-neutral-900 mt-1">{material.hsn}</p>
            </div>
          )}
          {material.gstRate && (
            <div>
              <label className="text-sm font-medium text-neutral-700">GST Rate</label>
              <p className="text-sm text-neutral-900 mt-1">{material.gstRate}%</p>
            </div>
          )}
        </div>
      </Card>

      {/* How It Works */}
      <Card className="p-6 border-2 border-neutral-200 bg-neutral-50">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">How It Works</h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">1.</span>
            Add materials to your catalog using the toggle above
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">2.</span>
            Buyers in your service areas can see and order these materials
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">3.</span>
            Accept orders, deliver materials, and earn your payout per unit
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">4.</span>
            Payments are settled to your account after successful delivery confirmation
          </p>
        </div>
      </Card>
    </div>
  );
}