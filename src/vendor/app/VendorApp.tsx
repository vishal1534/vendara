/**
 * Vendor Portal App Entry Point
 * Desktop-first web portal for vendor order management, payouts, and analytics
 */

import { Suspense, useEffect } from 'react';
import { VendorRouter } from './routes';
import { VendorAuthProvider } from '../context/VendorAuthContext';
import { VendorOrdersProvider } from '../context/VendorOrdersContext';
import { VendorNotificationsProvider } from '../context/VendorNotificationsContext';
import { VendorSupportProvider } from '../context/VendorSupportContext';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingScreen } from '../components/common/LoadingScreen';

export default function VendorApp() {
  useEffect(() => {
    document.title = 'Vendara Vendor Portal';
  }, []);

  return (
    <ErrorBoundary>
      <VendorAuthProvider>
        <VendorNotificationsProvider>
          <VendorSupportProvider>
            <VendorOrdersProvider>
              <Suspense fallback={<LoadingScreen />}>
                <VendorRouter />
              </Suspense>
            </VendorOrdersProvider>
          </VendorSupportProvider>
        </VendorNotificationsProvider>
      </VendorAuthProvider>
    </ErrorBoundary>
  );
}