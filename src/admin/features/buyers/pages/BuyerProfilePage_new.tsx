/**
 * Buyer Profile Page - Admin Portal
 * Comprehensive buyer management with detailed tabs
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  Bell,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Package,
  IndianRupee,
  Star,
  Clock,
  User,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Download,
  Eye,
  Briefcase,
  CreditCard,
  CalendarDays,
  Repeat,
} from 'lucide-react';
import { mockBuyers } from '../../../data/mockBuyers';
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
const spendingData = [
  { month: 'Jul', orders: 3, amount: 45000 },
  { month: 'Aug', orders: 5, amount: 78000 },
  { month: 'Sep', orders: 4, amount: 52000 },
  { month: 'Oct', orders: 6, amount: 95000 },
  { month: 'Nov', orders: 7, amount: 112000 },
  { month: 'Dec', orders: 5, amount: 89000 },
];

const mockActivityLog = [
  {
    id: 'a1',
    type: 'order_placed',
    description: 'Placed order RS2024001234',
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
    type: 'order_completed',
    description: 'Completed order RS2024001220',
    timestamp: '2024-01-05T16:45:00Z',
    user: 'System',
  },
  {
    id: 'a4',
    type: 'kyc_verified',
    description: 'KYC verification completed',
    timestamp: '2024-01-03T11:20:00Z',
    user: 'System',
  },
  {
    id: 'a5',
    type: 'profile_updated',
    description: 'Updated contact information',
    timestamp: '2024-01-02T14:10:00Z',
    user: (buyer: any) => buyer.name,
  },
  {
    id: 'a6',
    type: 'registered',
    description: 'Buyer registered on platform',
    timestamp: '2023-12-15T09:15:00Z',
    user: 'System',
  },
];

const activityIcons = {
  order_placed: Package,
  order_completed: CheckCircle2,
  status_change: AlertTriangle,
  kyc_verified: ShieldCheck,
  profile_updated: Edit,
  registered: User,
};

const activityColors = {
  order_placed: 'text-primary-600 bg-primary-50',
  order_completed: 'text-success-600 bg-success-50',
  status_change: 'text-warning-600 bg-warning-50',
  kyc_verified: 'text-success-600 bg-success-50',
  profile_updated: 'text-neutral-600 bg-neutral-100',
  registered: 'text-primary-600 bg-primary-50',
};

export function BuyerProfilePage() {
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
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [orderDateFilter, setOrderDateFilter] = useState<string>('all');
  const [orderSortBy, setOrderSortBy] = useState<string>('newest');
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 20;

  // Modals
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);

  const buyer = mockBuyers.find((b) => b.id === id);

  if (!buyer) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Buyer not found</p>
        <Button onClick={() => navigate('/admin/buyers')} className="mt-4">
          Back to Buyers
        </Button>
      </div>
    );
  }

  const currentStatus = buyer.status;

  // Filter orders by buyer
  const buyerOrders = mockOrders.filter((order) => order.buyerId === id);

  // Helper function to filter by date range
  const filterByDateRange = (order: any) => {
    if (orderDateFilter === 'all') return true;
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (orderDateFilter) {
      case '7days':
        return daysDiff <= 7;
      case '30days':
        return daysDiff <= 30;
      case '90days':
        return daysDiff <= 90;
      default:
        return true;
    }
  };

  // Filter orders with all criteria
  const filteredOrders = buyerOrders
    .filter((order) => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesType = orderTypeFilter === 'all' || order.type === orderTypeFilter;
      const matchesPayment = orderPaymentFilter === 'all' || order.paymentStatus === orderPaymentFilter;
      const matchesDateRange = filterByDateRange(order);
      const matchesSearch =
        orderSearch === '' ||
        order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.vendorName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.type === 'material' ? 'material order' : 'labor booking').includes(orderSearch.toLowerCase()) ||
        order.deliveryAddress?.toLowerCase().includes(orderSearch.toLowerCase());
      return matchesStatus && matchesType && matchesPayment && matchesDateRange && matchesSearch;
    })
    .sort((a, b) => {
      switch (orderSortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-high':
          return b.total - a.total;
        case 'amount-low':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  // Pagination for orders
  const totalOrderPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ORDERS_PER_PAGE,
    orderPage * ORDERS_PER_PAGE
  );

  // Filter and paginate activities
  const filteredActivities = mockActivityLog.filter((activity) => {
    const matchesType = activityTypeFilter === 'all' || activity.type === activityTypeFilter;
    const matchesSearch =
      activitySearchQuery === '' ||
      activity.description.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(activitySearchQuery.toLowerCase());
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
        ? 'Buyer reactivated successfully'
        : 'Buyer suspended successfully'
    );
    setShowSuspendDialog(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd MMM yyyy, HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const formatMonthYear = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/buyers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">{buyer.name}</h1>
              <StatusBadge status={currentStatus} />
              {buyer.isVerified && <ShieldCheck className="w-6 h-6 text-success-600" />}
            </div>
            <p className="text-neutral-600 mt-1">
              Buyer ID: {buyer.id} • Joined {formatMonthYear(buyer.registeredAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canEdit && (
            <>
              <Button variant="outline">
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
              <p className="text-3xl font-bold text-neutral-900">{buyer.totalOrders}</p>
              <p className="text-xs text-neutral-600 mt-1">{buyer.completedOrders} completed</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Total Spent</p>
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-success-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">
                ₹{(buyer.totalSpent / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-neutral-600 mt-1">Lifetime value</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Avg Order Value</p>
                <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">
                {formatCurrency(buyer.averageOrderValue)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">Per order</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Cancellation Rate</p>
                <div className="w-10 h-10 bg-error-50 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-error-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-error-600">
                {buyer.totalOrders > 0
                  ? Math.round((buyer.cancelledOrders / buyer.totalOrders) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {buyer.cancelledOrders} of {buyer.totalOrders} orders
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Contact Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Full Name</p>
                    <p className="font-medium text-neutral-900 truncate">{buyer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Phone</p>
                    <p className="font-medium text-neutral-900">{buyer.phone}</p>
                  </div>
                </div>
                {buyer.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-600 mb-1">Email</p>
                      <p className="font-medium text-neutral-900 truncate">{buyer.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Buyer Type</p>
                    <Badge variant="secondary" className="capitalize">
                      {buyer.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 mb-1">Primary Location</p>
                    <p className="font-medium text-neutral-900">{buyer.primaryLocation}</p>
                  </div>
                </div>
                {buyer.secondaryLocations && buyer.secondaryLocations.length > 0 && (
                  <div className="flex items-start gap-3 col-span-2">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-600 mb-1">Secondary Locations</p>
                      <p className="font-medium text-neutral-900">
                        {buyer.secondaryLocations.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Account Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Account Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Account Status</p>
                  <StatusBadge status={currentStatus} />
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">KYC Status</p>
                  <Badge
                    variant={
                      buyer.kycStatus === 'verified'
                        ? 'default'
                        : buyer.kycStatus === 'rejected'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="capitalize"
                  >
                    {buyer.kycStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Verified Account</p>
                  <div className="flex items-center gap-2">
                    {buyer.isVerified ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-success-600" />
                        <span className="text-sm font-medium text-success-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-600">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Registered</p>
                  <p className="font-medium text-neutral-900">{formatDate(buyer.registeredAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Last Active</p>
                  <p className="font-medium text-neutral-900">
                    {formatDateTime(buyer.lastActiveAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-2">Order Frequency</p>
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-900">
                      {buyer.totalOrders > 10 ? 'High' : buyer.totalOrders > 5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Orders Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Recent Orders</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                View All Orders
              </Button>
            </div>
            <div className="space-y-3">
              {buyerOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600">No orders yet</p>
                </div>
              ) : (
                buyerOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-neutral-600">
                          {order.vendorName} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {order.type === 'material' ? 'Material' : 'Labor'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Buyer Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Order Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Completed Orders</p>
                      <p className="text-xs text-neutral-600">Successfully delivered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-success-600">{buyer.completedOrders}</p>
                    <p className="text-xs text-neutral-600">
                      {buyer.totalOrders > 0
                        ? Math.round((buyer.completedOrders / buyer.totalOrders) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-error-50 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-error-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Cancelled Orders</p>
                      <p className="text-xs text-neutral-600">Cancelled by buyer or system</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-error-600">{buyer.cancelledOrders}</p>
                    <p className="text-xs text-neutral-600">
                      {buyer.totalOrders > 0
                        ? Math.round((buyer.cancelledOrders / buyer.totalOrders) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-warning-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Average Rating</p>
                      <p className="text-xs text-neutral-600">Feedback from vendors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {buyer.averageRating ? (
                      <>
                        <p className="text-xl font-bold text-neutral-900">
                          {buyer.averageRating.toFixed(1)}
                        </p>
                        <div className="flex items-center gap-0.5 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(buyer.averageRating || 0)
                                  ? 'fill-warning-500 text-warning-500'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-bold text-neutral-400">N/A</p>
                        <div className="flex items-center gap-0.5 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-neutral-300" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Spending Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Spending Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Total Spent</p>
                      <p className="text-xs text-neutral-600">Lifetime value</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-neutral-900">
                    ₹{(buyer.totalSpent / 100000).toFixed(2)}L
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Average Order Value</p>
                      <p className="text-xs text-neutral-600">Per transaction</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-neutral-900">
                    {formatCurrency(buyer.averageOrderValue)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Avg Monthly Spend</p>
                      <p className="text-xs text-neutral-600">Based on activity</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-neutral-900">
                    {formatCurrency(Math.round(buyer.totalSpent / Math.max(buyer.totalOrders, 1)))}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Payment Method</p>
                      <p className="text-xs text-neutral-600">Preferred option</p>
                    </div>
                  </div>
                  <Badge variant="outline">Online Payment</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Tags & Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tags</h3>
              {buyer.tags && buyer.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {buyer.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 italic">No tags assigned</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Admin Notes</h3>
              {buyer.notes ? (
                <p className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                  {buyer.notes}
                </p>
              ) : (
                <p className="text-sm text-neutral-500 italic">No notes available</p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="pt-6 space-y-6">
          {/* Search & Filter Section - Three-Section Layout */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            {/* Section 1: Search Bar */}
            <div className="p-4 border-b border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search by order number, vendor, location, or type..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Section 2: Filter Toolbar */}
            <div className="px-4 py-3 bg-neutral-50">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-[190px] bg-white">
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

                  <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                    <SelectTrigger className="w-[140px] bg-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={orderPaymentFilter} onValueChange={setOrderPaymentFilter}>
                    <SelectTrigger className="w-[140px] bg-white">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={orderDateFilter} onValueChange={setOrderDateFilter}>
                    <SelectTrigger className="w-[150px] bg-white">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={orderSortBy} onValueChange={setOrderSortBy}>
                    <SelectTrigger className="w-[150px] bg-white">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                      <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-neutral-600">
                    {filteredOrders.length} of {buyerOrders.length} orders
                  </div>
                  {filteredOrders.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Active Filter Chips */}
            {(orderStatusFilter !== 'all' ||
              orderTypeFilter !== 'all' ||
              orderPaymentFilter !== 'all' ||
              orderDateFilter !== 'all' ||
              orderSortBy !== 'newest') && (
              <div className="px-4 py-3 bg-primary-50/30 border-t border-primary-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-neutral-600">Active filters:</span>
                  {orderStatusFilter !== 'all' && (
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>
                        Status:{' '}
                        {orderStatusFilter.charAt(0).toUpperCase() + orderStatusFilter.slice(1)}
                      </span>
                      <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                  {orderTypeFilter !== 'all' && (
                    <button
                      onClick={() => setOrderTypeFilter('all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>
                        Type: {orderTypeFilter.charAt(0).toUpperCase() + orderTypeFilter.slice(1)}
                      </span>
                      <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                  {orderPaymentFilter !== 'all' && (
                    <button
                      onClick={() => setOrderPaymentFilter('all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>
                        Payment:{' '}
                        {orderPaymentFilter.charAt(0).toUpperCase() + orderPaymentFilter.slice(1)}
                      </span>
                      <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                  {orderDateFilter !== 'all' && (
                    <button
                      onClick={() => setOrderDateFilter('all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>
                        Date:{' '}
                        {orderDateFilter === '7days'
                          ? 'Last 7 Days'
                          : orderDateFilter === '30days'
                          ? 'Last 30 Days'
                          : 'Last 3 Months'}
                      </span>
                      <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                  {orderSortBy !== 'newest' && (
                    <button
                      onClick={() => setOrderSortBy('newest')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>
                        Sort:{' '}
                        {orderSortBy === 'oldest'
                          ? 'Oldest First'
                          : orderSortBy === 'amount-high'
                          ? 'Amount High-Low'
                          : 'Amount Low-High'}
                      </span>
                      <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOrderStatusFilter('all');
                      setOrderTypeFilter('all');
                      setOrderPaymentFilter('all');
                      setOrderDateFilter('all');
                      setOrderSortBy('newest');
                    }}
                    className="text-xs text-primary-700 hover:text-primary-800 font-medium underline ml-2"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {paginatedOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 font-medium">
                  {buyerOrders.length === 0
                    ? 'No orders yet'
                    : 'No orders match your filters'}
                </p>
                {buyerOrders.length > 0 && filteredOrders.length === 0 && (
                  <p className="text-sm text-neutral-500 mt-2">
                    Try adjusting your filters to see more results
                  </p>
                )}
              </Card>
            ) : (
              paginatedOrders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-neutral-900">{order.orderNumber}</h4>
                          <StatusBadge status={order.status} />
                          {order.paymentStatus === 'pending' && (
                            <Badge variant="destructive" className="text-xs">
                              Payment Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">
                          {order.type === 'material' ? 'Material Order' : 'Labor Booking'} •
                          Created {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-lg font-bold text-neutral-900">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <Badge
                        variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}
                        className="mt-1"
                      >
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-neutral-600">Vendor</p>
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {order.vendorName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-neutral-600">Location</p>
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {order.deliveryAddress || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-neutral-600">Delivery Date</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <div className="min-w-0">
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

          {/* Pagination */}
          {totalOrderPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing {(orderPage - 1) * ORDERS_PER_PAGE + 1} to{' '}
                {Math.min(orderPage * ORDERS_PER_PAGE, filteredOrders.length)} of{' '}
                {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={orderPage === 1}
                  onClick={() => setOrderPage(orderPage - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalOrderPages, 5) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <Button
                        key={pageNumber}
                        variant={orderPage === pageNumber ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setOrderPage(pageNumber)}
                        className="w-9"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  {totalOrderPages > 5 && <span className="text-neutral-600 px-2">...</span>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={orderPage === totalOrderPages}
                  onClick={() => setOrderPage(orderPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          {filteredOrders.length > 0 && (
            <Card className="p-6 bg-neutral-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Spent (Filtered Results)</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    ₹
                    {filteredOrders
                      .reduce((sum, order) => sum + order.total, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Average Order Value</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    ₹
                    {Math.round(
                      filteredOrders.reduce((sum, order) => sum + order.total, 0) /
                        filteredOrders.length
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Payment Status</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success-500"></div>
                      <span className="text-sm text-neutral-900">
                        {filteredOrders.filter((o) => o.paymentStatus === 'paid').length} Paid
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                      <span className="text-sm text-neutral-900">
                        {filteredOrders.filter((o) => o.paymentStatus === 'pending').length}{' '}
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="pt-6 space-y-6">
          {/* Spending Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Spending Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#8B2C2C" name="Spending (₹)" />
                <Bar dataKey="orders" fill="#2F3E46" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Repeat Customer</p>
              <p className="text-3xl font-bold text-neutral-900">
                {buyer.totalOrders > 1 ? '100' : '0'}%
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                {buyer.totalOrders > 1
                  ? `${buyer.totalOrders - 1} repeat order${buyer.totalOrders > 2 ? 's' : ''}`
                  : 'No repeat orders yet'}
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Cancellation Rate</p>
              <p className="text-3xl font-bold text-error-600">
                {buyer.totalOrders > 0
                  ? Math.round((buyer.cancelledOrders / buyer.totalOrders) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                {buyer.cancelledOrders} of {buyer.totalOrders} orders
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-neutral-600 mb-2">Completion Rate</p>
              <p className="text-3xl font-bold text-success-600">
                {buyer.totalOrders > 0
                  ? Math.round((buyer.completedOrders / buyer.totalOrders) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                {buyer.completedOrders} of {buyer.totalOrders} orders
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="pt-6 space-y-6">
          {/* Search & Filter Section - Three-Section Layout */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            {/* Section 1: Search Bar */}
            <div className="p-4 border-b border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search activity by description or type..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Section 2: Filter Toolbar */}
            <div className="px-4 py-3 bg-neutral-50">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                    <SelectTrigger className="w-[190px] bg-white">
                      <SelectValue placeholder="All Activities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="order_placed">Orders Placed</SelectItem>
                      <SelectItem value="order_completed">Orders Completed</SelectItem>
                      <SelectItem value="status_change">Status Changes</SelectItem>
                      <SelectItem value="kyc_verified">KYC Updates</SelectItem>
                      <SelectItem value="profile_updated">Profile Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-neutral-600">
                  {filteredActivities.length} of {mockActivityLog.length} activities
                </div>
              </div>
            </div>

            {/* Section 3: Active Filter Chips */}
            {activityTypeFilter !== 'all' && (
              <div className="px-4 py-3 bg-primary-50/30 border-t border-primary-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-neutral-600">Active filters:</span>
                  <button
                    onClick={() => setActivityTypeFilter('all')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <span>
                      Type:{' '}
                      {activityTypeFilter === 'order_placed'
                        ? 'Orders Placed'
                        : activityTypeFilter === 'order_completed'
                        ? 'Orders Completed'
                        : activityTypeFilter === 'status_change'
                        ? 'Status Changes'
                        : activityTypeFilter === 'kyc_verified'
                        ? 'KYC Updates'
                        : 'Profile Updates'}
                    </span>
                    <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                  <button
                    onClick={() => setActivityTypeFilter('all')}
                    className="text-xs text-primary-700 hover:text-primary-800 font-medium underline ml-2"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity List */}
          <Card className="divide-y divide-neutral-200">
            {paginatedActivities.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No activity found</p>
              </div>
            ) : (
              paginatedActivities.map((activity) => {
                const Icon =
                  activityIcons[activity.type as keyof typeof activityIcons] || FileText;
                const colorClass =
                  activityColors[activity.type as keyof typeof activityColors] ||
                  'text-neutral-600 bg-neutral-100';

                return (
                  <div key={activity.id} className="p-4 flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {typeof activity.user === 'function'
                          ? activity.user(buyer)
                          : activity.user}{' '}
                        • {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </Card>

          {/* Pagination */}
          {totalActivityPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Page {activityPage} of {totalActivityPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activityPage === 1}
                  onClick={() => setActivityPage(activityPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activityPage === totalActivityPages}
                  onClick={() => setActivityPage(activityPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showSuspendDialog}
        onOpenChange={setShowSuspendDialog}
        title={currentStatus === 'suspended' ? 'Reactivate Buyer' : 'Suspend Buyer'}
        description={
          currentStatus === 'suspended'
            ? 'Are you sure you want to reactivate this buyer account? They will regain full access to the platform.'
            : 'Are you sure you want to suspend this buyer account? They will lose access to the platform.'
        }
        confirmText={currentStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
        onConfirm={handleSuspendConfirm}
        variant={currentStatus === 'suspended' ? 'default' : 'destructive'}
      />
    </div>
  );
}