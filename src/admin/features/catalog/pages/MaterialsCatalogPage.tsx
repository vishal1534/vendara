/**
 * Materials Catalog Page - Admin Portal
 * Manage materials inventory, pricing, and categories
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Material, Category } from '../../../types/catalog';
import { mockMaterials } from '../../../data/mockCatalog';
import { mockCategories } from '../../../data/mockCategories';
import { MaterialDialog } from '../components/MaterialDialog';
import { CategoryDialog } from '../components/CategoryDialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import {
  Search,
  Download,
  Filter,
  Plus,
  Edit,
  Package,
  TrendingUp,
  IndianRupee,
  Layers,
  AlertCircle,
  CheckCircle2,
  Grid3x3,
  Settings,
  Activity,
  Mountain,
  Boxes,
  LayoutGrid,
  Paintbrush,
  Droplet,
  Zap,
  Wrench,
  AlertTriangle,
  Upload,
  FileDown,
  MoreVertical,
  Copy,
  Archive,
  Eye,
  Trash2,
  X,
  ClipboardCopy,
} from 'lucide-react';
import { toast } from 'sonner';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Card } from '../../../../app/components/ui/card';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../app/components/ui/dropdown-menu';

// Icon mapping for categories
const iconMap: Record<string, any> = {
  Package,
  Activity,
  Grid3x3,
  Mountain,
  Boxes,
  LayoutGrid,
  Paintbrush,
  Droplet,
  Zap,
  Wrench,
  Layers,
};

const categoryLabels: Record<Material['category'], string> = {
  cement: 'Cement',
  steel: 'Steel',
  bricks: 'Bricks',
  sand: 'Sand',
  aggregates: 'Aggregates',
  tiles: 'Tiles',
  paints: 'Paints',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hardware: 'Hardware',
};

const statusConfig: Record<Material['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
};

const categoryStatusConfig: Record<Category['status'], { label: string; variant: 'default' | 'secondary' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
};

export function MaterialsCatalogPage() {
  const [activeTab, setActiveTab] = useState('materials');
  const navigate = useNavigate();

  // Materials state
  const [filters, setFilters] = useState<{
    category: Material['category'] | 'all';
    status: Material['status'] | 'all';
    search: string;
  }>({
    category: 'all',
    status: 'all',
    search: '',
  });

  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>();
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Categories state
  const [categoryFilters, setCategoryFilters] = useState<{
    status: Category['status'] | 'all';
    search: string;
  }>({
    status: 'all',
    search: '',
  });

  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  // Calculate low stock items (stock level < 5x minimum order quantity)
  const lowStockItems = materials.filter(m => 
    m.inStock && m.stockLevel && m.stockLevel < (m.minOrderQuantity * 5)
  );

  // Calculate out of stock items
  const outOfStockItems = materials.filter(m => !m.inStock || m.status === 'out_of_stock');

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    if (filters.category !== 'all' && material.category !== filters.category) return false;
    if (filters.status !== 'all' && material.status !== filters.status) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        material.name.toLowerCase().includes(search) ||
        material.description?.toLowerCase().includes(search) ||
        material.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }
    return true;
  });

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    if (categoryFilters.status !== 'all' && category.status !== categoryFilters.status) return false;
    if (categoryFilters.search) {
      const search = categoryFilters.search.toLowerCase();
      return (
        category.name.toLowerCase().includes(search) ||
        category.key.toLowerCase().includes(search) ||
        category.description?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Calculate dynamic material counts for categories
  const categoriesWithCounts = filteredCategories.map(category => ({
    ...category,
    materialCount: materials.filter(m => m.category === category.key).length,
  }));

  // Active filters for materials
  const activeMaterialFilters = [];
  if (filters.category !== 'all') {
    activeMaterialFilters.push({
      type: 'category',
      label: 'Category',
      value: categoryLabels[filters.category],
      onRemove: () => setFilters({ ...filters, category: 'all' }),
    });
  }
  if (filters.status !== 'all') {
    activeMaterialFilters.push({
      type: 'status',
      label: 'Status',
      value: statusConfig[filters.status].label,
      onRemove: () => setFilters({ ...filters, status: 'all' }),
    });
  }

  // Active filters for categories
  const activeCategoryFilters = [];
  if (categoryFilters.status !== 'all') {
    activeCategoryFilters.push({
      type: 'status',
      label: 'Status',
      value: categoryStatusConfig[categoryFilters.status].label,
      onRemove: () => setCategoryFilters({ ...categoryFilters, status: 'all' }),
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleAddMaterial = () => {
    setSelectedMaterial(undefined);
    setIsMaterialDialogOpen(true);
  };

  const handleEditMaterial = (id: string) => {
    const material = materials.find(m => m.id === id);
    setSelectedMaterial(material);
    setIsMaterialDialogOpen(true);
  };

  const handleSaveMaterial = (materialData: Partial<Material>) => {
    if (selectedMaterial) {
      // Update existing material
      setMaterials(materials.map(m => 
        m.id === selectedMaterial.id ? { ...m, ...materialData } : m
      ));
    } else {
      // Add new material
      const newMaterial: Material = {
        id: `mat_${Date.now()}`,
        name: materialData.name || '',
        category: materialData.category as any || 'cement',
        unit: materialData.unit || '',
        basePrice: materialData.basePrice || 0,
        description: materialData.description,
        brandName: materialData.brandName,
        status: materialData.status || 'active',
        minOrderQuantity: 1,
        inStock: true,
        availableVendors: 0,
        isPopular: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMaterials([...materials, newMaterial]);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    setSelectedCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      // Update existing category
      setCategories(categories.map(c => 
        c.id === selectedCategory.id 
          ? { ...c, ...categoryData, updatedAt: new Date().toISOString() }
          : c
      ));
    } else {
      // Add new category
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        key: categoryData.key || '',
        name: categoryData.name || '',
        description: categoryData.description,
        icon: categoryData.icon || 'Package',
        status: categoryData.status || 'active',
        displayOrder: categoryData.displayOrder || categories.length + 1,
        materialCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
    }
  };

  const handleExportCatalog = () => {
    const headers = ['Material ID', 'Name', 'Category', 'Unit', 'Base Price', 'Stock Status', 'Vendors', 'Status'];
    const rows = materials.map(m => [
      m.id,
      m.name,
      categoryLabels[m.category],
      m.unit,
      m.basePrice,
      m.inStock ? 'In Stock' : 'Out of Stock',
      m.availableVendors,
      statusConfig[m.status].label,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `materials_catalog_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Materials catalog exported successfully');
  };

  const handleExportFiltered = () => {
    const headers = ['Material ID', 'Name', 'Category', 'Unit', 'Base Price', 'Stock Status', 'Vendors', 'Status'];
    const rows = filteredMaterials.map(m => [
      m.id,
      m.name,
      categoryLabels[m.category],
      m.unit,
      m.basePrice,
      m.inStock ? 'In Stock' : 'Out of Stock',
      m.availableVendors,
      statusConfig[m.status].label,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_materials_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredMaterials.length} filtered materials`);
  };

  const handleExportSelected = () => {
    const selectedMaterials = materials.filter(m => selectedMaterialIds.includes(m.id));
    const headers = ['Material ID', 'Name', 'Category', 'Unit', 'Base Price', 'Stock Status', 'Vendors', 'Status'];
    const rows = selectedMaterials.map(m => [
      m.id,
      m.name,
      categoryLabels[m.category],
      m.unit,
      m.basePrice,
      m.inStock ? 'In Stock' : 'Out of Stock',
      m.availableVendors,
      statusConfig[m.status].label,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_materials_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedMaterials.length} selected materials`);
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMaterialIds(filteredMaterials.map(m => m.id));
    } else {
      setSelectedMaterialIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterialIds([...selectedMaterialIds, id]);
    } else {
      setSelectedMaterialIds(selectedMaterialIds.filter(selectedId => selectedId !== id));
    }
  };

  // Bulk action handlers
  const handleBulkActivate = () => {
    setMaterials(materials.map(m => 
      selectedMaterialIds.includes(m.id) ? { ...m, status: 'active' as Material['status'] } : m
    ));
    toast.success(`Activated ${selectedMaterialIds.length} materials`);
    setSelectedMaterialIds([]);
  };

  const handleBulkDeactivate = () => {
    setMaterials(materials.map(m => 
      selectedMaterialIds.includes(m.id) ? { ...m, status: 'inactive' as Material['status'] } : m
    ));
    toast.success(`Deactivated ${selectedMaterialIds.length} materials`);
    setSelectedMaterialIds([]);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = () => {
    setMaterials(materials.filter(m => !selectedMaterialIds.includes(m.id)));
    toast.success(`Deleted ${selectedMaterialIds.length} materials`);
    setSelectedMaterialIds([]);
  };

  // Individual action handlers
  const handleDuplicate = (id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      const duplicated: Material = {
        ...material,
        id: `mat_${Date.now()}`,
        name: `${material.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMaterials([...materials, duplicated]);
      toast.success('Material duplicated successfully');
    }
  };

  const handleViewDetails = (id: string) => {
    // In a real app, this would navigate to a detail page
    // For now, just open the edit dialog
    handleEditMaterial(id);
    toast.info('Opening material details...');
  };

  const handleArchive = (id: string) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, status: 'inactive' as Material['status'] } : m
    ));
    toast.success('Material archived');
  };

  const handleDelete = (id: string) => {
    setMaterialToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      setMaterials(materials.filter(m => m.id !== materialToDelete));
      toast.success('Material deleted');
      setMaterialToDelete(null);
    }
  };

  const handleCopySKU = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('SKU copied to clipboard');
  };

  const handleExportCategories = () => {
    const headers = ['Category ID', 'Key', 'Name', 'Description', 'Icon', 'Status', 'Display Order', 'Material Count'];
    const rows = categories.map(c => [
      c.id,
      c.key,
      c.name,
      c.description || '',
      c.icon,
      c.status,
      c.displayOrder,
      c.materialCount,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `material_categories_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Categories exported successfully');
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Materials Catalog</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage materials inventory, pricing, categories, and availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCatalog}>
            <Download className="w-4 h-4 mr-2" />
            Export Materials
          </Button>
          <Button onClick={handleAddMaterial}>
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Materials</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockMaterials.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Items</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockMaterials.filter(material => material.status === 'active').length}
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
              <p className="text-sm text-neutral-600">Categories</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Stock Alerts</p>
              <p className="text-2xl font-semibold text-warning-700 mt-1">
                {lowStockItems.length + outOfStockItems.length}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {lowStockItems.length} low stock, {outOfStockItems.length} out of stock
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-neutral-200">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="materials"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Package className="w-4 h-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Layers className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Materials Tab */}
        <TabsContent value="materials" className="pt-6 space-y-6">
          {/* Search & Filter Section */}
          <SearchFilterSection
            searchPlaceholder="Search materials by name, description, or tags..."
            searchValue={filters.search}
            onSearchChange={(value) => setFilters({ ...filters, search: value })}
            activeFilters={activeMaterialFilters}
            onClearAll={() => setFilters({ category: 'all', status: 'all', search: '' })}
          >
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value as Material['category'] | 'all' })
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
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value as Material['status'] | 'all' })
              }
            >
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </SearchFilterSection>

          {/* Bulk Actions Toolbar */}
          {selectedMaterialIds.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">
                  {selectedMaterialIds.length} material{selectedMaterialIds.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleBulkActivate}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkDeactivate}>
                    <X className="w-4 h-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExportSelected}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedMaterialIds([])}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Materials Table */}
          <DataTable
            data={filteredMaterials}
            columns={[
              {
                key: 'select',
                label: (
                  <Checkbox
                    checked={selectedMaterialIds.length === filteredMaterials.length && filteredMaterials.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all materials"
                  />
                ),
                width: '40px',
                render: (material) => (
                  <Checkbox
                    checked={selectedMaterialIds.includes(material.id)}
                    onCheckedChange={(checked) => handleSelectRow(material.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${material.name}`}
                  />
                ),
              },
              {
                key: 'thumbnail',
                label: '',
                width: '60px',
                render: (material) => (
                  <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center overflow-hidden">
                    {material.imageUrl ? (
                      <img 
                        src={material.imageUrl} 
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                ),
              },
              {
                key: 'name',
                label: 'Material',
                sortable: true,
                width: '26%',
                render: (material) => (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        {material.name}
                      </span>
                      {material.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-neutral-500 mt-0.5">
                      SKU: {material.id}
                    </span>
                    {material.brandName && (
                      <span className="text-xs font-medium text-neutral-600 mt-0.5">
                        {material.brandName}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: 'category',
                label: 'Category',
                sortable: true,
                width: '15%',
                render: (material) => (
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-900">
                      {categoryLabels[material.category]}
                    </span>
                    {material.hsn && (
                      <span className="text-xs text-neutral-500 mt-0.5">
                        HSN: {material.hsn}
                      </span>
                    )}
                    {material.gstRate && (
                      <span className="text-xs text-neutral-400 mt-0.5">
                        GST: {material.gstRate}%
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: 'basePrice',
                label: 'Pricing',
                sortable: true,
                align: 'right',
                width: '13%',
                render: (material) => (
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(material.basePrice)}
                    </span>
                    <span className="text-xs text-neutral-500">per {material.unit}</span>
                    <span className="text-xs text-neutral-400 mt-0.5">
                      MOQ: {material.minOrderQuantity} {material.unit}
                    </span>
                  </div>
                ),
              },
              {
                key: 'inStock',
                label: 'Stock',
                sortable: true,
                width: '12%',
                render: (material) => {
                  const isLowStock = material.inStock && material.stockLevel && material.stockLevel < (material.minOrderQuantity * 5);
                  return (
                    <div className="flex flex-col">
                      {material.inStock ? (
                        <>
                          <span className={`text-sm font-medium ${
                            isLowStock ? 'text-warning-700' : 'text-[#22C55E]'
                          }`}>
                            {isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                          {material.stockLevel && (
                            <span className="text-xs text-neutral-500">
                              {material.stockLevel.toLocaleString()} {material.unit}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm font-medium text-error-700">Out of Stock</span>
                      )}
                    </div>
                  );
                },
              },
              {
                key: 'availableVendors',
                label: 'Vendor Count',
                sortable: true,
                align: 'right',
                width: '12%',
                render: (material) => (
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-neutral-900">
                      {material.availableVendors}
                    </span>
                    {material.averageVendorPrice && (
                      <span className="text-xs text-neutral-500">
                        Avg: {formatCurrency(material.averageVendorPrice)}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                width: '10%',
                render: (material) => (
                  <Badge variant={statusConfig[material.status].variant}>
                    {statusConfig[material.status].label}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                align: 'right',
                width: '80px',
                render: (material) => (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditMaterial(material.id);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(material.id);
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
            loading={isLoading}
            emptyMessage="No materials found"
            onRowClick={(material) => navigate(`/admin/catalog/materials/${material.id}`)}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="pt-6 space-y-6">
          {/* Tab Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleExportCategories}>
              <Download className="w-4 h-4 mr-2" />
              Export Categories
            </Button>
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Search & Filter Section */}
          <SearchFilterSection
            searchPlaceholder="Search categories by name or key..."
            searchValue={categoryFilters.search}
            onSearchChange={(value) => setCategoryFilters({ ...categoryFilters, search: value })}
            activeFilters={activeCategoryFilters}
            onClearAll={() => setCategoryFilters({ status: 'all', search: '' })}
          >
            <Select
              value={categoryFilters.status}
              onValueChange={(value) =>
                setCategoryFilters({ ...categoryFilters, status: value as Category['status'] | 'all' })
              }
            >
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </SearchFilterSection>

          {/* Categories Table */}
          <DataTable
            data={categoriesWithCounts}
            columns={[
              {
                key: 'name',
                label: 'Category',
                sortable: true,
                width: '30%',
                render: (category) => {
                  const Icon = iconMap[category.icon] || Package;
                  return (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">
                          {category.name}
                        </span>
                        <span className="text-xs text-neutral-500 mt-0.5">
                          Key: {category.key}
                        </span>
                        {category.description && (
                          <span className="text-xs text-neutral-400 mt-1">
                            {category.description}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'materialCount',
                label: 'Materials',
                sortable: true,
                align: 'center',
                width: '12%',
                render: (category) => (
                  <span className="text-sm font-medium text-neutral-900">
                    {category.materialCount}
                  </span>
                ),
              },
              {
                key: 'displayOrder',
                label: 'Display Order',
                sortable: true,
                align: 'center',
                width: '12%',
                render: (category) => (
                  <span className="text-sm text-neutral-900">
                    {category.displayOrder}
                  </span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                width: '12%',
                render: (category) => (
                  <Badge variant={categoryStatusConfig[category.status].variant}>
                    {categoryStatusConfig[category.status].label}
                  </Badge>
                ),
              },
              {
                key: 'updatedAt',
                label: 'Last Updated',
                sortable: true,
                width: '15%',
                render: (category) => (
                  <span className="text-sm text-neutral-600">
                    {formatDate(category.updatedAt)}
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                align: 'right',
                width: '80px',
                render: (category) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category.id);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ),
              },
            ]}
            searchable={false}
            pageSize={15}
            emptyMessage="No categories found"
          />
        </TabsContent>
      </Tabs>

      {/* Material Dialog */}
      <MaterialDialog
        isOpen={isMaterialDialogOpen}
        onClose={() => setIsMaterialDialogOpen(false)}
        material={selectedMaterial}
        onSave={handleSaveMaterial}
      />

      {/* Category Dialog */}
      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      <ConfirmationDialog
        open={showBulkDeleteConfirm}
        onOpenChange={setShowBulkDeleteConfirm}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Materials"
        description={`Are you sure you want to delete ${selectedMaterialIds.length} materials? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Material"
        description="Are you sure you want to delete this material? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}