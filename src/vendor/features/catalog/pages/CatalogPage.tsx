import { useState, useMemo, useEffect } from 'react';
import { Package, Grid3x3, List, Wrench } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../app/components/ui/tabs';
import { CatalogTable } from '../components/CatalogTable';
import { CatalogGrid } from '../components/CatalogGrid';
import { ServicesTable } from '../components/ServicesTable';
import { ServicesGrid } from '../components/ServicesGrid';
import { WhatsAppUpdateBanner } from '../components/WhatsAppUpdateBanner';
import { mockCatalog, mockServicesCatalog } from '../../../mocks/catalog.mock';
import type { CatalogItem, ServiceItem } from '../../../mocks/catalog.mock';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import { Search } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'in-catalog' | 'available';
type CatalogTab = 'materials' | 'services';

const CATALOG_VIEW_MODE_KEY = 'realserv_catalog_view_mode';
const CATALOG_TAB_KEY = 'realserv_catalog_tab';

export function CatalogPage() {
  // Initialize activeTab from localStorage, default to 'materials'
  const [activeTab, setActiveTab] = useState<CatalogTab>(() => {
    const saved = localStorage.getItem(CATALOG_TAB_KEY);
    return (saved === 'materials' || saved === 'services') ? saved : 'materials';
  });
  
  // Initialize viewMode from localStorage, default to 'grid'
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(CATALOG_VIEW_MODE_KEY);
    return (saved === 'grid' || saved === 'list') ? saved : 'grid';
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(mockCatalog);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(mockServicesCatalog);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Persist activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CATALOG_TAB_KEY, activeTab);
  }, [activeTab]);

  // Persist viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CATALOG_VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(catalogItems.map(item => item.category));
    return Array.from(uniqueCategories);
  }, [catalogItems]);

  const categoryLabels: Record<string, string> = {
    cement: 'Cement',
    sand: 'Sand',
    aggregate: 'Aggregate',
    steel: 'Steel',
    bricks: 'Bricks',
  };

  const skillTypeLabels: Record<string, string> = {
    mason: 'Mason',
    electrician: 'Electrician',
    plumber: 'Plumber',
    carpenter: 'Carpenter',
    painter: 'Painter',
    welder: 'Welder',
    helper: 'Helper',
  };

  const skillTypes = useMemo(() => {
    const uniqueSkillTypes = new Set(serviceItems.map(item => item.skillType));
    return Array.from(uniqueSkillTypes);
  }, [serviceItems]);

  // Calculate counts for materials
  const counts = useMemo(() => {
    const inCatalog = catalogItems.filter(item => item.isAvailable).length;
    const available = catalogItems.filter(item => !item.isAvailable).length;
    return {
      all: catalogItems.length,
      inCatalog,
      available,
    };
  }, [catalogItems]);

  // Calculate counts for services
  const serviceCounts = useMemo(() => {
    const inCatalog = serviceItems.filter(item => item.isAvailable).length;
    const available = serviceItems.filter(item => !item.isAvailable).length;
    return {
      all: serviceItems.length,
      inCatalog,
      available,
    };
  }, [serviceItems]);

  // Apply filters for materials
  const filteredItems = useMemo(() => {
    let filtered = [...catalogItems];

    if (statusFilter === 'in-catalog') {
      filtered = filtered.filter(item => item.isAvailable);
    } else if (statusFilter === 'available') {
      filtered = filtered.filter(item => !item.isAvailable);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.specifications?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [catalogItems, statusFilter, selectedCategory, searchQuery]);

  // Apply filters for services
  const filteredServices = useMemo(() => {
    let filtered = [...serviceItems];

    if (statusFilter === 'in-catalog') {
      filtered = filtered.filter(item => item.isAvailable);
    } else if (statusFilter === 'available') {
      filtered = filtered.filter(item => !item.isAvailable);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.skillType === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.skillType.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [serviceItems, statusFilter, selectedCategory, searchQuery]);

  const handleToggleItem = (itemId: string) => {
    setCatalogItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
  };

  const handleToggleService = (itemId: string) => {
    setServiceItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Catalog Management</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage items you offer to buyers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-4">
          <p className="text-sm text-neutral-600">{activeTab === 'materials' ? 'Total Items' : 'Total Services'}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{activeTab === 'materials' ? counts.all : serviceCounts.all}</p>
        </div>
        <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
          <p className="text-sm text-primary-700">In My Catalog</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">{activeTab === 'materials' ? counts.inCatalog : serviceCounts.inCatalog}</p>
        </div>
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-4">
          <p className="text-sm text-neutral-600">Available to Add</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{activeTab === 'materials' ? counts.available : serviceCounts.available}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CatalogTab)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="materials">
              <Package className="w-4 h-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="services">
              <Wrench className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white border-2 border-neutral-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
              title="Grid view"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
              title="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <TabsContent value="materials">
          {/* Filters Bar */}
          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b-2 border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search materials by name, description, or specifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-neutral-50 flex items-center gap-3 flex-wrap">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="w-[200px] h-10 border-2 bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items ({counts.all})</SelectItem>
                  <SelectItem value="in-catalog">In My Catalog ({counts.inCatalog})</SelectItem>
                  <SelectItem value="available">Available to Add ({counts.available})</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px] h-10 border-2 bg-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category] || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-neutral-600">
                Showing <span className="font-semibold text-neutral-900">{filteredItems.length}</span> of{' '}
                <span className="font-semibold text-neutral-900">{counts.all}</span> items
              </div>
            </div>
          </div>

          {/* Items Display */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No materials found</h3>
              <p className="text-sm text-neutral-500">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No materials available'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <CatalogGrid items={filteredItems} onToggleItem={handleToggleItem} />
          ) : (
            <CatalogTable 
              items={filteredItems} 
              showAvailabilityColumn={true}
              onToggleItem={handleToggleItem}
              showActions={true}
            />
          )}
        </TabsContent>

        <TabsContent value="services">
          {/* Filters Bar */}
          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b-2 border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search services by skill name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-neutral-50 flex items-center gap-3 flex-wrap">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="w-[200px] h-10 border-2 bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services ({serviceCounts.all})</SelectItem>
                  <SelectItem value="in-catalog">In My Catalog ({serviceCounts.inCatalog})</SelectItem>
                  <SelectItem value="available">Available to Add ({serviceCounts.available})</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px] h-10 border-2 bg-white">
                  <SelectValue placeholder="Filter by skill type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skill Types</SelectItem>
                  {skillTypes.map((skillType) => (
                    <SelectItem key={skillType} value={skillType}>
                      {skillTypeLabels[skillType] || skillType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-neutral-600">
                Showing <span className="font-semibold text-neutral-900">{filteredServices.length}</span> of{' '}
                <span className="font-semibold text-neutral-900">{serviceCounts.all}</span> services
              </div>
            </div>
          </div>

          {/* Services Display */}
          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
              <Wrench className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No services found</h3>
              <p className="text-sm text-neutral-500">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No services available'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <ServicesGrid items={filteredServices} onToggleItem={handleToggleService} />
          ) : (
            <ServicesTable 
              items={filteredServices} 
              showAvailabilityColumn={true}
              onToggleItem={handleToggleService}
              showActions={true}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* WhatsApp Alternative */}
      <WhatsAppUpdateBanner />
    </div>
  );
}