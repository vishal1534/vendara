/**
 * Buyers Page - Admin Portal
 * Comprehensive buyer directory with filters and stats
 */

import { Badge } from '@/app/components/ui/badge';
import {
  Search,
  Download,
  Filter,
  Eye,
  Users,
  UserCheck,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buyer, BuyerStatus, BuyerType, BuyerFilters } from '@admin/types/buyer';
import { mockBuyers, mockBuyerStats } from '@admin/data/mockBuyers';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { SearchFilterSection } from '@admin/components/SearchFilterSection';
import { DataTable, Column } from '@admin/components/common/DataTable';
import { Card } from '@/app/components/ui/card';
import { formatCurrency, formatDate } from '../../../../shared/utils';

const statusConfig: Record<BuyerStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  suspended: { label: 'Suspended', variant: 'destructive' },
};

const typeConfig: Record<BuyerType, { label: string; color: string }> = {
  individual: { label: 'Individual', color: 'text-primary-700 bg-primary-50' },
  contractor: { label: 'Contractor', color: 'text-secondary-700 bg-secondary-50' },
  builder: { label: 'Builder', color: 'text-error-700 bg-error-50' },
};

export function BuyersPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<BuyerFilters>({
    status: 'all',
    type: 'all',
    search: '',
  });

  // Filter buyers
  const filteredBuyers = mockBuyers.filter((buyer) => {
    if (filters.status !== 'all' && buyer.status !== filters.status) return false;
    if (filters.type !== 'all' && buyer.type !== filters.type) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        buyer.name.toLowerCase().includes(search) ||
        buyer.phone.includes(search) ||
        buyer.email?.toLowerCase().includes(search) ||
        buyer.primaryLocation.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Active filters for chips
  const activeFilters = [];
  if (filters.status !== 'all') {
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusConfig[filters.status].label,
      onRemove: () => setFilters({ ...filters, status: 'all' }),
    });
  }
  if (filters.type !== 'all') {
    activeFilters.push({
      type: 'type',
      label: 'Type',
      value: typeConfig[filters.type].label,
      onRemove: () => setFilters({ ...filters, type: 'all' }),
    });
  }

  const handleExportBuyers = () => {
    // CSV Export
    const headers = ['Buyer ID', 'Name', 'Phone', 'Email', 'Type', 'Status', 'Location', 'Total Orders', 'Total Spent', 'Registered Date'];
    const rows = filteredBuyers.map((b) => [
      b.id,
      b.name,
      b.phone,
      b.email || 'N/A',
      (b.type && typeConfig[b.type]) ? typeConfig[b.type].label : 'N/A',
      statusConfig[b.status].label,
      b.primaryLocation,
      b.totalOrders.toString(),
      `₹${b.totalSpent.toLocaleString('en-IN')}`,
      new Date(b.registeredAt).toLocaleDateString('en-IN'),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buyers-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Buyers data exported successfully');
  };

  const getActivityStatus = (lastActive: string) => {
    const daysSince = Math.floor(
      (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < 7) return { label: 'Active', color: 'text-[#22C55E]' };
    if (daysSince < 30) return { label: 'Recent', color: 'text-secondary-700' };
    return { label: 'Inactive', color: 'text-neutral-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Buyers</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage buyer accounts and monitor activity
          </p>
        </div>
        <Button variant="outline" onClick={handleExportBuyers}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Buyers</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockBuyerStats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Buyers</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockBuyerStats.active}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {formatCurrency(mockBuyerStats.totalSpent)}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Avg Lifetime Value</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {formatCurrency(mockBuyerStats.averageLifetimeValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-error-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <SearchFilterSection
        searchPlaceholder="Search by name, phone, email, or location..."
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        activeFilters={activeFilters}
        onClearAll={() => setFilters({ status: 'all', type: 'all', search: '' })}
      >
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value as BuyerStatus | 'all' })
          }
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, type: value as BuyerType | 'all' })
          }
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="builder">Builder</SelectItem>
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Buyers Table - Separate Card */}
      <DataTable
        data={filteredBuyers}
        columns={[
          {
            key: 'name',
            label: 'Buyer Details',
            sortable: true,
            width: '25%',
            render: (buyer) => (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">
                    {buyer.name}
                  </span>
                  {buyer.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  )}
                </div>
                {buyer.type && typeConfig[buyer.type] && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center w-fit mt-1 ${typeConfig[buyer.type].color}`}
                  >
                    {typeConfig[buyer.type].label}
                  </span>
                )}
              </div>
            ),
          },
          {
            key: 'phone',
            label: 'Contact',
            width: '18%',
            render: (buyer) => (
              <div className="flex flex-col">
                <span className="text-sm text-neutral-900">
                  {buyer.phone}
                </span>
                {buyer.email && (
                  <span className="text-xs text-neutral-500">
                    {buyer.email}
                  </span>
                )}
              </div>
            ),
          },
          {
            key: 'primaryLocation',
            label: 'Location',
            sortable: true,
            width: '15%',
            render: (buyer) => (
              <span className="text-sm text-neutral-900">
                {buyer.primaryLocation}
              </span>
            ),
          },
          {
            key: 'totalOrders',
            label: 'Orders',
            sortable: true,
            align: 'right',
            width: '12%',
            render: (buyer) => (
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-neutral-900">
                  {buyer.totalOrders}
                </span>
                <span className="text-xs text-neutral-500">
                  {buyer.completedOrders} completed
                </span>
              </div>
            ),
          },
          {
            key: 'totalSpent',
            label: 'Total Spent',
            sortable: true,
            align: 'right',
            width: '12%',
            render: (buyer) => (
              <span className="font-semibold text-neutral-900">
                {formatCurrency(buyer.totalSpent)}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: '12%',
            render: (buyer) => {
              const activity = getActivityStatus(buyer.lastActiveAt);
              return (
                <div className="flex flex-col gap-1">
                  <Badge variant={statusConfig[buyer.status].variant}>
                    {statusConfig[buyer.status].label}
                  </Badge>
                  <span className={`text-xs ${activity.color}`}>
                    {activity.label}
                  </span>
                </div>
              );
            },
          },
          {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            width: '80px',
            render: (buyer) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/buyers/${buyer.id}`);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            ),
          },
        ]}
        searchable={false}
        pageSize={15}
        emptyMessage="No buyers found"
        onRowClick={(buyer) => navigate(`/admin/buyers/${buyer.id}`)}
      />
    </div>
  );
}