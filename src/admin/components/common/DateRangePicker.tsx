/**
 * Date Range Picker Component
 * Select start and end dates for filtering
 */

import { useState } from 'react';
import { Calendar } from '../../../app/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../app/components/ui/popover';
import { Button } from '../../../app/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onSelect: (from: Date | undefined, to: Date | undefined) => void;
}

export function DateRangePicker({ from, to, onSelect }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? (
              <>
                {format(from, 'LLL dd, y')} - {format(to, 'LLL dd, y')}
              </>
            ) : (
              format(from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={(range) => {
            onSelect(range?.from, range?.to);
            if (range?.from && range?.to) {
              setIsOpen(false);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
