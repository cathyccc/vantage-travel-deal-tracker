import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";

export default function DatePicker({label, field, disabledDates, handleDateChange}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();

  const formValue = date ? format(date, 'yyyy-MM-dd') : '';

  const onDateSelect = (newDate) => {
    setDate(newDate);
    handleDateChange(field, newDate);
    setOpen(false);
  }

  return (
    <div className="flex flex-col">
      <label htmlFor={field} className="text-sm text-zinc-400 block">
        {label}
      </label>
      <input type="hidden" name={field} value={formValue}/>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-zinc-900 text-zinc-100 mt-1 hover:bg-zinc-900 hover:text-zinc-100">
          <Button
            id={field}
            variant="outline"
            data-empty={!date}
            className="px-4 py-3 border border-zinc-800"
          >
            {date ? format(date, "PP") : <span className="text-zinc-500 text-sm">Select date</span>}
            <ChevronDownIcon className="text-zinc-500"/>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            onSelect={onDateSelect}
            defaultMonth={new Date()}
            disabled={disabledDates()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}