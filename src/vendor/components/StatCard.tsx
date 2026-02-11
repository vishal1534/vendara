/**
 * StatCard Component
 * 
 * Standardized stat card for vendor portal
 * Follows Vendara Design Standards matching admin portal
 * 
 * @see /DESIGN_STANDARDS.md for full documentation
 */

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  icon: Icon,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-700',
  label,
  value,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 relative">
      {/* Icon - Fixed top-right position */}
      <div className={`absolute top-6 right-6 w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      
      {/* Content - With right padding to avoid icon overlap */}
      <div className="pr-16">
        <p className="text-sm text-neutral-600 mb-1">{label}</p>
        <p className="text-xl font-bold text-neutral-900 whitespace-nowrap">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span
              className={`text-sm font-medium ${
                trend.value >= 0 ? 'text-success-600' : 'text-error-600'
              }`}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-neutral-500">{trend.label}</span>
          </div>
        )}
        {subtitle && !trend && (
          <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}