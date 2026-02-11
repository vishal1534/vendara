import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Badge } from '../../../../app/components/ui/badge';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { KYCDocument, KYCStatus } from '../../../types/vendor';

interface KYCDocumentsCardProps {
  documents: KYCDocument[];
  kycStatus: KYCStatus;
}

export function KYCDocumentsCard({ documents, kycStatus }: KYCDocumentsCardProps) {
  const documentLabels: Record<string, string> = {
    aadhaar: 'Aadhaar Card',
    pan: 'PAN Card',
    driving_license: 'Driving License',
    voter_id: 'Voter ID',
  };

  const getStatusBadge = () => {
    if (kycStatus === 'verified') {
      return (
        <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
          <CheckCircle className="w-3.5 h-3.5 mr-1" />
          Verified
        </Badge>
      );
    }
    if (kycStatus === 'pending') {
      return (
        <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">
          <Clock className="w-3.5 h-3.5 mr-1" />
          Pending
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-danger-100 text-danger-700 border-danger-200">
        <XCircle className="w-3.5 h-3.5 mr-1" />
        Rejected
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-700" />
            KYC Documents
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.type} className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {documentLabels[doc.type] || doc.type}
                </h3>
                {doc.verified && (
                  <CheckCircle className="w-4 h-4 text-success-600" />
                )}
              </div>
              <p className="text-base font-mono text-neutral-700">{doc.number}</p>
              {doc.verifiedAt && (
                <p className="text-xs text-neutral-500 mt-1">
                  Verified on {new Date(doc.verifiedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
            {doc.verified ? (
              <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">
                Pending
              </Badge>
            )}
          </div>
        ))}

        {/* Security Notice */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
            <p className="text-sm text-neutral-900">
              <strong>Security:</strong> Your KYC documents are securely stored and verified by Vendara. Sensitive information is masked for privacy.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}