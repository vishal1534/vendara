import { useVendorAuth } from '../../context/VendorAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../app/components/ui/dropdown-menu';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';
import { Building2, Check, ChevronDown } from 'lucide-react';

/**
 * VendorSelector Component
 * Allows users to switch between multiple vendor entities they manage
 * Shows in header - only interactive when user has multiple vendors
 */
export function VendorSelector() {
  const { vendor, availableVendors, switchVendor } = useVendorAuth();

  if (!vendor) return null;

  const hasMultipleVendors = availableVendors.length > 1;

  // Single vendor - just show name (no dropdown)
  if (!hasMultipleVendors) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            {vendor.businessName}
          </h1>
        </div>
      </div>
    );
  }

  // Multiple vendors - show dropdown selector
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto px-3 py-2 hover:bg-neutral-100 rounded-lg"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-lg font-semibold text-neutral-900">
              {vendor.businessName}
            </h1>
            <span className="text-xs text-neutral-500">
              {availableVendors.length} businesses
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-500 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-80">
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
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-primary-600' : 'bg-neutral-100'
              }`}>
                <Building2 className={`w-5 h-5 ${
                  isSelected ? 'text-white' : 'text-neutral-600'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900 truncate">
                    {v.businessName}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={v.isAvailable ? 'default' : 'secondary'}
                    className={`text-xs ${
                      v.isAvailable
                        ? 'bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {v.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                  
                  <span className="text-xs text-neutral-500">
                    {v.serviceAreas.length} areas
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
