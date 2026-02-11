/**
 * Orders Page - Admin Portal
 * Clean, scannable design with essential filters
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderStatus, OrderType } from '../../../types/order';
import { mockOrders, mockOrderStats } from '../../../data/mockOrders';
import { Button } from '../../../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import {
  Search,
  Download,
  Eye,
  AlertTriangle,
  Clock,
  X,
  ShoppingCart,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
} from 'lucide-react';
import { Badge } from '../../../../app/components/ui/badge';
import { toast } from 'sonner';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Card } from '../../../../app/components/ui/card';
import { SearchFilterSection } from '../../../components/SearchFilterSection';

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  confirmed: { label: 'Confirmed', variant: 'secondary' },
  active: { label: 'Active', variant: 'default' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  disputed: { label: 'Disputed', variant: 'destructive' },
};

const typeConfig: Record<OrderType, { label: string; color: string }> = {
  material: { label: 'Material', color: 'text-primary-700 bg-primary-50' },
  labor: { label: 'Labor', color: 'text-secondary-700 bg-secondary-50' },
};

// Helper to get status count for dropdown display
const getStatusLabel = (status: string, count: number) => {
  const labels: Record<string, string> = {
    all: `All Statuses (${mockOrderStats.total})`,
    pending: `Pending (${mockOrderStats.pending})`,
    confirmed: `Confirmed (${mockOrderStats.confirmed})`,
    active: `Active (${mockOrderStats.active})`,
    disputed: `Disputed (${mockOrderStats.disputed})`,
    completed: `Completed (${mockOrderStats.completed})`,
    cancelled: `Cancelled (${mockOrderStats.cancelled})`,
  };
  return labels[status] || status;
};

export function OrdersPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderType, setOrderType] = useState<OrderType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders based on status, type, date, and search
  const filteredOrders = mockOrders.filter((order) => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    
    // Type filter
    if (orderType !== 'all' && order.type !== orderType) return false;
    
    // Date filter
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') {
        if (orderDate < today) return false;
      } else if (dateFilter === '7days') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (orderDate < weekAgo) return false;
      } else if (dateFilter === '30days') {
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        if (orderDate < monthAgo) return false;
      }
    }
    
    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(search) ||
        order.buyerName.toLowerCase().includes(search) ||
        order.vendorName.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

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
    });
  };

  // Get relevant date for display based on order status
  const getDisplayDate = (order: Order) => {
    // For active/confirmed orders, show delivery date if available
    if ((order.status === 'active' || order.status === 'confirmed') && order.deliveryDate) {
      return {
        date: formatDate(order.deliveryDate),
        label: 'Delivery',
        isDelivery: true,
      };
    }
    // Otherwise show created date
    return {
      date: formatDate(order.createdAt),
      label: 'Created',
      isDelivery: false,
    };
  };

  const handleExportData = () => {
    toast.success('Orders exported successfully');
  };

  const isUrgent = (order: Order) => {
    // Mark as urgent if disputed or if pending for more than 24 hours
    if (order.hasActiveDispute) return true;
    if (order.status === 'pending') {
      const created = new Date(order.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 24;
    }
    return false;
  };

  // Get active filters for chips display
  const activeFilters = [];
  if (statusFilter !== 'all') {
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusConfig[statusFilter].label,
      onRemove: () => setStatusFilter('all'),
    });
  }
  if (orderType !== 'all') {
    activeFilters.push({
      type: 'type',
      label: 'Type',
      value: typeConfig[orderType].label,
      onRemove: () => setOrderType('all'),
    });
  }
  if (dateFilter !== 'all') {
    const dateLabels: Record<string, string> = {
      today: 'Today',
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days',
    };
    activeFilters.push({
      type: 'date',
      label: 'Date',
      value: dateLabels[dateFilter],
      onRemove: () => setDateFilter('all'),
    });
  }

  const hasActiveFilters = statusFilter !== 'all' || orderType !== 'all' || dateFilter !== 'all';

  // Get current filter display values
  const getStatusDisplay = () => {
    if (statusFilter === 'all') return 'All Statuses';
    return statusConfig[statusFilter].label;
  };

  const getTypeDisplay = () => {
    if (orderType === 'all') return 'All Types';
    return typeConfig[orderType].label;
  };

  const getDateDisplay = () => {
    if (dateFilter === 'all') return 'All Time';
    const dateLabels: Record<string, string> = {
      today: 'Today',
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days',
    };
    return dateLabels[dateFilter];
  };

  // Define columns for DataTable
  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order Details',
      sortable: true,
      render: (order) => {
        const urgent = isUrgent(order);
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {order.orderNumber}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig[order.type].color}`}>
              {typeConfig[order.type].label}
            </span>
            {order.hasActiveDispute && (
              <AlertTriangle className="w-4 h-4 text-error-600 flex-shrink-0" />
            )}
            {urgent && !order.hasActiveDispute && (
              <Clock className="w-4 h-4 text-warning-600 flex-shrink-0" />
            )}
          </div>
        );
      },
    },
    {
      key: 'buyerName',
      label: 'Buyer',
      sortable: true,
      render: (order) => (
        <span className="text-sm font-medium text-neutral-900">
          {order.buyerName}
        </span>
      ),
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true,
      render: (order) => (
        <span className="text-sm font-medium text-neutral-900">
          {order.vendorName}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Amount',
      sortable: true,
      render: (order) => (
        <span className="font-semibold text-neutral-900">
          {formatCurrency(order.total)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order) => (
        <Badge variant={statusConfig[order.status].variant}>
          {statusConfig[order.status].label}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (order) => {
        const displayDate = getDisplayDate(order);
        return (
          <div>
            <div className="text-sm text-neutral-900">{displayDate.date}</div>
            <div className={`text-xs ${displayDate.isDelivery ? 'text-primary-600 font-medium' : 'text-neutral-500'}`}>
              {displayDate.label}
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions' as any,
      label: 'Actions',
      render: (order) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/orders/${order.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Orders</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockOrderStats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Orders</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockOrderStats.active}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Completed</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {mockOrderStats.completed}
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
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {formatCurrency(mockOrderStats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - Separate Card */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search by order number, buyer name, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-4 py-3 bg-neutral-50">
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
              <SelectTrigger className="w-[190px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getStatusLabel('all', mockOrderStats.total)}</SelectItem>
                <SelectItem value="pending">{getStatusLabel('pending', mockOrderStats.pending)}</SelectItem>
                <SelectItem value="confirmed">{getStatusLabel('confirmed', mockOrderStats.confirmed)}</SelectItem>
                <SelectItem value="active">{getStatusLabel('active', mockOrderStats.active)}</SelectItem>
                <SelectItem value="disputed" className="text-error-700 font-medium">
                  {getStatusLabel('disputed', mockOrderStats.disputed)}</SelectItem>
                <SelectItem value="completed">{getStatusLabel('completed', mockOrderStats.completed)}</SelectItem>
                <SelectItem value="cancelled">{getStatusLabel('cancelled', mockOrderStats.cancelled)}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType | 'all')}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="px-4 py-3 bg-primary-50/30 border-t border-primary-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-neutral-600">Active filters:</span>
              
              {activeFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={filter.onRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                >
                  <span className="font-medium text-neutral-500">{filter.label}:</span>
                  <span>{filter.value}</span>
                  <X className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              ))}
              
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setOrderType('all');
                  setDateFilter('all');
                }}
                className="text-xs text-primary-700 hover:text-primary-800 font-medium underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        searchable={false}
        pageSize={15}
        emptyMessage="No orders found"
        onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
        getRowClassName={(order) => {
          if (order.hasActiveDispute) {
            return 'bg-error-50/40 border-l-4 border-l-error-600';
          }
          if (isUrgent(order) && !order.hasActiveDispute) {
            return 'bg-warning-50/30';
          }
          return '';
        }}
      />
    </div>
  );
}