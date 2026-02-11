/**
 * QuickActionsCard Component
 * 
 * Provides quick access to common vendor actions
 * Follows industry best practices from Shopify, Amazon Seller Central, and Stripe
 */

import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
      <div className="border-b-2 border-neutral-200 px-6 py-4">
        <h2 className="font-semibold text-neutral-900">Quick Actions</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg border-2 border-neutral-200 hover:border-primary-300 transition-all text-left group"
            >
              <div
                className={`w-10 h-10 ${action.iconBgColor || 'bg-primary-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className={`w-5 h-5 ${action.iconColor || 'text-primary-700'}`} />
              </div>
              <p className="text-sm font-medium text-neutral-900 mb-0.5">
                {action.label}
              </p>
              <p className="text-xs text-neutral-500">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
