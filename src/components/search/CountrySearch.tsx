"use client";
import Fuse from 'fuse.js';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { useFormContext } from 'react-hook-form';
import CountriesJSON from '@/lib/countries_cities.min.json';

const countriesArray = Object.keys(CountriesJSON);

export default function CountriesSearch({ path, value, onChange }: { path: string, value: string, onChange: (value: string) => void }) {
  const { setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => {
    return new Fuse(countriesArray, {
      threshold: 0.3
    })
  }, [])

  const results = query ? fuse.search(query).slice(0, 5).map(results => results.item) : countriesArray.slice(0, 5);

  const handleSelect = (country: string): void => {
    setValue(path, country, { shouldValidate: true });
    onChange(country);
    setQuery("");
    setOpen(false);
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Command className="bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-2xl mt-1 overflow-visible" shouldFilter={false}>
        <CommandInput
          placeholder="Search..."
          value={open ? query : (value || "")}
          onValueChange={(val) => {
            setQuery(val);
            setOpen(true);
          }}
        // className="border-none"
        />
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl animate-in fade-in-0 zoom-in-95">
            <CommandList>
              {results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
              {results.map((country) => (
                <CommandItem
                  key={country}
                  value={country}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => handleSelect(country)}
                >
                  {country}
                </CommandItem>
              ))}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}