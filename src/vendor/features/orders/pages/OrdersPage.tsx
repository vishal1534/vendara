import { useState, useMemo, useEffect } from 'react';
import { useVendorOrders } from '../../../context/VendorOrdersContext';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';
import { OrdersTable } from '../components/OrdersTable';
import { ExportButton } from '../components/ExportButton';
import { RejectOrderModal } from '../components/RejectOrderModal';
import { StatCard } from '../../../components/StatCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../app/components/ui/tabs';
import { Badge } from '../../../../app/components/ui/badge';
import { useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import { Package, TrendingUp, CheckCircle, Clock, Search, X } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils';
import { toast } from 'sonner';

type DateRangePreset = 'last7days' | 'last30days' | 'last60days' | 'thisMonth' | 'lastMonth' | 'allTime';

// Helper function to get date range from preset
function getDateRangeFromPreset(preset: DateRangePreset): { from: Date; to: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();

  switch (preset) {
    case 'last7days':
      start.setDate(start.getDate() - 6);
      break;
    case 'last30days':
      start.setDate(start.getDate() - 29);
      break;
    case 'last60days':
      start.setDate(start.getDate() - 59);
      break;
    case 'thisMonth':
      start.setDate(1);
      break;
    case 'lastMonth':
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end.setDate(0); // Last day of previous month
      break;
    case 'allTime':
      start.setFullYear(2000, 0, 1);
      break;
  }

  start.setHours(0, 0, 0, 0);
  return { from: start, to: end };
}

export function OrdersPage() {
  const { orders } = useVendorOrders();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<VendorOrderStatus | 'all' | 'active'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSettlement, setSelectedSettlement] = useState<'all' | 'pending' | 'processing' | 'settled'>('all');
  const [activeTab, setActiveTab] = useState<'requests' | 'my-orders'>('requests');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOrderForReject, setSelectedOrderForReject] = useState<{ id: string; orderNumber: string; itemName: string } | null>(null);

  // Check if we need to restore a specific tab from navigation state
  useEffect(() => {
    const state = location.state as { activeTab?: 'requests' | 'my-orders' };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      // Clear the state to prevent it from being reused on subsequent navigations
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Get unique categories from orders
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      orders
        .filter(order => order.itemCategory)
        .map(order => order.itemCategory as string)
    );
    return Array.from(uniqueCategories).sort();
  }, [orders]);

  const categoryLabels: Record<string, string> = {
    cement: 'Cement',
    sand: 'Sand',
    aggregate: 'Aggregate',
    steel: 'Steel',
  };

  // Calculate order counts
  const orderCounts = useMemo(() => {
    const activeStatuses = [
      VendorOrderStatus.OFFERED,
      VendorOrderStatus.ACCEPTED,
      VendorOrderStatus.IN_PROGRESS,
    ];

    // Calculate total payout amount (vendor earnings)
    const totalPayout = orders.reduce((sum, order) => sum + order.totalPayoutAmount, 0);

    // Count non-expired order requests
    const now = new Date();
    const nonExpiredRequests = orders.filter(order => {
      if (order.status !== VendorOrderStatus.OFFERED) return false;
      if (order.offerExpiresAt) {
        const expiresAt = new Date(order.offerExpiresAt);
        return expiresAt > now;
      }
      return true;
    }).length;

    return {
      all: orders.length,
      requests: nonExpiredRequests,
      myOrders: orders.filter(order => order.status !== VendorOrderStatus.OFFERED).length,
      active: orders.filter((order) =>
        activeStatuses.includes(order.status)
      ).length,
      completed: orders.filter(
        (order) => order.status === VendorOrderStatus.COMPLETED
      ).length,
      totalPayout,
    };
  }, [orders]);

  // Filter orders based on current tab and filters
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by tab first
    if (activeTab === 'requests') {
      // Show only OFFERED orders that haven't expired
      filtered = filtered.filter(order => {
        if (order.status !== VendorOrderStatus.OFFERED) return false;
        
        // Check if offer has expired
        if (order.offerExpiresAt) {
          const expiresAt = new Date(order.offerExpiresAt);
          const now = new Date();
          return expiresAt > now; // Only show non-expired offers
        }
        
        return true;
      });
    } else {
      filtered = filtered.filter(order => order.status !== VendorOrderStatus.OFFERED);
    }

    // Apply filters (works on both tabs)
    // Filter by status (only if not filtering by tab-specific status)
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(
          (order) =>
            order.status === VendorOrderStatus.ACCEPTED ||
            order.status === VendorOrderStatus.IN_PROGRESS ||
            order.status === VendorOrderStatus.READY
        );
      } else {
        filtered = filtered.filter((order) => order.status === selectedStatus);
      }
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((order) => order.itemCategory === selectedCategory);
    }

    // Filter by settlement status
    if (selectedSettlement !== 'all') {
      filtered = filtered.filter((order) => order.settlementStatus === selectedSettlement);
    }

    // Default sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter by search (applies to both tabs)
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.itemName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [orders, searchQuery, selectedStatus, selectedCategory, activeTab, selectedSettlement]);

  // Active filters for chips
  const activeFilters = [];
  
  if (selectedStatus !== 'all') {
    const statusLabels: Record<VendorOrderStatus | 'active', string> = {
      [VendorOrderStatus.ACCEPTED]: 'Accepted',
      [VendorOrderStatus.IN_PROGRESS]: 'In Progress',
      [VendorOrderStatus.READY]: 'Ready',
      [VendorOrderStatus.COMPLETED]: 'Completed',
      [VendorOrderStatus.REJECTED]: 'Rejected',
      [VendorOrderStatus.CANCELLED]: 'Cancelled',
      [VendorOrderStatus.OFFERED]: 'Order Requests',
      active: 'Active',
    };
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusLabels[selectedStatus],
      onRemove: () => setSelectedStatus('all'),
    });
  }

  if (selectedCategory !== 'all') {
    activeFilters.push({
      type: 'category',
      label: 'Category',
      value: categoryLabels[selectedCategory] || selectedCategory,
      onRemove: () => setSelectedCategory('all'),
    });
  }

  if (selectedSettlement !== 'all') {
    const settlementLabels: Record<'all' | 'pending' | 'processing' | 'settled', string> = {
      all: 'All Settlements',
      pending: 'Pending',
      processing: 'Processing',
      settled: 'Settled',
    };
    
    activeFilters.push({
      type: 'settlement',
      label: 'Settlement Status',
      value: settlementLabels[selectedSettlement],
      onRemove: () => setSelectedSettlement('all'),
    });
  }

  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedSettlement('all');
  };

  const hasActiveFilters = activeFilters.length > 0;

  // Handle accepting an order
  const handleAcceptOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // TODO: Call API to accept order
    // For now, show success toast with undo option
    console.log('Accepting order:', orderId);
    
    toast.success(
      `Order ${order.orderNumber} accepted!`,
      {
        description: `You've accepted the order for ${order.itemName}`,
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => {
            console.log('Undo accept:', orderId);
            toast.info('Order acceptance cancelled');
          },
        },
      }
    );
  };

  // Handle rejecting an order (opens modal)
  const handleRejectOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrderForReject({
      id: order.id,
      orderNumber: order.orderNumber,
      itemName: order.itemName,
    });
    setRejectModalOpen(true);
  };

  // Handle reject confirmation from modal
  const handleConfirmReject = (reason: string, additionalNotes?: string) => {
    if (!selectedOrderForReject) return;

    // TODO: Call API to reject order with reason
    console.log('Rejecting order:', selectedOrderForReject.id, 'Reason:', reason, 'Notes:', additionalNotes);
    
    toast.error(
      `Order ${selectedOrderForReject.orderNumber} rejected`,
      {
        description: `Reason: ${reason}`,
        duration: 5000,
      }
    );

    // Close modal
    setRejectModalOpen(false);
    setSelectedOrderForReject(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage order requests and track your order history
          </p>
        </div>
        <ExportButton orders={filteredOrders} filename="realserv_orders" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          iconBgColor="bg-warning-100"
          iconColor="text-warning-700"
          label="Pending Requests"
          value={orderCounts.requests}
          subtitle="Awaiting your response"
        />
        <StatCard
          icon={Package}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-700"
          label="Active Orders"
          value={orderCounts.active - orderCounts.requests}
          subtitle="In progress"
        />
        <StatCard
          icon={CheckCircle}
          iconBgColor="bg-success-100"
          iconColor="text-success-700"
          label="Completed"
          value={orderCounts.completed}
          subtitle="Successfully delivered"
        />
        <StatCard
          icon={TrendingUp}
          iconBgColor="bg-secondary-100"
          iconColor="text-secondary-700"
          label="Total Payout"
          value={formatCurrency(orderCounts.totalPayout)}
          subtitle="All orders"
        />
      </div>

      {/* Unified Search and Filters - Above Tabs */}
      <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b-2 border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search by order number, item name, or delivery area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-4 py-3 bg-neutral-50 border-t-2 border-neutral-200">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as VendorOrderStatus | 'all' | 'active')}>
              <SelectTrigger className="w-[180px] h-10 border-2 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value={VendorOrderStatus.OFFERED}>Order Requests</SelectItem>
                <SelectItem value={VendorOrderStatus.ACCEPTED}>Accepted</SelectItem>
                <SelectItem value={VendorOrderStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={VendorOrderStatus.READY}>Ready</SelectItem>
                <SelectItem value={VendorOrderStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={VendorOrderStatus.REJECTED}>Rejected</SelectItem>
                <SelectItem value={VendorOrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-10 border-2 bg-white">
                <SelectValue placeholder="Category" />
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

            {/* Settlement Status Filter */}
            <Select value={selectedSettlement} onValueChange={setSelectedSettlement}>
              <SelectTrigger className="w-[180px] h-10 border-2 bg-white">
                <SelectValue placeholder="Settlement Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Settlements</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="px-4 py-3 bg-primary-50/30 border-t-2 border-primary-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-neutral-600">Active filters:</span>
              
              {activeFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={filter.onRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                >
                  <span className="font-medium text-neutral-500">{filter.label}:</span>
                  <span>{filter.value}</span>
                  <X className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              ))}
              
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-primary-700 hover:text-primary-800 font-medium underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as 'requests' | 'my-orders');
      }} className="mt-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="requests">
              Order Requests
              {orderCounts.requests > 0 && (
                <Badge 
                  variant="outline" 
                  className="ml-2 bg-warning-100 text-warning-700 border-warning-200 px-1.5 py-0 text-xs"
                >
                  {orderCounts.requests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-orders">
              My Orders
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Order Requests Tab */}
        <TabsContent value="requests" className="pt-0">
          {/* Info Banner for Order Requests */}
          <div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-warning-800">
              <strong>New Order Requests:</strong> Review and accept orders that match your availability and service areas. 
              You have 15 minutes to respond. If you don't respond, the request will automatically be declined.
            </p>
          </div>

          {/* Title and Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-neutral-900">Order Requests</h2>
              <p className="text-sm text-neutral-600">
                Showing <span className="font-semibold text-neutral-900">{filteredOrders.length}</span> order request{filteredOrders.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <OrdersTable orders={filteredOrders} currentTab={activeTab} onAcceptOrder={handleAcceptOrder} onRejectOrder={handleRejectOrder} />
        </TabsContent>

        {/* My Orders Tab */}
        <TabsContent value="my-orders" className="pt-0">
          {/* Title and Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-neutral-900">My Orders</h2>
              <p className="text-sm text-neutral-600">
                Showing <span className="font-semibold text-neutral-900">{filteredOrders.length}</span> of{' '}
                <span className="font-semibold text-neutral-900">{orderCounts.myOrders}</span> order{orderCounts.myOrders !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <OrdersTable orders={filteredOrders} currentTab={activeTab} onAcceptOrder={handleAcceptOrder} onRejectOrder={handleRejectOrder} />
        </TabsContent>
      </Tabs>

      {/* Reject Order Modal */}
      {selectedOrderForReject && (
        <RejectOrderModal
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            setSelectedOrderForReject(null);
          }}
          onConfirm={handleConfirmReject}
          orderNumber={selectedOrderForReject.orderNumber}
          itemName={selectedOrderForReject.itemName}
        />
      )}
    </div>
  );
}