/**
 * Vendara Portal - Main Entry Point
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PortalSelector } from './components/PortalSelector';
import VendorApp from '../vendor/app/VendorApp';
import AdminApp from '../admin/app/AdminApp';
import { ErrorBoundary } from '../vendor/components/common/ErrorBoundary';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary> 
        <Routes>
          <Route path="/" element={<PortalSelector />} />
                 {/* <Route path="/" element={<VendorApp />} /> */}
          <Route path="/vendor/*" element={<VendorApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<PortalSelector />} />
        </Routes>
        <Toaster position="top-center" />
      </ErrorBoundary>
    </BrowserRouter>
  );
}