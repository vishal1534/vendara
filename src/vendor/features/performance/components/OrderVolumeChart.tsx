/**
 * OrderVolumeChart Component
 * Displays order volume trend over time using recharts
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { TrendingUp, Package } from 'lucide-react';
import { formatCurrency } from '@/vendor/utils/formatCurrency';

interface OrderVolumeTrendData {
  month: string;
  orderCount: number;
  revenue: number;
  growth?: number; // Growth percentage vs previous month
}

interface OrderVolumeChartProps {
  data: OrderVolumeTrendData[];
  title?: string;
  subtitle?: string;
}

export function OrderVolumeChart({ 
  data, 
  title = "Order Volume Trend",
  subtitle = "Last 3 months" 
}: OrderVolumeChartProps) {
  // Calculate totals
  const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const latestMonth = data[data.length - 1];
  const hasGrowth = latestMonth.growth !== undefined;

  // Format data for chart (short month names)
  const chartData = data.map((item) => ({
    ...item,
    monthShort: item.month.split(' ')[0].substring(0, 3), // "January 2026" -> "Jan"
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-lg">
          <p className="font-semibold text-neutral-900 mb-2">{data.month}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-600">Orders:</span>
              <span className="font-semibold text-neutral-900">{data.orderCount}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-600">Revenue:</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(data.revenue)}</span>
            </div>
            {data.growth !== undefined && (
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-200">
                <span className="text-neutral-600">Growth:</span>
                <span className={`font-semibold ${data.growth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {data.growth > 0 ? '+' : ''}{data.growth.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
        </div>
        <Package className="size-5 text-[#2F3E46]" />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="text-sm text-neutral-600 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-neutral-900">{totalOrders}</div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="text-sm text-neutral-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-neutral-900">{formatCurrency(totalRevenue)}</div>
        </div>
      </div>

      {/* Growth Badge */}
      {hasGrowth && latestMonth.growth && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <TrendingUp className="size-4 text-green-700" />
          <span className="text-sm font-medium text-green-900">
            {latestMonth.growth > 0 ? '+' : ''}{latestMonth.growth.toFixed(1)}% growth this month
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="monthShort" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(47, 62, 70, 0.05)' }} />
            <Bar 
              dataKey="orderCount" 
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === chartData.length - 1 ? '#2F3E46' : '#9CA3AF'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-neutral-400" />
          <span className="text-xs text-neutral-600">Previous months</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#2F3E46]" />
          <span className="text-xs text-neutral-600">Current month</span>
        </div>
      </div>
    </div>
  );
}