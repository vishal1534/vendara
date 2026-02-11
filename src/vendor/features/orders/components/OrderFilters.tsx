import { VendorOrderStatus } from '../../../constants/vendorOrderStates';
import { Button } from '../../../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import { Search, X } from 'lucide-react';

export interface OrderFilterState {
  status: VendorOrderStatus | 'all';
  search: string;
}

interface OrderFiltersProps {
  filters: OrderFilterState;
  onFilterChange: (filters: OrderFilterState) => void;
  orderCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function OrderFilters({ filters, onFilterChange, orderCounts }: OrderFiltersProps) {
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value as VendorOrderStatus | 'all',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleClearSearch = () => {
    onFilterChange({
      ...filters,
      search: '',
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: 'all',
      search: '',
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.search !== '';

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filters.status === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange('all')}
          className={
            filters.status === 'all'
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }
        >
          All Orders
          <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
            {orderCounts.all}
          </span>
        </Button>

        <Button
          variant={
            filters.status === VendorOrderStatus.OFFERED ||
            filters.status === VendorOrderStatus.ACCEPTED ||
            filters.status === VendorOrderStatus.IN_PROGRESS
              ? 'default'
              : 'outline'
          }
          size="sm"
          onClick={() => handleStatusChange(VendorOrderStatus.ACCEPTED)}
          className={
            filters.status === VendorOrderStatus.OFFERED ||
            filters.status === VendorOrderStatus.ACCEPTED ||
            filters.status === VendorOrderStatus.IN_PROGRESS
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }
        >
          Active
          <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
            {orderCounts.active}
          </span>
        </Button>

        <Button
          variant={filters.status === VendorOrderStatus.COMPLETED ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange(VendorOrderStatus.COMPLETED)}
          className={
            filters.status === VendorOrderStatus.COMPLETED
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }
        >
          Completed
          <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
            {orderCounts.completed}
          </span>
        </Button>
      </div>

      {/* Search and Status Dropdown */}
      <div className="flex gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by order number or item name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 pr-10 border-neutral-300"
          />
          {filters.search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px] border-neutral-300">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={VendorOrderStatus.OFFERED}>New Offers</SelectItem>
            <SelectItem value={VendorOrderStatus.ACCEPTED}>Accepted</SelectItem>
            <SelectItem value={VendorOrderStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={VendorOrderStatus.READY}>Ready</SelectItem>
            <SelectItem value={VendorOrderStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={VendorOrderStatus.REJECTED}>Rejected</SelectItem>
            <SelectItem value={VendorOrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
