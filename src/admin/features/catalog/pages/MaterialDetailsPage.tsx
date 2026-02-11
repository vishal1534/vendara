/**
 * Material Details Page - Admin Portal
 * Full-screen comprehensive material information and management
 */

import { Badge } from '../../../../app/components/ui/badge';
import { Card } from '../../../../app/components/ui/card';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import { Input } from '../../../../app/components/ui/input';
import { Textarea } from '../../../../app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Package,
  IndianRupee,
  TrendingUp,
  Building,
  FileText,
  History,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  ShoppingCart,
  BarChart3,
  Copy,
  Archive,
  Trash2,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { mockMaterials } from '../../../data/mockCatalog';
import { Material } from '../../../types/catalog';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

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

// Mock data for charts
const performanceData = [
  { month: 'Jul', orders: 45, revenue: 125000 },
  { month: 'Aug', orders: 52, revenue: 148000 },
  { month: 'Sep', orders: 48, revenue: 132000 },
  { month: 'Oct', orders: 61, revenue: 175000 },
  { month: 'Nov', orders: 58, revenue: 162000 },
  { month: 'Dec', orders: 67, revenue: 195000 },
];

const priceHistoryData = [
  { date: 'Jan', basePrice: 385, avgVendorPrice: 392 },
  { date: 'Feb', basePrice: 385, avgVendorPrice: 395 },
  { date: 'Mar', basePrice: 390, avgVendorPrice: 398 },
  { date: 'Apr', basePrice: 390, avgVendorPrice: 400 },
  { date: 'May', basePrice: 395, avgVendorPrice: 402 },
  { date: 'Jun', basePrice: 395, avgVendorPrice: 405 },
];

// Mock recent orders
const mockRecentOrders = [
  {
    id: 'RS2024001234',
    buyerName: 'Ramesh Kumar',
    quantity: 150,
    unit: 'bags',
    amount: 59250,
    vendor: 'Sri Sai Cement Works',
    date: '2024-01-08',
    status: 'delivered',
  },
  {
    id: 'RS2024001189',
    buyerName: 'Suresh Reddy',
    quantity: 200,
    unit: 'bags',
    amount: 79000,
    vendor: 'Kumar Building Materials',
    date: '2024-01-06',
    status: 'in_transit',
  },
  {
    id: 'RS2024001145',
    buyerName: 'Vijay Sharma',
    quantity: 100,
    unit: 'bags',
    amount: 39500,
    vendor: 'Sri Sai Cement Works',
    date: '2024-01-04',
    status: 'delivered',
  },
  {
    id: 'RS2024001098',
    buyerName: 'Rajesh Patel',
    quantity: 180,
    unit: 'bags',
    amount: 71100,
    vendor: 'Modern Suppliers',
    date: '2024-01-02',
    status: 'delivered',
  },
];

// Mock vendor offerings
const mockVendorOfferings = [
  {
    id: 'v1',
    vendorName: 'Sri Sai Cement Works',
    price: 395,
    minOrder: 50,
    leadTime: '2-3 days',
    rating: 4.8,
    totalOrders: 145,
  },
  {
    id: 'v2',
    vendorName: 'Kumar Building Materials',
    price: 398,
    minOrder: 40,
    leadTime: '1-2 days',
    rating: 4.6,
    totalOrders: 98,
  },
  {
    id: 'v3',
    vendorName: 'Modern Suppliers',
    price: 402,
    minOrder: 30,
    leadTime: '2-4 days',
    rating: 4.7,
    totalOrders: 72,
  },
];

// Mock activity log
const mockActivityLog = [
  {
    id: 'a1',
    action: 'Price updated',
    user: 'Admin User',
    details: 'Base price changed from ₹390 to ₹395',
    timestamp: '2024-01-08 14:30',
  },
  {
    id: 'a2',
    action: 'Stock updated',
    user: 'System',
    details: 'Stock level updated to 5,000 bags',
    timestamp: '2024-01-08 10:15',
  },
  {
    id: 'a3',
    action: 'Vendor added',
    user: 'Admin User',
    details: 'New vendor "Modern Suppliers" added',
    timestamp: '2024-01-05 16:45',
  },
  {
    id: 'a4',
    action: 'Description updated',
    user: 'Catalog Manager',
    details: 'Material description and specifications updated',
    timestamp: '2024-01-03 11:20',
  },
];

