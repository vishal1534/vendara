/**
 * Admin Forgot Password Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Alert, AlertDescription } from '../../../../app/components/ui/alert';
import { AlertCircle, ArrowLeft, CheckCircle2, Mail, Shield } from 'lucide-react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation - in production, this would call your API
    const validEmails = [
      'admin@realserv.com',
      'ops@realserv.com',
      'support@realserv.com'
    ];

    if (validEmails.includes(email)) {
      setIsSuccess(true);
    } else {
      setError('No account found with this email address.');
    }
    
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-600 rounded-lg mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-neutral-600">
              Password reset instructions sent
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="text-center space-y-4">
              <Alert className="border-success-200 bg-success-50">
                <CheckCircle2 className="h-4 w-4 text-success-600" />
                <AlertDescription className="text-success-800">
                  We've sent password reset instructions to <strong>{email}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-2 text-sm text-neutral-600 text-left">
                <p className="font-medium text-neutral-900">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Check your email inbox</li>
                  <li>Click the password reset link</li>
                  <li>Create a new password</li>
                  <li>Sign in with your new password</li>
                </ol>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => navigate('/admin/auth/login')}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>

              {/* Resend Link */}
              <div className="pt-2">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Didn't receive the email? Resend
                </button>
              </div>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-3 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 mb-1 font-medium">
                Demo Mode
              </p>
              <p className="text-xs text-neutral-500">
                In production, a real email would be sent with a secure reset link.
              </p>
            </div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-error-600 rounded-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-neutral-600">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@realserv.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <p className="text-xs text-neutral-500">
                We'll send password reset instructions to this email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-error-600 hover:bg-error-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/auth/login')}
                className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </button>
            </div>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-neutral-50 rounded-lg">
            <p className="text-xs font-medium text-neutral-600 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-neutral-500">
              <p>• admin@realserv.com</p>
              <p>• ops@realserv.com</p>
              <p>• support@realserv.com</p>
            </div>
          </div>
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
      </div>
    </div>
  );
}
