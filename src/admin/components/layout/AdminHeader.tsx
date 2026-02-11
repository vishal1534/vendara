/**
 * Admin Header Component
 * Top header with breadcrumbs and user menu
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../../app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../app/components/ui/dropdown-menu';
import { LogOut, Settings, User, ChevronRight, Home } from 'lucide-react';
import { AdminNotificationDropdown } from '../common/AdminNotificationDropdown';

export function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    // logout();
    navigate('/admin/login');
  };

  // Generate breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
  }));

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-neutral-500">Admin</span>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span
              className={
                index === breadcrumbs.length - 1
                  ? 'font-medium text-neutral-900'
                  : 'text-neutral-500'
              }
            >
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      {/* Right Side Actions */}
      {admin && (
        <div className="flex items-center gap-4">
          {/* Notification Dropdown */}
          <AdminNotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 bg-error-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-error-700">
                    {admin.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-neutral-900">{admin.name}</p>
                  <p className="text-xs text-neutral-500 capitalize">
                    {admin.role.replace('_', ' ')}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-xs text-neutral-500 font-normal">{admin.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Portal Selector
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-error-600">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}