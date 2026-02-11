import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Badge } from '../../../../app/components/ui/badge';
import { Building, CheckCircle, AlertCircle } from 'lucide-react';
import type { BankDetails } from '../../../types/vendor';
import { Link } from 'react-router-dom';

interface BankDetailsCardProps {
  bankDetails: BankDetails;
}

export function BankDetailsCard({ bankDetails }: BankDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary-700" />
            Bank Account Details
          </CardTitle>
          {bankDetails.verified ? (
            <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Pending Verification
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Account Holder Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            Account Holder Name
          </label>
          <p className="text-base font-medium text-neutral-900">{bankDetails.accountHolderName}</p>
        </div>

        {/* Bank Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            Bank Name
          </label>
          <p className="text-base text-neutral-900">{bankDetails.bankName}</p>
        </div>

        {/* Account Number (Masked) */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            Account Number
          </label>
          <div className="flex items-center gap-2">
            <p className="text-base font-mono text-neutral-900">{bankDetails.accountNumber}</p>
            <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300 text-xs">
              Masked
            </Badge>
          </div>
        </div>

        {/* IFSC Code */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            IFSC Code
          </label>
          <p className="text-base font-mono text-neutral-900">{bankDetails.ifscCode}</p>
        </div>

        {/* Verification Date */}
        {bankDetails.verified && bankDetails.verifiedAt && (
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
              Verified On
            </label>
            <p className="text-sm text-neutral-700">
              {new Date(bankDetails.verifiedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Settlement Info */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="bg-success-50 border-2 border-success-200 rounded-lg p-4">
            <p className="text-sm text-neutral-900 mb-1">
              <strong>Payout Account:</strong>
            </p>
            <p className="text-sm text-neutral-700">
              All settlements from Vendara will be transferred to this verified bank account.
            </p>
          </div>
        </div>

        {/* Update Notice */}
        <div className="pt-2">
          <p className="text-sm text-neutral-600">
            <strong>Note:</strong> To update bank details,{' '}
            <Link to="/vendor/support" className="text-primary-700 hover:text-primary-800 underline font-medium">
              contact Vendara support
            </Link>{' '}
            with your updated information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}