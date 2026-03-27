import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from "date-fns";

export default function DatePicker({label, field, disabledDates, UrlValue, handleDateChange}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(()=> {
    if (!UrlValue) return "";
    return typeof UrlValue === 'string' ? parseISO(UrlValue) : UrlValue;
  });

  useEffect(()=> {
    if (UrlValue) {
      const parsedDate = typeof UrlValue === 'string' ? parseISO(UrlValue) : UrlValue;
      setDate(parsedDate);
    } else {
      setDate("");
    }
  },[UrlValue])

  const onDateSelect = (newDate) => {
    const finalDate = newDate || ""; 
    setDate(finalDate);
    handleDateChange(field, newDate);
    setOpen(false);
  }

  const hiddenValue = date instanceof Date ? format(date, "yyyy-MM-dd") : "";

  const accessibleName = date ? `${label} date selected: ${format(date,"PPP")}` : `Select ${label} date` 

  return (
    <div className="flex flex-col">
      <label htmlFor={field} className="text-sm text-zinc-400 block">
        {label}
      </label>
      <input type="hidden" name={field} value={hiddenValue}/>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-zinc-900 text-zinc-100 mt-1 hover:bg-zinc-900 hover:text-zinc-100">
          <Button
            id={field}
            variant="outline"
            data-empty={!date}
            aria-label={accessibleName}
            className="px-4 py-3 border border-zinc-800"
          >
            {date ? format(date, "PP") : <span className="text-zinc-500 text-sm">Select date</span>}
            <ChevronDownIcon className="text-zinc-500"/>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            aria-label="calendar"
            onSelect={onDateSelect}
            defaultMonth={new Date()}
            disabled={disabledDates()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}