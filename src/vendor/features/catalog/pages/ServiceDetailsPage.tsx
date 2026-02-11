/**
 * Service Details Page - Vendor Portal
 * View detailed information about a specific labor service in the catalog
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card } from '../../../../app/components/ui/card';
import { Switch } from '../../../../app/components/ui/switch';
import {
  ArrowLeft,
  Wrench,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { mockServicesCatalog } from '../../../mocks/catalog.mock';
import { formatCurrency } from '../../../utils/formatCurrency';
import { toast } from 'sonner';

const skillTypeLabels: Record<string, string> = {
  mason: 'Mason',
  electrician: 'Electrician',
  plumber: 'Plumber',
  carpenter: 'Carpenter',
  painter: 'Painter',
  welder: 'Welder',
  helper: 'Helper',
};

const skillTypeColors: Record<string, string> = {
  mason: 'bg-orange-100 text-orange-700 border-orange-200',
  electrician: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  plumber: 'bg-blue-100 text-blue-700 border-blue-200',
  carpenter: 'bg-amber-100 text-amber-700 border-amber-200',
  painter: 'bg-purple-100 text-purple-700 border-purple-200',
  welder: 'bg-red-100 text-red-700 border-red-200',
  helper: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

export function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find service from mock data
  const service = mockServicesCatalog.find((s) => s.id === id);
  
  const [isInCatalog, setIsInCatalog] = useState(service?.isAvailable || false);

  if (!service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Wrench className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900">Service not found</h2>
          <p className="text-neutral-600 mt-2">The service you're looking for doesn't exist.</p>
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
        ? `${service.name} added to your catalog`
        : `${service.name} removed from your catalog`
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
            <h1 className="text-2xl font-bold text-neutral-900">{service.name}</h1>
            <Badge 
              variant="outline" 
              className={skillTypeColors[service.skillType] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}
            >
              {skillTypeLabels[service.skillType] || service.skillType}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600">
            SKU: {service.id}
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
                Add this service to start receiving booking requests from buyers in your service areas.
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
            <div>
              <label className="text-sm font-medium text-neutral-700">Service Name</label>
              <p className="text-sm text-neutral-900 mt-1">{service.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">Skill Type</label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${skillTypeColors[service.skillType] || 'bg-neutral-100 text-neutral-700'}`}
                >
                  {skillTypeLabels[service.skillType] || service.skillType}
                </Badge>
              </div>
            </div>

            {service.description && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Description</label>
                <p className="text-sm text-neutral-900 mt-1">{service.description}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-neutral-700">Rate Type</label>
              <p className="text-sm text-neutral-900 mt-1 capitalize">{service.rateType}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">Unit</label>
              <p className="text-sm text-neutral-900 mt-1 capitalize">{service.unit}</p>
            </div>
          </div>
        </Card>

        {/* Pricing & Details */}
        <Card className="p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pricing & Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700">Your Payout Per Unit</label>
              <p className="text-2xl font-semibold text-primary-700 mt-1">
                {formatCurrency(service.payoutPerUnit)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                You earn this amount per {service.unit} completed
              </p>
            </div>

            {service.minBookingHours && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Minimum Booking</label>
                <p className="text-sm text-neutral-900 mt-1">{service.minBookingHours} hours</p>
              </div>
            )}

            <div className="pt-4 border-t-2 border-neutral-200">
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">Payout Information</h4>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Fixed payout rate per unit completed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>No rate negotiation required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Payment settled after work completion</span>
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
            <label className="text-sm font-medium text-neutral-700">Service ID / SKU</label>
            <p className="text-sm text-neutral-900 mt-1 font-mono">{service.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Rate Type</label>
            <p className="text-sm text-neutral-900 mt-1 capitalize">{service.rateType}</p>
          </div>
          {service.minBookingHours && (
            <div>
              <label className="text-sm font-medium text-neutral-700">Min. Booking</label>
              <p className="text-sm text-neutral-900 mt-1">{service.minBookingHours} hours</p>
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
            Add services to your catalog using the toggle above
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">2.</span>
            Buyers in your service areas can see and book these services
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">3.</span>
            Accept bookings, complete the work, and earn your payout per unit
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary-600 font-bold min-w-[20px]">4.</span>
            Payments are settled to your account after work completion confirmation
          </p>
        </div>
      </Card>
    </div>
  );
}