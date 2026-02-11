import { MapPin, Calendar, Truck, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Separator } from '../../../../app/components/ui/separator';
import { formatDate } from '../../../utils/formatDate';

interface DeliveryInformationCardProps {
  deliveryDate: string;
  deliveryTimeSlot: {
    startTime: string;
    endTime: string;
  };
  deliveryArea: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  deliveryMethod?: 'vendor' | 'platform';
}

export function DeliveryInformationCard({
  deliveryDate,
  deliveryTimeSlot,
  deliveryArea,
  deliveryAddress,
  deliveryInstructions,
  deliveryMethod = 'vendor',
}: DeliveryInformationCardProps) {
  const handleViewMap = () => {
    // Open Google Maps with the delivery address
    const address = deliveryAddress || deliveryArea;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary-600" />
          Delivery Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Delivery Date & Time */}
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide flex items-center gap-1 mb-2">
            <Calendar className="w-3 h-3" />
            Delivery Date & Time
          </label>
          <p className="text-base font-semibold text-neutral-900">{formatDate(deliveryDate)}</p>
          <p className="text-sm text-neutral-600 mt-0.5">
            {deliveryTimeSlot.startTime} - {deliveryTimeSlot.endTime}
          </p>
        </div>

        <Separator />

        {/* Delivery Method */}
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Delivery Method
          </label>
          <p className="text-base text-neutral-900 mt-1">
            {deliveryMethod === 'vendor' ? 'Vendor Self-Delivery' : 'Platform Logistics'}
          </p>
        </div>

        <Separator />

        {/* Delivery Address */}
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" />
            Delivery Address
          </label>
          {deliveryAddress ? (
            <p className="text-sm text-neutral-900 leading-relaxed whitespace-pre-line">
              {deliveryAddress}
            </p>
          ) : (
            <p className="text-sm text-neutral-900">{deliveryArea}</p>
          )}
        </div>

        {/* Delivery Instructions */}
        {deliveryInstructions && (
          <>
            <Separator />
            <div className="bg-warning-50 border-2 border-warning-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-warning-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-warning-900 uppercase tracking-wide mb-1">
                    Special Instructions
                  </p>
                  <p className="text-sm text-warning-800 whitespace-pre-line leading-relaxed">
                    {deliveryInstructions}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* View on Map Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewMap}
          className="w-full justify-start border-2 border-neutral-200 hover:bg-blue-50 hover:border-blue-300"
        >
          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
          View on Map
          <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
        </Button>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-600">
            Ensure the materials are delivered to the correct location within the specified time slot.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
