"use client"

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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
  const [childAges, setChildAges] = useState<number[]>(
    searchParams.get('childAges')?.split(',').map(Number) ?? []
  )
  const [infants, setInfants] = useState(Number(searchParams.get('infants')) || 0);
  const [infantAges, setInfantAges] = useState<number[]>(
    searchParams.get('infantAges')?.split(',').map(Number) ?? []
  )
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
      children,
      childAges,
      infants,
      infantAges
    });

    if (!result.success) {
      setErrors(prev => ({ ...prev, ...result.error.flatten().fieldErrors }));
      return;
    }

    setErrors({});
    const params = new URLSearchParams({
      originLocationCode: origin ?? '',
      destinationLocationCode: destination ?? '',
      departureDate: departureDate ?? '',
      returnDate: returnDate ?? '',
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
    });
    if (children > 0) params.set('childAges', childAges.join(','));
    if (infants > 0) params.set('infantAges', infantAges.join(','));
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

  const validatePassengers = (adultsVal: number, childrenVal: number, infantsVal: number) => {
    const totalPassengers = adultsVal + childrenVal + infantsVal;
    const infantsExceedAdults = infantsVal > adultsVal;
    if (totalPassengers > 9) {
      setErrors(prev => ({
        ...prev,
        adults: ["Total passengers cannot exceed 9"]
      }));
    } else {
      setErrors(prev => ({ ...prev, adults: [] }));
    }

    if (infantsExceedAdults) {
      setErrors(prev => ({
        ...prev,
        infants: ["Number of infants cannot exceed number of adults"]
      }));
    } else {
      setErrors(prev => ({ ...prev, infants: [] }));
    }
  }

  const handleAdultsCount = (num: number) => {
    setAdults(num);
    validatePassengers(num, children, infants);
  };

  const handleChildrenCount = (num: number) => {
    setChildren(num);
    validatePassengers(adults, num, infants);
    setChildAges(prev => {
      if (num > prev.length) {
        return Array.from({ length: num }, (_, i) => prev[i] ?? 2);
      }
      return prev.slice(0, num);
    })
  }

  const handleInfantsCount = (num: number) => {
    setInfants(num);
    validatePassengers(adults, children, num);
    setInfantAges(prev => {
      if (num > prev.length) {
        return Array.from({ length: num }, (_, i) => prev[i] ?? 0);
      }
      return prev.slice(0, num);
    })
  }

  const handleChildAgeChange = (index: number, age: number) => {
    setChildAges(prev => {
      const updated = [...prev];
      updated[index] = age;
      return updated;
    });
  }

  const handleInfantAgeChange = (index: number, age: number) => {
    setInfantAges(prev => {
      const updated = [...prev];
      updated[index] = age;
      return updated;
    });
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 md:p-8">
      <form onSubmit={searchFlightOffers}>
        <div className="pb-4">
          <AirportSearch label="Origin" field="originLocationCode" UrlValue={origin} handleSelectedAirportCode={handleSelectedAirportCode} />
          {errors?.originLocationCode && <p data-testid="origin-error" className="text-red-400 text-xs pt-1">{errors?.originLocationCode[0]}</p>}
        </div>

        <div className="pb-4">
          <AirportSearch label="Destination" field="destinationLocationCode" UrlValue={destination} handleSelectedAirportCode={handleSelectedAirportCode} />
          {errors?.destinationLocationCode && <p data-testid="destination-error" className="text-red-400 text-xs pt-1">{errors?.destinationLocationCode[0]}</p>}
        </div>

        <div className="pb-4">
          <DatePicker
            label="Departure"
            field="departureDate"
            UrlValue={departureDate}
            disabledDates={departureDisabledDates}
            handleDateChange={handleDateChange}
          />
          {errors?.departureDate && <p data-testid="departureDate-error" className="text-red-400 text-xs pt-1">{errors?.departureDate[0]}</p>}
        </div>

        <div className="pb-4">
          <DatePicker
            label="Return"
            field="returnDate"
            UrlValue={returnDate}
            disabledDates={returnDisabledDates}
            handleDateChange={handleDateChange}
          />
          {errors?.returnDate && <p data-testid="returnDate-error" className="text-red-400 text-xs pt-1">{errors?.returnDate[0]}</p>}
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
          {children > 0 && (
            <div className="mt-2 space-y-2">
              {Array.from({ length: children }, (_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <label className="text-xs text-zinc-300 ml-4">Child {i + 1} age</label>
                  <Select
                    value={childAges[i].toString()}
                    onValueChange={(value) => handleChildAgeChange(i, Number(value))}
                  >
                    <SelectTrigger className="bg-zinc-800 text-white rounded-sm text-sm w-32 border-none">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      align="end"
                      className="bg-zinc-800 text-zinc-100 rounded-sm text-sm border-zinc-500"
                    >
                      {Array.from({ length: 11 }, (_, i) => i + 2).map(age => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pb-4">
          <PassengerCounter
            label="Infants"
            field="infants"
            value={infants}
            adultCount={adults}
            onChange={handleInfantsCount}
            errors={errors}
          />
          {infants > 0 && (
            <div className="mt-2 space-y-2">
              {Array.from({ length: infants }, (_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <label className="text-xs text-zinc-300 ml-4">Infant {i + 1} age</label>
                  <Select
                    value={infantAges[i].toString()}
                    onValueChange={(value) => handleInfantAgeChange(i, Number(value))}
                  >
                    <SelectTrigger className="bg-zinc-800 text-white rounded-sm text-sm w-32 border-none">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      align="end"
                      className="bg-zinc-800 text-zinc-100 rounded-sm text-sm border-zinc-500"
                    >
                      {[0, 1].map(age => (
                        <SelectItem key={age} value={age.toString()}>
                          {age === 0 ? 'Under 1' : '1 year'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
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