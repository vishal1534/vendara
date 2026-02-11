import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorOrders } from '../../../context/VendorOrdersContext';
import { VendorOrderStatus } from '../../../constants/vendorOrderStates';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import {
  Package,
  DollarSign,
  Bell,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { StatCard } from '../../../components/StatCard';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { CountdownTimer } from '../../orders/components/CountdownTimer';

export function DashboardPage() {
  const navigate = useNavigate();
  const { orders } = useVendorOrders();

  // Calculate MVP KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Pending offers (OFFERED status - needs immediate response)
    const pendingOffers = orders.filter(
      order => order.status === VendorOrderStatus.OFFERED
    );

    // Active orders (accepted, in_progress)
    const activeOrders = orders.filter(
      order =>
        order.status === VendorOrderStatus.ACCEPTED ||
        order.status === VendorOrderStatus.IN_PROGRESS
    );

    // This month's revenue (completed orders this month)
    const monthRevenue = orders
      .filter(order => {
        if (order.status !== VendorOrderStatus.COMPLETED) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfMonth;
      })
      .reduce((sum, order) => sum + order.totalPayoutAmount, 0);

    return {
      pendingOffers: pendingOffers.length,
      activeOrders: activeOrders.length,
      monthRevenue,
    };
  }, [orders]);

  // Get pending offers (max 5)
  const pendingOffersList = useMemo(() => {
    return orders
      .filter(order => order.status === VendorOrderStatus.OFFERED)
      .slice(0, 5);
  }, [orders]);

  // Get recent active orders (max 5)
  const recentActiveOrders = useMemo(() => {
    return orders
      .filter(
        order =>
          order.status === VendorOrderStatus.ACCEPTED ||
          order.status === VendorOrderStatus.IN_PROGRESS
      )
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Welcome to Vendara Vendor Portal
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Bell}
          iconBgColor="bg-warning-100"
          iconColor="text-warning-700"
          label="Pending Offers"
          value={kpis.pendingOffers}
          subtitle="Need response"
        />

        <StatCard
          icon={Package}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-700"
          label="Active Orders"
          value={kpis.activeOrders}
          subtitle="In progress"
        />

        <StatCard
          icon={DollarSign}
          iconBgColor="bg-success-100"
          iconColor="text-success-700"
          label="This Month"
          value={formatCurrency(kpis.monthRevenue)}
          subtitle="Revenue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Orders Lists (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Offers */}
          <div className="bg-white rounded-xl border-2 border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning-700" />
                  <h2 className="font-semibold text-neutral-900">Pending Offers</h2>
                  {kpis.pendingOffers > 0 && (
                    <Badge className="bg-warning-600 text-white">
                      {kpis.pendingOffers}
                    </Badge>
                  )}
                </div>
                {kpis.pendingOffers > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/vendor/orders?filter=offered')}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
            {pendingOffersList.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">
                  No pending offers at the moment
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {pendingOffersList.map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-3 hover:bg-neutral-50 cursor-pointer flex items-center justify-between"
                    onClick={() => navigate(`/vendor/orders/${order.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-neutral-900">
                          {order.orderNumber}
                        </div>
                        {/* Show countdown timer */}
                        {order.offerExpiresAt && (
                          <CountdownTimer expiresAt={order.offerExpiresAt} />
                        )}
                      </div>
                      <div className="text-sm text-neutral-600 truncate">
                        {order.itemName} × {order.quantity} {order.unit}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(order.deliveryDate)}
                        </span>
                        <span>•</span>
                        <span>{order.deliveryArea}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold text-neutral-900">
                        {formatCurrency(order.totalPayoutAmount)}
                      </div>
                      <Button size="sm" className="mt-1">
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-xl border-2 border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-700" />
                  <h2 className="font-semibold text-neutral-900">Active Orders</h2>
                </div>
                {kpis.activeOrders > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/vendor/orders')}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
            {recentActiveOrders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">
                  No active orders at the moment
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {recentActiveOrders.map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-3 hover:bg-neutral-50 cursor-pointer flex items-center justify-between"
                    onClick={() => navigate(`/vendor/orders/${order.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-neutral-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-neutral-600 truncate">
                        {order.itemName} × {order.quantity} {order.unit}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(order.deliveryDate)}
                        </span>
                        <span>•</span>
                        <span>{order.deliveryArea}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <Badge
                        variant="outline"
                        className={
                          order.status === VendorOrderStatus.ACCEPTED
                            ? 'bg-primary-100 text-primary-700 border-primary-200'
                            : 'bg-blue-100 text-blue-700 border-blue-200'
                        }
                      >
                        {order.status === VendorOrderStatus.ACCEPTED
                          ? 'Accepted'
                          : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Help & Support (1/3 width) */}
        <div className="space-y-6">
          {/* Help & Support */}
          <div className="bg-white rounded-xl border-2 border-neutral-200">
            <div className="bg-primary-50 px-6 py-4 border-b border-primary-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary-700" />
                <h2 className="font-semibold text-neutral-900">Help & Support</h2>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                We're here to help you succeed
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Contact Us
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+911234567890"
                    className="flex items-start gap-3 text-sm text-neutral-700 hover:text-primary-700 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <Phone className="w-4 h-4 text-primary-700" />
                    </div>
                    <div>
                      <div className="font-medium">Call Us</div>
                      <div className="text-xs text-neutral-500">+91 123 456 7890</div>
                    </div>
                  </a>

                  <a
                    href="mailto:vendor-support@vendara.com"
                    className="flex items-start gap-3 text-sm text-neutral-700 hover:text-primary-700 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <Mail className="w-4 h-4 text-primary-700" />
                    </div>
                    <div>
                      <div className="font-medium">Email Us</div>
                      <div className="text-xs text-neutral-500">vendor-support@vendara.com</div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/911234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm text-neutral-700 hover:text-primary-700 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <MessageSquare className="w-4 h-4 text-primary-700" />
                    </div>
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-xs text-neutral-500">Chat with support</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Support Hours */}
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  Support Hours
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Monday - Saturday</span>
                    <span className="font-medium text-neutral-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Sunday</span>
                    <span className="font-medium text-neutral-900">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  Average response time: 2-4 hours
                </p>
              </div>

              {/* Common Topics */}
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-sm text-neutral-900 mb-3">
                  Common Questions
                </h3>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => navigate('/vendor/support?question=catalog')}
                    className="block w-full text-left text-neutral-600 hover:text-primary-700 hover:underline cursor-pointer text-[14px]"
                  >
                    • How to update my catalog?
                  </button>
                  <button
                    onClick={() => navigate('/vendor/support?question=payment')}
                    className="block w-full text-left text-neutral-600 hover:text-primary-700 hover:underline cursor-pointer text-[14px]"
                  >
                    • When will I receive payment?
                  </button>
                  <button
                    onClick={() => navigate('/vendor/support?question=offers')}
                    className="block w-full text-left text-neutral-600 hover:text-primary-700 hover:underline cursor-pointer text-[14px]"
                  >
                    • How to respond to offers?
                  </button>
                  <button
                    onClick={() => navigate('/vendor/support?question=delivery')}
                    className="block w-full text-left text-neutral-600 hover:text-primary-700 hover:underline cursor-pointer text-[14px]"
                  >
                    • Delivery requirements
                  </button>
                </div>
                <p className="text-xs text-primary-700 mt-3">
                  Click any question to view details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}