/**
 * Vendor Directory Page
 * List all vendors with filters and search
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '../../../components/common/DataTable';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../../app/components/ui/button';
import { Card } from '../../../../app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Download, Eye, UserPlus, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { mockVendors } from '../../../mocks/vendors.mock';
import { Vendor, VendorStatus, VendorCategory } from '../../../types/vendor';
import { format } from 'date-fns';
import { SearchFilterSection } from '../../../components/SearchFilterSection';

export function VendorsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<VendorStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | 'all'>('all');
  const [serviceAreaFilter, setServiceAreaFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique service areas from all vendors
  const uniqueServiceAreas = Array.from(
    new Set(mockVendors.flatMap(v => v.serviceAreas))
  ).sort();

  // Calculate stats
  const vendorStats = {
    total: mockVendors.length,
    active: mockVendors.filter(v => v.status === 'active').length,
    pending: mockVendors.filter(v => v.status === 'pending').length,
    suspended: mockVendors.filter(v => v.status === 'suspended').length,
  };

  // Filter vendors
  const filteredVendors = mockVendors.filter((vendor) => {
    if (statusFilter !== 'all' && vendor.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && vendor.category !== categoryFilter) return false;
    if (serviceAreaFilter !== 'all' && !vendor.serviceAreas.includes(serviceAreaFilter)) return false;
    
    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        vendor.id.toLowerCase().includes(search) ||
        vendor.businessName.toLowerCase().includes(search) ||
        vendor.ownerName.toLowerCase().includes(search) ||
        vendor.phone.includes(search) ||
        vendor.email.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  // Active filters for chips
  const activeFilters = [];
  if (statusFilter !== 'all') {
    const statusLabels: Record<VendorStatus, string> = {
      active: 'Active',
      pending: 'Pending',
      suspended: 'Suspended',
      rejected: 'Rejected',
    };
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusLabels[statusFilter],
      onRemove: () => setStatusFilter('all'),
    });
  }
  if (categoryFilter !== 'all') {
    activeFilters.push({
      type: 'category',
      label: 'Category',
      value: categoryFilter,
      onRemove: () => setCategoryFilter('all'),
    });
  }
  if (serviceAreaFilter !== 'all') {
    activeFilters.push({
      type: 'serviceArea',
      label: 'Service Area',
      value: serviceAreaFilter,
      onRemove: () => setServiceAreaFilter('all'),
    });
  }

  const columns: Column<Vendor>[] = [
    {
      key: 'id',
      label: 'Vendor ID',
      sortable: true,
    },
    {
      key: 'businessName',
      label: 'Business Name',
      sortable: true,
      render: (vendor) => (
        <div>
          <p className="font-medium text-neutral-900">{vendor.businessName}</p>
          <p className="text-sm text-neutral-500">{vendor.ownerName}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (vendor) => (
        <div className="text-sm">
          <p>{vendor.phone}</p>
          <p className="text-neutral-500">{vendor.email}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'serviceAreas',
      label: 'Service Areas',
      render: (vendor) => (
        <div className="text-sm">
          {vendor.serviceAreas.slice(0, 2).join(', ')}
          {vendor.serviceAreas.length > 2 && (
            <span className="text-neutral-500"> +{vendor.serviceAreas.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (vendor) => <StatusBadge status={vendor.status} />,
    },
    {
      key: 'registeredDate',
      label: 'Registered',
      sortable: true,
      render: (vendor) => format(new Date(vendor.registeredDate), 'MMM dd, yyyy'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (vendor) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/vendors/${vendor.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const handleExportCSV = () => {
    // Simple CSV export
    const headers = ['Vendor ID', 'Business Name', 'Owner', 'Phone', 'Email', 'Category', 'Status'];
    const rows = filteredVendors.map((v) => [
      v.id,
      v.businessName,
      v.ownerName,
      v.phone,
      v.email,
      v.category,
      v.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Vendor Directory</h1>
          <p className="text-neutral-600 mt-1">
            Manage and monitor all vendor partners
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => navigate('/admin/vendors/pending')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Pending Approvals
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Vendors</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {vendorStats.total}
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
              <p className="text-sm text-neutral-600">Active Vendors</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {vendorStats.active}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pending Approval</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {vendorStats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Suspended</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {vendorStats.suspended}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-error-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - New Pattern */}
      <SearchFilterSection
        searchPlaceholder="Search by vendor ID, business name, owner, phone, or email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onClearAll={() => {
          setStatusFilter('all');
          setCategoryFilter('all');
          setServiceAreaFilter('all');
        }}
      >
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as VendorStatus | 'all')}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as VendorCategory | 'all')}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Cement">Cement</SelectItem>
            <SelectItem value="Steel & TMT Bars">Steel & TMT Bars</SelectItem>
            <SelectItem value="Aggregates">Aggregates</SelectItem>
            <SelectItem value="Bricks & Blocks">Bricks & Blocks</SelectItem>
            <SelectItem value="Sand">Sand</SelectItem>
            <SelectItem value="Plumbing">Plumbing</SelectItem>
            <SelectItem value="Electrical">Electrical</SelectItem>
            <SelectItem value="Paint & Hardware">Paint & Hardware</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={serviceAreaFilter}
          onValueChange={(value) => setServiceAreaFilter(value)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Service Areas</SelectItem>
            {uniqueServiceAreas.map(area => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Vendors Table */}
      <DataTable
        data={filteredVendors}
        columns={columns}
        searchable={false}
        pageSize={15}
        emptyMessage="No vendors found"
        onRowClick={(vendor) => navigate(`/admin/vendors/${vendor.id}`)}
      />
    </div>
  );
}