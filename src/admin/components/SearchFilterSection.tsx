/**
 * SearchFilterSection Component
 * 
 * Standardized search + filter pattern for all list/table views
 * Follows Vendara Design Standards v1.0
 * 
 * @see /DESIGN_STANDARDS.md for full documentation
 */

import { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../app/components/ui/input';

interface ActiveFilter {
  type: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface SearchFilterSectionProps {
  // Search
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;

  // Filters (rendered as children for flexibility)
  children: ReactNode;

  // Active filters
  activeFilters: ActiveFilter[];
  onClearAll: () => void;
}

export function SearchFilterSection({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
  activeFilters,
  onClearAll,
}: SearchFilterSectionProps) {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* Section 1: Search Bar */}
      <div className="p-4 border-b border-neutral-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Section 2: Filter Toolbar */}
      <div className="px-4 py-3 bg-neutral-50">
        <div className="flex items-center gap-3 flex-wrap">
          {children}
        </div>
      </div>

      {/* Section 3: Active Filter Chips (only shown when filters active) */}
      {hasActiveFilters && (
        <div className="px-4 py-3 bg-primary-50/30 border-t border-primary-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-neutral-600">Active filters:</span>
            
            {activeFilters.map((filter, index) => (
              <button
                key={index}
                onClick={filter.onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
              >
                <span className="font-medium text-neutral-500">{filter.label}:</span>
                <span>{filter.value}</span>
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            ))}
            
            <button
              onClick={onClearAll}
              className="text-xs text-primary-700 hover:text-primary-800 font-medium underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
