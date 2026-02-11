import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function PortalSelector() {
  const navigate = useNavigate();

  const handleVendorDemo = () => {
    // Navigate directly to vendor dashboard (mock data auto-loads)
    navigate('/vendor/login');
  };

  const handleAdminDemo = () => {
    // Navigate directly to admin dashboard (mock data auto-loads)
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">RS</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Vendara Portal Demo
          </h1>
          <p className="text-neutral-600">
            Select a portal to explore • Mock data auto-loaded
          </p>
        </div>

        {/* Portal Selection Cards */}
        <div className="space-y-4">
          {/* Vendor Portal */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-all hover:border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                  Vendor Portal
                </h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Desktop portal for vendors to manage orders, catalog, payouts, and performance
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Demo: Sri Sai Suppliers
                  </span>
                  <span>•</span>
                  <span>Material Supplier</span>
                  <span>•</span>
                  <span>Kukatpally</span>
                </div>
                <Button
                  onClick={handleVendorDemo}
                  className="w-full"
                  size="lg"
                >
                  Launch Vendor Portal Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Portal */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-all hover:border-error-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                  Admin Portal
                </h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Operations control center for Vendara team to manage marketplace operations
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Demo: Super Admin
                  </span>
                  <span>•</span>
                  <span>Full Access</span>
                  <span>•</span>
                  <span>All Permissions</span>
                </div>
                <Button
                  onClick={handleAdminDemo}
                  className="w-full bg-error-600 hover:bg-error-700"
                  size="lg"
                >
                  Launch Admin Portal Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            Vendara MVP • Hyperlocal Construction Materials Marketplace • Hyderabad
          </p>
        </div>
      </div>
    </div>
  );
}