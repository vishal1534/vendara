/**
 * Settlement Detail Page
 * Shows comprehensive settlement information following industry standards:
 * - Stripe Connect, Razorpay Route, Amazon Seller Central patterns
 * - Indian marketplace standards (TDS, UTR, Bank details)
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Copy,
  FileText,
  Eye,
  Info,
  Receipt,
  AlertTriangle,
} from 'lucide-react';
import { getMockSettlementsByVendor, mockPayments } from '../../../../mocks/payments.mock';
import type { Settlement, Payment } from '../../../../types/payment';
import { toast } from 'sonner';

export function SettlementDetailPage() {
  const { payoutId: settlementId } = useParams<{ payoutId: string }>();
  const navigate = useNavigate();
  const [copiedUTR, setCopiedUTR] = useState(false);

  // Get settlement details
  const settlement = useMemo<Settlement | undefined>(() => {
    // Using Chauhan Cement Suppliers vendor ID
    const vendorId = 'vendor_01HQKZX8Y9Z1A2B3C4D5E6F7G8';
    const response = getMockSettlementsByVendor(vendorId);
    return response.items.find(s => s.id === settlementId);
  }, [settlementId]);

  // Get payments included in this settlement
  const includedPayments = useMemo<Payment[]>(() => {
    if (!settlement) return [];
    
    // Filter payments that fall within the settlement period
    return mockPayments.filter(p => {
      if (p.vendorId !== settlement.vendorId) return false;
      if (p.paymentStatus !== 'success') return false;
      
      const paymentDate = new Date(p.completedAt || p.createdAt);
      const periodStart = new Date(settlement.periodStart);
      const periodEnd = new Date(settlement.periodEnd);
      
      return paymentDate >= periodStart && paymentDate <= periodEnd;
    });
  }, [settlement]);

  if (!settlement) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Settlement Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            The settlement you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/vendor/payouts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payouts
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 text-base px-3 py-1">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            COMPLETED
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 text-base px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            PENDING
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 text-base px-3 py-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            FAILED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 text-base px-3 py-1">
            {status.toUpperCase()}
          </Badge>
        );
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (label === 'UTR') {
      setCopiedUTR(true);
      setTimeout(() => setCopiedUTR(false), 2000);
    }
    toast.success(`${label} copied to clipboard`);
  };

  const downloadPDFStatement = () => {
    // In production, this would generate and download a PDF
    toast.success('Settlement statement downloaded');
    console.log('Downloading PDF for settlement:', settlement.id);
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Order ID', 'Payment ID', 'Amount', 'Status'];
    const rows = includedPayments.map(p => [
      formatDate(p.completedAt || p.createdAt),
      p.orderId,
      p.id,
      p.amount.toString(),
      p.paymentStatus,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlement-${settlement.id}-${formatDate(settlement.periodStart)}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  const handleRaiseDispute = () => {
    toast.info('Dispute feature coming soon');
    // Navigate to support with pre-filled settlement ID
    // navigate('/vendor/support/create-ticket', { state: { settlementId: settlement.id } });
  };

  // Calculate TDS (1% of total amount)
  const tdsAmount = Math.round(settlement.totalAmount * 0.01);
  const paymentGatewayFee = Math.round(settlement.totalAmount * 0.02); // 2% typical gateway fee

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/vendor/payouts')}
              className="mb-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payouts
            </Button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">Settlement Details</h1>
              {getStatusBadge(settlement.status)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Settlement Period: {formatDate(settlement.periodStart)} - {formatDate(settlement.periodEnd)}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              ID: {settlement.id}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            {settlement.status === 'completed' && (
              <Button variant="default" size="sm" onClick={downloadPDFStatement}>
                <FileText className="w-4 h-4 mr-2" />
                Download Statement
              </Button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        {settlement.status === 'pending' && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">
                  Settlement Processing
                </p>
                <p className="text-sm text-yellow-700">
                  This settlement is scheduled to be processed on Monday. Settlements are typically credited within 1-2 business days after processing.
                </p>
              </div>
            </div>
          </div>
        )}

        {settlement.status === 'completed' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800 mb-1">
                  ✓ Settlement Completed Successfully
                </p>
                <p className="text-sm text-green-700">
                  Funds were transferred to your bank account on {formatDate(settlement.processedAt!)} at {formatTime(settlement.processedAt!)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Settlement Summary - The Most Important Card */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Settlement Summary</h2>
              </div>

              {/* Amount Breakdown - Large, Clear Numbers */}
              <div className="space-y-4">
                {/* Total Sales */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Total Sales Amount</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {formatCurrency(settlement.totalAmount)}
                  </span>
                </div>

                <div className="border-t border-gray-200" />

                {/* Deductions */}
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-700 uppercase">Deductions</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-700">
                        Platform Commission ({settlement.commissionPercentage}%)
                      </span>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -{formatCurrency(settlement.commissionAmount)}
                    </span>
                  </div>

                  {paymentGatewayFee > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-700">Payment Gateway Fee (2%)</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        -{formatCurrency(paymentGatewayFee)}
                      </span>
                    </div>
                  )}

                  {tdsAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-700">TDS (1%)</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        -{formatCurrency(tdsAmount)}
                      </span>
                    </div>
                  )}

                  {settlement.adjustmentAmount !== 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">Adjustments</span>
                      </div>
                      <span className={`text-sm font-medium ${settlement.adjustmentAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {settlement.adjustmentAmount > 0 ? '+' : ''}{formatCurrency(Math.abs(settlement.adjustmentAmount))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-300" />

                {/* Net Settlement - Most Prominent */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Net Settlement Amount</span>
                    <span className="text-3xl font-bold text-green-600">
                      {formatCurrency(settlement.settlementAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {settlement.paymentCount} {settlement.paymentCount === 1 ? 'payment' : 'payments'} included in this settlement
                  </p>
                </div>
              </div>

              {settlement.notes && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">{settlement.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bank Transfer Details - Only show if completed */}
            {settlement.status === 'completed' && settlement.utrNumber && (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Bank Transfer Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Bank Account</p>
                    <p className="text-sm font-semibold text-gray-900">
                      HDFC Bank {settlement.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Account Holder</p>
                    <p className="text-sm font-semibold text-gray-900">{settlement.accountHolderName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">IFSC Code</p>
                    <p className="text-sm font-mono font-semibold text-gray-900">{settlement.ifscCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Transfer Method</p>
                    <p className="text-sm font-semibold text-gray-900">{settlement.settlementMethod}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4" />

                {/* UTR Number - Most Important for Reconciliation */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-700 mb-1">UTR Number (Transaction Reference)</p>
                      <p className="text-sm font-mono font-bold text-gray-900 break-all">
                        {settlement.utrNumber}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(settlement.utrNumber!, 'UTR')}
                      className="flex-shrink-0"
                    >
                      {copiedUTR ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Use this UTR number to track the transaction in your bank statement
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Transfer Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(settlement.processedAt!)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Transfer Time</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatTime(settlement.processedAt!)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Included Payments Table */}
            <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
              <div className="p-4 border-b-2 border-gray-300 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Included Payments</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {includedPayments.length} {includedPayments.length === 1 ? 'payment' : 'payments'} in this settlement
                  </p>
                </div>
              </div>

              {includedPayments.length === 0 ? (
                <div className="p-8 text-center">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No payments found in this settlement period</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Payment ID
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Commission
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Net Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {includedPayments.map((payment) => {
                        const commission = Math.round(payment.amount * (settlement.commissionPercentage / 100));
                        const netAmount = payment.amount - commission;
                        
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {formatDate(payment.completedAt || payment.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="font-mono text-xs text-gray-700">
                                {payment.orderId.slice(0, 20)}...
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="font-mono text-xs text-gray-700">
                                {payment.id.slice(0, 15)}...
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-red-600">
                              -{formatCurrency(commission)}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                              {formatCurrency(netAmount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                          {formatCurrency(settlement.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-red-600">
                          -{formatCurrency(settlement.commissionAmount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-green-600">
                          {formatCurrency(settlement.settlementAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Settlement Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Settlement ID</p>
                  <p className="text-xs font-mono text-gray-900 break-all">{settlement.id}</p>
                </div>

                <div className="border-t border-gray-200" />

                <div>
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  {getStatusBadge(settlement.status)}
                </div>

                <div className="border-t border-gray-200" />

                <div>
                  <p className="text-xs text-gray-600 mb-1">Period Start</p>
                  <p className="text-sm text-gray-900">{formatDate(settlement.periodStart)}</p>
                </div>

                <div className="border-t border-gray-200" />

                <div>
                  <p className="text-xs text-gray-600 mb-1">Period End</p>
                  <p className="text-sm text-gray-900">{formatDate(settlement.periodEnd)}</p>
                </div>

                <div className="border-t border-gray-200" />

                <div>
                  <p className="text-xs text-gray-600 mb-1">Created Date</p>
                  <p className="text-sm text-gray-900">{formatDate(settlement.createdAt)}</p>
                </div>

                {settlement.processedAt && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Processed Date</p>
                      <p className="text-sm text-gray-900">{formatDate(settlement.processedAt)}</p>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200" />

                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Payments</p>
                  <p className="text-sm font-semibold text-gray-900">{settlement.paymentCount}</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={downloadPDFStatement}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={downloadCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
                {settlement.status === 'completed' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-orange-600 border-orange-300 hover:bg-orange-50"
                    onClick={() => navigate('/vendor/support/create-ticket?category=settlement&settlementId=' + settlementId)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Raise Dispute
                  </Button>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Need Help?
                  </p>
                  <p className="text-sm text-blue-800 mb-3">
                    If you have questions about this settlement or notice any discrepancies, contact our support team.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams({
                        category: 'settlement',
                        settlementId: settlementId || '',
                      });
                      navigate(`/vendor/support/create-ticket?${params.toString()}`);
                    }}
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Settlement Cycle Info */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Settlement Cycle
                  </p>
                  <p className="text-sm text-gray-700">
                    Settlements are processed weekly every Monday. Funds typically reach your account within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}