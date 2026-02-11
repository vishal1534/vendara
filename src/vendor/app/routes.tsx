import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { VendorLayout } from '../components/layout/VendorLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { OrderDetailsPage } from '../features/orders/pages/OrderDetailsPage';
import { PayoutsPage } from '../features/payouts/pages/PayoutsPage';
import { PayoutDetailsPage } from '../features/payouts/pages/PayoutDetailsPage';
import { SettlementDetailPage } from '../features/payouts/pages/SettlementDetailPage';
import { PerformancePage } from '../features/performance/pages/PerformancePage';
import { CatalogPage } from '../features/catalog/pages/CatalogPage';
import { MaterialDetailsPage } from '../features/catalog/pages/MaterialDetailsPage';
import { ServiceDetailsPage } from '../features/catalog/pages/ServiceDetailsPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { SupportPage } from '../features/support/pages/SupportPage';
import { CreateTicketPage } from '../features/support/pages/CreateTicketPage';
import { TicketsPage } from '../features/support/pages/TicketsPage';
import { TicketDetailPage } from '../features/support/pages/TicketDetailPage';

export function VendorRouter() {
  return (
    <Routes>
      {/* Login page (optional - for future use) */}
      <Route path="/login" element={<LoginPage />} />
      {/* All routes are accessible - mock mode */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="payouts" element={<PayoutsPage />} />
        <Route path="payouts/:payoutId" element={<SettlementDetailPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/materials/:id" element={<MaterialDetailsPage />} />
        <Route path="catalog/services/:id" element={<ServiceDetailsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="support/create-ticket" element={<CreateTicketPage />} />
        <Route path="support/tickets" element={<TicketsPage />} />
        <Route path="support/tickets/:ticketId" element={<TicketDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Unknown vendor routes redirect to dashboard */}
      <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
    </Routes>
  );
}