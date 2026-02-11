import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Switch } from '../../../../app/components/ui/switch';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Plus, Minus, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ServiceItem } from '../../../mocks/catalog.mock';

interface ServicesTableProps {
  items: ServiceItem[];
  showAvailabilityColumn?: boolean;
  onToggleItem?: (itemId: string) => void;
  showActions?: boolean;
}

/**
 * ServicesTable Component
 * 
 * Displays service items in a professional table format.
 * Design: Desktop-optimized data table with construction-native styling.
 */
export function ServicesTable({ 
  items, 
  showAvailabilityColumn = true,
  onToggleItem,
  showActions = false
}: ServicesTableProps) {
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

  const columns: Column<ServiceItem>[] = [
    {
      key: 'name',
      label: 'Service Name',
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
      key: 'skillType',
      label: 'Skill Type',
      sortable: true,
      width: '14%',
      render: (item) => (
        <Badge
          variant="outline"
          className={`text-xs ${skillTypeColors[item.skillType] || 'bg-neutral-100 text-neutral-700'}`}
        >
          {skillTypeLabels[item.skillType] || item.skillType}
        </Badge>
      ),
    },
    {
      key: 'rateType',
      label: 'Rate Type',
      sortable: true,
      width: '12%',
      render: (item) => (
        <span className="text-sm text-neutral-700 capitalize">{item.rateType}</span>
      ),
    },
    {
      key: 'payoutPerUnit',
      label: 'Payout / Unit',
      sortable: true,
      width: '14%',
      render: (item) => (
        <div>
          <div className="font-semibold text-neutral-900">
            {formatCurrency(item.payoutPerUnit)}
          </div>
          <div className="text-xs text-neutral-500">per {item.unit}</div>
        </div>
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

  return (
    <DataTable
      data={items}
      columns={columns}
      emptyState={{
        icon: Wrench,
        title: 'No services found',
        description: 'No services match your current filters',
      }}
      onRowClick={(item) => navigate(`services/${item.id}`)}
      getRowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
    />
  );
}