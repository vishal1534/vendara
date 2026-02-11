/**
 * Admin First Login Setup Page
 * Forces new users to change their temporary password on first login
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Alert, AlertDescription } from '../../../../app/components/ui/alert';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Shield, UserCog } from 'lucide-react';

export function FirstLoginSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAdminAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get email from location state or current user
  const userEmail = location.state?.email || currentUser?.email || 'your account';

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

    // Validate current password
    if (!currentPassword) {
      setError('Please enter your current temporary password.');
      return;
    }

    // Validate new password is different
    if (currentPassword === newPassword) {
      setError('New password must be different from your temporary password.');
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    // Validate password strength
    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setError(`Password must contain: ${validationErrors.join(', ')}`);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, this would call your API to update the password
    // For demo, we'll just navigate to dashboard
    setIsLoading(false);
    navigate('/admin/dashboard');
  };

  const handleSkipForDemo = () => {
    // For demo purposes only - skip password setup
    navigate('/admin/dashboard');
  };

  const passwordErrors = newPassword ? validatePassword(newPassword) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning-600 rounded-lg mb-4">
            <UserCog className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            First Login Setup
          </h1>
          <p className="text-neutral-600">
            Please change your temporary password
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          {/* Important Notice */}
          <Alert className="mb-6 border-warning-200 bg-warning-50">
            <Shield className="h-4 w-4 text-warning-600" />
            <AlertDescription className="text-warning-800">
              <strong>Security Required:</strong> You must change your temporary password before accessing the admin portal.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Account Info */}
            <div className="p-3 bg-neutral-50 rounded-lg">
              <p className="text-xs font-medium text-neutral-600 mb-1">
                Account
              </p>
              <p className="text-sm text-neutral-900">{userEmail}</p>
            </div>

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Temporary Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter temporary password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
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
                  { label: 'At least 8 characters', valid: newPassword.length >= 8 },
                  { label: 'One uppercase letter', valid: /[A-Z]/.test(newPassword) },
                  { label: 'One lowercase letter', valid: /[a-z]/.test(newPassword) },
                  { label: 'One number', valid: /[0-9]/.test(newPassword) },
                  { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(newPassword) },
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
              disabled={isLoading || passwordErrors.length > 0 || newPassword !== confirmPassword}
            >
              {isLoading ? 'Updating Password...' : 'Set New Password & Continue'}
            </Button>
          </form>

          {/* Demo Skip Option */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="text-center">
              <button
                type="button"
                onClick={handleSkipForDemo}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Skip for Demo →
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-6 p-3 bg-neutral-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1 font-medium">
              Security Best Practices
            </p>
            <ul className="space-y-1 text-xs text-neutral-500 list-disc list-inside">
              <li>Never share your password</li>
              <li>Use a unique password for this portal</li>
              <li>Change your password regularly</li>
            </ul>
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
