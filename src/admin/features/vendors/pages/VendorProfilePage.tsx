/**
 * Vendor Profile Page
 * Comprehensive vendor management with detailed tabs
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { SendNotificationModal, NotificationData } from '../../../components/vendors/SendNotificationModal';
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  Bell,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  FileText,
  TrendingUp,
  Package,
  IndianRupee,
  Calendar,
  Search,
  Download,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShoppingBag,
} from 'lucide-react';
import { mockVendors } from '../../../mocks/vendors.mock';
import { mockOrders } from '../../../data/mockOrders';
import { usePermissions } from '../../../hooks/usePermissions';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
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

// Mock data for charts
const performanceData = [
  { month: 'Jul', orders: 12, revenue: 145000 },
  { month: 'Aug', orders: 19, revenue: 225000 },
  { month: 'Sep', orders: 15, revenue: 189000 },
  { month: 'Oct', orders: 22, revenue: 278000 },
  { month: 'Nov', orders: 28, revenue: 345000 },
  { month: 'Dec', orders: 24, revenue: 298000 },
];

const mockReviews = [
  {
    id: 'r1',
    buyerName: 'Ramesh Kumar',
    rating: 5,
    comment: 'Excellent quality materials, delivered on time!',
    date: '2024-01-08',
    orderNumber: 'RS2024001234',
  },
  {
    id: 'r2',
    buyerName: 'Suresh Reddy',
    rating: 4,
    comment: 'Good service, professional workers.',
    date: '2024-01-06',
    orderNumber: 'RS2024001220',
  },
  {
    id: 'r3',
    buyerName: 'Vijay Sharma',
    rating: 5,
    comment: 'Very reliable vendor. Will order again.',
    date: '2024-01-04',
    orderNumber: 'RS2024001205',
  },
];

const mockTransactions = [
  {
    id: 't1',
    date: '2024-01-08',
    orderNumber: 'RS2024001234',
    type: 'settlement',
    amount: 12680,
    status: 'completed',
  },
  {
    id: 't2',
    date: '2024-01-05',
    orderNumber: 'RS2024001220',
    type: 'settlement',
    amount: 3286,
    status: 'completed',
  },
  {
    id: 't3',
    date: '2024-01-02',
    orderNumber: 'RS2024001205',
    type: 'settlement',
    amount: 8940,
    status: 'pending',
  },
];

const mockActivityLog = [
  {
    id: 'a1',
    type: 'order_completed',
    description: 'Completed order RS2024001234',
    timestamp: '2024-01-09T14:30:00Z',
    user: 'System',
  },
  {
    id: 'a2',
    type: 'status_change',
    description: 'Account reactivated by Admin',
    timestamp: '2024-01-08T10:15:00Z',
    user: 'Priya Sharma',
  },
  {
    id: 'a3',
    type: 'status_change',
    description: 'Account suspended due to customer complaints',
    timestamp: '2024-01-05T16:45:00Z',
    user: 'Vishal Chauhan',
  },
  {
    id: 'a4',
    type: 'order_accepted',
    description: 'Accepted order RS2024001220',
    timestamp: '2024-01-04T09:30:00Z',
    user: 'System',
  },
  {
    id: 'a5',
    type: 'payout_processed',
    description: 'Payout of ₹45,230 processed',
    timestamp: '2024-01-03T11:20:00Z',
    user: 'System',
  },
  {
    id: 'a6',
    type: 'document_uploaded',
    description: 'Uploaded GST Certificate',
    timestamp: '2024-01-02T14:10:00Z',
    user: vendor => vendor.ownerName,
  },
  {
    id: 'a7',
    type: 'profile_updated',
    description: 'Updated service areas',
    timestamp: '2023-12-28T15:30:00Z',
    user: vendor => vendor.ownerName,
  },
  {
    id: 'a8',
    type: 'approved',
    description: 'Vendor account approved',
    timestamp: '2023-12-15T10:00:00Z',
    user: 'Priya Sharma',
  },
  {
    id: 'a9',
    type: 'registered',
    description: 'Vendor registered on platform',
    timestamp: '2023-12-10T09:15:00Z',
    user: 'System',
  },
];

const activityIcons = {
  order_completed: CheckCircle2,
  order_accepted: ShoppingBag,
  status_change: AlertTriangle,
  payout_processed: IndianRupee,
  document_uploaded: FileText,
  profile_updated: Edit,
  approved: CheckCircle,
  registered: User,
};

const activityColors = {
  order_completed: 'text-success-600 bg-success-50',
  order_accepted: 'text-primary-600 bg-primary-50',
  status_change: 'text-warning-600 bg-warning-50',
  payout_processed: 'text-success-600 bg-success-50',
  document_uploaded: 'text-primary-600 bg-primary-50',
  profile_updated: 'text-neutral-600 bg-neutral-100',
  approved: 'text-success-600 bg-success-50',
  registered: 'text-primary-600 bg-primary-50',
};

export function VendorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');

  // Activity Log filters
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityPage, setActivityPage] = useState(1);
  const ACTIVITIES_PER_PAGE = 20;

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const vendor = mockVendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Vendor not found</p>
        <Button onClick={() => navigate('/admin/vendors')} className="mt-4">
          Back to Vendors
        </Button>
      </div>
    );
  }

  const currentStatus = vendor.status;

  // Filter orders by vendor
  const vendorOrders = mockOrders.filter((order) => order.vendorId === id);

  // Filter orders
  const filteredOrders = vendorOrders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch = orderSearch === '' ||
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter activities
  const filteredActivities = mockActivityLog.filter((activity) => {
    const matchesType = activityTypeFilter === 'all' || activity.type === activityTypeFilter;
    const matchesSearch = activitySearchQuery === '' || 
      activity.description.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
      (typeof activity.user === 'string' && activity.user.toLowerCase().includes(activitySearchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalActivityPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (activityPage - 1) * ACTIVITIES_PER_PAGE,
    activityPage * ACTIVITIES_PER_PAGE
  );

  const canEdit = canAccess(['super_admin', 'operations']);

  const handleSuspendConfirm = () => {
    toast.success(
      currentStatus === 'suspended'
        ? 'Vendor reactivated successfully'
        : 'Vendor suspended successfully'
    );
    setShowSuspendDialog(false);
  };

  const handleSendNotification = (data: NotificationData) => {
    console.log('Sending notification:', data);
    toast.success('Notification sent successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/vendors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">{vendor.businessName}</h1>
              <StatusBadge status={currentStatus} />
            </div>
            <p className="text-neutral-600 mt-1">
              Vendor ID: {vendor.id} • Joined {format(new Date(vendor.registeredDate), 'MMMM yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowNotificationModal(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
          {canEdit && (
            <>
              <Button variant="outline" onClick={() => navigate(`/admin/vendors/${id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSuspendDialog(true)}
                className={
                  currentStatus === 'suspended'
                    ? 'text-success-600 hover:bg-success-50 border-success-200'
                    : 'text-error-600 hover:bg-error-50 border-error-200'
                }
              >
                {currentStatus === 'suspended' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reactivate
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="border-b border-neutral-200 w-full rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="financials"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Financials
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="activity"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="pt-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Total Orders</p>
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{vendor.performance.totalOrders}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {vendor.performance.completedOrders} completed
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Total Revenue</p>
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-success-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">
                ₹{(vendor.financials.totalRevenue / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                ₹{(vendor.financials.totalCommission / 1000).toFixed(0)}K commission
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Average Rating</p>
                <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{vendor.performance.avgRating.toFixed(1)}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(vendor.performance.avgRating)
                        ? 'fill-warning-500 text-warning-500'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">On-Time Delivery</p>
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-success-600">{vendor.performance.onTimeDeliveryRate}%</p>
              <p className="text-xs text-neutral-600 mt-1">Excellent performance</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Business Information */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Business Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Business Name</p>
                    <p className="font-medium text-neutral-900 truncate">{vendor.businessName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Owner Name</p>
                    <p className="font-medium text-neutral-900 truncate">{vendor.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Phone</p>
                    <p className="font-medium text-neutral-900">{vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Email</p>
                    <p className="font-medium text-neutral-900 truncate">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Category</p>
                    <Badge variant="secondary">{vendor.category}</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Service Areas</p>
                    <p className="font-medium text-neutral-900">{vendor.serviceAreas.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Business Address</p>
                    <p className="font-medium text-neutral-900">
                      {vendor.businessAddress.line1}
                      {vendor.businessAddress.line2 && `, ${vendor.businessAddress.line2}`}, {vendor.businessAddress.area}, {vendor.businessAddress.city}, {vendor.businessAddress.state} - {vendor.businessAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Service Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Service Configuration</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Service Radius</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-neutral-900">{vendor.serviceRadius}</p>
                    <p className="text-sm text-neutral-600">km</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Commission Rate</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-neutral-900">{vendor.commissionRate}</p>
                    <p className="text-sm text-neutral-600">%</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Registered</p>
                  <p className="font-medium text-neutral-900">
                    {format(new Date(vendor.registeredDate), 'dd MMM yyyy')}
                  </p>
                </div>
                {vendor.approvedDate && (
                  <div>
                    <p className="text-xs text-neutral-600 mb-2">Approved</p>
                    <p className="font-medium text-neutral-900">
                      {format(new Date(vendor.approvedDate), 'dd MMM yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tax & Bank Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Tax Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 mb-1">GST Number</p>
                    <p className="font-medium text-neutral-900 font-mono">{vendor.gstNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 mb-1">PAN Number</p>
                    <p className="font-medium text-neutral-900 font-mono">{vendor.panNumber}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Bank Account</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 mb-1">Account Number</p>
                    <p className="font-medium text-neutral-900 font-mono">
                      {canAccess(['super_admin', 'operations'])
                        ? vendor.bankAccount.accountNumber
                        : '••••••' + vendor.bankAccount.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 mb-1">IFSC Code</p>
                    <p className="font-medium text-neutral-900 font-mono">{vendor.bankAccount.ifscCode}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 mb-1">Account Holder</p>
                    <p className="font-medium text-neutral-900">{vendor.bankAccount.accountHolderName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 mb-1">Bank Name</p>
                    <p className="font-medium text-neutral-900">{vendor.bankAccount.bankName}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="pt-6 space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-neutral-600">
                  {filteredOrders.length} of {vendorOrders.length} orders
                </div>
              </div>
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search by order number or buyer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </Card>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No orders found</p>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-neutral-900">{order.orderNumber}</h4>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-neutral-600">
                          {order.type === 'material' ? 'Material Order' : 'Labor Booking'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900">₹{order.total.toLocaleString()}</p>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="mt-1">
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-600">Buyer</p>
                        <p className="text-sm font-medium text-neutral-900">{order.buyerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-600">Delivery Date</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {format(new Date(order.deliveryDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-600">Items</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          {filteredOrders.length > 0 && (
            <Card className="p-6 bg-neutral-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    ₹{filteredOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">Average Order Value</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    ₹{Math.round(filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="pt-6 space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-neutral-900">{vendor.performance.totalOrders}</p>
              <p className="text-xs text-success-600 mt-1">+12% from last month</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Completed</p>
              <p className="text-3xl font-bold text-success-600">{vendor.performance.completedOrders}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {((vendor.performance.completedOrders / vendor.performance.totalOrders) * 100).toFixed(1)}% success rate
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Average Rating</p>
              <p className="text-3xl font-bold text-neutral-900">{vendor.performance.avgRating.toFixed(1)}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(vendor.performance.avgRating)
                        ? 'fill-warning-500 text-warning-500'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">On-Time Delivery</p>
              <p className="text-3xl font-bold text-success-600">{vendor.performance.onTimeDeliveryRate}%</p>
              <p className="text-xs text-success-600 mt-1">Excellent</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Orders Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Customer Reviews */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Customer Reviews</h3>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-neutral-900">{review.buyerName}</p>
                      <p className="text-xs text-neutral-600">Order {review.orderNumber}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-warning-500 text-warning-500'
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 mb-2">{review.comment}</p>
                  <p className="text-xs text-neutral-500">{format(new Date(review.date), 'dd MMM yyyy')}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-6 mt-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-neutral-900">
                ₹{(vendor.financials.totalRevenue / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-neutral-600 mt-1">Lifetime earnings</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Commission Earned</p>
              <p className="text-3xl font-bold text-primary-600">
                ₹{(vendor.financials.totalCommission / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {vendor.commissionRate}% commission rate
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Pending Payouts</p>
              <p className="text-3xl font-bold text-warning-600">
                ₹{(vendor.financials.pendingPayouts / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-neutral-600 mt-1">Next payout in 3 days</p>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Transaction History</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.status === 'completed'
                        ? 'bg-success-50'
                        : 'bg-warning-50'
                    }`}>
                      <IndianRupee className={`w-5 h-5 ${
                        transaction.status === 'completed'
                          ? 'text-success-600'
                          : 'text-warning-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Settlement - {transaction.orderNumber}</p>
                      <p className="text-sm text-neutral-600">{format(new Date(transaction.date), 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">₹{transaction.amount.toLocaleString()}</p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                      {transaction.status === 'completed' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payout Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payout Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-600 mb-2">Payout Frequency</p>
                <p className="font-medium text-neutral-900">Weekly (Every Friday)</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-2">Next Payout Date</p>
                <p className="font-medium text-neutral-900">{format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-2">Payout Method</p>
                <p className="font-medium text-neutral-900">Bank Transfer (NEFT)</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-2">Total Payouts</p>
                <p className="font-medium text-neutral-900">
                  ₹{((vendor.financials.totalRevenue - vendor.financials.pendingPayouts) / 100000).toFixed(2)}L
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">KYC Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'gstCertificate', label: 'GST Certificate', icon: FileText },
                { key: 'panCard', label: 'PAN Card', icon: CreditCard },
                { key: 'cancelledCheque', label: 'Cancelled Cheque', icon: CreditCard },
                { key: 'shopLicense', label: 'Shop License', icon: FileText },
              ].map((doc) => {
                const Icon = doc.icon;
                const isUploaded = vendor.kycDocuments[doc.key as keyof typeof vendor.kycDocuments];
                return (
                  <div
                    key={doc.key}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg transition-colors ${
                      isUploaded
                        ? 'border-success-200 bg-success-50'
                        : 'border-error-200 bg-error-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isUploaded ? 'bg-success-100' : 'bg-error-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isUploaded ? 'text-success-600' : 'text-error-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{doc.label}</p>
                        {isUploaded ? (
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-4 h-4 text-success-600" />
                            <p className="text-sm text-success-600">Uploaded</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-1">
                            <XCircle className="w-4 h-4 text-error-600" />
                            <p className="text-sm text-error-600">Not uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {isUploaded && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4 mt-6">
          {/* Filters & Search */}
          <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Select value={activityTypeFilter} onValueChange={(value) => {
                  setActivityTypeFilter(value);
                  setActivityPage(1);
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Activities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="order_completed">Orders Completed</SelectItem>
                    <SelectItem value="order_accepted">Orders Accepted</SelectItem>
                    <SelectItem value="status_change">Status Changes</SelectItem>
                    <SelectItem value="payout_processed">Payouts</SelectItem>
                    <SelectItem value="document_uploaded">Documents</SelectItem>
                    <SelectItem value="profile_updated">Profile Updates</SelectItem>
                    <SelectItem value="approved">Approvals</SelectItem>
                    <SelectItem value="registered">Registration</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-neutral-600">
                  {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Search activities..."
                    value={activitySearchQuery}
                    onChange={(e) => {
                      setActivitySearchQuery(e.target.value);
                      setActivityPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>

          {/* Activity Grid */}
          <Card className="p-6">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No activities found</p>
                <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Activity</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">User</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedActivities.map((activity) => {
                        const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                        const colorClass = activityColors[activity.type as keyof typeof activityColors];
                        return (
                          <tr key={activity.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="py-4 px-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${colorClass}`}>
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium capitalize">
                                  {activity.type.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-neutral-900">{activity.description}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-neutral-600">
                                {typeof activity.user === 'function' ? activity.user(vendor) : activity.user}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-neutral-900">
                                {format(new Date(activity.timestamp), 'dd MMM yyyy')}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {format(new Date(activity.timestamp), 'HH:mm')}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalActivityPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
                    <div className="text-sm text-neutral-600">
                      Showing {((activityPage - 1) * ACTIVITIES_PER_PAGE) + 1} to {Math.min(activityPage * ACTIVITIES_PER_PAGE, filteredActivities.length)} of {filteredActivities.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivityPage(1)}
                        disabled={activityPage === 1}
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivityPage(activityPage - 1)}
                        disabled={activityPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="px-3 text-sm text-neutral-700">
                        Page {activityPage} of {totalActivityPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivityPage(activityPage + 1)}
                        disabled={activityPage === totalActivityPages}
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivityPage(totalActivityPages)}
                        disabled={activityPage === totalActivityPages}
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Suspend Dialog */}
      <ConfirmDialog
        open={showSuspendDialog}
        onOpenChange={setShowSuspendDialog}
        title={currentStatus === 'suspended' ? 'Reactivate Vendor' : 'Suspend Vendor'}
        description={
          currentStatus === 'suspended'
            ? `Are you sure you want to reactivate the vendor "${vendor.businessName}"? They will be able to receive orders again.`
            : `Are you sure you want to suspend the vendor "${vendor.businessName}"? They will not be able to receive new orders until reactivated.`
        }
        confirmText={currentStatus === 'suspended' ? 'Reactivate Vendor' : 'Suspend Vendor'}
        onConfirm={handleSuspendConfirm}
        variant={currentStatus === 'suspended' ? 'default' : 'destructive'}
      />

      {/* Send Notification Modal */}
      <SendNotificationModal
        open={showNotificationModal}
        onOpenChange={setShowNotificationModal}
        vendorName={vendor.businessName}
        onSend={handleSendNotification}
      />
    </div>
  );
}