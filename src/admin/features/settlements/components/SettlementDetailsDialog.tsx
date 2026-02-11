/**
 * Settlement Details Dialog - Admin Portal
 * Shows comprehensive settlement breakdown with order details
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../app/components/ui/dialog';
import { Badge } from '../../../../app/components/ui/badge';
import { Button } from '../../../../app/components/ui/button';
import {
  IndianRupee,
  Calendar,
  Building2,
  CreditCard,
  Package,
  FileText,
  X,
  Download,
} from 'lucide-react';
import { Settlement, SettlementStatus } from '../../../types/settlement';
import { mockOrders } from '../../../data/mockOrders';

interface SettlementDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement | null;
}

const statusConfig: Record<SettlementStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  processing: { label: 'Processing', variant: 'default' },
  completed: { label: 'Completed', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
  on_hold: { label: 'On Hold', variant: 'destructive' },
};

export function SettlementDetailsDialog({
  isOpen,
  onClose,
  settlement,
}: SettlementDetailsDialogProps) {
  if (!settlement) return null;

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

  // Get orders associated with this settlement
  const settlementOrders = mockOrders
    .filter(order => settlement.orderIds.includes(order.id))
    .slice(0, settlement.orderCount); // Limit to orderCount

  // If no real orders found, generate representative data
  const ordersToShow = settlementOrders.length > 0 
    ? settlementOrders 
    : Array.from({ length: settlement.orderCount }, (_, i) => ({
        id: `ord_${String(i + 1).padStart(3, '0')}`,
        orderNumber: `RS2024${String(Math.floor(Math.random() * 900000) + 100000)}`,
        total: Math.floor(settlement.totalAmount / settlement.orderCount),
        createdAt: settlement.periodStart,
        buyerName: ['Ramesh Kumar', 'Suresh Reddy', 'Vijay Kumar', 'Mahesh Babu', 'Rakesh Sharma'][i % 5],
      }));

  const handleDownloadReceipt = () => {
    // Generate receipt download
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
${ordersToShow.map(order => `${order.orderNumber || order.id}: ${formatCurrency((order as any).total || 0)}`).join('\n')}

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
  };

  const handleExportDetails = () => {
    // CSV Export
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">Settlement Details</DialogTitle>
              <p className="text-sm text-neutral-600 mt-1">
                {settlement.settlementNumber}
              </p>
            </div>
            <Badge variant={statusConfig[settlement.status].variant}>
              {statusConfig[settlement.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Information */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-neutral-600" />
              <h3 className="font-semibold text-neutral-900">Vendor Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-600">Business Name</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {settlement.vendorName}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Vendor Type</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {settlement.vendorType}
                </p>
              </div>
              {settlement.accountNumber && (
                <div>
                  <p className="text-xs text-neutral-600">Account Number</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {settlement.accountNumber}
                  </p>
                </div>
              )}
              {settlement.ifscCode && (
                <div>
                  <p className="text-xs text-neutral-600">IFSC Code</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {settlement.ifscCode}
                  </p>
                </div>
              )}
              {settlement.accountHolderName && (
                <div className="col-span-2">
                  <p className="text-xs text-neutral-600">Account Holder Name</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {settlement.accountHolderName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settlement Period */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <h3 className="font-semibold text-neutral-900">Settlement Period</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-600">Period Start</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {formatDate(settlement.periodStart)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Period End</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {formatDate(settlement.periodEnd)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Total Orders</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {settlement.orderCount} orders
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
              <div>
                <p className="text-xs text-neutral-600">Created</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  {formatDateTime(settlement.createdAt)}
                </p>
              </div>
              {settlement.processedAt && (
                <div>
                  <p className="text-xs text-neutral-600">Processed</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {formatDateTime(settlement.processedAt)}
                  </p>
                </div>
              )}
              {settlement.completedAt && (
                <div>
                  <p className="text-xs text-neutral-600">Completed</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {formatDateTime(settlement.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-4 h-4 text-neutral-600" />
              <h3 className="font-semibold text-neutral-900">Financial Breakdown</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Order Value</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {formatCurrency(settlement.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Platform Fee ({settlement.platformFeePercentage}%)</span>
                <span className="text-sm font-medium text-error-600">
                  - {formatCurrency(settlement.platformFee)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">TDS ({settlement.tdsPercentage}%)</span>
                <span className="text-sm font-medium text-error-600">
                  - {formatCurrency(settlement.tds)}
                </span>
              </div>
              {settlement.adjustments && settlement.adjustments !== 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Adjustments</span>
                  <span className={`text-sm font-medium ${settlement.adjustments > 0 ? 'text-[#22C55E]' : 'text-error-600'}`}>
                    {settlement.adjustments > 0 ? '+' : ''}{formatCurrency(settlement.adjustments)}
                  </span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
                <span className="text-base font-semibold text-neutral-900">Net Payable Amount</span>
                <span className="text-xl font-bold text-primary-700">
                  {formatCurrency(settlement.netAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {settlement.transactionId && (
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-neutral-600" />
                <h3 className="font-semibold text-neutral-900">Transaction Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600">Transaction ID</p>
                  <p className="text-sm font-medium text-neutral-900 mt-1 font-mono">
                    {settlement.transactionId}
                  </p>
                </div>
                {settlement.utrNumber && (
                  <div>
                    <p className="text-xs text-neutral-600">UTR Number</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1 font-mono">
                      {settlement.utrNumber}
                    </p>
                  </div>
                )}
                {settlement.paymentDate && (
                  <div>
                    <p className="text-xs text-neutral-600">Payment Date</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {formatDate(settlement.paymentDate)}
                    </p>
                  </div>
                )}
                {settlement.paymentMethod && (
                  <div>
                    <p className="text-xs text-neutral-600">Payment Method</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1 capitalize">
                      {settlement.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                )}
                {settlement.processedBy && (
                  <div className="col-span-2">
                    <p className="text-xs text-neutral-600">Processed By</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {settlement.processedBy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Included */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-600" />
                <h3 className="font-semibold text-neutral-900">Orders Included ({ordersToShow.length})</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDetails}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-medium text-neutral-600">
                      Order #
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-neutral-600">
                      Date
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-neutral-600">
                      Buyer
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-neutral-600">
                      Amount
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-neutral-600">
                      Platform Fee
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-neutral-600">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {ordersToShow.map((order) => {
                    const amount = (order as any).total || 0;
                    const platformFee = amount * ((settlement.platformFeePercentage || 3) / 100);
                    const tds = amount * ((settlement.tdsPercentage || 1) / 100);
                    const netAmount = amount - platformFee - tds;
                    
                    return (
                      <tr key={order.id} className="hover:bg-white">
                        <td className="px-4 py-2 text-sm font-medium text-neutral-900">
                          {(order as any).orderNumber || order.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-neutral-600">
                          {formatDate((order as any).createdAt)}
                        </td>
                        <td className="px-4 py-2 text-sm text-neutral-600">
                          {(order as any).buyerName || 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-neutral-900">
                          {formatCurrency(amount)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-error-600">
                          -{formatCurrency(platformFee)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-primary-700">
                          {formatCurrency(netAmount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-white border-t-2 border-neutral-300">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-neutral-900">
                      Total ({ordersToShow.length} orders)
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-neutral-900">
                      {formatCurrency(settlement.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-error-600">
                      -{formatCurrency(settlement.platformFee + settlement.tds)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-primary-700">
                      {formatCurrency(settlement.netAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes/Remarks */}
          {settlement.notes && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-warning-700" />
                <h3 className="font-semibold text-warning-900">Notes</h3>
              </div>
              <p className="text-sm text-warning-800">{settlement.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {settlement.status === 'completed' && (
            <Button variant="default" onClick={handleDownloadReceipt}>
              <FileText className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}