/**
 * Payment Failed Page
 */

import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { XCircle, RefreshCw, Home } from 'lucide-react';

export function PaymentFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg border-2 border-gray-300 p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-error-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Unfortunately, your payment could not be processed. Please try again.
          </p>

          {/* Common Reasons */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm font-semibold text-gray-900 mb-2">Common reasons:</div>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Insufficient funds in account</li>
              <li>Incorrect card details</li>
              <li>Payment cancelled by user</li>
              <li>Network connection issue</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate(`/checkout?orderId=${orderId}`)}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-xs text-gray-500">
            Need help? Contact support at{' '}
            <a href="mailto:support@vendara.com" className="text-primary hover:underline">
              support@vendara.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
