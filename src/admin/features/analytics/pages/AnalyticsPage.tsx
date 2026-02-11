/**
 * Analytics & Reports Page - Admin Portal
 * Industry-grade marketplace analytics with two-sided metrics
 * 
 * Phase 1 Features Implemented:
 * - Period-over-period comparison mode
 * - Two-sided marketplace metrics (buyers + vendors)
 * - Financial breakdown (GMV, platform revenue, payouts)
 * - Geographic analytics (zone-wise performance)
 */

import { useState } from 'react';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card } from '../../../../app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  IndianRupee,
  ShoppingCart,
  Calendar,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
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
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';

// Mock data for current period
const currentPeriodData = {
  revenue: {
    data: [
      { month: 'Aug', revenue: 185000, orders: 45, buyers: 32, vendors: 8 },
      { month: 'Sep', revenue: 235000, orders: 58, buyers: 41, vendors: 10 },
      { month: 'Oct', revenue: 298000, orders: 72, buyers: 52, vendors: 12 },
      { month: 'Nov', revenue: 345000, orders: 85, buyers: 64, vendors: 14 },
      { month: 'Dec', revenue: 425000, orders: 102, buyers: 78, vendors: 16 },
      { month: 'Jan', revenue: 512000, orders: 125, buyers: 95, vendors: 18 },
    ],
  },
  totals: {
    gmv: 2000000, // Gross Merchandise Value
    platformRevenue: 80000, // 4% platform fee
    tdsCollected: 20000, // 1% TDS
    vendorPayout: 1900000, // GMV - platform fee - TDS
    orders: 487,
    activeVendors: 18,
    activeBuyers: 95,
    newBuyers: 28,
    returningBuyers: 67,
    avgOrderValue: 4104,
    buyerLTV: 21053, // Lifetime value
    vendorFulfillmentRate: 94.5,
    onTimeDeliveryRate: 92.3,
  },
};

// Mock data for previous period (for comparison)
const previousPeriodData = {
  totals: {
    gmv: 1640000,
    platformRevenue: 65600,
    tdsCollected: 16400,
    vendorPayout: 1558000,
    orders: 399,
    activeVendors: 15,
    activeBuyers: 78,
    newBuyers: 31,
    returningBuyers: 47,
    avgOrderValue: 4110,
    buyerLTV: 18974,
    vendorFulfillmentRate: 92.1,
    onTimeDeliveryRate: 89.7,
  },
};

// Zone-wise performance data
const zoneData = [
  { 
    zone: 'Madhapur', 
    orders: 145, 
    revenue: 595000, 
    vendors: 6, 
    buyers: 42,
    avgDeliveryTime: 2.3, // hours
    onTimeRate: 95.2,
  },
  { 
    zone: 'Gachibowli', 
    orders: 132, 
    revenue: 542000, 
    vendors: 5, 
    buyers: 38,
    avgDeliveryTime: 2.1,
    onTimeRate: 96.1,
  },
  { 
    zone: 'Kukatpally', 
    orders: 98, 
    revenue: 402000, 
    vendors: 4, 
    buyers: 29,
    avgDeliveryTime: 2.8,
    onTimeRate: 91.8,
  },
  { 
    zone: 'Miyapur', 
    orders: 68, 
    revenue: 279000, 
    vendors: 3, 
    buyers: 21,
    avgDeliveryTime: 3.2,
    onTimeRate: 88.2,
  },
  { 
    zone: 'Kondapur', 
    orders: 44, 
    revenue: 182000, 
    vendors: 2, 
    buyers: 15,
    avgDeliveryTime: 2.5,
    onTimeRate: 93.2,
  },
];

// Category performance
const categoryData = [
  { category: 'Cement', value: 350000, orders: 145, margin: 3.8 },
  { category: 'Steel', value: 425000, orders: 98, margin: 4.2 },
  { category: 'Bricks', value: 280000, orders: 168, margin: 3.5 },
  { category: 'Sand', value: 195000, orders: 87, margin: 3.2 },
  { category: 'Tiles', value: 225000, orders: 76, margin: 4.5 },
  { category: 'Others', value: 180000, orders: 132, margin: 3.9 },
];

// Order funnel data
const funnelData = [
  { stage: 'Requests', count: 542, percentage: 100 },
  { stage: 'Vendor Matched', count: 518, percentage: 95.6 },
  { stage: 'Accepted', count: 492, percentage: 90.8 },
  { stage: 'Delivered', count: 485, percentage: 89.5 },
  { stage: 'Completed', count: 472, percentage: 87.1 },
];

