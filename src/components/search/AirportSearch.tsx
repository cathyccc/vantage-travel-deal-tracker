import { useState, useMemo, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from '@/components/ui/command';
import Fuse from "fuse.js";
import airportData from "../../lib/airports_feb2026.json";
import { Airport } from '../../lib/local.types'

type FieldTypes = 'originLocationCode' | 'destinationLocationCode'

type AirportSearchProps = {
  label: 'Origin' | 'Destination',
  field: FieldTypes,
  UrlValue: string | null,
  handleSelectedAirportCode: (field: FieldTypes, iataCode: string) => void
}

const airports = airportData as Airport[];

const formatDisplay = (airport: Airport) => `${airport.city} (${airport.iata} - ${airport.name}, ${airport.country})`

export default function AirportSearch({ label, field, UrlValue, handleSelectedAirportCode }: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (!UrlValue) return "";
    const airport = airports.find((a) => a.iata === UrlValue);
    return airport ? formatDisplay(airport) : UrlValue;
  });

  const fuse = useMemo(() => {
    return new Fuse(airports, {
      keys: [
        { name: "iata", weight: 1 },
        { name: "name", weight: 1 },
        { name: "city", weight: 2 }
      ],
      threshold: 0.3
    });
  }, []);

  useEffect(() => {
    if (!UrlValue) {
      setSearchQuery("");
      return;
    }

    const airport = airports.find(a => a.iata === UrlValue);
    const displayValue = airport ? formatDisplay(airport) : UrlValue;

    if (searchQuery !== displayValue) {
      setSearchQuery(displayValue);
    }
  }, [UrlValue]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 5).map(result => result.item);
  }, [searchQuery, fuse]);

  const handleSearch = (value: string): void => {
    if (value.length > 0) setOpen(true);
    setSearchQuery(value);

    if (value === '') {
      handleSelectedAirportCode(field, '');
      setOpen(false);
    }
  }

  const handleSelect = ({ displayName, iataCode }: { displayName: string, iataCode: string }): void => {
    handleSelectedAirportCode(field, iataCode);
    setOpen(false);
    setSearchQuery(displayName);
  }

  const loadAirportResults = () => {
    return results.map((airport) => {
      return (
        <CommandItem
          key={airport.iata}
          value={formatDisplay(airport)}
          onSelect={(e) => handleSelect({ displayName: e, iataCode: airport.iata })}
        >
          <span>{formatDisplay(airport)}</span>
        </CommandItem>
      )
    })
  }

  return (
    <div className="relative">
      <label htmlFor={field} className="text-sm text-zinc-400">{label}</label>
      <input type="hidden" name={field} value={UrlValue || ''} />
      <Command className="bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl mt-1 overflow-visible" shouldFilter={false}>
        <div className="[&_div]:!border-b-0 [&_div]:!border-none">
          <CommandInput
            id={field}
            aria-label={label}
            value={searchQuery}
            onValueChange={handleSearch}
            placeholder="Search airport or city..."
          />
        </div>
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl animate-in fade-in-0 zoom-in-95">
            <CommandList>
              {results.length === 0 && <CommandEmpty>No matching airports found.</CommandEmpty>}
              {results.length > 0 && <CommandGroup className="text-zinc-500 px-2">{loadAirportResults()}</CommandGroup>}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}