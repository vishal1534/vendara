/**
 * Admin Dashboard Page
 * Overview of key metrics, alerts, and quick actions
 */

import { StatsCard } from '../../../components/common/StatsCard';
import { Card } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { AlertTriangle, Package, ShoppingCart, Users, CreditCard, DollarSign, AlertCircle, ChevronRight } from 'lucide-react';
import { mockDashboardMetrics, mockAlerts, mockOrderTrends, mockCategorySales } from '../../../mocks/dashboard.mock';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export function DashboardPage() {
  const navigate = useNavigate();
  const metrics = mockDashboardMetrics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'medium':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'low':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Today's Orders"
          value={metrics.todayOrders.count}
          icon={ShoppingCart}
          trend={{
            value: metrics.todayOrders.trend,
            label: 'vs yesterday',
          }}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />
        <StatsCard
          title="Today's GMV"
          value={formatCurrency(metrics.todayOrders.gmv)}
          icon={DollarSign}
          trend={{
            value: metrics.todayOrders.trend,
            label: 'vs yesterday',
          }}
          iconColor="text-success-600"
          iconBgColor="bg-success-100"
        />
        <StatsCard
          title="Active Vendors"
          value={metrics.activeVendors.count}
          icon={Users}
          trend={{
            value: metrics.activeVendors.trend,
            label: 'vs last month',
          }}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />
        <StatsCard
          title="Pending Approvals"
          value={metrics.pendingApprovals.count}
          icon={Package}
          iconColor="text-warning-600"
          iconBgColor="bg-warning-100"
        />
        <StatsCard
          title="Open Tickets"
          value={metrics.openTickets.count}
          icon={AlertCircle}
          trend={{
            value: metrics.openTickets.trend,
            label: 'vs last week',
          }}
          iconColor="text-error-600"
          iconBgColor="bg-error-100"
        />
        <StatsCard
          title="Pending Settlements"
          value={formatCurrency(metrics.pendingSettlements.amount)}
          icon={CreditCard}
          iconColor="text-warning-600"
          iconBgColor="bg-warning-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Volume Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Order Volume Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockOrderTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                stroke="#737373"
                fontSize={12}
              />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip
                labelFormatter={(date) => format(new Date(date), 'PPP')}
                formatter={(value: number) => [value, 'Orders']}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Sales */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockCategorySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#737373"
                fontSize={11}
              />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Sales']}
              />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alerts & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Active Alerts</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-sm mt-1 opacity-90">{alert.description}</p>
                    <p className="text-xs mt-2 opacity-75">
                      {format(new Date(alert.createdAt), 'PPp')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/vendors/pending')}
            >
              <Package className="w-4 h-4 mr-2" />
              Review Pending
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/orders')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Monitor Orders
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/support')}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              View Tickets
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/settlements')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Process Settlements
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}