/**
 * Admin Sidebar Component
 * Navigation sidebar with role-based menu items
 */

import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { RealServLogo } from '../../../shared/components/RealServLogo';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  UserCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Briefcase,
  CreditCard,
  MessageSquare,
  Activity,
  Truck,
} from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import React from 'react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: AdminRole[];
  separator?: boolean; // Add visual separator after this item
}

const navItems: NavItem[] = [
  // CORE OPERATIONS
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin/dashboard',
    roles: ['super_admin', 'operations', 'support'],
  },
  {
    label: 'Orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    path: '/admin/orders',
    roles: ['super_admin', 'operations', 'support'],
  },
  {
    label: 'Support',
    icon: <MessageSquare className="w-5 h-5" />,
    path: '/admin/support',
    roles: ['super_admin', 'operations', 'support'],
    separator: true, // Add separator after Support
  },
  
  // PEOPLE MANAGEMENT
  {
    label: 'Vendors',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/vendors',
    roles: ['super_admin', 'operations', 'support'],
  },
  {
    label: 'Buyers',
    icon: <UserCircle className="w-5 h-5" />,
    path: '/admin/buyers',
    roles: ['super_admin', 'operations', 'support'],
    separator: true, // Add separator after Buyers
  },
  
  // CATALOG
  {
    label: 'Materials',
    icon: <Layers className="w-5 h-5" />,
    path: '/admin/catalog/materials',
    roles: ['super_admin', 'operations'],
  },
  {
    label: 'Labor Services',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/admin/catalog/labor',
    roles: ['super_admin', 'operations'],
    separator: true, // Add separator after Labor Services
  },
  
  // LOGISTICS
  {
    label: 'Delivery Zones',
    icon: <Truck className="w-5 h-5" />,
    path: '/admin/delivery/zones',
    roles: ['super_admin', 'operations'],
    separator: true, // Add separator after Delivery Zones
  },
  
  // FINANCIAL
  {
    label: 'Settlements',
    icon: <CreditCard className="w-5 h-5" />,
    path: '/admin/settlements',
    roles: ['super_admin', 'operations'],
    separator: true, // Add separator after Settlements
  },
  
  // INSIGHTS
  {
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/admin/analytics',
    roles: ['super_admin', 'operations'],
    separator: true, // Add separator after Analytics
  },
  
  // SYSTEM (Admin only)
  {
    label: 'System Logs',
    icon: <Activity className="w-5 h-5" />,
    path: '/admin/logs',
    roles: ['super_admin'],
  },
  {
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin/settings',
    roles: ['super_admin'],
  },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { admin } = useAdminAuth();

  const filteredNavItems = navItems.filter(item =>
    admin && item.roles.includes(admin.role)
  );

  return (
    <aside
      className={`sticky top-0 h-screen bg-white border-r border-neutral-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <RealServLogo className="h-10 w-10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-error-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">Admin</span>
            </div>
          </div>
        ) : (
          <RealServLogo className="h-10 w-10 mx-auto" />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.flatMap((item) => {
            const elements = [
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-error-50 text-error-700'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ];
            
            if (item.separator && !collapsed) {
              elements.push(
                <li key={`${item.path}-separator`} className="list-none">
                  <div className="h-px bg-neutral-200 my-2 mx-1"></div>
                </li>
              );
            }
            
            return elements;
          })}
        </ul>
      </nav>

      {/* User Info */}
      {admin && !collapsed && (
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-error-700">
                {admin.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {admin.name}
              </p>
              <p className="text-xs text-neutral-500 capitalize">
                {admin.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}