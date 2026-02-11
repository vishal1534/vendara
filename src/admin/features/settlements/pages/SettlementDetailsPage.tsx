/**
 * Settlement Details Page - Admin Portal
 * Full-screen comprehensive settlement information following fintech best practices
 * 
 * Best Practices Implemented:
 * - Clear financial breakdown with visual hierarchy
 * - Transaction audit trail with timeline
 * - Bank details visibility for reconciliation
 * - Order-level details with individual calculations
 * - Export capabilities for accounting/compliance
 * - Action history and status changes tracking
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settlement, SettlementStatus } from '../../../types/settlement';
import { mockSettlements } from '../../../data/mockSettlements';
import { mockOrders } from '../../../data/mockOrders';
import { ProcessSettlementDialog } from '../components/ProcessSettlementDialog';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card } from '../../../../app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import { Separator } from '../../../../app/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../app/components/ui/dropdown-menu';
import {
  ArrowLeft,
  IndianRupee,
  Building2,
  Calendar,
  CreditCard,
  Package,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  MoreVertical,
  Copy,
  Printer,
  Mail,
  ExternalLink,
  Pause,
  Play,
  History,
  TrendingDown,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '../../../components/common/DataTable';

const statusConfig: Record<SettlementStatus, { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: any; color: string }> = {
  pending: { label: 'Pending', variant: 'secondary', icon: Clock, color: 'text-warning-700 bg-warning-50 border-warning-200' },
  processing: { label: 'Processing', variant: 'default', icon: Clock, color: 'text-primary-700 bg-primary-50 border-primary-200' },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle2, color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20' },
  failed: { label: 'Failed', variant: 'destructive', icon: XCircle, color: 'text-error-700 bg-error-50 border-error-200' },
  on_hold: { label: 'On Hold', variant: 'destructive', icon: AlertCircle, color: 'text-error-700 bg-error-50 border-error-200' },
};

export function SettlementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);

  const settlement = mockSettlements.find(s => s.id === id);

  if (!settlement) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Settlement Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The settlement you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/settlements')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settlements
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString('en-IN', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-IN', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = endDate.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  // Get orders associated with this settlement
  const settlementOrders = mockOrders
    .filter(order => settlement.orderIds.includes(order.id))
    .slice(0, settlement.orderCount);

  // If no real orders found, generate representative data
  const ordersToShow = settlementOrders.length > 0 
    ? settlementOrders 
    : Array.from({ length: Math.min(settlement.orderCount, 10) }, (_, i) => ({
        id: `ord_${String(i + 1).padStart(3, '0')}`,
        orderNumber: `RS2024${String(Math.floor(Math.random() * 900000) + 100000)}`,
        total: Math.floor(settlement.totalAmount / settlement.orderCount),
        createdAt: settlement.periodStart,
        buyerName: ['Ramesh Kumar', 'Suresh Reddy', 'Vijay Kumar', 'Mahesh Babu', 'Rakesh Sharma'][i % 5],
        status: 'delivered' as const,
      }));

  const StatusIcon = statusConfig[settlement.status].icon;

  const handleDownloadReceipt = () => {
    const receiptData = `
SETTLEMENT RECEIPT
==================
Settlement Number: ${settlement.settlementNumber}
Vendor: ${settlement.vendorName}
Period: ${formatDate(settlement.periodStart)} to ${formatDate(settlement.periodEnd)}

FINANCIAL BREAKDOWN
-------------------
Gross Amount:        ${formatCurrency(settlement.totalAmount)}
Platform Fee (${settlement.platformFeePercentage}%):    ${formatCurrency(settlement.platformFee)}
TDS (${settlement.tdsPercentage}%):           ${formatCurrency(settlement.tds)}
${settlement.adjustments ? `Adjustments:        ${formatCurrency(settlement.adjustments)}\n` : ''}
-------------------
Net Payout:          ${formatCurrency(settlement.netAmount)}

ORDERS INCLUDED (${settlement.orderCount})
-------------------
${ordersToShow.map(order => `${(order as any).orderNumber || order.id}: ${formatCurrency((order as any).total || 0)}`).join('\n')}

${settlement.transactionId ? `Transaction ID: ${settlement.transactionId}` : ''}
${settlement.utrNumber ? `UTR Number: ${settlement.utrNumber}` : ''}
${settlement.paymentDate ? `Payment Date: ${formatDate(settlement.paymentDate)}` : ''}
`.trim();

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlement-receipt-${settlement.settlementNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully');
  };

  const handleExportDetails = () => {
    const headers = ['Order ID', 'Order Number', 'Date', 'Buyer', 'Amount', 'Platform Fee', 'TDS', 'Net Amount'];
    const platformFeeRate = settlement.platformFeePercentage! / 100;
    const tdsRate = settlement.tdsPercentage! / 100;
    
    const rows = ordersToShow.map((order) => {
      const amount = (order as any).total || 0;
      const platformFee = amount * platformFeeRate;
      const tds = amount * tdsRate;
      const netAmount = amount - platformFee - tds;
      
      return [
        order.id,
        (order as any).orderNumber || order.id,
        formatDate((order as any).createdAt),
        (order as any).buyerName || 'N/A',
        amount.toString(),
        platformFee.toFixed(2),
        tds.toFixed(2),
        netAmount.toFixed(2),
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlement-${settlement.settlementNumber}-details.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Details exported as CSV');
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handlePrintPage = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleEmailSettlement = () => {
    toast.success('Email sent to vendor with settlement details');
  };

  const handleProcessSettlement = () => {
    setIsProcessDialogOpen(true);
  };

  const handlePutOnHold = () => {
    toast.success(`Settlement ${settlement.settlementNumber} put on hold`);
  };

  const handleReactivate = () => {
    toast.success(`Settlement ${settlement.settlementNumber} reactivated`);
  };

  const handleProcessSuccess = () => {
    toast.success('Settlement processed successfully');
    navigate('/admin/settlements');
  };

  // Mock activity timeline
  const activityTimeline = [
    {
      id: '1',
      action: 'Settlement created',
      user: 'System',
      timestamp: settlement.createdAt,
      icon: FileText,
      color: 'text-neutral-600',
    },
    ...(settlement.processedAt ? [{
      id: '2',
      action: 'Payment processed',
      user: settlement.processedBy || 'Admin',
      timestamp: settlement.processedAt,
      icon: CreditCard,
      color: 'text-primary-600',
    }] : []),
    ...(settlement.completedAt ? [{
      id: '3',
      action: 'Payment completed',
      user: 'System',
      timestamp: settlement.completedAt,
      icon: CheckCircle2,
      color: 'text-[#22C55E]',
    }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/admin/settlements')}
        className="text-neutral-600 hover:text-neutral-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Settlements
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-neutral-900">{settlement.settlementNumber}</h1>
            <Badge variant="outline" className={`px-3 py-1 ${statusConfig[settlement.status].color} border`}>
              <StatusIcon className="w-4 h-4 mr-1.5" />
              {statusConfig[settlement.status].label}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600">
            Created on {formatDate(settlement.createdAt)} • Settlement for {formatDateRange(settlement.periodStart, settlement.periodEnd)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {settlement.status === 'pending' && (
            <Button onClick={handleProcessSettlement}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadReceipt}>
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportDetails}>
                <FileText className="w-4 h-4 mr-2" />
                Export Details (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrintPage}>
                <Printer className="w-4 h-4 mr-2" />
                Print Settlement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEmailSettlement}>
                <Mail className="w-4 h-4 mr-2" />
                Email to Vendor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {settlement.status === 'pending' && (
                <DropdownMenuItem onClick={handlePutOnHold} className="text-error-700">
                  <Pause className="w-4 h-4 mr-2" />
                  Put On Hold
                </DropdownMenuItem>
              )}
              {settlement.status === 'on_hold' && (
                <DropdownMenuItem onClick={handleReactivate} className="text-primary-700">
                  <Play className="w-4 h-4 mr-2" />
                  Reactivate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alert for Pending/On Hold status */}
      {(settlement.status === 'pending' || settlement.status === 'on_hold') && (
        <div className={`border rounded-lg p-4 ${settlement.status === 'pending' ? 'bg-warning-50 border-warning-200' : 'bg-error-50 border-error-200'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 ${settlement.status === 'pending' ? 'text-warning-700' : 'text-error-700'}`} />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${settlement.status === 'pending' ? 'text-warning-900' : 'text-error-900'} mb-1`}>
                {settlement.status === 'pending' ? 'Action Required - Payment Pending' : 'On Hold - Action Required'}
              </p>
              <p className={`text-sm ${settlement.status === 'pending' ? 'text-warning-800' : 'text-error-800'}`}>
                {settlement.status === 'pending' 
                  ? 'Review the settlement details and process payment to the vendor.'
                  : settlement.notes || 'This settlement has been put on hold. Review and take appropriate action.'}
              </p>
            </div>
            {settlement.status === 'pending' && (
              <Button
                onClick={handleProcessSettlement}
                className="bg-success-600 hover:bg-success-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Process Now
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Breakdown Card - Most Important */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Financial Breakdown</h2>
                  <p className="text-sm text-neutral-600">{settlement.orderCount} orders included</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Gross Amount */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-neutral-600">Total Order Value</span>
                  <span className="text-base font-semibold text-neutral-900">
                    {formatCurrency(settlement.totalAmount)}
                  </span>
                </div>

                <Separator />

                {/* Deductions */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-error-600" />
                      <span className="text-sm text-neutral-600">
                        Platform Fee ({settlement.platformFeePercentage}%)
                      </span>
                    </div>
                    <span className="text-sm font-medium text-error-600">
                      - {formatCurrency(settlement.platformFee)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-error-600" />
                      <span className="text-sm text-neutral-600">
                        TDS ({settlement.tdsPercentage}%)
                      </span>
                    </div>
                    <span className="text-sm font-medium text-error-600">
                      - {formatCurrency(settlement.tds)}
                    </span>
                  </div>

                  {settlement.adjustments && settlement.adjustments !== 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {settlement.adjustments > 0 ? (
                          <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-error-600" />
                        )}
                        <span className="text-sm text-neutral-600">Adjustments</span>
                      </div>
                      <span className={`text-sm font-medium ${settlement.adjustments > 0 ? 'text-[#22C55E]' : 'text-error-600'}`}>
                        {settlement.adjustments > 0 ? '+' : ''}{formatCurrency(settlement.adjustments)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="border-neutral-300" />

                {/* Net Payout - Highlighted */}
                <div className="bg-primary-50 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-primary-700 font-medium mb-0.5">Net Payable to Vendor</p>
                    <p className="text-xs text-primary-600">
                      {settlement.orderCount} orders • {formatDateRange(settlement.periodStart, settlement.periodEnd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-700">
                      {formatCurrency(settlement.netAmount)}
                    </p>
                    <p className="text-xs text-primary-600 mt-0.5">
                      {((settlement.netAmount / settlement.totalAmount) * 100).toFixed(1)}% of gross
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Orders Included Table */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-secondary-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Orders Included</h2>
                    <p className="text-sm text-neutral-600">{ordersToShow.length} orders in this settlement</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportDetails}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Orders
                </Button>
              </div>

              <DataTable
                data={ordersToShow}
                columns={[
                  {
                    key: 'orderNumber',
                    label: 'Order #',
                    width: '25%',
                    render: (order) => (
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900 text-sm">
                          {(order as any).orderNumber || order.id}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {formatDate((order as any).createdAt)}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: 'buyerName',
                    label: 'Buyer',
                    width: '25%',
                    render: (order) => (
                      <span className="text-sm text-neutral-900">
                        {(order as any).buyerName || 'N/A'}
                      </span>
                    ),
                  },
                  {
                    key: 'total',
                    label: 'Order Value',
                    align: 'right',
                    width: '20%',
                    render: (order) => {
                      const amount = (order as any).total || 0;
                      return (
                        <span className="text-sm font-medium text-neutral-900">
                          {formatCurrency(amount)}
                        </span>
                      );
                    },
                  },
                  {
                    key: 'fees',
                    label: 'Deductions',
                    align: 'right',
                    width: '15%',
                    render: (order) => {
                      const amount = (order as any).total || 0;
                      const platformFee = amount * ((settlement.platformFeePercentage || 3) / 100);
                      const tds = amount * ((settlement.tdsPercentage || 1) / 100);
                      const totalDeductions = platformFee + tds;
                      return (
                        <span className="text-sm text-error-600">
                          -{formatCurrency(totalDeductions)}
                        </span>
                      );
                    },
                  },
                  {
                    key: 'net',
                    label: 'Net Amount',
                    align: 'right',
                    width: '15%',
                    render: (order) => {
                      const amount = (order as any).total || 0;
                      const platformFee = amount * ((settlement.platformFeePercentage || 3) / 100);
                      const tds = amount * ((settlement.tdsPercentage || 1) / 100);
                      const netAmount = amount - platformFee - tds;
                      return (
                        <span className="text-sm font-semibold text-primary-700">
                          {formatCurrency(netAmount)}
                        </span>
                      );
                    },
                  },
                ]}
                searchable={false}
                pageSize={10}
                emptyMessage="No orders found"
              />

              {/* Orders Summary Footer */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-neutral-600 mb-1">Total Orders</p>
                    <p className="text-lg font-semibold text-neutral-900">{settlement.orderCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neutral-600 mb-1">Gross Value</p>
                    <p className="text-lg font-semibold text-neutral-900">{formatCurrency(settlement.totalAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neutral-600 mb-1">Net Payout</p>
                    <p className="text-lg font-semibold text-primary-700">{formatCurrency(settlement.netAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Vendor Information */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-neutral-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Vendor Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Business Name</p>
                  <p className="text-sm font-medium text-neutral-900">{settlement.vendorName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Vendor Type</p>
                  <p className="text-sm font-medium text-neutral-900">{settlement.vendorType}</p>
                </div>
                {settlement.accountNumber && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-neutral-600">Account Number</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => handleCopyToClipboard(settlement.accountNumber!, 'Account number')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-mono font-medium text-neutral-900">
                        {settlement.accountNumber}
                      </p>
                    </div>
                  </>
                )}
                {settlement.ifscCode && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-neutral-600">IFSC Code</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => handleCopyToClipboard(settlement.ifscCode!, 'IFSC code')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-mono font-medium text-neutral-900">
                        {settlement.ifscCode}
                      </p>
                    </div>
                  </>
                )}
                {settlement.accountHolderName && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-neutral-600 mb-1">Account Holder Name</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {settlement.accountHolderName}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Transaction Details */}
          {settlement.transactionId && (
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-neutral-600">Transaction ID</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => handleCopyToClipboard(settlement.transactionId!, 'Transaction ID')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-mono font-medium text-neutral-900">
                      {settlement.transactionId}
                    </p>
                  </div>
                  {settlement.utrNumber && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-neutral-600">UTR Number</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleCopyToClipboard(settlement.utrNumber!, 'UTR number')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-mono font-medium text-neutral-900">
                          {settlement.utrNumber}
                        </p>
                      </div>
                    </>
                  )}
                  {settlement.paymentDate && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Payment Date</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatDateTime(settlement.paymentDate)}
                        </p>
                      </div>
                    </>
                  )}
                  {settlement.paymentMethod && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Payment Method</p>
                        <p className="text-sm font-medium text-neutral-900 capitalize">
                          {settlement.paymentMethod.replace('_', ' ')}
                        </p>
                      </div>
                    </>
                  )}
                  {settlement.processedBy && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Processed By</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {settlement.processedBy}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Settlement Timeline */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <History className="w-5 h-5 text-neutral-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Activity Timeline</h2>
              </div>

              <div className="space-y-4">
                {activityTimeline.map((activity, index) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={activity.id} className="relative">
                      {index !== activityTimeline.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-px bg-neutral-200" />
                      )}
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <ActivityIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-sm font-medium text-neutral-900">{activity.action}</p>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {activity.user} • {formatDateTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Settlement Period */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-neutral-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Settlement Period</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Period Start</p>
                  <p className="text-sm font-medium text-neutral-900">{formatDate(settlement.periodStart)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Period End</p>
                  <p className="text-sm font-medium text-neutral-900">{formatDate(settlement.periodEnd)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Duration</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {Math.ceil((new Date(settlement.periodEnd).getTime() - new Date(settlement.periodStart).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Process Settlement Dialog */}
      <ProcessSettlementDialog
        settlement={settlement}
        isOpen={isProcessDialogOpen}
        onClose={() => setIsProcessDialogOpen(false)}
        onSuccess={handleProcessSuccess}
      />
    </div>
  );
}
