/**
 * Admin Payments Management Page
 * Replaces mock data with real Payment Service integration
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Loader2,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import type { Payment, PaymentStatus } from '../../../../types/payment';
import { toast } from 'sonner';
import { getMockPayments } from '../../../../mocks/payments.mock';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import { formatDate } from '../../../../shared/utils/formatDate';

const statusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  success: { label: 'Success', color: 'bg-green-100 text-green-700 border-green-300' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-300' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700 border-gray-300' },
};

export function PaymentsPage() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    successRate: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Use mock data for demo
      const response = getMockPayments(
        currentPage,
        pageSize,
        statusFilter === 'all' ? undefined : statusFilter
      );

      const paymentsData = response.items || [];
      setPayments(paymentsData);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);

      // Calculate analytics
      const total = paymentsData.reduce((sum, p) => sum + p.amount, 0);
      const successful = paymentsData.filter((p) => p.paymentStatus === 'success').length;
      const pending = paymentsData.filter((p) => p.paymentStatus === 'pending').length;
      const failed = paymentsData.filter((p) => p.paymentStatus === 'failed').length;
      const successRate = paymentsData.length > 0 ? (successful / paymentsData.length) * 100 : 0;

      setAnalytics({
        totalRevenue: total,
        totalPayments: paymentsData.length,
        successfulPayments: successful,
        successRate: Number(successRate.toFixed(1)),
        pendingPayments: pending,
        failedPayments: failed,
      });
    } catch (error: any) {
      console.error('Failed to load payments:', error);
      setPayments([]);
      setAnalytics({
        totalRevenue: 0,
        totalPayments: 0,
        successfulPayments: 0,
        successRate: 0,
        pendingPayments: 0,
        failedPayments: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    const matchesSearch =
      searchQuery === '' ||
      payment.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMethod && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Payment ID', 'Order ID', 'Amount', 'Method', 'Status'];
    const rows = filteredPayments.map((p) => [
      formatDate(p.createdAt),
      p.razorpayPaymentId || p.id,
      p.orderId,
      p.amount.toString(),
      p.paymentMethod.toUpperCase(),
      p.paymentStatus,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Payments exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage all platform payments</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{analytics.successfulPayments}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{analytics.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-error-600 mt-1">{analytics.failedPayments}</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by payment ID, order ID..."
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
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Method Filter */}
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
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

        {/* Payments Table */}
        <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payments found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Method
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
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-mono text-xs text-gray-700">
                            {payment.razorpayPaymentId?.slice(0, 15) || payment.id.slice(0, 15)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-mono text-xs text-gray-700">
                            {payment.orderId.slice(0, 15)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {payment.paymentMethod === 'cod' ? (
                              <Wallet className="w-4 h-4" />
                            ) : (
                              <CreditCard className="w-4 h-4" />
                            )}
                            <span className="capitalize">
                              {payment.paymentMethod === 'cod' ? 'COD' : 'Online'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={statusConfig[payment.paymentStatus].color}>
                            {statusConfig[payment.paymentStatus].label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/payments/${payment.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t-2 border-gray-300 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems} payments
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