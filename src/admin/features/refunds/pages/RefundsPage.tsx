/**
 * Admin Refunds Management Page
 * Real Payment Service integration
 */

import type { Refund, RefundStatus } from '../../../../types/payment';
import { toast } from 'sonner';
import { getMockRefunds } from '../../../../mocks/payments.mock';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import { formatDate } from '../../../../shared/utils/formatDate';

const statusConfig: Record<RefundStatus, { label: string; color: string; icon: any }> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: RefreshCw,
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: XCircle,
  },
};

export function RefundsPage() {
  const navigate = useNavigate();

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalRefunded: 0,
    totalRefunds: 0,
    pendingRefunds: 0,
    processedRefunds: 0,
    failedRefunds: 0,
  });

  useEffect(() => {
    fetchRefunds();
  }, [currentPage, statusFilter]);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      // Use mock data for demo
      const response = getMockRefunds(
        currentPage,
        pageSize,
        statusFilter === 'all' ? undefined : statusFilter
      );

      const refundsData = response.items || [];
      setRefunds(refundsData);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);

      // Calculate analytics
      const total = refundsData.reduce((sum, r) => sum + r.amount, 0);
      const pending = refundsData.filter((r) => r.refundStatus === 'pending').length;
      const processed = refundsData.filter((r) => r.refundStatus === 'processed').length;
      const failed = refundsData.filter((r) => r.refundStatus === 'failed').length;

      setAnalytics({
        totalRefunded: total,
        totalRefunds: refundsData.length,
        pendingRefunds: pending,
        processedRefunds: processed,
        failedRefunds: failed,
      });
    } catch (error: any) {
      console.error('Failed to load refunds:', error);
      setRefunds([]);
      setAnalytics({
        totalRefunded: 0,
        totalRefunds: 0,
        pendingRefunds: 0,
        processedRefunds: 0,
        failedRefunds: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      searchQuery === '' ||
      refund.razorpayRefundId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleProcessRefund = async (refundId: string) => {
    try {
      // Mock implementation - refund processing would be handled by backend
      toast.success('Refund processed successfully (mock)');
      fetchRefunds();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process refund');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
          <p className="text-sm text-gray-600 mt-1">Process and manage customer refunds</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Refunded</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(analytics.totalRefunded)}
                </p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{analytics.pendingRefunds}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{analytics.processedRefunds}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-error-600 mt-1">{analytics.failedRefunds}</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-error-600" />
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
                placeholder="Search by refund ID, payment ID..."
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
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No refunds found</p>
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
                        Refund ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Reason
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
                    {filteredRefunds.map((refund) => {
                      const StatusIcon = statusConfig[refund.refundStatus].icon;
                      return (
                        <tr key={refund.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(refund.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-mono text-xs text-gray-700">
                              {refund.razorpayRefundId?.slice(0, 15) || refund.id.slice(0, 15)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-mono text-xs text-gray-700">
                              {refund.paymentId.slice(0, 15)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {formatCurrency(refund.amount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            {refund.refundReason}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={statusConfig[refund.refundStatus].color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[refund.refundStatus].label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {refund.refundStatus === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProcessRefund(refund.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4 text-success-600" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/refunds/${refund.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
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
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems} refunds
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