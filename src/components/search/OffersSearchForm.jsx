"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'
import AirportSearch from '../search/AirportSearch';
import DatePicker from '../search/DatePicker';
import PassengerCounter from '../search/PassengerCounter';
import { FlightOffersSearchSchema } from '@/lib/schemas/flight-search';
import { format, isAfter, isBefore, startOfTomorrow, parseISO } from 'date-fns';

export default function OffersSearchForm() {  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState({});
  const [origin, setOrigin] = useState(searchParams.get('originLocationCode') ?? null);
  const [destination, setDestination] = useState(searchParams.get('destinationLocationCode') ?? null);
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 1);
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
  const [departureDate, setDepartureDate] = useState(searchParams.get('departureDate') ?? null);
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') ?? null);

  const searchFlightOffers = (e) => {
    e.preventDefault();
    const result = FlightOffersSearchSchema.safeParse({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate,
      adults,
      children
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
      children
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
    if (field === 'originLocationCode') {
      if (destination !== null && destination === iataCode){
        setOrigin(iataCode);
        return setErrors({...errors, originLocationCode: ["Origin and destination cannot be the same"]})
      }
      setErrors({...errors, originLocationCode: null});
      return setOrigin(iataCode);
    }
    if (field === 'destinationLocationCode') {
      if (origin !== null && origin === iataCode){
        setDestination(iataCode);
        return setErrors({...errors, destinationLocationCode: ["Origin and destination cannot be the same"]})
      }
      setErrors({...errors, destinationLocationCode: null});
      return setDestination(iataCode);
    }
  }

  const handleAdultsCount = (num) => setAdults(num);
  const handleChildrenCount = (num) => setChildren(num);

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

        <div className="pb-4">
          <PassengerCounter
            label="Adults"
            field="adults"
            value={adults}
            onChange={handleAdultsCount}
            errors
          />
        </div>

        <div className="pb-4">
          <PassengerCounter
            label="Children"
            field="children"
            value={children}
            onChange={handleChildrenCount}
            errors
          />
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