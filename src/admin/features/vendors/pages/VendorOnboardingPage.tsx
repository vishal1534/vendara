/**
 * Vendor Onboarding/Approval Page
 * Review and approve pending vendor applications
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Textarea } from '../../../../app/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../app/components/ui/dialog';
import { Alert, AlertDescription } from '../../../../app/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, FileText, Building, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { mockVendors } from '../../../mocks/vendors.mock';
import { Vendor } from '../../../types/vendor';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function VendorOnboardingPage() {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingVendors = mockVendors.filter((v) => v.status === 'pending');

  const handleAction = (vendor: Vendor, action: 'approve' | 'reject') => {
    setSelectedVendor(vendor);
    setActionType(action);
    setRejectionReason('');
  };

  const handleConfirmAction = () => {
    if (!selectedVendor) return;

    if (actionType === 'approve') {
      toast.success(`Vendor "${selectedVendor.businessName}" approved successfully!`);
    } else if (actionType === 'reject' && rejectionReason) {
      toast.success(`Vendor "${selectedVendor.businessName}" rejected.`);
    }

    setSelectedVendor(null);
    setActionType(null);
    setRejectionReason('');
  };

  const getDocumentStatus = (vendor: Vendor) => {
    const docs = vendor.kycDocuments;
    const total = 4;
    const uploaded = [docs.gstCertificate, docs.panCard, docs.cancelledCheque, docs.shopLicense].filter(Boolean).length;
    return { uploaded, total };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Vendor Onboarding</h1>
          <p className="text-neutral-600 mt-1">
            Review and approve pending vendor applications
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/vendors')}>
          View All Vendors
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Pending Review</p>
              <p className="text-2xl font-bold text-neutral-900">{pendingVendors.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Approved Today</p>
              <p className="text-2xl font-bold text-neutral-900">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-error-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Rejected Today</p>
              <p className="text-2xl font-bold text-neutral-900">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Applications */}
      {pendingVendors.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">All caught up!</h3>
          <p className="text-neutral-600">No pending vendor applications at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingVendors.map((vendor) => {
            const docStatus = getDocumentStatus(vendor);
            const isDocComplete = docStatus.uploaded === docStatus.total;

            return (
              <Card key={vendor.id} className="p-6">
                <div className="flex items-start gap-6">
                  {/* Vendor Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {vendor.businessName}
                        </h3>
                        <p className="text-sm text-neutral-600">{vendor.ownerName}</p>
                      </div>
                      <Badge variant="outline" className="bg-warning-50 text-warning-700 border-warning-200">
                        Pending Review
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{vendor.category}</p>
                          <p className="text-xs text-neutral-500">Category</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {vendor.serviceAreas.join(', ')}
                          </p>
                          <p className="text-xs text-neutral-500">Service Areas</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{vendor.phone}</p>
                          <p className="text-xs text-neutral-500">Contact</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{vendor.email}</p>
                          <p className="text-xs text-neutral-500">Email</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{vendor.gstNumber}</p>
                          <p className="text-xs text-neutral-500">GST Number</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {docStatus.uploaded}/{docStatus.total} Documents
                          </p>
                          <p className="text-xs text-neutral-500">KYC Verification</p>
                        </div>
                      </div>
                    </div>

                    {/* Document Checklist */}
                    <div className="pt-4 border-t border-neutral-200">
                      <p className="text-sm font-medium text-neutral-900 mb-2">Document Checklist:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'gstCertificate', label: 'GST Certificate' },
                          { key: 'panCard', label: 'PAN Card' },
                          { key: 'cancelledCheque', label: 'Cancelled Cheque' },
                          { key: 'shopLicense', label: 'Shop License' },
                        ].map((doc) => (
                          <div key={doc.key} className="flex items-center gap-2">
                            {vendor.kycDocuments[doc.key as keyof typeof vendor.kycDocuments] ? (
                              <CheckCircle className="w-4 h-4 text-success-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neutral-300" />
                            )}
                            <span className="text-sm text-neutral-700">{doc.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {vendor.notes && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{vendor.notes}</AlertDescription>
                      </Alert>
                    )}

                    {/* Applied Date */}
                    <p className="text-xs text-neutral-500">
                      Applied on {format(new Date(vendor.registeredDate), 'PPP')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 min-w-[160px]">
                    <Button
                      onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleAction(vendor, 'approve')}
                      className="w-full bg-success-600 hover:bg-success-700"
                      disabled={!isDocComplete}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(vendor, 'reject')}
                      variant="outline"
                      className="w-full text-error-600 hover:bg-error-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Approval/Rejection Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Vendor' : 'Reject Vendor'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve "${selectedVendor?.businessName}"? They will be able to start receiving orders.`
                : `Please provide a reason for rejecting "${selectedVendor?.businessName}".`}
            </DialogDescription>
          </DialogHeader>
          {actionType === 'reject' && (
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={
                actionType === 'approve'
                  ? 'bg-success-600 hover:bg-success-700'
                  : 'bg-error-600 hover:bg-error-700'
              }
              disabled={actionType === 'reject' && !rejectionReason.trim()}
            >
              {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}