// Vendor performance tiers
const vendorTiers = [
  { tier: 'Platinum (4.8+)', count: 5, orders: 245, revenue: 1005000 },
  { tier: 'Gold (4.5-4.7)', count: 7, orders: 168, revenue: 689000 },
  { tier: 'Silver (4.0-4.4)', count: 4, orders: 58, revenue: 238000 },
  { tier: 'New (<10 orders)', count: 2, orders: 16, revenue: 68000 },
];

const COLORS = ['#2563EB', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#6B7280'];

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_6_months');
  const [comparisonMode, setComparisonMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
      formatted: `${change >= 0 ? '+' : '-'}${Math.abs(change).toFixed(1)}%`,
    };
  };

  const handleExportReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    toast.success('Comprehensive analytics report exported');
  };

  // Metric Card Component with Sparkline
  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    iconBg, 
    iconColor,
    suffix = '',
    trend = 'up',
  }: any) => {
    const changeData = comparisonMode ? change : null;
    
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-600">{title}</p>
            <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-neutral-900">
              {value}{suffix}
            </p>
            {comparisonMode && changeData && (
              <div className="flex items-center gap-2">
                {changeData.isPositive ? (
                  <div className="flex items-center gap-1 text-[#22C55E]">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">{changeData.formatted}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-error-600">
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="text-sm font-medium">{changeData.formatted}</span>
                  </div>
                )}
                <span className="text-xs text-neutral-500">vs previous period</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Analytics & Reports</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Comprehensive marketplace performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={comparisonMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setComparisonMode(!comparisonMode)}
          >
            <Activity className="w-4 h-4 mr-2" />
            {comparisonMode ? 'Comparison On' : 'Comparison Off'}
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs for Different Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="border-b border-neutral-200 w-full rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="buyers"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Buyers
          </TabsTrigger>
          <TabsTrigger 
            value="vendors"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Vendors
          </TabsTrigger>
          <TabsTrigger 
            value="geographic"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Geographic
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="pt-6 space-y-6">
          {/* Financial Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Financial Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="GMV (Gross Merchandise Value)"
                value={formatCurrency(currentPeriodData.totals.gmv)}
                change={calculateChange(currentPeriodData.totals.gmv, previousPeriodData.totals.gmv)}
                icon={DollarSign}
                iconBg="bg-primary-50"
                iconColor="text-primary-700"
              />
              <MetricCard
                title="Platform Revenue"
                value={formatCurrency(currentPeriodData.totals.platformRevenue)}
                change={calculateChange(currentPeriodData.totals.platformRevenue, previousPeriodData.totals.platformRevenue)}
                icon={IndianRupee}
                iconBg="bg-[#22C55E]/10"
                iconColor="text-[#22C55E]"
              />
              <MetricCard
                title="Vendor Payout"
                value={formatCurrency(currentPeriodData.totals.vendorPayout)}
                change={calculateChange(currentPeriodData.totals.vendorPayout, previousPeriodData.totals.vendorPayout)}
                icon={Building2}
                iconBg="bg-secondary-50"
                iconColor="text-secondary-700"
              />
              <MetricCard
                title="TDS Collected"
                value={formatCurrency(currentPeriodData.totals.tdsCollected)}
                change={calculateChange(currentPeriodData.totals.tdsCollected, previousPeriodData.totals.tdsCollected)}
                icon={Percent}
                iconBg="bg-warning-50"
                iconColor="text-warning-700"
              />
            </div>
          </div>

          {/* Marketplace Health */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Marketplace Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Orders"
                value={currentPeriodData.totals.orders.toLocaleString()}
                change={calculateChange(currentPeriodData.totals.orders, previousPeriodData.totals.orders)}
                icon={Package}
                iconBg="bg-primary-50"
                iconColor="text-primary-700"
              />
              <MetricCard
                title="Average Order Value"
                value={formatCurrency(currentPeriodData.totals.avgOrderValue)}
                change={calculateChange(currentPeriodData.totals.avgOrderValue, previousPeriodData.totals.avgOrderValue)}
                icon={ShoppingCart}
                iconBg="bg-secondary-50"
                iconColor="text-secondary-700"
              />
              <MetricCard
                title="Fulfillment Rate"
                value={currentPeriodData.totals.vendorFulfillmentRate.toFixed(1)}
                suffix="%"
                change={calculateChange(currentPeriodData.totals.vendorFulfillmentRate, previousPeriodData.totals.vendorFulfillmentRate)}
                icon={CheckCircle}
                iconBg="bg-[#22C55E]/10"
                iconColor="text-[#22C55E]"
              />
              <MetricCard
                title="On-Time Delivery"
                value={currentPeriodData.totals.onTimeDeliveryRate.toFixed(1)}
                suffix="%"
                change={calculateChange(currentPeriodData.totals.onTimeDeliveryRate, previousPeriodData.totals.onTimeDeliveryRate)}
                icon={Clock}
                iconBg="bg-warning-50"
                iconColor="text-warning-700"
              />
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & GMV Trend */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-neutral-900">Revenue & GMV Trend</h2>
                  <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                    6 months
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={currentPeriodData.revenue.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis
                      stroke="#6B7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      fill="#2563EB20"
                      stroke="#2563EB"
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      name="Orders"
                      yAxisId={0}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Order Funnel */}
            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Order Conversion Funnel</h2>
                <div className="space-y-3">
                  {funnelData.map((stage, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-900">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900">{stage.count}</span>
                          <span className="text-xs text-neutral-500">({stage.percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="h-8 bg-neutral-100 rounded-lg overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            idx === 0 ? 'bg-primary-600' :
                            idx === 1 ? 'bg-primary-500' :
                            idx === 2 ? 'bg-primary-400' :
                            idx === 3 ? 'bg-[#22C55E]' :
                            'bg-[#22C55E]'
                          }`}
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                      {idx < funnelData.length - 1 && (
                        <p className="text-xs text-error-600 mt-1">
                          Drop-off: {((funnelData[idx].count - funnelData[idx + 1].count) / funnelData[idx].count * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Category Performance */}
          <Card>
            <div className="p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Category Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Category
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Revenue
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Orders
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Avg Order
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Margin %
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Share
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {categoryData.map((cat, idx) => {
                      const total = categoryData.reduce((sum, c) => sum + c.value, 0);
                      const share = (cat.value / total) * 100;
                      return (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                            {cat.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {formatCurrency(cat.value)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {cat.orders}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {formatCurrency(cat.value / cat.orders)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-[#22C55E]">
                            {cat.margin}%
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-600 rounded-full"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                              <span className="text-xs text-neutral-600 w-12 text-right">
                                {share.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* BUYERS TAB */}
        <TabsContent value="buyers" className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Buyer Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Active Buyers"
                value={currentPeriodData.totals.activeBuyers.toLocaleString()}
                change={calculateChange(currentPeriodData.totals.activeBuyers, previousPeriodData.totals.activeBuyers)}
                icon={Users}
                iconBg="bg-primary-50"
                iconColor="text-primary-700"
              />
              <MetricCard
                title="New Buyers"
                value={currentPeriodData.totals.newBuyers.toLocaleString()}
                change={calculateChange(currentPeriodData.totals.newBuyers, previousPeriodData.totals.newBuyers)}
                icon={Zap}
                iconBg="bg-[#22C55E]/10"
                iconColor="text-[#22C55E]"
              />
              <MetricCard
                title="Returning Buyers"
                value={currentPeriodData.totals.returningBuyers.toLocaleString()}
                change={calculateChange(currentPeriodData.totals.returningBuyers, previousPeriodData.totals.returningBuyers)}
                icon={Target}
                iconBg="bg-secondary-50"
                iconColor="text-secondary-700"
              />
              <MetricCard
                title="Buyer LTV"
                value={formatCurrency(currentPeriodData.totals.buyerLTV)}
                change={calculateChange(currentPeriodData.totals.buyerLTV, previousPeriodData.totals.buyerLTV)}
                icon={TrendingUp}
                iconBg="bg-warning-50"
                iconColor="text-warning-700"
              />
            </div>
          </div>

          {/* Buyer Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Buyer Acquisition Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={currentPeriodData.revenue.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="buyers"
                      stackId="1"
                      fill="#2563EB"
                      stroke="#2563EB"
                      name="Total Buyers"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Buyer Retention</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600">New Buyers</span>
                      <span className="text-lg font-semibold text-neutral-900">
                        {((currentPeriodData.totals.newBuyers / currentPeriodData.totals.activeBuyers) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22C55E]"
                        style={{ width: `${(currentPeriodData.totals.newBuyers / currentPeriodData.totals.activeBuyers) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600">Returning Buyers</span>
                      <span className="text-lg font-semibold text-neutral-900">
                        {((currentPeriodData.totals.returningBuyers / currentPeriodData.totals.activeBuyers) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600"
                        style={{ width: `${(currentPeriodData.totals.returningBuyers / currentPeriodData.totals.activeBuyers) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Retention Rate</p>
                        <p className="text-2xl font-bold text-primary-700">
                          {((currentPeriodData.totals.returningBuyers / currentPeriodData.totals.activeBuyers) * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Avg Orders/Buyer</p>
                        <p className="text-2xl font-bold text-primary-700">
                          {(currentPeriodData.totals.orders / currentPeriodData.totals.activeBuyers).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* VENDORS TAB */}
        <TabsContent value="vendors" className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Vendor Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Active Vendors"
                value={currentPeriodData.totals.activeVendors.toLocaleString()}
                change={calculateChange(currentPeriodData.totals.activeVendors, previousPeriodData.totals.activeVendors)}
                icon={Building2}
                iconBg="bg-primary-50"
                iconColor="text-primary-700"
              />
              <MetricCard
                title="Fulfillment Rate"
                value={currentPeriodData.totals.vendorFulfillmentRate.toFixed(1)}
                suffix="%"
                change={calculateChange(currentPeriodData.totals.vendorFulfillmentRate, previousPeriodData.totals.vendorFulfillmentRate)}
                icon={CheckCircle}
                iconBg="bg-[#22C55E]/10"
                iconColor="text-[#22C55E]"
              />
              <MetricCard
                title="Avg Orders/Vendor"
                value={(currentPeriodData.totals.orders / currentPeriodData.totals.activeVendors).toFixed(1)}
                change={calculateChange(
                  currentPeriodData.totals.orders / currentPeriodData.totals.activeVendors,
                  previousPeriodData.totals.orders / previousPeriodData.totals.activeVendors
                )}
                icon={Package}
                iconBg="bg-secondary-50"
                iconColor="text-secondary-700"
              />
              <MetricCard
                title="Avg Revenue/Vendor"
                value={formatCurrency(currentPeriodData.totals.vendorPayout / currentPeriodData.totals.activeVendors)}
                change={calculateChange(
                  currentPeriodData.totals.vendorPayout / currentPeriodData.totals.activeVendors,
                  previousPeriodData.totals.vendorPayout / previousPeriodData.totals.activeVendors
                )}
                icon={IndianRupee}
                iconBg="bg-warning-50"
                iconColor="text-warning-700"
              />
            </div>
          </div>

          {/* Vendor Performance */}
          <Card>
            <div className="p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Vendor Performance Tiers</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Tier
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Vendors
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Orders
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Revenue
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                        Avg/Vendor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {vendorTiers.map((tier, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              idx === 0 ? 'bg-primary-600' :
                              idx === 1 ? 'bg-[#22C55E]' :
                              idx === 2 ? 'bg-warning-600' :
                              'bg-neutral-400'
                            }`} />
                            <span className="text-sm font-medium text-neutral-900">{tier.tier}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-neutral-900">
                          {tier.count}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-neutral-900">
                          {tier.orders}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-neutral-900">
                          {formatCurrency(tier.revenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-primary-700 font-medium">
                          {formatCurrency(tier.revenue / tier.count)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* GEOGRAPHIC TAB */}
        <TabsContent value="geographic" className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Zone Performance</h2>
            <Card>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          Zone
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          Orders
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          Revenue
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          Vendors
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          Buyers
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          Avg Delivery
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">
                          On-Time Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {zoneData.map((zone, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary-600" />
                              <span className="text-sm font-medium text-neutral-900">{zone.zone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {zone.orders}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-neutral-900">
                            {formatCurrency(zone.revenue)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {zone.vendors}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {zone.buyers}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900">
                            {zone.avgDeliveryTime.toFixed(1)}h
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <Badge
                              variant="outline"
                              className={`${
                                zone.onTimeRate >= 95 ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                                zone.onTimeRate >= 90 ? 'bg-primary-50 text-primary-700 border-primary-200' :
                                'bg-warning-50 text-warning-700 border-warning-200'
                              }`}
                            >
                              {zone.onTimeRate.toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Zone Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Revenue by Zone</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="zone" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis
                      stroke="#6B7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#2563EB" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Zone Coverage Summary</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-primary-700 mb-1">Total Zones</p>
                      <p className="text-3xl font-bold text-primary-900">{zoneData.length}</p>
                    </div>
                    <div className="bg-[#22C55E]/10 rounded-lg p-4 text-center">
                      <p className="text-sm text-[#22C55E] mb-1">Avg On-Time</p>
                      <p className="text-3xl font-bold text-[#22C55E]">
                        {(zoneData.reduce((sum, z) => sum + z.onTimeRate, 0) / zoneData.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-2">Coverage by Orders</p>
                    {zoneData.map((zone, idx) => {
                      const total = zoneData.reduce((sum, z) => sum + z.orders, 0);
                      const share = (zone.orders / total) * 100;
                      return (
                        <div key={idx} className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-neutral-700">{zone.zone}</span>
                            <span className="text-xs font-medium text-neutral-900">{share.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}