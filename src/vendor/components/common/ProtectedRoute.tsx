import { useVendorAuth } from '../../context/VendorAuthContext';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading } = useVendorAuth();

  // Show loading only while initializing mock data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // No authentication check - mock mode, always allow access
  return <>{children}</>;
}