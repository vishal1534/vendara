/**
 * Vendara Admin Portal - Root Component
 */

import { useEffect } from 'react';
import { AdminRouter } from './routes';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { AdminNotificationsProvider } from '../context/AdminNotificationsContext';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { Suspense } from 'react';

export default function AdminApp() {
  useEffect(() => {
    document.title = 'Vendara Admin Portal';
  }, []);

  return (
   
    <ErrorBoundary>
      <AdminAuthProvider>
        <AdminNotificationsProvider>
          <Suspense fallback={<LoadingScreen />}>
            <AdminRouter />
          </Suspense>
        </AdminNotificationsProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}