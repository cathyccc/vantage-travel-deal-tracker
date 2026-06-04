import { useState, useMemo, useRef } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from '@/components/ui/command';
import Fuse from "fuse.js";
import loyaltyProgramData from "../../lib/loyalty_programs.json";
import { createPortal } from 'react-dom';
import { useFormContext } from "react-hook-form";

type LoyaltyPrograms = {
  airline_iata_code: string;
  airline_name: string;
  loyalty_program_name: string;
}

const loyaltyPrograms = loyaltyProgramData as LoyaltyPrograms[];

const fuse = new Fuse(loyaltyPrograms, {
  keys: [{ name: "loyalty_program_name", weight: 1 }],
  threshold: 0.3
});

export default function LoyaltyProgramSearch({ path }: { path: string }) {
  const { register, setValue, getValues } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => {
    const initialValue = getValues(path);
    const program = loyaltyPrograms.find(p => p.airline_iata_code === initialValue);
    return program ? program.loyalty_program_name : "";
  });
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 5).map(result => result.item);
  }, [searchQuery]);

  const updateDropdownPosition = () => {
    const rect = inputWrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      updateDropdownPosition();
      setOpen(true);
    } else {
      setValue(path, '', { shouldValidate: true });
      setOpen(false);
    }
  }

  const handleSelect = ({ displayName, iataCode }: { displayName: string, iataCode: string }) => {
    setSearchQuery(displayName);
    setValue(path, iataCode, { shouldValidate: true });
    setOpen(false);
  }

  const loadLoyaltyProgramResults = () => {
    return results.map((loyaltyProgram) => {
      return (
        <CommandItem
          key={loyaltyProgram.airline_iata_code}
          value={loyaltyProgram.loyalty_program_name}
          onSelect={() => handleSelect({
            displayName: loyaltyProgram.loyalty_program_name, iataCode: loyaltyProgram.airline_iata_code
          })}
        >
          <span>{loyaltyProgram.loyalty_program_name}</span>
        </CommandItem>
      )
    })
  }

  return (
    <div className="relative">
      <label htmlFor="loyaltyProgram" className="block mb-1 font-medium text-xs text-gray-300 grid">Loyalty Program</label>
      <input type="hidden" {...register(path)} />
      <div ref={inputWrapperRef}>
        <Command className="bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl mt-1 overflow-visible" shouldFilter={false}>
          <div className="[&_div]:!border-b-0 [&_div]:!border-none">
            <CommandInput
              id="loyaltyProgram"
              aria-label="loyalty program search"
              value={searchQuery}
              onValueChange={handleSearch}
              placeholder="Search loyalty programs..."
            />
          </div>
          {open && createPortal(
            <div style={dropdownStyle} className="bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl">
              <CommandList>
                {results.length === 0 && <CommandEmpty>No matching loyalty programs found.</CommandEmpty>}
                {results.length > 0 && <CommandGroup className="text-zinc-500 px-2">{loadLoyaltyProgramResults()}</CommandGroup>}
              </CommandList>
            </div>,
            document.body
          )}
        </Command>
      </div>
    </div>
  )
}