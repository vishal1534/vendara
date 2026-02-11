/**
 * System Logs Page - Admin Portal
 * Audit trails and activity monitoring
 */

import { useState } from 'react';
import { Button } from '../../../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Input } from '../../../../app/components/ui/input';
import { Badge } from '../../../../app/components/ui/badge';
import {
  Search,
  Download,
  Filter,
  Activity,
  User,
  Shield,
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Card } from '../../../../app/components/ui/card';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'auth' | 'order' | 'payment' | 'system' | 'database' | 'api';
  action: string;
  user?: string;
  userId?: string;
  details: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

const mockLogs: SystemLog[] = [
  {
    id: 'log_001',
    timestamp: '2024-01-09T16:45:23Z',
    level: 'success',
    category: 'order',
    action: 'Order Created',
    user: 'Ramesh Kumar',
    userId: 'buy_001',
    details: 'New order RS2024001242 created successfully',
    ipAddress: '103.45.67.89',
    metadata: { orderId: 'ord_009', amount: 15450 },
  },
  {
    id: 'log_002',
    timestamp: '2024-01-09T16:30:15Z',
    level: 'info',
    category: 'auth',
    action: 'Admin Login',
    user: 'Priya Sharma',
    userId: 'adm_001',
    details: 'Super admin logged in successfully',
    ipAddress: '103.45.67.90',
  },
  {
    id: 'log_003',
    timestamp: '2024-01-09T15:50:42Z',
    level: 'warning',
    category: 'payment',
    action: 'Payment Retry',
    user: 'System',
    details: 'Payment gateway timeout - automatic retry initiated',
    metadata: { orderId: 'ord_008', attempt: 2 },
  },
  {
    id: 'log_004',
    timestamp: '2024-01-09T15:20:18Z',
    level: 'success',
    category: 'payment',
    action: 'Settlement Processed',
    user: 'Priya Sharma',
    userId: 'adm_001',
    details: 'Settlement SET2024002 processed - ₹3,69,600 transferred',
    metadata: { settlementId: 'set_002', vendorId: 'v_002' },
  },
  {
    id: 'log_005',
    timestamp: '2024-01-09T14:35:50Z',
    level: 'info',
    category: 'auth',
    action: 'Vendor Registration',
    user: 'Shiva Construction Materials',
    details: 'New vendor registration submitted for approval',
    ipAddress: '103.45.67.91',
  },
  {
    id: 'log_006',
    timestamp: '2024-01-09T13:42:12Z',
    level: 'error',
    category: 'api',
    action: 'API Error',
    user: 'System',
    details: 'SMS notification service failed - retry scheduled',
    metadata: { service: 'sms', errorCode: 'TIMEOUT_ERROR' },
  },
  {
    id: 'log_007',
    timestamp: '2024-01-09T12:15:33Z',
    level: 'info',
    category: 'system',
    action: 'Database Backup',
    user: 'System',
    details: 'Automated database backup completed successfully',
    metadata: { backupSize: '2.4 GB', duration: '15 minutes' },
  },
  {
    id: 'log_008',
    timestamp: '2024-01-09T11:30:45Z',
    level: 'warning',
    category: 'database',
    action: 'High Query Load',
    user: 'System',
    details: 'Database queries exceeded threshold - performance monitoring active',
    metadata: { queryCount: 1250, threshold: 1000 },
  },
  {
    id: 'log_009',
    timestamp: '2024-01-09T10:05:22Z',
    level: 'success',
    category: 'order',
    action: 'Order Delivered',
    user: 'System',
    details: 'Order RS2024001234 marked as delivered',
    metadata: { orderId: 'ord_001', vendorId: 'v_001' },
  },
  {
    id: 'log_010',
    timestamp: '2024-01-09T09:00:00Z',
    level: 'info',
    category: 'system',
    action: 'Daily Report Generated',
    user: 'System',
    details: 'Platform performance report for Jan 8 generated',
    metadata: { reportDate: '2024-01-08' },
  },
];

const levelConfig = {
  info: { label: 'Info', variant: 'secondary' as const, icon: Info, color: 'text-neutral-600' },
  warning: { label: 'Warning', variant: 'default' as const, icon: AlertTriangle, color: 'text-secondary-700' },
  error: { label: 'Error', variant: 'destructive' as const, icon: XCircle, color: 'text-error-700' },
  success: { label: 'Success', variant: 'default' as const, icon: CheckCircle2, color: 'text-[#22C55E]' },
};

