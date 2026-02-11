import { useNavigate } from 'react-router-dom';
import { VendorOrder } from '../../../types/vendorOrder';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { Badge } from '../../../../app/components/ui/badge';
import { Button } from '../../../../app/components/ui/button';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Package, Check, X } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface OrdersTableProps {
  orders: VendorOrder[];
  onOrderClick?: (orderId: string) => void;
  currentTab?: 'requests' | 'my-orders';
  onAcceptOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
}

export function OrdersTable({ orders, onOrderClick, currentTab, onAcceptOrder, onRejectOrder }: OrdersTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: VendorOrderStatus) => {
    const variants: Record<VendorOrderStatus, { label: string; className: string }> = {
      [VendorOrderStatus.OFFERED]: {
        label: 'New Offer',
        className: 'bg-warning-100 text-warning-700 border-warning-200',
      },
      [VendorOrderStatus.ACCEPTED]: {
        label: 'Accepted',
        className: 'bg-primary-100 text-primary-700 border-primary-200',
      },
      [VendorOrderStatus.IN_PROGRESS]: {
        label: 'In Progress',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      [VendorOrderStatus.READY]: {
        label: 'Ready',
        className: 'bg-success-100 text-success-700 border-success-200',
      },
      [VendorOrderStatus.COMPLETED]: {
        label: 'Completed',
        className: 'bg-success-100 text-success-700 border-success-200',
      },
      [VendorOrderStatus.REJECTED]: {
        label: 'Rejected',
        className: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      },
      [VendorOrderStatus.ISSUE]: {
        label: 'Issue',
        className: 'bg-error-100 text-error-700 border-error-200',
      },
      [VendorOrderStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-error-100 text-error-700 border-error-200',
      },
    };

    const variant = variants[status];
    if (!variant) {
      return (
        <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const handleRowClick = (order: VendorOrder) => {
    if (onOrderClick) {
      onOrderClick(order.id);
    } else {
      navigate(`/vendor/orders/${order.id}`, { state: { fromTab: currentTab } });
    }
  };

  // Base columns that appear in all tabs
  const baseColumns: Column<VendorOrder>[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      sortable: true,
      width: currentTab === 'requests' ? '12%' : '15%',
      render: (order) => (
        <div className="font-medium text-neutral-900">
          {order.orderNumber}
        </div>
      ),
    },
  ];

  // Conditional column for countdown timer (only for requests tab)
  const timeRemainingColumn: Column<VendorOrder> = {
    key: 'timeRemaining',
    label: 'Time Remaining',
    width: '12%',
    render: (order) => (
      <div>
        {order.offerExpiresAt && (
          <CountdownTimer expiresAt={order.offerExpiresAt} />
        )}
      </div>
    ),
  };

  // Other standard columns
  const standardColumns: Column<VendorOrder>[] = [
    {
      key: 'itemName',
      label: 'Item & Quantity',
      width: currentTab === 'requests' ? '20%' : '20%',
      render: (order) => (
        <div>
          <div className="text-sm text-neutral-900">
            {order.itemName}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">
            {order.quantity} {order.unit}
          </div>
        </div>
      ),
    },
    {
      key: 'deliveryDate',
      label: 'Delivery',
      sortable: true,
      width: currentTab === 'requests' ? '15%' : '15%',
      render: (order) => (
        <div>
          <div className="text-sm text-neutral-900">
            {formatDate(order.deliveryDate)}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">
            {order.deliveryTimeSlot.startTime}-{order.deliveryTimeSlot.endTime}
          </div>
        </div>
      ),
    },
    {
      key: 'totalPayoutAmount',
      label: 'Payout',
      sortable: true,
      align: 'right',
      width: currentTab === 'requests' ? '10%' : '10%',
      render: (order) => (
        <div className="font-semibold text-neutral-900">
          {formatCurrency(order.totalPayoutAmount)}
        </div>
      ),
    },
  ];

  // Status column (only for my-orders tab)
  const statusColumn: Column<VendorOrder> = {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '10%',
    render: (order) => getStatusBadge(order.status),
  };

  // Payment status column (only for my-orders tab for completed orders)
  const paymentStatusColumn: Column<VendorOrder> = {
    key: 'paymentStatus',
    label: 'Payment',
    sortable: false,
    width: '12%',
    render: (order) => {
      // Only show payment status for completed orders
      if (order.status === VendorOrderStatus.COMPLETED) {
        if (order.settlementStatus === 'settled') {
          return (
            <div>
              <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200 mb-1">
                Settled
              </Badge>
              {order.settlementDate && (
                <div className="text-xs text-neutral-500 mt-1">
                  {formatDate(order.settlementDate)}
                </div>
              )}
            </div>
          );
        } else if (order.settlementStatus === 'processing') {
          return (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              Processing
            </Badge>
          );
        } else {
          return (
            <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">
              Awaiting Settlement
            </Badge>
          );
        }
      }
      // For non-completed orders, show "-"
      return <span className="text-xs text-neutral-400">-</span>;
    },
  };

  // Actions column (only for requests tab)
  const actionsColumn: Column<VendorOrder> = {
    key: 'actions',
    label: 'Actions',
    width: '16%',
    align: 'right',
    render: (order) => (
      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAcceptOrder?.(order.id);
          }}
          className="bg-success-600 hover:bg-success-700 text-white h-9 px-4 border-2 border-success-600"
        >
          <Check className="w-4 h-4 mr-1.5" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onRejectOrder?.(order.id);
          }}
          className="border-2 border-error-600 text-error-600 hover:bg-error-50 hover:text-error-700 h-9 px-4"
        >
          <X className="w-4 h-4 mr-1.5" />
          Reject
        </Button>
      </div>
    ),
  };

  // Build columns based on current tab
  const columns: Column<VendorOrder>[] = 
    currentTab === 'requests'
      ? [...baseColumns, timeRemainingColumn, ...standardColumns, actionsColumn]
      : [...baseColumns.slice(0, 1), {
          key: 'createdAt',
          label: 'Date',
          sortable: true,
          width: '15%',
          render: (order) => (
            <div>
              <div className="text-sm text-neutral-900">
                {formatDate(order.createdAt)}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {formatTime(order.createdAt)}
              </div>
            </div>
          ),
        }, ...standardColumns, statusColumn, paymentStatusColumn];

  if (orders.length === 0) {
    return (
      <div className="border border-neutral-200 rounded-lg p-12 text-center bg-white">
        <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No orders found</h3>
        <p className="text-sm text-neutral-500">
          Orders matching your filters will appear here.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchable={false}
      pageSize={10}
      onRowClick={handleRowClick}
      emptyMessage="No orders found"
      stickyHeader={true}
      showPageSizeSelector={true}
      showPaginationInfo={true}
      showFirstLastButtons={true}
    />
  );
}