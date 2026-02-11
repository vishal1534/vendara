/**
 * Admin Reset Password Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Alert, AlertDescription } from '../../../../app/components/ui/alert';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Shield } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Validate token on mount
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setTokenError('Invalid or missing reset link. Please request a new password reset.');
    }

    // In production, validate token with API
    // For demo, we'll accept any token
  }, [searchParams]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push('At least 8 characters long');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('One lowercase letter');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      errors.push('One special character (!@#$%^&*)');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password strength
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError(`Password must contain: ${validationErrors.join(', ')}`);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, this would call your API to reset the password
    setIsSuccess(true);
    setIsLoading(false);
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-error-600 rounded-lg mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-neutral-600">
              This password reset link is invalid or has expired
            </p>
          </div>

          {/* Error Card */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/admin/auth/forgot-password')}
                className="w-full bg-error-600 hover:bg-error-700"
                size="lg"
              >
                Request New Reset Link
              </Button>

              <Button
                onClick={() => navigate('/admin/auth/login')}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
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
              Password Reset Successful
            </h1>
            <p className="text-neutral-600">
              Your password has been updated
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="text-center space-y-4">
              <Alert className="border-success-200 bg-success-50">
                <CheckCircle2 className="h-4 w-4 text-success-600" />
                <AlertDescription className="text-success-800">
                  Your password has been successfully reset. You can now sign in with your new password.
                </AlertDescription>
              </Alert>

              <div className="pt-4">
                <Button
                  onClick={() => navigate('/admin/auth/login')}
                  className="w-full bg-error-600 hover:bg-error-700"
                  size="lg"
                >
                  Continue to Login
                </Button>
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

  const passwordErrors = password ? validatePassword(password) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-error-600 rounded-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Reset Password
          </h1>
          <p className="text-neutral-600">
            Create a new password for your account
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
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-3 bg-neutral-50 rounded-lg">
              <p className="text-xs font-medium text-neutral-600 mb-2">
                Password must contain:
              </p>
              <ul className="space-y-1 text-xs text-neutral-500">
                {[
                  { label: 'At least 8 characters', valid: password.length >= 8 },
                  { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
                  { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
                  { label: 'One number', valid: /[0-9]/.test(password) },
                  { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(password) },
                ].map((req, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${
                      req.valid ? 'bg-success-100' : 'bg-neutral-200'
                    }`}>
                      {req.valid && (
                        <CheckCircle2 className="w-3 h-3 text-success-600" />
                      )}
                    </div>
                    <span className={req.valid ? 'text-success-700' : ''}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-error-600 hover:bg-error-700"
              size="lg"
              disabled={isLoading || passwordErrors.length > 0 || password !== confirmPassword}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/auth/login')}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Back to Login
              </button>
            </div>
          </form>
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
