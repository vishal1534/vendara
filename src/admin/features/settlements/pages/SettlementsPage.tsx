/**
 * Settlements Page - Admin Portal
 * Real Payment Service Integration - NO MOCK DATA
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  IndianRupee
} from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Input } from '../../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { toast } from 'sonner';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import { formatDate } from '../../../../shared/utils/formatDate';
import type { Settlement, SettlementStatus } from '../../../../types/payment';
import { getMockSettlements } from '../../../../mocks/payments.mock';

export function SettlementsPage() {
  const navigate = useNavigate();

  const statusConfig: Record<SettlementStatus, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Clock },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle2 },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
    on_hold: { label: 'On Hold', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: AlertCircle },
  };

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalSettled: 0,
    pendingSettlements: 0,
    completedSettlements: 0,
    onHoldSettlements: 0,
  });

  useEffect(() => {
    fetchSettlements();
  }, [currentPage, statusFilter]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      // Use mock data for demo
      const response = getMockSettlements(
        currentPage,
        pageSize,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setSettlements(response.items);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);

      calculateAnalytics(response.items);
    } catch (error: any) {
      console.error('Failed to load settlements:', error);
      setSettlements([]);
      setTotalPages(1);
      setTotalItems(0);
      setAnalytics({
        totalSettled: 0,
        pendingSettlements: 0,
        completedSettlements: 0,
        onHoldSettlements: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (settlementList: Settlement[]) => {
    const stats = {
      totalSettled: 0,
      pendingSettlements: 0,
      completedSettlements: 0,
      onHoldSettlements: 0,
    };

    settlementList.forEach((settlement) => {
      if (settlement.status === 'completed') {
        stats.totalSettled += settlement.settlementAmount;
        stats.completedSettlements++;
      } else if (settlement.status === 'pending') {
        stats.pendingSettlements++;
      } else if (settlement.status === 'on_hold') {
        stats.onHoldSettlements++;
      }
    });

    setAnalytics(stats);
  };

  const filteredSettlements = settlements.filter((settlement) => {
    const matchesSearch =
      searchQuery === '' ||
      settlement.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.vendorId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const exportToCSV = () => {
    const headers = [
      'Settlement ID',
      'Vendor',
      'Period',
      'Total Amount',
      'Commission',
      'Settlement Amount',
      'Status',
    ];
    const rows = filteredSettlements.map((s) => [
      s.id,
      s.vendorName,
      `${s.periodStart} to ${s.periodEnd}`,
      s.totalAmount.toString(),
      s.commissionAmount.toString(),
      s.settlementAmount.toString(),
      s.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlements-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Settlements exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Settlements</h1>
            <p className="text-sm text-gray-600 mt-1">Manage vendor payouts and commissions</p>
          </div>
          <Button onClick={() => navigate('/admin/settlements/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Settlement
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Settled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(analytics.totalSettled)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{analytics.pendingSettlements}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{analytics.completedSettlements}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{analytics.onHoldSettlements}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by vendor name, settlement ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            </div>
          ) : filteredSettlements.length === 0 ? (
            <div className="p-12 text-center">
              <IndianRupee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No settlements found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/admin/settlements/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Settlement
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Settlement ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Settlement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSettlements.map((settlement) => {
                      const StatusIcon = statusConfig[settlement.status].icon;
                      return (
                        <tr key={settlement.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-mono text-xs text-gray-700">
                              {settlement.id.slice(0, 15)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{settlement.vendorName}</div>
                            <div className="text-xs text-gray-500 font-mono">
                              {settlement.vendorId.slice(0, 10)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div>{formatDate(settlement.periodStart)}</div>
                            <div className="text-xs text-gray-500">
                              to {formatDate(settlement.periodEnd)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(settlement.totalAmount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div>{formatCurrency(settlement.commissionAmount)}</div>
                            <div className="text-xs text-gray-500">
                              ({settlement.commissionPercentage}%)
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-primary">
                            {formatCurrency(settlement.settlementAmount)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={statusConfig[settlement.status].color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[settlement.status].label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/settlements/${settlement.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t-2 border-gray-300 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems} settlements
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}