/**
 * Delivery Zones Page - Admin Portal
 * Manage delivery zones, pricing, and coverage areas
 */

import { useState } from 'react';
import { DeliveryZoneDialog } from '../components/DeliveryZoneDialog';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Switch } from '../../../../app/components/ui/switch';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  IndianRupee,
  Truck,
  Map,
} from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryZone {
  id: string;
  name: string;
  areas: string[];
  baseFee: number;
  freeDeliveryThreshold: number;
  estimatedTime: string;
  isActive: boolean;
}

const mockDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone_001',
    name: 'Kukatpally Zone',
    areas: ['Kukatpally', 'KPHB', 'Miyapur', 'Bachupally'],
    baseFee: 300,
    freeDeliveryThreshold: 10000,
    estimatedTime: '2-4 hours',
    isActive: true,
  },
  {
    id: 'zone_002',
    name: 'Madhapur Zone',
    areas: ['Madhapur', 'Gachibowli', 'Kondapur', 'Hitech City'],
    baseFee: 400,
    freeDeliveryThreshold: 15000,
    estimatedTime: '3-5 hours',
    isActive: true,
  },
  {
    id: 'zone_003',
    name: 'Nizampet Zone',
    areas: ['Nizampet', 'Kompally', 'Quthbullapur'],
    baseFee: 500,
    freeDeliveryThreshold: 12000,
    estimatedTime: '4-6 hours',
    isActive: true,
  },
];

export function DeliveryZonesPage() {
  const [deliveryZones, setDeliveryZones] = useState(mockDeliveryZones);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | undefined>();

  const handleAddZone = () => {
    setSelectedZone(undefined);
    setIsZoneDialogOpen(true);
  };

  const handleEditZone = (id: string) => {
    const zone = deliveryZones.find(z => z.id === id);
    if (zone) {
      setSelectedZone({
        id: zone.id,
        zoneName: zone.name,
        areas: zone.areas,
        deliveryFee: zone.baseFee,
        minOrderValue: zone.freeDeliveryThreshold,
        estimatedDeliveryTime: zone.estimatedTime,
        status: zone.isActive ? 'active' : 'inactive',
      } as any);
      setIsZoneDialogOpen(true);
    }
  };

  const handleSaveZone = (zoneData: any) => {
    if (selectedZone) {
      // Update existing zone
      setDeliveryZones(deliveryZones.map(z => 
        z.id === selectedZone.id ? {
          ...z,
          name: zoneData.zoneName,
          areas: zoneData.areas,
          baseFee: zoneData.deliveryFee,
          freeDeliveryThreshold: zoneData.minOrderValue,
          estimatedTime: zoneData.estimatedDeliveryTime,
        } : z
      ));
    } else {
      // Add new zone
      const newZone: DeliveryZone = {
        id: `zone_${Date.now()}`,
        name: zoneData.zoneName,
        areas: zoneData.areas,
        baseFee: zoneData.deliveryFee,
        freeDeliveryThreshold: zoneData.minOrderValue,
        estimatedTime: zoneData.estimatedDeliveryTime,
        isActive: true,
      };
      setDeliveryZones([...deliveryZones, newZone]);
    }
  };

  const handleDeleteZone = (id: string) => {
    setDeliveryZones(deliveryZones.filter(z => z.id !== id));
    toast.success('Delivery zone deleted');
  };

  const handleToggleZone = (id: string) => {
    setDeliveryZones(deliveryZones.map(z =>
      z.id === id ? { ...z, isActive: !z.isActive } : z
    ));
    const zone = deliveryZones.find(z => z.id === id);
    toast.success(zone?.isActive ? 'Zone deactivated' : 'Zone activated');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeZonesCount = deliveryZones.filter(z => z.isActive).length;
  const totalAreasCount = deliveryZones.reduce((acc, zone) => acc + zone.areas.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Delivery Zones</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage delivery zones, pricing, and service areas
          </p>
        </div>
        <Button onClick={handleAddZone}>
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Zones</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {deliveryZones.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Map className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Zones</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {activeZonesCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Service Areas</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {totalAreasCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Zones List */}
      <div className="space-y-4">
        {deliveryZones.map(zone => (
          <div
            key={zone.id}
            className="bg-white border border-neutral-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {zone.name}
                  </h3>
                  {zone.isActive ? (
                    <Badge variant="default" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Inactive
                    </Badge>
                  )}
                </div>

                {/* Areas */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">
                      {zone.areas.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Delivery Fee</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {formatCurrency(zone.baseFee)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Free Delivery Above</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {formatCurrency(zone.freeDeliveryThreshold)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Estimated Time</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {zone.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <Switch
                  checked={zone.isActive}
                  onCheckedChange={() => handleToggleZone(zone.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditZone(zone.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteZone(zone.id)}
                >
                  <Trash2 className="w-4 h-4 text-error-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {deliveryZones.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No delivery zones yet
          </h3>
          <p className="text-neutral-600 mb-4">
            Create your first delivery zone to start accepting orders
          </p>
          <Button onClick={handleAddZone}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Zone
          </Button>
        </div>
      )}

      {/* Dialog */}
      <DeliveryZoneDialog
        zone={selectedZone}
        isOpen={isZoneDialogOpen}
        onClose={() => {
          setIsZoneDialogOpen(false);
          setSelectedZone(undefined);
        }}
        onSave={handleSaveZone}
      />
    </div>
  );
}
