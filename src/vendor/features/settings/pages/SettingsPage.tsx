import { Settings } from 'lucide-react';
import { BusinessInfoCard } from '../components/BusinessInfoCard';
import { KYCDocumentsCard } from '../components/KYCDocumentsCard';
import { BankDetailsCard } from '../components/BankDetailsCard';
import { AvailabilityCard } from '../components/AvailabilityCard';
import { mockVendorProfile } from '../../../mocks/vendorProfile.mock';
import { useVendorAuth } from '../../../context/VendorAuthContext';
import { Link } from 'react-router-dom';

export function SettingsPage() {
  const { vendor, toggleAvailability } = useVendorAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-700" />
        </div>
        <div>
          <h1 className="font-bold text-neutral-900">Settings & Profile</h1>
          <p className="text-sm text-neutral-600">
            Manage your business information and account settings
          </p>
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <BusinessInfoCard vendor={vendor || mockVendorProfile} />
          <AvailabilityCard isAvailable={vendor?.isAvailable ?? mockVendorProfile.isAvailable} onToggle={toggleAvailability} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <KYCDocumentsCard 
            documents={vendor?.kycDocuments || mockVendorProfile.kycDocuments} 
            kycStatus={vendor?.kycStatus || mockVendorProfile.kycStatus}
          />
          <BankDetailsCard bankDetails={vendor?.bankDetails || mockVendorProfile.bankDetails} />
        </div>
      </div>

      {/* Bottom Notice */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-900 mb-2">
          Need to make changes?
        </h3>
        <p className="text-sm text-neutral-700">
          For security reasons, all profile updates must be verified by Vendara. 
          To update any information,{' '}
          <Link 
            to="/vendor/support"
            className="text-primary-700 hover:text-primary-800 underline font-medium"
          >
            contact Vendara support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}