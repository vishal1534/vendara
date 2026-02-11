/**
 * Loading Screen Component
 */

import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error-100 rounded-2xl mb-4">
          <Loader2 className="w-8 h-8 text-error-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-neutral-700">Loading...</p>
      </div>
    </div>
  );
}
