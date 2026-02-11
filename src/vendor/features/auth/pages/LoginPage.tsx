import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { useVendorAuth } from '../../../context/VendorAuthContext';
import { Loader, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { RealServWordmark } from '../../../../shared/components/RealServWordmark';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useVendorAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-login if demo=true in URL
  useEffect(() => {
    const isDemo = searchParams.get('demo') === 'true';
    if (isDemo && !isLoading) {
      handleDemoLogin();
    }
  }, [searchParams]);

  const handleDemoLogin = async () => {
    const demoPhone = '9876543210';
    const demoOtp = '123456';
    
    setIsSubmitting(true);
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Auto login with demo credentials
    const result = await login(demoPhone, demoOtp);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Demo account logged in successfully!');
      navigate('/vendor/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number (Indian format)
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Simulate sending OTP
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    
    toast.success('OTP sent to +91 ' + phone);
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    const result = await login(phone, otp);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/vendor/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border-2 border-neutral-200 p-8 shadow-sm">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <RealServWordmark className="h-16" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 mb-2">
              Vendor Portal
            </h1>
            <p className="text-sm text-neutral-600">
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : 'Enter the OTP sent to +91 ' + phone}
            </p>
          </div>

          {/* Phone Number Step */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-neutral-700">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-12 h-12 text-base border-neutral-300 focus-visible:ring-primary-500"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium"
                disabled={isSubmitting || phone.length !== 10}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>

              {/* Demo Account Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-neutral-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400 text-neutral-700 font-medium"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
              >
                <Zap className="w-4 h-4 mr-2 text-secondary-600" />
                Try Demo Account
              </Button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-neutral-700">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-12 text-center text-2xl tracking-widest border-neutral-300 focus-visible:ring-primary-500"
                  disabled={isSubmitting || isLoading}
                  required
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium"
                  disabled={isSubmitting || isLoading || otp.length !== 6}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-10 text-neutral-600"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                  }}
                  disabled={isSubmitting || isLoading}
                >
                  Change phone number
                </Button>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={handlePhoneSubmit}
                  disabled={isSubmitting || isLoading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Portal Selector
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-500 mt-6">
          Vendara © 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
}