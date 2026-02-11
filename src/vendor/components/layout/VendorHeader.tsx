import { useVendorAuth } from '../../context/VendorAuthContext';
import { Button } from '../../../app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../app/components/ui/dropdown-menu';
import { Badge } from '../../../app/components/ui/badge';
import { Switch } from '../../../app/components/ui/switch';
import { User, LogOut, Settings, Power, Home, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { RealServWordmark } from '../../../shared/components/RealServWordmark';

interface VendorHeaderProps {
  onAcceptOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
}

export function VendorHeader({ onAcceptOrder, onRejectOrder }: VendorHeaderProps) {
  const { vendor, logout, toggleAvailability } = useVendorAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/vendor/login');
  };

  if (!vendor) return null;

  // Generate breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
  }));

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
      {/* Left: Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center">
          <RealServWordmark className="h-8 w-auto" />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-neutral-200" />

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-neutral-400" />}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'font-semibold text-neutral-900'
                    : 'text-neutral-500'
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Availability, Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Availability Toggle */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50">
          <span className="text-xs font-medium text-neutral-600">
            Status
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                vendor.isAvailable ? 'text-[#22C55E]' : 'text-neutral-500'
              }`}
            >
              {vendor.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <Switch
              checked={vendor.isAvailable}
              onCheckedChange={toggleAvailability}
              style={{
                backgroundColor: vendor.isAvailable ? '#22C55E' : undefined
              }}
            />
          </div>
        </div>

        {/* Notification Bell */}
        <NotificationDropdown onAcceptOrder={onAcceptOrder} onRejectOrder={onRejectOrder} />

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-10 px-3 hover:bg-neutral-100"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-700" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-neutral-900">{vendor.ownerName}</p>
                <p className="text-xs text-neutral-500">Vendor</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{vendor.ownerName}</span>
                <span className="text-xs text-neutral-500 font-normal">{vendor.phone}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/vendor/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleAvailability}>
              <Power className="w-4 h-4 mr-2" />
              Toggle Availability
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Portal Selector
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-error-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}