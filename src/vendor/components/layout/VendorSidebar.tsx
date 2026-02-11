import { NavLink } from 'react-router-dom';
import { cn } from '../../../app/components/ui/utils';
import { useVendorSupport } from '../../context/VendorSupportContext';
import { useVendorNotifications } from '../../context/VendorNotificationsContext';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { Badge } from '../../../app/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  Wallet,
  TrendingUp,
  Box,
  Settings,
  HelpCircle,
  Bell,
  Building2,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../app/components/ui/dropdown-menu';
import { Button } from '../../../app/components/ui/button';

const navigation = [
  {
    name: 'Dashboard',
    href: '/vendor/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    href: '/vendor/orders',
    icon: Package,
  },
  {
    name: 'Catalog',
    href: '/vendor/catalog',
    icon: Box,
  },
  {
    name: 'Payouts',
    href: '/vendor/payouts',
    icon: Wallet,
  },
  {
    name: 'Performance',
    href: '/vendor/performance',
    icon: TrendingUp,
  },
  {
    name: 'Notifications',
    href: '/vendor/notifications',
    icon: Bell,
  },
  {
    name: 'Help & Support',
    href: '/vendor/support',
    icon: HelpCircle,
  },
  {
    name: 'Settings',
    href: '/vendor/settings',
    icon: Settings,
  },
];

export function VendorSidebar() {
  const { openTicketsCount } = useVendorSupport();
  const { unreadCount } = useVendorNotifications();
  const { vendor, availableVendors, switchVendor } = useVendorAuth();

  if (!vendor) return null;

  const hasMultipleVendors = availableVendors.length > 1;

  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-neutral-200 bg-white flex flex-col">
      {/* Business Selector */}
      <div className="h-16 px-4 border-b border-neutral-200 flex items-center">
        {hasMultipleVendors ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto hover:bg-neutral-100 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {vendor.businessName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {availableVendors.length} businesses
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" className="w-[232px]">
              <DropdownMenuLabel className="text-xs text-neutral-500 font-normal">
                Switch Business
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {availableVendors.map((v) => {
                const isSelected = v.id === vendor.id;
                
                return (
                  <DropdownMenuItem
                    key={v.id}
                    onClick={() => switchVendor(v.id)}
                    className="flex items-start gap-3 py-3 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary-600' : 'bg-neutral-100'
                    }`}>
                      <Building2 className={`w-5 h-5 ${
                        isSelected ? 'text-white' : 'text-neutral-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {v.businessName}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`text-xs ${
                            v.isAvailable
                              ? 'bg-[#22C55E]/10 text-[#22C55E]'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {v.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2 w-full">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {vendor.businessName}
              </p>
              <p className="text-xs text-neutral-500">Vendor Portal</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-neutral-500')} />
                  <span>{item.name}</span>
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <Badge className="ml-auto bg-error-600 text-white text-xs px-1.5 py-0 h-5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                  {item.name === 'Help & Support' && openTicketsCount > 0 && (
                    <Badge className="ml-auto bg-primary-600 text-white text-xs px-1.5 py-0 h-5">
                      {openTicketsCount}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          <p className="mb-1">Vendara Vendor Portal</p>
          <p>© 2026 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}