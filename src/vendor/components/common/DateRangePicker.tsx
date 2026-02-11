import { useState, useRef, useEffect } from 'react';
import { Button } from '../../../app/components/ui/button';
import { Card, CardContent } from '../../../app/components/ui/card';
import { Calendar, X } from 'lucide-react';

export type DateRange = {
  from: Date;
  to: Date;
};

export type DateRangePreset = 'today' | 'last7days' | 'last30days' | 'last60days' | 'thisMonth' | 'lastMonth' | 'allTime' | 'custom';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
  className?: string;
}

export function DateRangePicker({ value, onChange, label = 'Date Range', className = '' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('last30days');
  const [customFrom, setCustomFrom] = useState(formatDateForInput(value.from));
  const [customTo, setCustomTo] = useState(formatDateForInput(value.to));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const presets: { id: DateRangePreset; label: string; range: () => DateRange }[] = [
    {
      id: 'today',
      label: 'Today',
      range: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        return { from: today, to: end };
      },
    },
    {
      id: 'last7days',
      label: 'Last 7 Days',
      range: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return { from: start, to: end };
      },
    },
    {
      id: 'last30days',
      label: 'Last 30 Days',
      range: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        return { from: start, to: end };
      },
    },
    {
      id: 'last60days',
      label: 'Last 60 Days',
      range: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 59);
        start.setHours(0, 0, 0, 0);
        return { from: start, to: end };
      },
    },
    {
      id: 'thisMonth',
      label: 'This Month',
      range: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        return { from: start, to: end };
      },
    },
    {
      id: 'lastMonth',
      label: 'Last Month',
      range: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        return { from: start, to: end };
      },
    },
    {
      id: 'allTime',
      label: 'All Time',
      range: () => {
        const start = new Date(2000, 0, 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { from: start, to: end };
      },
    },
  ];

  const handlePresetClick = (preset: DateRangePreset) => {
    const presetConfig = presets.find(p => p.id === preset);
    if (presetConfig) {
      const range = presetConfig.range();
      setSelectedPreset(preset);
      onChange(range);
      setIsOpen(false);
    }
  };

  const handleCustomApply = () => {
    const from = new Date(customFrom);
    from.setHours(0, 0, 0, 0);
    const to = new Date(customTo);
    to.setHours(23, 59, 59, 999);

    if (from > to) {
      alert('Start date must be before end date');
      return;
    }

    setSelectedPreset('custom');
    onChange({ from, to });
    setIsOpen(false);
  };

  const formatDisplayText = () => {
    if (selectedPreset === 'custom') {
      return `${formatDate(value.from)} - ${formatDate(value.to)}`;
    }
    const preset = presets.find(p => p.id === selectedPreset);
    return preset?.label || 'Select Date Range';
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset to last 30 days
    const preset = presets.find(p => p.id === 'last30days');
    if (preset) {
      const range = preset.range();
      setSelectedPreset('last30days');
      onChange(range);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[220px] h-10 flex items-center justify-between px-4 py-2.5 border-2 border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:border-primary-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <span>{formatDisplayText()}</span>
        </div>
        {selectedPreset !== 'last30days' && (
          <X
            className="w-4 h-4 text-neutral-400 hover:text-neutral-600"
            onClick={clearFilter}
          />
        )}
      </button>

      {isOpen && (
        <Card className="absolute z-50 mt-2 w-full min-w-[320px] border-2 border-primary-200 shadow-lg">
          <CardContent className="p-0">
            {/* Presets */}
            <div className="p-3 space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPreset === preset.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="border-t border-neutral-200" />

            {/* Custom Range */}
            <div className="p-3">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Custom Range</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
                  />
                </div>
                <Button
                  onClick={handleCustomApply}
                  size="sm"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white border-0"
                >
                  Apply Custom Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-IN', options);
}