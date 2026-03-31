"use client"

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'
import AirportSearch from './AirportSearch';
import DatePicker from './DatePicker';
import PassengerCounter from './PassengerCounter';
import { FlightOffersSearchSchema } from '@/lib/schemas/flight-search';
import { format, isAfter, isBefore, startOfTomorrow, parseISO } from 'date-fns';

type AirportFields = "originLocationCode" | "destinationLocationCode"
type DateFields = "departureDate" | "returnDate"
type FormFields = AirportFields | DateFields | "adults" | "children"
type FormErrors = Partial<Record<FormFields, string[]>>

export default function OffersSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<FormErrors>({});
  const [origin, setOrigin] = useState<string | null>(searchParams.get('originLocationCode') ?? null);
  const [destination, setDestination] = useState<string | null>(searchParams.get('destinationLocationCode') ?? null);
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 1);
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
  const [departureDate, setDepartureDate] = useState<string | undefined>(searchParams.get('departureDate') ?? undefined);
  const [returnDate, setReturnDate] = useState<string | undefined>(searchParams.get('returnDate') ?? undefined);

  const searchFlightOffers = (e: FormEvent) => {
    e.preventDefault();
    const result = FlightOffersSearchSchema.safeParse({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate,
      adults,
      children
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return;
    }

    setErrors({});
    const params = new URLSearchParams({
      originLocationCode: origin ?? '',
      destinationLocationCode: destination ?? '',
      departureDate: departureDate ?? '',
      returnDate: returnDate ?? '',
      adults: adults.toString(),
      children: children.toString()
    });
    router.push(`/?${params.toString()}`);
  }

  const departureDisabledDates = (date: Date): boolean => {
    const isPast: boolean = isBefore(date, startOfTomorrow());
    if (!returnDate) return isPast;
    return isPast || !isBefore(date, parseISO(returnDate));
  }

  const returnDisabledDates = (date: Date): boolean => {
    const isPast: boolean = isBefore(date, startOfTomorrow());
    if (!departureDate) return isPast;
    return isPast || !isAfter(date, parseISO(departureDate));
  }

  const handleDateChange = (field: DateFields, selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    if (field === 'departureDate') return setDepartureDate(formattedDate);
    if (field === 'returnDate') return setReturnDate(formattedDate);
  }

  const handleSelectedAirportCode = (field: AirportFields, iataCode: string) => {
    const otherField = field === 'originLocationCode' ? destination : origin;
    if (otherField === iataCode) {
      setErrors(prev => ({
        ...prev,
        [field]: ["Origin and destination cannot be the same"]
      }));
    } else {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
    if (field === 'originLocationCode') setOrigin(iataCode);
    else setDestination(iataCode);
  }

  const handleAdultsCount = (num: number) => setAdults(num);
  const handleChildrenCount = (num: number) => setChildren(num);

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 md:p-8">
      <form onSubmit={searchFlightOffers}>
        <div className="pb-4">
          <AirportSearch label="Origin" field="originLocationCode" UrlValue={origin} handleSelectedAirportCode={handleSelectedAirportCode} />
          {errors?.originLocationCode && <p className="text-red-400 text-xs pt-1">{errors?.originLocationCode[0]}</p>}
        </div>

        <div className="pb-4">
          <AirportSearch label="Destination" field="destinationLocationCode" UrlValue={destination} handleSelectedAirportCode={handleSelectedAirportCode} />
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
            errors={errors}
          />
        </div>

        <div className="pb-4">
          <PassengerCounter
            label="Children"
            field="children"
            value={children}
            onChange={handleChildrenCount}
            errors={errors}
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