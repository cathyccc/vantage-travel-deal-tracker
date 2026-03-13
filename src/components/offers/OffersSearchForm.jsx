"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'
import AirportSearch from '../search/AirportSearch';
import DatePicker from '../search/DatePicker';
import { FlightOffersSearchSchema } from '@/lib/schemas/flight-search';
import { format, isAfter, isBefore, startOfTomorrow, subDays, endOfDay, parseISO } from 'date-fns';

export default function OffersSearchForm() {  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState({});
  const [origin, setOrigin] = useState(searchParams.get('originLocationCode') ?? null);
  const [destination, setDestination] = useState(searchParams.get('destinationLocationCode') ?? null);
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 1);
  const [departureDate, setDepartureDate] = useState(searchParams.get('departureDate') ?? null);
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') ?? null);
  
  const minusAdult = () => {
    setAdults(prevAdults => prevAdults > 1 ? prevAdults-1 : 1);
  }

  const addAdult = () => {
    if (adults === 9) return setAdultError('Max adult passenger reached.')
    setAdults(prevAdults => prevAdults < 10 ? prevAdults+1 : 9);
  }

  const searchFlightOffers = (e) => {
    e.preventDefault();
    const result = FlightOffersSearchSchema.safeParse({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate,
      adults
    });

    if (!result.success){
      setErrors(result.error.flatten().fieldErrors)
      return;
    }

    setErrors({});
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate ?? '',
      returnDate: returnDate ?? '',
      adults,
    });
    router.push(`/?${params.toString()}`);
  }

  const departureDisabledDates = () => {
    if (!returnDate) return (date) => isBefore(date, startOfTomorrow());
    if (returnDate) return (date) => isBefore(date, startOfTomorrow()) || !isBefore(date, parseISO(returnDate));
  }

  const returnDisabledDates = () => {
    if (!departureDate) return (date) => isBefore(date, startOfTomorrow());
    if (departureDate) return (date) => !isAfter(date, parseISO(departureDate));
  }

  const handleDateChange = (field, selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    if (field === 'departureDate') return setDepartureDate(formattedDate);
    if (field === 'returnDate') return setReturnDate(formattedDate);
  }

  const handleSelectedAirportCode = (field, iataCode) => {
    if (field === 'originLocationCode') return setOrigin(iataCode);
    if (field === 'destinationLocationCode') return setDestination(iataCode);
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 md:p-8">
      <form onSubmit={searchFlightOffers}>
        <div className="pb-4">
          <AirportSearch label="Origin" field="originLocationCode" UrlValue={origin} handleSelectedAirportCode={handleSelectedAirportCode}/>
          {errors?.originLocationCode && <p className="text-red-400 text-xs pt-1">{errors?.originLocationCode[0]}</p>}
        </div>

        <div className="pb-4">
          <AirportSearch label="Destination" field="destinationLocationCode" UrlValue={destination} handleSelectedAirportCode={handleSelectedAirportCode}/>
          {errors?.destinationLocationCode && <p className="text-red-400 text-xs pt-1">{errors?.destinationLocationCode[0]}</p>}
        </div>

       <div className="pb-4">
          <DatePicker
            label="Departure"
            field="departureDate"
            UrlValue={departureDate}
            disabledDates={departureDisabledDates}
            handleDateChange={handleDateChange}
          />
          {errors?.departureDate && <p className="text-red-400 text-xs pt-1">{errors?.departureDate[0]}</p>}
        </div>

        <div className="pb-4">
          <DatePicker
            label="Return"
            field="returnDate"
            UrlValue={returnDate}
            disabledDates={returnDisabledDates}
            handleDateChange={handleDateChange}
          />
          {errors?.returnDate && <p className="text-red-400 text-xs pt-1">{errors?.returnDate[0]}</p>}
        </div>

       <div className="pb-4 flex justify-between items-center">
          <label htmlFor="adults" className="text-sm text-zinc-400">Adults</label>
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              disabled={adults <= 1}
              onClick={minusAdult}
              className="bg-zinc-800 text-zinc-100 rounded-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                -
            </Button>
            <input type="hidden" name="adults" value={adults} />
            {errors?.adults && <p className="text-red-400 text-xs pt-1">{errors?.adults[0]}</p>}
            <span className="inline-block w-12 text-center">{adults}</span>
            <Button
              type="button"
              disabled={adults >= 9}
              onClick={addAdult}
              className="bg-zinc-800 text-zinc-100 rounded-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                +
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-violet-600 text-sm tracking-wide hover:bg-violet-500"
        >
          SEARCH OFFERS
        </Button>
      </form>
    </div>
  )
}