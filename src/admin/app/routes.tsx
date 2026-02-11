import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { FirstLoginSetupPage } from '../features/auth/pages/FirstLoginSetupPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { VendorsPage } from '../features/vendors/pages/VendorsPage';
import { VendorOnboardingPage } from '../features/vendors/pages/VendorOnboardingPage';
import { VendorProfilePage } from '../features/vendors/pages/VendorProfilePage';
import { VendorEditPage } from '../features/vendors/pages/VendorEditPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { OrderDetailPage } from '../features/orders/pages/OrderDetailPage';
import { BuyersPage } from '../features/buyers/pages/BuyersPage';
import { BuyerProfilePage } from '../features/buyers/pages/BuyerProfilePage_new';
import { MaterialsCatalogPage } from '../features/catalog/pages/MaterialsCatalogPage';
import { MaterialDetailsPage } from '../features/catalog/pages/MaterialDetailsPage';
import { LaborServicesPage } from '../features/catalog/pages/LaborServicesPage';
import { LaborServiceDetailsPage } from '../features/catalog/pages/LaborServiceDetailsPage';
import { DeliveryZonesPage } from '../features/delivery/pages/DeliveryZonesPage';
import { PlatformSettingsPage } from '../features/settings/pages/PlatformSettingsPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { SettlementsPage } from '../features/settlements/pages/SettlementsPage';
import { CreateSettlementPage } from '../features/settlements/pages/CreateSettlementPage';
import { SettlementDetailsPage } from '../features/settlements/pages/SettlementDetailsPage';
import { SupportTicketsPage } from '../features/support/pages/SupportTicketsPage';
import { TicketDetailsPage } from '../features/support/pages/TicketDetailsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { SystemLogsPage } from '../features/logs/pages/SystemLogsPage';
import { FeedbackDemoPage } from '../features/demo/pages/FeedbackDemoPage';

export function AdminRouter() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/first-login-setup" element={<FirstLoginSetupPage />} />

      {/* Protected Routes - All wrapped in Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="vendors/pending" element={<VendorOnboardingPage />} />
        <Route path="vendors/:id/edit" element={<VendorEditPage />} />
        <Route path="vendors/:id" element={<VendorProfilePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="buyers" element={<BuyersPage />} />
        <Route path="buyers/:id" element={<BuyerProfilePage />} />
        <Route path="catalog/materials" element={<MaterialsCatalogPage />} />
        <Route path="catalog/materials/:id" element={<MaterialDetailsPage />} />
        <Route path="catalog/labor" element={<LaborServicesPage />} />
        <Route path="catalog/labor/:id" element={<LaborServiceDetailsPage />} />
        <Route path="delivery/zones" element={<DeliveryZonesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settlements" element={<SettlementsPage />} />
        <Route path="settlements/create" element={<CreateSettlementPage />} />
        <Route path="settlements/:id" element={<SettlementDetailsPage />} />
        <Route path="support" element={<SupportTicketsPage />} />
        <Route path="support/:ticketId" element={<TicketDetailsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="logs" element={<SystemLogsPage />} />
        <Route path="settings" element={<PlatformSettingsPage />} />
        <Route path="demo/feedback" element={<FeedbackDemoPage />} />
      </Route>

      {/* Catch-all redirect to login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}