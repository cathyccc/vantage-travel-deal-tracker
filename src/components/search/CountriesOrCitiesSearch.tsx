"use client";
import Fuse from 'fuse.js';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { useFormContext } from 'react-hook-form';
import CountriesAndCitiesJSON from '@/lib/countries_cities.min.json';

const countriesArray = Object.keys(CountriesAndCitiesJSON);
const citiesArray = Object.values(CountriesAndCitiesJSON).flat();

interface CountryOrCityInput {
  searchTopic: "country" | "city",
  path: string, value: string,
  selectedCountry?: string,
  onChange: (value: string) => void
}

export default function CountriesOrCitiesSearch({ searchTopic, selectedCountry, path, value, onChange }: CountryOrCityInput) {
  const { setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const citiesForCountry = CountriesAndCitiesJSON[selectedCountry as keyof typeof CountriesAndCitiesJSON];
  const countryOrCitiesArray = searchTopic === "city"
    ? (selectedCountry ? citiesForCountry : citiesArray)
    : countriesArray;

  const fuse = useMemo(() => {
    return new Fuse(countryOrCitiesArray, {
      threshold: 0.3
    })
  }, [countryOrCitiesArray])

  const results = query ? fuse.search(query).slice(0, 5).map(results => results.item) : countriesArray.slice(0, 5);

  const handleSelect = (location: string): void => {
    setValue(path, location, { shouldValidate: true });
    onChange(location);
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
        />
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl animate-in fade-in-0 zoom-in-95">
            <CommandList>
              {results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
              {results.map((location) => (
                <CommandItem
                  key={location}
                  value={location}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => handleSelect(location)}
                >
                  {location}
                </CommandItem>
              ))}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}