export function MaterialDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find material from mock data
  const material = mockMaterials.find((m) => m.id === id);

  const [editedMaterial, setEditedMaterial] = useState<Material | undefined>(material);

  if (!material || !editedMaterial) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900">Material not found</h2>
          <p className="text-neutral-600 mt-2">The material you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/catalog/materials')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Materials
          </Button>
        </div>
      </div>
    );
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

  const handleSave = () => {
    // In real app, this would call an API
    toast.success('Material updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMaterial(material);
    setIsEditing(false);
  };

  const handleDuplicate = () => {
    toast.success('Material duplicated successfully');
    navigate('/admin/catalog/materials');
  };

  const handleArchive = () => {
    setShowArchiveConfirm(true);
  };

  const handleConfirmArchive = () => {
    toast.success('Material archived successfully');
    navigate('/admin/catalog/materials');
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    toast.success('Material deleted successfully');
    navigate('/admin/catalog/materials');
  };

  const isLowStock = material.inStock && material.stockLevel && material.stockLevel < (material.minOrderQuantity * 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/catalog/materials')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">{material.name}</h1>
            <p className="text-sm text-neutral-600 mt-1">
              SKU: {material.id} • {categoryLabels[material.category]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Material
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Base Price</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {formatCurrency(material.basePrice)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">per {material.unit}</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Stock Status</p>
              <p className={`text-2xl font-semibold mt-1 ${
                !material.inStock ? 'text-error-700' : isLowStock ? 'text-warning-700' : 'text-[#22C55E]'
              }`}>
                {!material.inStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
              </p>
              {material.stockLevel && (
                <p className="text-xs text-neutral-500 mt-1">
                  {material.stockLevel.toLocaleString()} {material.unit}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              !material.inStock ? 'bg-error-50' : isLowStock ? 'bg-warning-50' : 'bg-[#22C55E]/10'
            }`}>
              {!material.inStock ? (
                <AlertTriangle className="w-6 h-6 text-error-700" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Available Vendors</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {material.availableVendors}
              </p>
              {material.averageVendorPrice && (
                <p className="text-xs text-neutral-500 mt-1">
                  Avg: {formatCurrency(material.averageVendorPrice)}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Orders</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">248</p>
              <p className="text-xs text-neutral-500 mt-1">Last 6 months</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant={statusConfig[material.status].variant}>
          {statusConfig[material.status].label}
        </Badge>
        {material.isPopular && (
          <Badge variant="secondary">Popular</Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-neutral-200">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Package className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="vendors"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Building className="w-4 h-4 mr-2" />
              Vendors ({mockVendorOfferings.length})
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Recent Orders
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <History className="w-4 h-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                {/* Material Image - Compact in view, expanded in edit */}
                <div>
                  <label className="text-sm font-medium text-neutral-700">Material Image (Mobile App)</label>
                  {isEditing ? (
                    <div className="mt-2 space-y-3">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail Preview */}
                        <div className="w-24 h-24 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {editedMaterial.imageUrl ? (
                            <img 
                              src={editedMaterial.imageUrl} 
                              alt={editedMaterial.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-neutral-400" />
                          )}
                        </div>
                        
                        {/* Upload Options */}
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="material-image-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditedMaterial({ ...editedMaterial, imageUrl: reader.result as string });
                                  toast.success('Image uploaded');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('material-image-upload')?.click()}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Upload
                            </Button>
                            {editedMaterial.imageUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditedMaterial({ ...editedMaterial, imageUrl: undefined })}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                          <Input
                            type="url"
                            value={editedMaterial.imageUrl || ''}
                            onChange={(e) => setEditedMaterial({ ...editedMaterial, imageUrl: e.target.value })}
                            placeholder="Or enter image URL"
                            className="text-sm"
                          />
                          <p className="text-xs text-neutral-500">
                            Recommended: 800x800px, JPG/PNG, max 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-3">
                      {/* Small Thumbnail */}
                      <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        {material.imageUrl ? (
                          <img 
                            src={material.imageUrl} 
                            alt={material.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-neutral-400" />
                        )}
                      </div>
                      {/* Status */}
                      <div>
                        {material.imageUrl ? (
                          <>
                            <p className="text-sm text-neutral-900 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                              Image set
                            </p>
                            <p className="text-xs text-neutral-500">Visible on mobile app</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-neutral-900 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-warning-600" />
                              No image
                            </p>
                            <p className="text-xs text-neutral-500">Placeholder shown to buyers</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Material Name</label>
                  {isEditing ? (
                    <Input
                      value={editedMaterial.name}
                      onChange={(e) => setEditedMaterial({ ...editedMaterial, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{material.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Category</label>
                  {isEditing ? (
                    <Select
                      value={editedMaterial.category}
                      onValueChange={(value) =>
                        setEditedMaterial({ ...editedMaterial, category: value as Material['category'] })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{categoryLabels[material.category]}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Brand Name</label>
                  {isEditing ? (
                    <Input
                      value={editedMaterial.brandName || ''}
                      onChange={(e) => setEditedMaterial({ ...editedMaterial, brandName: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{material.brandName || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editedMaterial.description || ''}
                      onChange={(e) => setEditedMaterial({ ...editedMaterial, description: e.target.value })}
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{material.description || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Unit of Measurement</label>
                  {isEditing ? (
                    <Input
                      value={editedMaterial.unit}
                      onChange={(e) => setEditedMaterial({ ...editedMaterial, unit: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{material.unit}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Pricing & Stock */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pricing & Stock</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Base Price (per {material.unit})</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedMaterial.basePrice}
                      onChange={(e) =>
                        setEditedMaterial({ ...editedMaterial, basePrice: parseFloat(e.target.value) })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{formatCurrency(material.basePrice)}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Minimum Order Quantity</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedMaterial.minOrderQuantity}
                      onChange={(e) =>
                        setEditedMaterial({ ...editedMaterial, minOrderQuantity: parseInt(e.target.value) })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">
                      {material.minOrderQuantity} {material.unit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Current Stock Level</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedMaterial.stockLevel || 0}
                      onChange={(e) =>
                        setEditedMaterial({ ...editedMaterial, stockLevel: parseInt(e.target.value) })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">
                      {material.stockLevel?.toLocaleString() || '-'} {material.unit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">HSN Code</label>
                  {isEditing ? (
                    <Input
                      value={editedMaterial.hsn || ''}
                      onChange={(e) => setEditedMaterial({ ...editedMaterial, hsn: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{material.hsn || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">GST Rate (%)</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedMaterial.gstRate || 0}
                      onChange={(e) =>
                        setEditedMaterial({ ...editedMaterial, gstRate: parseFloat(e.target.value) })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{material.gstRate || '-'}%</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Status</label>
                  {isEditing ? (
                    <Select
                      value={editedMaterial.status}
                      onValueChange={(value) =>
                        setEditedMaterial({ ...editedMaterial, status: value as Material['status'] })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={statusConfig[material.status].variant} className="mt-1">
                      {statusConfig[material.status].label}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Metadata */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Material ID / SKU</label>
                <p className="text-sm text-neutral-900 mt-1 font-mono">{material.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Average Vendor Price</label>
                <p className="text-sm text-neutral-900 mt-1">
                  {material.averageVendorPrice ? formatCurrency(material.averageVendorPrice) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Created On</label>
                <p className="text-sm text-neutral-900 mt-1">{formatDate(material.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Last Updated</label>
                <p className="text-sm text-neutral-900 mt-1">{formatDate(material.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6 pt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Vendor Offerings</h3>
              <Button size="sm">
                <Users className="w-4 h-4 mr-2" />
                Manage Vendors
              </Button>
            </div>

            <div className="space-y-4">
              {mockVendorOfferings.map((vendor) => (
                <div key={vendor.id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-neutral-900">{vendor.vendorName}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                        <span>Price: {formatCurrency(vendor.price)}</span>
                        <span>•</span>
                        <span>MOQ: {vendor.minOrder} {material.unit}</span>
                        <span>•</span>
                        <span>Lead Time: {vendor.leadTime}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-neutral-600">Rating: {vendor.rating}/5</span>
                        <span>•</span>
                        <span className="text-sm text-neutral-600">{vendor.totalOrders} orders</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6 pt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Recent Orders</h3>
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </div>

            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-neutral-900">{order.id}</h4>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status === 'delivered' ? 'Delivered' : 'In Transit'}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-neutral-600">
                        <p>Buyer: {order.buyerName}</p>
                        <p>Vendor: {order.vendor}</p>
                        <p className="mt-1">
                          Quantity: {order.quantity} {order.unit} • Amount: {formatCurrency(order.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-600">{formatDate(order.date)}</p>
                      <Button variant="ghost" size="sm" className="mt-2">View Order</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 pt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Order Volume (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#F97316" name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Revenue Trend (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  strokeWidth={2}
                  name="Revenue (₹)"
                  dot={{ fill: '#F97316', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Price History (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="date" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="basePrice"
                  stroke="#F97316"
                  strokeWidth={2}
                  name="Base Price (₹)"
                  dot={{ fill: '#F97316', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgVendorPrice"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  name="Avg Vendor Price (₹)"
                  dot={{ fill: '#0EA5E9', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6 pt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Activity Log</h3>
            <div className="space-y-4">
              {mockActivityLog.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                      <History className="w-4 h-4 text-primary-700" />
                    </div>
                    {index < mockActivityLog.length - 1 && (
                      <div className="w-px h-full bg-neutral-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">{activity.action}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{activity.details}</p>
                        <p className="text-xs text-neutral-500 mt-2">
                          by {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={showArchiveConfirm}
        onOpenChange={setShowArchiveConfirm}
        onConfirm={handleConfirmArchive}
        title="Archive Material"
        description="Are you sure you want to archive this material?"
        confirmText="Archive"
        cancelText="Cancel"
        variant="warning"
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