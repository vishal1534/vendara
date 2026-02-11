import { Button } from '../../../../app/components/ui/button';
import { Download } from 'lucide-react';
import { VendorOrder } from '../../../types/vendorOrder';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

interface ExportButtonProps {
  orders: VendorOrder[];
  filename?: string;
  disabled?: boolean;
}

export function ExportButton({ orders, filename = 'orders', disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (orders.length === 0) return;

    // Prepare CSV data
    const headers = [
      'Order Number',
      'Date',
      'Time',
      'Item Name',
      'Quantity',
      'Unit',
      'Delivery Date',
      'Delivery Time',
      'Delivery Area',
      'Status',
      'Base Amount',
      'Vendara Fee',
      'Logistics Fee',
      'Total Payout',
      'Settlement Status',
    ];

    const rows = orders.map((order) => [
      order.orderNumber,
      formatDate(order.createdAt),
      formatTime(order.createdAt),
      order.itemName,
      order.quantity.toString(),
      order.unit,
      formatDate(order.deliveryDate),
      `${order.deliveryTimeSlot.startTime}-${order.deliveryTimeSlot.endTime}`,
      order.deliveryArea,
      order.status.replace('_', ' ').toUpperCase(),
      order.basePayoutAmount.toString(),
      order.realservFee.toString(),
      order.logisticsFee?.toString() || '0',
      order.totalPayoutAmount.toString(),
      order.settlementStatus || 'Pending',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || orders.length === 0}
      className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
    >
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
}
