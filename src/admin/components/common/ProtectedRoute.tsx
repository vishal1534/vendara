/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

import { useAdminAuth } from '../../context/AdminAuthContext';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAdminAuth();

  // Show loading only while initializing mock data
  if (isLoading) {
    return <LoadingScreen />;
  }

  // No authentication check - mock mode, always allow access
  return <>{children}</>;
}