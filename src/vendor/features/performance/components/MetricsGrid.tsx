/**
 * MetricsGrid Component
 * Displays key performance metrics in a grid layout
 */

import { CheckCircle, Clock, Package } from 'lucide-react';

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtitle?: string;
  description: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

function MetricCard({ icon: Icon, label, value, subtitle, description, status }: MetricCardProps) {
  // Status configuration
  const statusConfig = {
    excellent: 'bg-[#2F3E46] text-white',
    good: 'bg-[#4A5C6A] text-white',
    warning: 'bg-[#D2B48C] text-neutral-900',
    critical: 'bg-red-100 text-red-800',
  };

  const iconBgConfig = {
    excellent: 'bg-[#2F3E46]/10',
    good: 'bg-[#4A5C6A]/10',
    warning: 'bg-[#D2B48C]/20',
    critical: 'bg-red-50',
  };

  const iconColorConfig = {
    excellent: 'text-[#2F3E46]',
    good: 'text-[#4A5C6A]',
    warning: 'text-[#8B7355]',
    critical: 'text-red-700',
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-sm transition-shadow">
      {/* Icon */}
      <div className={`inline-flex p-3 rounded-lg ${iconBgConfig[status]} mb-4`}>
        <Icon className={`size-6 ${iconColorConfig[status]}`} />
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-neutral-600 mb-2">{label}</div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-3xl font-bold text-neutral-900">{value}</div>
        {subtitle && <div className="text-lg text-neutral-600">{subtitle}</div>}
      </div>

      {/* Description */}
      <div className="text-sm text-neutral-600 mb-4">{description}</div>

      {/* Status Badge */}
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {status === 'excellent' && 'Excellent'}
        {status === 'good' && 'Good'}
        {status === 'warning' && 'Needs Improvement'}
        {status === 'critical' && 'Critical'}
      </div>
    </div>
  );
}

interface MetricsGridProps {
  acceptanceRate: {
    percentage: number;
    accepted: number;
    total: number;
  };
  onTimeDeliveryRate: {
    percentage: number;
    onTime: number;
    total: number;
  };
  responseTime: {
    averageMinutes: number;
    fastestMinutes: number;
    slowestMinutes: number;
  };
}

export function MetricsGrid({ acceptanceRate, onTimeDeliveryRate, responseTime }: MetricsGridProps) {
  // Calculate statuses
  const getAcceptanceStatus = (percentage: number) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'warning';
    return 'critical';
  };

  const getOnTimeStatus = (percentage: number) => {
    if (percentage >= 95) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 75) return 'warning';
    return 'critical';
  };

  const getResponseTimeStatus = (minutes: number) => {
    if (minutes < 5) return 'excellent';
    if (minutes < 10) return 'good';
    if (minutes < 15) return 'warning';
    return 'critical';
  };

  // Format response time
  const formatResponseTime = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    return `${minutes.toFixed(1)}m`;
  };

  const metrics = [
    {
      icon: CheckCircle,
      label: 'Acceptance Rate',
      value: `${acceptanceRate.percentage.toFixed(1)}%`,
      description: `${acceptanceRate.accepted} accepted out of ${acceptanceRate.total} offers`,
      status: getAcceptanceStatus(acceptanceRate.percentage),
    },
    {
      icon: Package,
      label: 'On-Time Delivery',
      value: `${onTimeDeliveryRate.percentage.toFixed(1)}%`,
      description: `${onTimeDeliveryRate.onTime} on-time out of ${onTimeDeliveryRate.total} deliveries`,
      status: getOnTimeStatus(onTimeDeliveryRate.percentage),
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      value: formatResponseTime(responseTime.averageMinutes),
      subtitle: 'avg',
      description: `Range: ${formatResponseTime(responseTime.fastestMinutes)} - ${formatResponseTime(responseTime.slowestMinutes)}`,
      status: getResponseTimeStatus(responseTime.averageMinutes),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}