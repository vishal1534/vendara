import { formatCurrency } from '../../../utils/formatCurrency';
import { Badge } from '../../../../app/components/ui/badge';
import { Switch } from '../../../../app/components/ui/switch';
import { Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ServiceItem } from '../../../mocks/catalog.mock';

interface ServicesGridProps {
  items: ServiceItem[];
  onToggleItem: (itemId: string) => void;
}

/**
 * ServicesGrid Component
 * 
 * Displays service items in a card-based grid layout.
 * Industry standard design following Shopify/Amazon Seller patterns.
 */
export function ServicesGrid({ items, onToggleItem }: ServicesGridProps) {
  const navigate = useNavigate();

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

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
        <Wrench className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No services found</h3>
        <p className="text-sm text-neutral-500">
          Try adjusting your filters to see more services
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`services/${item.id}`)}
          className={`bg-white rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${
            item.isAvailable
              ? 'border-primary-200 bg-primary-50/30'
              : 'border-neutral-200'
          }`}
        >
          {/* Card Header */}
          <div className="p-4 border-b-2 border-neutral-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 truncate">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              
              {/* Status Toggle */}
              <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={item.isAvailable}
                  onCheckedChange={() => onToggleItem(item.id)}
                  className="data-[state=checked]:bg-primary-600"
                />
              </div>
            </div>

            {/* Category Badge */}
            <div className="mt-3">
              <Badge
                variant="outline"
                className={`text-xs ${skillTypeColors[item.skillType] || 'bg-neutral-100 text-neutral-700'}`}
              >
                {skillTypeLabels[item.skillType] || item.skillType}
              </Badge>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            {/* Rate Information */}
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-neutral-500">Payout Rate</p>
                <p className="text-lg font-bold text-neutral-900 mt-0.5">
                  {formatCurrency(item.payoutPerUnit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500">Rate Type</p>
                <p className="text-sm font-medium text-neutral-700 mt-0.5 capitalize">
                  {item.rateType}
                </p>
              </div>
            </div>

            {/* Unit */}
            <div className="pt-2 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                Per {item.unit}
              </p>
            </div>

            {/* Status Badge */}
            <div className="pt-2">
              {item.isAvailable ? (
                <Badge
                  variant="outline"
                  className="text-xs bg-primary-100 text-primary-700 border-primary-300"
                >
                  In Catalog
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs bg-neutral-100 text-neutral-600 border-neutral-300"
                >
                  Not in Catalog
                </Badge>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-4 py-3 bg-neutral-50 border-t-2 border-neutral-200 rounded-b-xl">
            <p className="text-xs text-neutral-500 text-center">
              {item.isAvailable 
                ? '✓ Visible to buyers' 
                : 'Toggle switch to add to catalog'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}