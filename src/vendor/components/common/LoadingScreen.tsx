import { Loader } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-neutral-700">Loading...</p>
      </div>
    </div>
  );
}
