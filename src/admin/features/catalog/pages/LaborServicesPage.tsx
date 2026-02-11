/**
 * Labor Services Page - Admin Portal
 * Manage labor categories, rates, and vendor availability
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LaborService, LaborCategory, LaborStatus } from '../../../types/catalog';
import { mockLaborServices, mockCatalogStats } from '../../../data/mockCatalog';
import { LaborServiceDialog } from '../components/LaborServiceDialog';
import { Button } from '../../../../app/components/ui/button';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import { Badge } from '../../../../app/components/ui/badge';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import {
  Search,
  Download,
  Filter,
  Plus,
  Edit,
  Copy,
  Users,
  TrendingUp,
  IndianRupee,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Card } from '../../../../app/components/ui/card';

const categoryLabels: Record<LaborCategory, string> = {
  masonry: 'Masonry',
  carpentry: 'Carpentry',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  painting: 'Painting',
  tile_work: 'Tile Work',
  steel_fixing: 'Steel Fixing',
  general: 'General',
};

const skillLevelConfig = {
  entry: { label: 'Entry Level', color: 'text-neutral-700 bg-neutral-100' },
  intermediate: { label: 'Intermediate', color: 'text-secondary-700 bg-secondary-100' },
  expert: { label: 'Expert', color: 'text-primary-700 bg-primary-100' },
};

const statusConfig: Record<LaborStatus, { label: string; variant: 'default' | 'secondary' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
};

export function LaborServicesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    category: LaborCategory | 'all';
    skillLevel: 'entry' | 'intermediate' | 'expert' | 'all';
    status: LaborStatus | 'all';
    search: string;
  }>({
    category: 'all',
    skillLevel: 'all',
    status: 'all',
    search: '',
  });

  const [services, setServices] = useState<LaborService[]>(mockLaborServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<LaborService | undefined>();
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter labor services
  const filteredServices = services.filter((service) => {
    if (filters.category !== 'all' && service.category !== filters.category) return false;
    if (filters.skillLevel !== 'all' && service.skillLevel !== filters.skillLevel) return false;
    if (filters.status !== 'all' && service.status !== filters.status) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        service.name.toLowerCase().includes(search) ||
        service.description?.toLowerCase().includes(search) ||
        service.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }
    return true;
  });

  // Active filters for chips
  const activeFilters = [];
  if (filters.category !== 'all') {
    activeFilters.push({
      type: 'category',
      label: 'Category',
      value: categoryLabels[filters.category],
      onRemove: () => setFilters({ ...filters, category: 'all' }),
    });
  }
  if (filters.skillLevel !== 'all') {
    activeFilters.push({
      type: 'skillLevel',
      label: 'Skill Level',
      value: skillLevelConfig[filters.skillLevel].label,
      onRemove: () => setFilters({ ...filters, skillLevel: 'all' }),
    });
  }
  if (filters.status !== 'all') {
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusConfig[filters.status].label,
      onRemove: () => setFilters({ ...filters, status: 'all' }),
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddService = () => {
    setSelectedService(undefined);
    setIsDialogOpen(true);
  };

  const handleEditService = (id: string) => {
    const service = services.find(s => s.id === id);
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleSaveService = (serviceData: Partial<LaborService>) => {
    if (selectedService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === selectedService.id ? { ...s, ...serviceData } : s
      ));
    } else {
      // Add new service
      const newService: LaborService = {
        id: `lab_${Date.now()}`,
        name: serviceData.serviceName || '',
        category: serviceData.category as any || 'general',
        skillLevel: serviceData.skillLevel || 'entry',
        baseRate: serviceData.ratePerDay || 0,
        unit: 'per_day',
        description: serviceData.description,
        minimumDuration: serviceData.minimumDuration,
        status: serviceData.status || 'active',
        availableVendors: 0,
        registeredVendors: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices([...services, newService]);
    }
  };

  const handleExportServices = () => {
    const headers = ['Service ID', 'Name', 'Category', 'Skill Level', 'Base Rate', 'Unit', 'Available Vendors', 'Registered Vendors', 'Status'];
    const rows = services.map(s => [
      s.id,
      s.name,
      categoryLabels[s.category],
      skillLevelConfig[s.skillLevel].label,
      s.baseRate,
      s.unit,
      s.availableVendors,
      s.registeredVendors,
      statusConfig[s.status].label,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labor_services_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Labor services exported successfully');
  };

  const handleDuplicate = (id: string) => {
    const service = services.find(s => s.id === id);
    if (service) {
      const newService: LaborService = {
        ...service,
        id: `lab_${Date.now()}`,
        name: `${service.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices([newService, ...services]);
      toast.success('Service duplicated successfully');
    }
  };

  // Row selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServiceIds(filteredServices.map(s => s.id));
    } else {
      setSelectedServiceIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedServiceIds([...selectedServiceIds, id]);
    } else {
      setSelectedServiceIds(selectedServiceIds.filter(sid => sid !== id));
    }
  };

  // Bulk actions
  const handleBulkActivate = () => {
    setServices(services.map(s => 
      selectedServiceIds.includes(s.id) ? { ...s, status: 'active' as LaborStatus } : s
    ));
    toast.success(`${selectedServiceIds.length} service(s) activated`);
    setSelectedServiceIds([]);
  };

  const handleBulkDeactivate = () => {
    setServices(services.map(s => 
      selectedServiceIds.includes(s.id) ? { ...s, status: 'inactive' as LaborStatus } : s
    ));
    toast.success(`${selectedServiceIds.length} service(s) deactivated`);
    setSelectedServiceIds([]);
  };

  const handleBulkExport = () => {
    const servicesToExport = services.filter(s => selectedServiceIds.includes(s.id));
    const headers = ['Service ID', 'Name', 'Category', 'Skill Level', 'Base Rate', 'Unit', 'Available Vendors', 'Registered Vendors', 'Status'];
    const rows = servicesToExport.map(s => [
      s.id,
      s.name,
      categoryLabels[s.category],
      skillLevelConfig[s.skillLevel].label,
      s.baseRate,
      s.unit,
      s.availableVendors,
      s.registeredVendors,
      statusConfig[s.status].label,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labor_services_selected_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${selectedServiceIds.length} service(s) exported`);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setServices(services.filter(s => !selectedServiceIds.includes(s.id)));
    toast.success(`${selectedServiceIds.length} service(s) deleted`);
    setSelectedServiceIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Labor Services</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage labor categories, rates, and vendor availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportServices}>
            <Download className="w-4 h-4 mr-2" />
            Export Services
          </Button>
          <Button onClick={handleAddService}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Services</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockCatalogStats.totalLabor}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Services</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockCatalogStats.activeLabor}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Workers</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockCatalogStats.totalWorkers}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Avg Daily Rate</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {formatCurrency(mockCatalogStats.averageRate)}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-error-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - New Pattern */}
      <SearchFilterSection
        searchPlaceholder="Search services by name, description, or tags..."
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        activeFilters={activeFilters}
        onClearAll={() => setFilters({ category: 'all', skillLevel: 'all', status: 'all', search: '' })}
      >
        <Select
          value={filters.category}
          onValueChange={(value) =>
            setFilters({ ...filters, category: value as LaborCategory | 'all' })
          }
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.skillLevel}
          onValueChange={(value) =>
            setFilters({ ...filters, skillLevel: value as any })
          }
        >
          <SelectTrigger className="w-[170px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skill Levels</SelectItem>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value as LaborStatus | 'all' })
          }
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Bulk Actions Toolbar */}
      {selectedServiceIds.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700">
                {selectedServiceIds.length} service(s) selected
              </span>
              <div className="h-4 w-px bg-neutral-300" />
              <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Activate
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                Deactivate
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedServiceIds([])}
            >
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {/* Services Table */}
      <DataTable
        data={filteredServices}
        columns={[
          {
            key: 'select',
            label: (
              <Checkbox
                checked={selectedServiceIds.length === filteredServices.length && filteredServices.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all services"
              />
            ),
            width: '40px',
            render: (service) => (
              <Checkbox
                checked={selectedServiceIds.includes(service.id)}
                onCheckedChange={(checked) => handleSelectRow(service.id, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${service.name}`}
              />
            ),
          },
          {
            key: 'name',
            label: 'Service',
            sortable: true,
            render: (service) => (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">
                    {service.name}
                  </span>
                  {service.isPopular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                  {service.certificationRequired && (
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  )}
                </div>
                {service.description && (
                  <span className="text-xs text-neutral-500 mt-1">
                    {service.description}
                  </span>
                )}
                {service.minimumExperience && (
                  <span className="text-xs text-neutral-400 mt-0.5">
                    Min. {service.minimumExperience} years experience
                  </span>
                )}
              </div>
            ),
          },
          {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (service) => (
              <span className="text-sm text-neutral-900">
                {categoryLabels[service.category]}
              </span>
            ),
          },
          {
            key: 'skillLevel',
            label: 'Skill Level',
            sortable: true,
            render: (service) => (
              <span className={`text-xs px-2 py-1 rounded-full ${skillLevelConfig[service.skillLevel].color}`}>
                {skillLevelConfig[service.skillLevel].label}
              </span>
            ),
          },
          {
            key: 'baseRate',
            label: 'Base Rate',
            sortable: true,
            render: (service) => (
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {formatCurrency(service.baseRate)}
                </span>
                <span className="text-xs text-neutral-500">{service.unit.replace('_', ' ')}</span>
                {service.averageContractorRate && (
                  <span className="text-xs text-neutral-400 mt-0.5">
                    Avg: {formatCurrency(service.averageContractorRate)}
                  </span>
                )}
              </div>
            ),
          },
          {
            key: 'availableVendors',
            label: 'Availability',
            sortable: true,
            render: (service) => (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">
                  {service.availableVendors} available
                </span>
                <span className="text-xs text-neutral-500">
                  {service.registeredVendors} total vendors
                </span>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (service) => (
              <Badge variant={statusConfig[service.status].variant}>
                {statusConfig[service.status].label}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            width: '80px',
            render: (service) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditService(service.id);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(service.id);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
        searchable={false}
        pageSize={15}
        pageSizeOptions={[10, 15, 25, 50, 100]}
        showPageSizeSelector={true}
        showPaginationInfo={true}
        showFirstLastButtons={true}
        emptyMessage="No services found"
        onRowClick={(service) => navigate(`/admin/catalog/labor/${service.id}`)}
      />

      {/* Labor Service Dialog */}
      <LaborServiceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        service={selectedService}
        onSave={handleSaveService}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Services"
        description={`Are you sure you want to delete ${selectedServiceIds.length} service(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}