import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Switch } from '../../../../app/components/ui/switch';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Plus, Minus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CatalogItem } from '../../../mocks/catalog.mock';

interface CatalogTableProps {
  items: CatalogItem[];
  showAvailabilityColumn?: boolean;
  onToggleItem?: (itemId: string) => void;
  showActions?: boolean;
}

/**
 * CatalogTable Component
 * 
 * Displays catalog items in a professional table format.
 * Design: Desktop-optimized data table with construction-native styling.
 */
export function CatalogTable({ 
  items, 
  showAvailabilityColumn = true,
  onToggleItem,
  showActions = false
}: CatalogTableProps) {
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

  const columns: Column<CatalogItem>[] = [
    {
      key: 'name',
      label: 'Item Name',
      sortable: true,
      width: '30%',
      render: (item) => (
        <div>
          <div className="font-medium text-neutral-900">{item.name}</div>
          {item.description && (
            <div className="text-sm text-neutral-500 mt-0.5">{item.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      width: '12%',
      render: (item) => (
        <Badge
          variant="outline"
          className={`text-xs ${categoryColors[item.category] || 'bg-neutral-100 text-neutral-700'}`}
        >
          {categoryLabels[item.category] || item.category}
        </Badge>
      ),
    },
    {
      key: 'unit',
      label: 'Unit',
      sortable: true,
      width: '10%',
      render: (item) => (
        <span className="text-sm text-neutral-700 capitalize">{item.unit}</span>
      ),
    },
    {
      key: 'payoutPerUnit',
      label: 'Payout/Unit',
      sortable: true,
      width: '12%',
      render: (item) => (
        <span className="font-semibold text-neutral-900">
          {formatCurrency(item.payoutPerUnit)}
        </span>
      ),
    },
    {
      key: 'specifications',
      label: 'Specifications',
      width: '26%',
      render: (item) => (
        <span className="text-sm text-neutral-600">{item.specifications || '—'}</span>
      ),
    },
  ];

  // Add actions column with toggle switch
  if (showActions && onToggleItem) {
    columns.push({
      key: 'actions',
      label: 'Add/Remove',
      align: 'center',
      width: '10%',
      render: (item) => (
        <div className="flex justify-center">
          <Switch
            checked={item.isAvailable}
            onCheckedChange={() => onToggleItem(item.id)}
            className="data-[state=checked]:bg-primary-600"
          />
        </div>
      ),
    });
  }

  if (items.length === 0) {
    return (
      <div className="border-2 border-neutral-200 rounded-xl p-12 text-center bg-white">
        <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No catalog items</h3>
        <p className="text-sm text-neutral-500">
          {showActions ? 'No items match your filters' : 'Your catalog is empty'}
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-neutral-200 rounded-xl overflow-hidden bg-white">
      <DataTable
        data={items}
        columns={columns}
        searchable={false}
        pageSize={20}
        emptyMessage="No items found"
        stickyHeader={true}
        showPageSizeSelector={true}
        showPaginationInfo={true}
        showFirstLastButtons={true}
        onRowClick={(item) => navigate(`materials/${item.id}`)}
        getRowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
      />
    </div>
  );
}