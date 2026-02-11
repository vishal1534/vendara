/**
 * Labor Service Details Page - Admin Portal
 * Full-screen detail view for individual labor services with tabs
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LaborService } from '../../../types/catalog';
import { mockLaborServices } from '../../../data/mockCatalog';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Textarea } from '../../../../app/components/ui/textarea';
import { Badge } from '../../../../app/components/ui/badge';
import { Card } from '../../../../app/components/ui/card';
import { ConfirmationDialog } from '../../../components/feedback/ConfirmationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
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
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShieldCheck,
  Award,
  Target,
  Activity,
  MapPin,
  Phone,
  Mail,
  Verified,
  XCircle,
  Upload,
  FileText,
  BarChart3,
  Package,
  Settings,
  Archive,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '../../../components/common/DataTable';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const skillLevelConfig = {
  entry: { label: 'Entry Level', color: 'text-neutral-700 bg-neutral-100' },
  intermediate: { label: 'Intermediate', color: 'text-secondary-700 bg-secondary-100' },
  expert: { label: 'Expert', color: 'text-primary-700 bg-primary-100' },
};

// Mock data for vendors providing labor services
const mockVendors = [
  {
    id: 'vendor_1',
    name: 'Vishal Chauhan',
    phone: '+91 7906441952',
    email: 'rajesh.k@example.com',
    experience: 8,
    rating: 4.8,
    completedJobs: 145,
    verified: true,
    availability: 'available',
    ratePerDay: 1200,
    location: 'Madhapur, Hyderabad',
    certifications: ['NCVT', 'Safety Training'],
    joinedDate: '2023-03-15',
  },
  {
    id: 'vendor_2',
    name: 'Suresh Reddy',
    phone: '+91 98765 43211',
    email: 'suresh.r@example.com',
    experience: 5,
    rating: 4.5,
    completedJobs: 89,
    verified: true,
    availability: 'busy',
    ratePerDay: 1000,
    location: 'Kukatpally, Hyderabad',
    certifications: ['Trade Certificate'],
    joinedDate: '2023-06-20',
  },
  {
    id: 'vendor_3',
    name: 'Anil Singh',
    phone: '+91 98765 43212',
    email: 'anil.s@example.com',
    experience: 3,
    rating: 4.2,
    completedJobs: 34,
    verified: false,
    availability: 'available',
    ratePerDay: 850,
    location: 'Miyapur, Hyderabad',
    certifications: [],
    joinedDate: '2024-01-10',
  },
];

// Mock data for bookings
const mockBookings = [
  {
    id: 'booking_1',
    customerName: 'Venkat Builders',
    customerPhone: '+91 98765 11111',
    workerName: 'Vishal Chauhan',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    duration: 3,
    totalAmount: 3600,
    status: 'completed',
    location: 'Gachibowli, Hyderabad',
    rating: 5,
  },
  {
    id: 'booking_2',
    customerName: 'Sai Constructions',
    customerPhone: '+91 98765 22222',
    workerName: 'Suresh Reddy',
    startDate: '2025-01-18',
    endDate: '2025-01-20',
    duration: 3,
    totalAmount: 3000,
    status: 'in_progress',
    location: 'Kondapur, Hyderabad',
    rating: null,
  },
  {
    id: 'booking_3',
    customerName: 'Ram Construction',
    customerPhone: '+91 98765 33333',
    workerName: 'Anil Singh',
    startDate: '2025-01-22',
    endDate: '2025-01-23',
    duration: 2,
    totalAmount: 1700,
    status: 'confirmed',
    location: 'Hitech City, Hyderabad',
    rating: null,
  },
];

// Mock revenue data
const revenueData = [
  { month: 'Jul', revenue: 45000, bookings: 38 },
  { month: 'Aug', revenue: 52000, bookings: 45 },
  { month: 'Sep', revenue: 48000, bookings: 41 },
  { month: 'Oct', revenue: 61000, bookings: 52 },
  { month: 'Nov', revenue: 58000, bookings: 49 },
  { month: 'Dec', revenue: 67000, bookings: 58 },
];

// Mock demand pattern data
const demandData = [
  { day: 'Mon', bookings: 12 },
  { day: 'Tue', bookings: 15 },
  { day: 'Wed', bookings: 18 },
  { day: 'Thu', bookings: 14 },
  { day: 'Fri', bookings: 16 },
  { day: 'Sat', bookings: 22 },
  { day: 'Sun', bookings: 8 },
];

// Mock activity log
const activityLog = [
  {
    id: 'log_1',
    action: 'Rate Updated',
    description: 'Base rate changed from ₹1,000 to ₹1,200',
    user: 'Admin User',
    timestamp: '2025-01-10T14:30:00Z',
  },
  {
    id: 'log_2',
    action: 'Worker Added',
    description: 'Vishal Chauhan added to service',
    user: 'Admin User',
    timestamp: '2025-01-08T10:15:00Z',
  },
  {
    id: 'log_3',
    action: 'Status Changed',
    description: 'Service status changed to Active',
    user: 'System',
    timestamp: '2025-01-05T09:00:00Z',
  },
  {
    id: 'log_4',
    action: 'Service Created',
    description: 'Service created in catalog',
    user: 'Admin User',
    timestamp: '2025-01-01T08:00:00Z',
  },
];

const bookingStatusConfig = {
  confirmed: { label: 'Confirmed', variant: 'secondary' as const, color: '#3B82F6' },
  in_progress: { label: 'In Progress', variant: 'default' as const, color: '#8B5CF6' },
  completed: { label: 'Completed', variant: 'default' as const, color: '#22C55E' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: '#EF4444' },
};

const availabilityConfig = {
  available: { label: 'Available', color: 'text-[#22C55E] bg-[#22C55E]/10' },
  busy: { label: 'Busy', color: 'text-warning-700 bg-warning-100' },
  unavailable: { label: 'Unavailable', color: 'text-neutral-600 bg-neutral-100' },
};

export function LaborServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the service (in real app, fetch from API)
  const service = mockLaborServices.find(s => s.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState<Partial<LaborService>>(service || {});

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="w-16 h-16 text-neutral-400 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Service Not Found</h2>
        <p className="text-neutral-600 mb-6">The service you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/catalog/labor')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = () => {
    // In real app, save to API
    toast.success('Service updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedService(service);
    setIsEditing(false);
  };

  const handleArchive = () => {
    setShowArchiveConfirm(true);
  };

  const handleConfirmArchive = () => {
    toast.success('Service archived successfully');
    navigate('/admin/catalog/labor');
  };

  const handleToggleStatus = () => {
    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    toast.success(`Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    toast.success('Service deleted successfully');
    navigate('/admin/catalog/labor');
  };

  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = mockBookings.length;
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : '0';
  const avgRating = mockBookings
    .filter(b => b.rating)
    .reduce((sum, b) => sum + (b.rating || 0), 0) / mockBookings.filter(b => b.rating).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/catalog/labor')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">{service.name}</h1>
            <p className="text-sm text-neutral-600 mt-1">
              Service ID: {service.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
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
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Service
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
          >
            {service.status === 'active' ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {service.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <X className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Available Vendors</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockVendors.filter(w => w.availability === 'available').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalBookings}</p>
            </div>
            <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{completionRate}%</p>
            </div>
            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-warning-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 bg-error-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-error-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="border-b border-neutral-200">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="workers"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Users className="w-4 h-4 mr-2" />
              Workers ({mockVendors.length})
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings ({mockBookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
            >
              <Activity className="w-4 h-4 mr-2" />
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
                {/* Service Image - Compact in view, expanded in edit */}
                <div>
                  <label className="text-sm font-medium text-neutral-700">Service Image (Mobile App)</label>
                  {isEditing ? (
                    <div className="mt-2 space-y-3">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail Preview */}
                        <div className="w-24 h-24 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {editedService.imageUrl ? (
                            <img 
                              src={editedService.imageUrl} 
                              alt={editedService.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Briefcase className="w-8 h-8 text-neutral-400" />
                          )}
                        </div>
                        
                        {/* Upload Options */}
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="service-image-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditedService({ ...editedService, imageUrl: reader.result as string });
                                  toast.success('Image uploaded');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label htmlFor="service-image-upload">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('service-image-upload')?.click()}
                              className="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New Image
                            </Button>
                          </label>
                          <p className="text-xs text-neutral-500">
                            Square image recommended (min 400x400px). Max 5MB. JPG, PNG, or WebP.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-20 h-20 object-cover rounded-lg border border-neutral-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-neutral-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Service Name</label>
                  {isEditing ? (
                    <Input
                      value={editedService.name || ''}
                      onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1">{service.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Category</label>
                  {isEditing ? (
                    <Select
                      value={editedService.category || service.category}
                      onValueChange={(value) => setEditedService({ ...editedService, category: value as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masonry">Masonry</SelectItem>
                        <SelectItem value="carpentry">Carpentry</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="tile_work">Tile Work</SelectItem>
                        <SelectItem value="steel_fixing">Steel Fixing</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-neutral-900 mt-1 capitalize">
                      {service.category.replace('_', ' ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Skill Level</label>
                  {isEditing ? (
                    <Select
                      value={editedService.skillLevel || service.skillLevel}
                      onValueChange={(value) => setEditedService({ ...editedService, skillLevel: value as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${skillLevelConfig[service.skillLevel].color}`}>
                        {skillLevelConfig[service.skillLevel].label}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editedService.description || ''}
                      onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-neutral-600 mt-1">
                      {service.description || 'No description provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Status</label>
                  {isEditing ? (
                    <Select
                      value={editedService.status || service.status}
                      onValueChange={(value) => setEditedService({ ...editedService, status: value as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Pricing Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pricing & Terms</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Base Rate</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedService.baseRate || ''}
                      onChange={(e) => setEditedService({ ...editedService, baseRate: Number(e.target.value) })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {formatCurrency(service.baseRate)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700">Unit</label>
                  <p className="text-sm text-neutral-900 mt-1 capitalize">
                    {service.unit.replace('_', ' ')}
                  </p>
                </div>

                {service.minimumDuration && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Minimum Duration</label>
                    <p className="text-sm text-neutral-900 mt-1">{service.minimumDuration} days</p>
                  </div>
                )}

                {service.minimumExperience && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Minimum Experience Required</label>
                    <p className="text-sm text-neutral-900 mt-1">{service.minimumExperience} years</p>
                  </div>
                )}

                {service.averageContractorRate && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Average Contractor Rate</label>
                    <p className="text-sm text-neutral-900 mt-1">
                      {formatCurrency(service.averageContractorRate)}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    {service.certificationRequired && (
                      <div className="flex items-center gap-1.5 text-sm text-[#22C55E]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Certification Required</span>
                      </div>
                    )}
                    {service.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular Service
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Service Requirements & Scope */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Service Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Minimum Experience</p>
                    <p className="text-xs text-neutral-600">{service.minimumExperience || 0} years in the field</p>
                  </div>
                </div>
                {service.certificationRequired && (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Valid Certification</p>
                      <p className="text-xs text-neutral-600">Trade-specific certification required</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Own Tools & Equipment</p>
                    <p className="text-xs text-neutral-600">Worker must bring required tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Background Verification</p>
                    <p className="text-xs text-neutral-600">Completed before onboarding</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Availability Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Registered Contractors</span>
                  <span className="text-sm font-semibold text-neutral-900">{service.registeredContractors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Available Workers</span>
                  <span className="text-sm font-semibold text-neutral-900">{service.availableWorkers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Average Response Time</span>
                  <span className="text-sm font-semibold text-neutral-900">2-4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Booking Lead Time</span>
                  <span className="text-sm font-semibold text-neutral-900">24 hours</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Metadata */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Service Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Created At</label>
                <p className="text-sm text-neutral-900 mt-1">{formatDate(service.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Last Updated</label>
                <p className="text-sm text-neutral-900 mt-1">{formatDate(service.updatedAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Service ID</label>
                <p className="text-sm font-mono text-neutral-900 mt-1">{service.id}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {mockVendors.length} registered worker(s) offering this service
            </p>
            <Button size="sm">
              <Users className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </div>

          <DataTable
            data={mockVendors}
            columns={[
              {
                key: 'name',
                label: 'Worker',
                sortable: true,
                render: (worker) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-700">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">{worker.name}</span>
                        {worker.verified && (
                          <Verified className="w-4 h-4 text-[#22C55E]" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">{worker.email}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'experience',
                label: 'Experience',
                sortable: true,
                render: (worker) => (
                  <span className="text-sm text-neutral-900">{worker.experience} years</span>
                ),
              },
              {
                key: 'rating',
                label: 'Rating',
                sortable: true,
                render: (worker) => (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                    <span className="text-sm font-medium text-neutral-900">{worker.rating}</span>
                    <span className="text-xs text-neutral-500">({worker.completedJobs})</span>
                  </div>
                ),
              },
              {
                key: 'ratePerDay',
                label: 'Rate',
                sortable: true,
                align: 'right',
                render: (worker) => (
                  <span className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(worker.ratePerDay)}/day
                  </span>
                ),
              },
              {
                key: 'location',
                label: 'Location',
                render: (worker) => (
                  <span className="text-sm text-neutral-600">{worker.location}</span>
                ),
              },
              {
                key: 'availability',
                label: 'Status',
                sortable: true,
                render: (worker) => (
                  <span className={`text-xs px-2 py-1 rounded-full ${availabilityConfig[worker.availability].color}`}>
                    {availabilityConfig[worker.availability].label}
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                align: 'right',
                render: (worker) => (
                  <Button variant="ghost" size="sm">
                    View Profile
                  </Button>
                ),
              },
            ]}
            searchable={false}
            pageSize={10}
            emptyMessage="No workers registered for this service"
          />
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {mockBookings.length} total booking(s) for this service
            </p>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            data={mockBookings}
            columns={[
              {
                key: 'id',
                label: 'Booking ID',
                render: (booking) => (
                  <span className="text-sm font-mono text-neutral-900">{booking.id}</span>
                ),
              },
              {
                key: 'customerName',
                label: 'Customer',
                sortable: true,
                render: (booking) => (
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{booking.customerName}</p>
                    <p className="text-xs text-neutral-500">{booking.customerPhone}</p>
                  </div>
                ),
              },
              {
                key: 'workerName',
                label: 'Worker',
                render: (booking) => (
                  <span className="text-sm text-neutral-900">{booking.workerName}</span>
                ),
              },
              {
                key: 'startDate',
                label: 'Service Period',
                sortable: true,
                render: (booking) => (
                  <div>
                    <p className="text-sm text-neutral-900">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                    <p className="text-xs text-neutral-500">{booking.duration} days</p>
                  </div>
                ),
              },
              {
                key: 'location',
                label: 'Location',
                render: (booking) => (
                  <span className="text-sm text-neutral-600">{booking.location}</span>
                ),
              },
              {
                key: 'totalAmount',
                label: 'Amount',
                sortable: true,
                align: 'right',
                render: (booking) => (
                  <span className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (booking) => (
                  <Badge variant={bookingStatusConfig[booking.status].variant}>
                    {bookingStatusConfig[booking.status].label}
                  </Badge>
                ),
              },
              {
                key: 'rating',
                label: 'Rating',
                render: (booking) => (
                  booking.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                      <span className="text-sm font-medium text-neutral-900">{booking.rating}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400">Not rated</span>
                  )
                ),
              },
            ]}
            searchable={false}
            pageSize={10}
            emptyMessage="No bookings for this service"
          />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 pt-6">
          {/* Performance KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Completion Rate</p>
                  <p className="text-xl font-semibold text-neutral-900">{completionRate}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Average Rating</p>
                  <p className="text-xl font-semibold text-neutral-900">
                    {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-secondary-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Avg Response Time</p>
                  <p className="text-xl font-semibold text-neutral-900">2.5h</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Worker Utilization</p>
                  <p className="text-xl font-semibold text-neutral-900">78%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue & Booking Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Demand Pattern */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Demand Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Growing Demand</p>
                    <p className="text-xs text-neutral-600">15% increase in bookings this month</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">High Satisfaction</p>
                    <p className="text-xs text-neutral-600">Average rating improved by 0.3 points</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Peak Days</p>
                    <p className="text-xs text-neutral-600">Saturdays see highest demand (22 bookings/day)</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Onboard More Workers</p>
                    <p className="text-xs text-neutral-600">Add 2-3 workers to meet weekend demand</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IndianRupee className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Consider Peak Pricing</p>
                    <p className="text-xs text-neutral-600">10-15% surge on Saturdays could optimize earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Incentivize Top Performers</p>
                    <p className="text-xs text-neutral-600">Reward workers with ratings above 4.5</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6 pt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Activity History</h3>
            <div className="space-y-4">
              {activityLog.map((log, index) => (
                <div 
                  key={log.id}
                  className={`flex items-start gap-4 pb-4 ${
                    index !== activityLog.length - 1 ? 'border-b border-neutral-200' : ''
                  }`}
                >
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{log.action}</p>
                        <p className="text-sm text-neutral-600 mt-0.5">{log.description}</p>
                      </div>
                      <span className="text-xs text-neutral-500">{formatDateTime(log.timestamp)}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">by {log.user}</p>
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
        title="Archive Service"
        description="Are you sure you want to archive this service?"
        confirmText="Archive"
        cancelText="Cancel"
        variant="warning"
      />

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}