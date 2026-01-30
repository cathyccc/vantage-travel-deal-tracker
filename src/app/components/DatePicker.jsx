import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";

export default function DatePicker({label, field, updateFormField}) {
  const [date, setDate] = useState();

  const onDateSelect = (newDate) => {
    const formatted = format(newDate, 'yyyy-LL-dd');
    setDate(formatted)
    updateFormField(field, date);
  }

  return (
    <div className="flex flex-col">
      <label className="text-sm text-zinc-400 block">
        {label}
      </label>
      <Popover >
        <PopoverTrigger asChild className="bg-zinc-900 text-zinc-100 mt-1 hover:bg-zinc-900 hover:text-zinc-100">
          <Button
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
            selected={date}
            onSelect={onDateSelect}
            defaultMonth={date}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}