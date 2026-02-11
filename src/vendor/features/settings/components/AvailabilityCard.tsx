import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Switch } from '../../../../app/components/ui/switch';
import { Power, MessageCircle } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';

interface AvailabilityCardProps {
  isAvailable: boolean;
  onToggle: () => void;
}

export function AvailabilityCard({ isAvailable, onToggle }: AvailabilityCardProps) {
  const handleWhatsAppClick = () => {
    const message = isAvailable ? 'UNAVAILABLE' : 'AVAILABLE';
    const url = `https://wa.me/917906441952?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="w-5 h-5 text-primary-700" />
          Availability Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className="flex items-center justify-between p-5 bg-neutral-50 rounded-lg border-2 border-neutral-200 mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isAvailable ? 'bg-success-100' : 'bg-neutral-200'
            }`}>
              <Power className={`w-6 h-6 ${isAvailable ? 'text-success-700' : 'text-neutral-500'}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-0.5">
                Currently {isAvailable ? 'Available' : 'Unavailable'}
              </h3>
              <p className="text-sm text-neutral-600">
                {isAvailable 
                  ? 'You are receiving new order notifications' 
                  : 'New orders are not being sent to you'}
              </p>
            </div>
          </div>
          
          {/* Visual Indicator */}
          <div className="flex items-center gap-2">
            <Switch 
              checked={isAvailable}
              onCheckedChange={onToggle}
              style={{
                backgroundColor: isAvailable ? '#22C55E' : undefined,
                opacity: 1
              }}
            />
          </div>
        </div>

        {/* WhatsApp Update Instructions */}
        <div className="bg-success-50 border-2 border-success-200 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-success-700" />
            How to Update Availability
          </h4>
          
          <div className="space-y-2 mb-4">
            <div className="flex gap-2 text-sm text-neutral-700">
              <span className="flex-shrink-0 w-5 h-5 bg-neutral-200 text-neutral-700 rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </span>
              <p>Send a WhatsApp message to Vendara</p>
            </div>
            <div className="flex gap-2 text-sm text-neutral-700">
              <span className="flex-shrink-0 w-5 h-5 bg-neutral-200 text-neutral-700 rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </span>
              <p>Type <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono">AVAILABLE</code> or <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono">UNAVAILABLE</code></p>
            </div>
            <div className="flex gap-2 text-sm text-neutral-700">
              <span className="flex-shrink-0 w-5 h-5 bg-neutral-200 text-neutral-700 rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </span>
              <p>Your status will update within 1 minute</p>
            </div>
          </div>
          
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-success-600 hover:bg-success-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
          </Button>
        </div>

        {/* Status Explanation */}
        <div className="p-4 bg-neutral-50 border-2 border-neutral-200 rounded-lg">
          <p className="text-sm text-neutral-700">
            <strong>Important:</strong> When unavailable, you won't receive new order offers. 
            Existing accepted orders will continue as normal. Always update your status when 
            closing for the day or taking a break.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}