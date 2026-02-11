/**
 * Admin Login Page
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Alert, AlertDescription } from '../../../../app/components/ui/alert';
import { AlertCircle, Lock, Mail, Shield } from 'lucide-react';
import { RealServWordmark } from '../../../../shared/components/RealServWordmark';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, quickLogin } = useAdminAuth();
  const hasAutoLoggedIn = useRef(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login for demo (only once on mount if param exists)
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam === 'superadmin' && !hasAutoLoggedIn.current) {
      hasAutoLoggedIn.current = true;
      const performQuickLogin = async () => {
        await quickLogin('admin@realserv.com');
        navigate('/admin/dashboard', { replace: true });
      };
      performQuickLogin();
    }
  }, [searchParams, quickLogin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = async (role: string) => {
    const emails = {
      superadmin: 'admin@realserv.com',
      operations: 'ops@realserv.com',
      support: 'support@realserv.com',
    };
    await quickLogin(emails[role as keyof typeof emails]);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <RealServWordmark className="h-12" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-error-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Admin Portal
            </h1>
          </div>
          <p className="text-neutral-600 text-sm">
            Operations Control Center
          </p>
        </div>

        {/* Login Form */}
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/auth/forgot-password')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-error-600 hover:bg-error-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-sm font-medium text-neutral-700 mb-3">
              Quick Demo Login:
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => handleQuickLogin('superadmin')}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Shield className="w-4 h-4 mr-2 text-error-600" />
                <span className="flex-1 text-left">Super Admin</span>
                <span className="text-xs text-neutral-500">Full Access</span>
              </Button>
              <Button
                onClick={() => handleQuickLogin('operations')}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Shield className="w-4 h-4 mr-2 text-primary-600" />
                <span className="flex-1 text-left">Operations</span>
                <span className="text-xs text-neutral-500">Vendor & Orders</span>
              </Button>
              <Button
                onClick={() => handleQuickLogin('support')}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Shield className="w-4 h-4 mr-2 text-warning-600" />
                <span className="flex-1 text-left">Support</span>
                <span className="text-xs text-neutral-500">Tickets & Help</span>
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