const categoryConfig = {
  auth: { label: 'Authentication', icon: Shield },
  order: { label: 'Orders', icon: Activity },
  payment: { label: 'Payments', icon: Activity },
  system: { label: 'System', icon: Server },
  database: { label: 'Database', icon: Database },
  api: { label: 'API', icon: Activity },
};

export function SystemLogsPage() {
  const [filters, setFilters] = useState<{
    level: string;
    category: string;
    search: string;
  }>({
    level: 'all',
    category: 'all',
    search: '',
  });

  // Filter logs
  const filteredLogs = mockLogs.filter((log) => {
    if (filters.level !== 'all' && log.level !== filters.level) return false;
    if (filters.category !== 'all' && log.category !== filters.category) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        log.action.toLowerCase().includes(search) ||
        log.details.toLowerCase().includes(search) ||
        log.user?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Active filters for chips
  const activeFilters = [];
  if (filters.level !== 'all') {
    activeFilters.push({
      type: 'level',
      label: 'Level',
      value: levelConfig[filters.level as keyof typeof levelConfig].label,
      onRemove: () => setFilters({ ...filters, level: 'all' }),
    });
  }
  if (filters.category !== 'all') {
    activeFilters.push({
      type: 'category',
      label: 'Category',
      value: categoryConfig[filters.category as keyof typeof categoryConfig].label,
      onRemove: () => setFilters({ ...filters, category: 'all' }),
    });
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const stats = {
    total: mockLogs.length,
    errors: mockLogs.filter(l => l.level === 'error').length,
    warnings: mockLogs.filter(l => l.level === 'warning').length,
    info: mockLogs.filter(l => l.level === 'info').length,
  };

  const handleExportLogs = () => {
    // CSV Export
    const headers = ['Timestamp', 'Level', 'Category', 'Action', 'User', 'Details', 'IP Address'];
    const rows = filteredLogs.map((log) => [
      formatTimestamp(log.timestamp),
      log.level.toUpperCase(),
      log.category,
      log.action,
      log.user || 'System',
      log.details,
      log.ipAddress || 'N/A',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('System logs exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">System Logs</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Monitor system activity and audit trails
          </p>
        </div>
        <Button variant="outline" onClick={handleExportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Logs</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Errors</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {stats.errors}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-error-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Warnings</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {stats.warnings}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-secondary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">System Health</p>
              <p className="text-2xl font-semibold text-[#22C55E] mt-1">
                Healthy
              </p>
            </div>
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - New Pattern */}
      <SearchFilterSection
        searchPlaceholder="Search logs by action, details, or user..."
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        activeFilters={activeFilters}
        onClearAll={() => setFilters({ level: 'all', category: 'all', search: '' })}
      >
        <Select
          value={filters.level}
          onValueChange={(value) => setFilters({ ...filters, level: value })}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Logs Table */}
      <DataTable
        data={filteredLogs}
        columns={[
          {
            key: 'timestamp',
            label: 'Timestamp',
            sortable: true,
            render: (log) => (
              <span className="text-sm text-neutral-600 whitespace-nowrap font-mono">
                {formatDateTime(log.timestamp)}
              </span>
            ),
          },
          {
            key: 'level',
            label: 'Level',
            sortable: true,
            render: (log) => {
              const LevelIcon = levelConfig[log.level].icon;
              return (
                <Badge variant={levelConfig[log.level].variant}>
                  <LevelIcon className="w-3 h-3 mr-1" />
                  {levelConfig[log.level].label}
                </Badge>
              );
            },
          },
          {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (log) => {
              const CategoryIcon = categoryConfig[log.category].icon;
              return (
                <div className="flex items-center gap-2">
                  <CategoryIcon className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-900">
                    {categoryConfig[log.category].label}
                  </span>
                </div>
              );
            },
          },
          {
            key: 'action',
            label: 'Action',
            sortable: true,
            render: (log) => (
              <span className="text-sm font-medium text-neutral-900">
                {log.action}
              </span>
            ),
          },
          {
            key: 'details',
            label: 'Details',
            render: (log) => (
              <div>
                <p className="text-sm text-neutral-600 max-w-md">
                  {log.details}
                </p>
                {log.ipAddress && (
                  <p className="text-xs text-neutral-400 mt-1">
                    IP: {log.ipAddress}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: 'user',
            label: 'User',
            render: (log) =>
              log.user && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-900">{log.user}</span>
                </div>
              ),
          },
        ]}
        searchable={false}
        pageSize={15}
        emptyMessage="No logs found"
      />
    </div>
  );
}