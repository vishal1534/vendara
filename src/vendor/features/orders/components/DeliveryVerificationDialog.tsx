import React, { useState } from 'react';
import { X, Upload, Camera, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface DeliveryVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (verificationType: 'otp' | 'image', data: string) => void;
  isVerifying: boolean;
  orderId: string;
}

type VerificationMethod = 'otp' | 'image';

export function DeliveryVerificationDialog({
  open,
  onOpenChange,
  onVerify,
  isVerifying,
  orderId,
}: DeliveryVerificationDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>('otp');
  const [otp, setOtp] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = () => {
    if (selectedMethod === 'otp') {
      if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
      onVerify('otp', otp);
    } else {
      if (!imageFile) {
        setError('Please upload an image');
        return;
      }
      // In real implementation, this would upload the image and get a URL
      // For now, we'll use the data URL
      onVerify('image', imagePreview || '');
    }
  };

  const handleClose = () => {
    if (!isVerifying) {
      setOtp('');
      setImageFile(null);
      setImagePreview(null);
      setError(null);
      onOpenChange(false);
    }
  };

  const isValid = selectedMethod === 'otp' 
    ? otp.length === 6 && /^\d{6}$/.test(otp)
    : imageFile !== null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Verify Delivery
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Order #{orderId}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isVerifying}
            className="text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Delivery Verification Required</p>
                {selectedMethod === 'otp' ? (
                  <p>
                    <strong>OTP Verification:</strong> If the buyer is present at the delivery site, collect their 6-digit OTP. This immediately marks the order as <strong>completed</strong> since the buyer is confirming delivery in person.
                  </p>
                ) : (
                  <p>
                    <strong>Image Verification:</strong> If the buyer is not present, upload a photo of the delivered materials. The order will be marked as <strong>delivered</strong> and will await buyer confirmation on their app.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-neutral-900">
              Select Verification Method
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedMethod('otp');
                  setError(null);
                }}
                disabled={isVerifying}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${selectedMethod === 'otp'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <div className="font-medium text-sm text-neutral-900 mb-1">
                  Buyer's OTP
                </div>
                <div className="text-xs text-neutral-600">
                  Ask buyer for 6-digit code
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedMethod('image');
                  setError(null);
                }}
                disabled={isVerifying}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${selectedMethod === 'image'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <div className="font-medium text-sm text-neutral-900 mb-1">
                  Image Proof
                </div>
                <div className="text-xs text-neutral-600">
                  Take photo of delivery
                </div>
              </button>
            </div>
          </div>

          {/* OTP Input */}
          {selectedMethod === 'otp' && (
            <div className="space-y-3">
              <Label htmlFor="otp" className="text-sm font-medium text-neutral-900">
                Enter Buyer's OTP
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError(null);
                }}
                className="h-12 text-center text-2xl tracking-widest"
                disabled={isVerifying}
                maxLength={6}
              />
              <p className="text-xs text-neutral-600">
                Ask the buyer to provide their 6-digit delivery confirmation OTP
              </p>
            </div>
          )}

          {/* Image Upload */}
          {selectedMethod === 'image' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-neutral-900">
                Upload Delivery Image
              </Label>
              
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border-2 border-neutral-200">
                    <img
                      src={imagePreview}
                      alt="Delivery proof"
                      className="w-full h-48 object-cover"
                    />
                    {!isVerifying && (
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-neutral-50"
                      >
                        <X className="w-4 h-4 text-neutral-600" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    disabled={isVerifying}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          Take Photo or Upload
                        </p>
                        <p className="text-xs text-neutral-600 mt-1">
                          Image of delivered materials (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              )}
              <p className="text-xs text-neutral-600">
                Take a clear photo showing the delivered materials at the buyer's site
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-neutral-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isVerifying}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !isValid}
            className="flex-1 bg-success-600 hover:bg-success-700 text-white"
          >
            {isVerifying 
              ? 'Verifying...' 
              : selectedMethod === 'otp' 
                ? 'Complete Order' 
                : 'Mark as Delivered'}
          </Button>
        </div>
      </div>
    </div>
  );
}