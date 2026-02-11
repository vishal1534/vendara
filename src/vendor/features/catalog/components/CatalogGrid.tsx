import { formatCurrency } from '../../../utils/formatCurrency';
import { Badge } from '../../../../app/components/ui/badge';
import { Switch } from '../../../../app/components/ui/switch';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CatalogItem } from '../../../mocks/catalog.mock';

interface CatalogGridProps {
  items: CatalogItem[];
  onToggleItem: (itemId: string) => void;
}

/**
 * CatalogGrid Component
 * 
 * Displays catalog items in a card-based grid layout.
 * Industry standard design following Shopify/Amazon Seller patterns.
 */
export function CatalogGrid({ items, onToggleItem }: CatalogGridProps) {
  const navigate = useNavigate();

  const categoryLabels: Record<string, string> = {
    cement: 'Cement',
    sand: 'Sand',
    aggregate: 'Aggregate',
    steel: 'Steel',
    bricks: 'Bricks',
  };

  const categoryColors: Record<string, string> = {
    cement: 'bg-blue-100 text-blue-700 border-blue-200',
    sand: 'bg-amber-100 text-amber-700 border-amber-200',
    aggregate: 'bg-gray-100 text-gray-700 border-gray-200',
    steel: 'bg-slate-100 text-slate-700 border-slate-200',
    bricks: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
        <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No items found</h3>
        <p className="text-sm text-neutral-500">
          Try adjusting your filters to see more items
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`materials/${item.id}`)}
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
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${categoryColors[item.category] || 'bg-neutral-100 text-neutral-700'}`}
              >
                {categoryLabels[item.category] || item.category}
              </Badge>
              
              {/* Status Badge */}
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
                  Not Added
                </Badge>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">
                {formatCurrency(item.payoutPerUnit)}
              </span>
              <span className="text-sm text-neutral-500">/ {item.unit}</span>
            </div>

            {/* Specifications */}
            {item.specifications && (
              <div className="pt-2 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                  Specifications
                </p>
                <p className="text-sm text-neutral-700">
                  {item.specifications}
                </p>
              </div>
            )}
          </div>

          {/* Card Footer - Action Hint */}
          <div className={`px-4 py-2 border-t-2 ${
            item.isAvailable 
              ? 'bg-primary-50 border-primary-100' 
              : 'bg-neutral-50 border-neutral-200'
          }`}>
            <p className="text-xs text-neutral-600">
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