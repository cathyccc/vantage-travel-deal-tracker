import { useState, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command'

export default function AirportSearch({label, field}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    if (selectedValue) return;

    if (search.length < 2 ) {
      setAirports([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async() => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/airports?q=${encodeURIComponent(search)}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json();
        setOpen(true);
        setAirports(data);
      } catch(error) {
        console.error('Search error:', error)
        setOpen(false);
        setAirports([]);
      } finally {
        setIsLoading(false);
      }
    }, 300)

    return () => clearTimeout(timer)
  },[search, selectedValue])

  const handleChange = (value) => {
    // if (search.length === 0) setOpen(true);
    setSearch(value);
  }

  const handleSelect = ({value, code}) => {
    setSelectedValue(code);
    setOpen(false);
    setSearch(value);
    setAirports([]);
  }

  const loadAirportResults = () => {
    return airports.map((airport) => {
      return (
        <CommandItem
          key={airport.iata_code}
          value={`${airport.iata_code}, (${airport.name}), ${airport.city}, ${airport.country}`}
          onSelect={(e) => handleSelect({value: e, code: airport.iata_code})}
        >
        <span>{`${airport.iata_code}, (${airport.name}), ${airport.city}, ${airport.country}`}</span>
        </CommandItem>
      )
    }
    )
  }

  return (
    <div className="relative">
      <label htmlFor={field} className="text-sm text-zinc-400">{label}</label>
      <input type="hidden" name={field} value={selectedValue || ''} />
      <Command className="bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl mt-1 overflow-visible">
        <div className="[&_div]:!border-b-0 [&_div]:!border-none">
          <CommandInput
            id={field}
            value={search}
            onValueChange={handleChange}
            placeholder="Search airport or city..."
          />
        </div>
        {open && (
          <div className="absolute top-full left-0 w-full z-50 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
                {!isLoading && airports.length && loadAirportResults()}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}