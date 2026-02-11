/**
 * Vendor Payouts Page - Vendara Design Standards
 * Following industry-standard settlement-focused structure
 * (Stripe Connect, Amazon Seller Central, Flipkart Seller Hub)
 * 
 * Key Principles:
 * - Payments page = Settlement focus (money to bank)
 * - No pending individual payments (that's on Orders page)
 * - Prominent balance overview
 * - Settlement history with UTR tracking
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../../app/components/ui/badge';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import {
  Wallet,
  Calendar,
  Download,
  CheckCircle2,
  Eye,
  Loader2,
  ArrowUpRight,
  IndianRupee,
  Search,
  X,
} from 'lucide-react';
import { StatCard } from '../../../components/StatCard';
import { DataTable, Column } from '../../../components/common/DataTable';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import type { Settlement } from '../../../../types/payment';
import { toast } from 'sonner';
import { getMockSettlementsByVendor, calculateAvailableBalance } from '../../../../mocks/payments.mock';

export function PayoutsPage() {
  const navigate = useNavigate();
  
  const vendorId = 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8'; // Chauhan Cement Suppliers

  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  // Financial Overview
  const [availableBalance, setAvailableBalance] = useState(0);
  const [lastSettlement, setLastSettlement] = useState<Settlement | null>(null);
  const [nextSettlementDate, setNextSettlementDate] = useState('');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch settlements for this vendor (DataTable will handle pagination internally)
      const response = getMockSettlementsByVendor(vendorId, 1, 1000); // Get all
      setSettlements(response.items);

      // Set last settlement (most recent completed one)
      const completedSettlements = response.items.filter(s => s.status === 'completed');
      if (completedSettlements.length > 0) {
        setLastSettlement(completedSettlements[0]);
      }

      // Calculate available balance (from completed orders not yet settled)
      const balance = calculateAvailableBalance(vendorId);
      setAvailableBalance(balance);

      // Calculate next settlement date (next Monday)
      const today = new Date();
      const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilMonday);
      setNextSettlementDate(formatDate(nextMonday.toISOString()));

    } catch (error: any) {
      toast.error('Failed to load payout data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportSettlementsCSV = () => {
    const headers = ['Settlement Date', 'Period', 'Orders', 'Gross Amount', 'Commission', 'Net Settled', 'Status', 'UTR'];
    const rows = settlements.map(s => [
      formatDate(s.processedAt || s.createdAt),
      `${formatDate(s.periodStart)} to ${formatDate(s.periodEnd)}`,
      s.paymentCount?.toString() || '0',
      s.totalAmount.toString(),
      s.commissionAmount.toString(),
      s.settlementAmount.toString(),
      s.status,
      s.utrNumber || 'N/A',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlements-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Settlement report exported');
  };

  const getSettlementStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      completed: { variant: 'success', label: 'Settled' },
      processing: { variant: 'warning', label: 'Processing' },
      pending: { variant: 'default', label: 'Pending' },
      failed: { variant: 'destructive', label: 'Failed' },
    };

    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Filter logic
  const filteredSettlements = settlements.filter((settlement) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      settlement.utrNumber?.toLowerCase().includes(searchLower) || 
      formatDate(settlement.periodStart).toLowerCase().includes(searchLower) || 
      formatDate(settlement.periodEnd).toLowerCase().includes(searchLower) || 
      settlement.settlementAmount.toString().includes(searchLower);

    // Status filter
    const matchesStatus = selectedStatus === 'all' || settlement.status === selectedStatus;

    // Month filter (based on settlement date)
    const matchesMonth = selectedMonth === 'all' || 
      (settlement.processedAt && new Date(settlement.processedAt).getMonth() === parseInt(selectedMonth));

    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Active filters
  interface ActiveFilter {
    label: string;
    value: string;
    onRemove: () => void;
  }

  const activeFilters: ActiveFilter[] = [];

  if (selectedStatus !== 'all') {
    const statusLabels: Record<string, string> = {
      completed: 'Settled',
      processing: 'Processing',
      pending: 'Pending',
      failed: 'Failed',
    };
    activeFilters.push({
      label: 'Status',
      value: statusLabels[selectedStatus] || selectedStatus,
      onRemove: () => setSelectedStatus('all'),
    });
  }

  if (selectedMonth !== 'all') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    activeFilters.push({
      label: 'Month',
      value: monthNames[parseInt(selectedMonth)],
      onRemove: () => setSelectedMonth('all'),
    });
  }

  const hasActiveFilters = activeFilters.length > 0;

  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedMonth('all');
  };

  // Define columns for DataTable
  const columns: Column<Settlement>[] = [
    {
      key: 'periodStart',
      label: 'Settlement Period',
      sortable: true,
      width: '18%',
      render: (settlement) => (
        <div>
          <div className="text-sm font-medium text-neutral-900">
            {formatDate(settlement.periodStart)} - {formatDate(settlement.periodEnd)}
          </div>
          <div className="text-xs text-neutral-600 mt-0.5">
            Settled: {formatDate(settlement.processedAt || settlement.createdAt)}
          </div>
        </div>
      ),
    },
    {
      key: 'paymentCount',
      label: 'Orders',
      sortable: true,
      width: '10%',
      render: (settlement) => (
        <span className="text-sm text-neutral-900">
          {settlement.paymentCount || 0} orders
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Gross Amount',
      sortable: true,
      align: 'right',
      width: '13%',
      render: (settlement) => (
        <span className="text-sm font-medium text-neutral-900">
          {formatCurrency(settlement.totalAmount)}
        </span>
      ),
    },
    {
      key: 'commissionAmount',
      label: 'Commission',
      sortable: true,
      align: 'right',
      width: '12%',
      render: (settlement) => (
        <span className="text-sm text-neutral-600">
          -{formatCurrency(settlement.commissionAmount)}
        </span>
      ),
    },
    {
      key: 'settlementAmount',
      label: 'Net Settled',
      sortable: true,
      align: 'right',
      width: '13%',
      render: (settlement) => (
        <span className="text-sm font-semibold text-success">
          {formatCurrency(settlement.settlementAmount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '12%',
      render: (settlement) => getSettlementStatusBadge(settlement.status),
    },
    {
      key: 'utrNumber',
      label: 'UTR Number',
      width: '14%',
      render: (settlement) => (
        settlement.utrNumber ? (
          <div className="text-xs font-mono text-neutral-700 bg-surface-2 px-2 py-1 rounded inline-block">
            {settlement.utrNumber}
          </div>
        ) : (
          <span className="text-xs text-neutral-500">Pending</span>
        )
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '8%',
      render: (settlement) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/vendor/payouts/${settlement.id}`);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Payouts & Settlements</h1>
        <p className="text-sm text-neutral-600 mt-1">Track your settlements and bank transfers</p>
      </div>

      {/* Financial Overview Cards - Using StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 relative">
          <div className="absolute top-6 right-6 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-700" />
          </div>
          <div className="pr-16">
            <p className="text-sm text-neutral-600 mb-1">Available Balance</p>
            <p className="text-xl font-bold text-neutral-900">
              {formatCurrency(availableBalance)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              <p className="text-xs text-neutral-500">
                Settling on {nextSettlementDate}
              </p>
            </div>
          </div>
        </div>

        {/* Last Settled */}
        <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 relative">
          <div className="absolute top-6 right-6 w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success-700" />
          </div>
          <div className="pr-16">
            <p className="text-sm text-neutral-600 mb-1">Last Settled</p>
            <p className="text-xl font-bold text-neutral-900">
              {lastSettlement ? formatCurrency(lastSettlement.settlementAmount) : '₹0'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {lastSettlement ? formatDate(lastSettlement.processedAt || lastSettlement.createdAt) : 'No settlements yet'}
            </p>
          </div>
        </div>

        {/* Next Settlement */}
        <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 relative">
          <div className="absolute top-6 right-6 w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-warning-700" />
          </div>
          <div className="pr-16">
            <p className="text-sm text-neutral-600 mb-1">Next Settlement</p>
            <p className="text-xl font-bold text-neutral-900">
              {nextSettlementDate}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Weekly on Mondays
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-primary-subtle border-2 border-neutral-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IndianRupee className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900 mb-1">How settlements work</p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Orders are settled weekly every Monday. Once settled, money is transferred to your bank account within 1-2 business days. 
              You'll receive UTR number for bank reconciliation. Check individual order payment status on the{' '}
              <button 
                onClick={() => navigate('/vendor/orders')}
                className="underline font-semibold text-primary hover:text-primary-pressed"
              >
                Orders page
              </button>.
            </p>
          </div>
        </div>
      </div>

      {/* Settlement History */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : settlements.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
            <Wallet className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-900 font-medium mb-1">No settlements yet</p>
            <p className="text-sm text-neutral-600">Your first settlement will appear here after completing orders</p>
          </div>
        ) : (
          <>
            {/* Search and Filters - Vendor Portal Design Standard */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden">
              {/* Search Bar */}
              <div className="p-4 border-b-2 border-neutral-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    placeholder="Search by UTR number, settlement period, or amount..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="px-4 py-3 bg-neutral-50">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Status Filter */}
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-[180px] h-10 border-2">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Settled</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Month Filter */}
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px] h-10 border-2">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="0">January</SelectItem>
                      <SelectItem value="1">February</SelectItem>
                      <SelectItem value="2">March</SelectItem>
                      <SelectItem value="3">April</SelectItem>
                      <SelectItem value="4">May</SelectItem>
                      <SelectItem value="5">June</SelectItem>
                      <SelectItem value="6">July</SelectItem>
                      <SelectItem value="7">August</SelectItem>
                      <SelectItem value="8">September</SelectItem>
                      <SelectItem value="9">October</SelectItem>
                      <SelectItem value="10">November</SelectItem>
                      <SelectItem value="11">December</SelectItem>
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

            {/* Title and Results Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-neutral-900">Settlement History</h2>
                <p className="text-sm text-neutral-600">
                  Showing <span className="font-semibold text-neutral-900">{filteredSettlements.length}</span> settlement{filteredSettlements.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={exportSettlementsCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Data Table */}
            <DataTable
              data={filteredSettlements}
              columns={columns}
              searchable={false}
              searchPlaceholder=""
              pageSize={10}
              emptyMessage="No settlements found"
              loading={false}
              stickyHeader={false}
              showPageSizeSelector={true}
              showPaginationInfo={true}
              showFirstLastButtons={true}
              onRowClick={(settlement) => navigate(`/vendor/payouts/${settlement.id}`)}
            />
          </>
        )}
      </div>
    </div>
  );
}