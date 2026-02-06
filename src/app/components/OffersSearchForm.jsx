import { useState } from 'react'
import { Button } from '@/components/ui/button'
import AirportSearch from './AirportSearch';
import DatePicker from './DatePicker';
import { isAfter, isBefore, startOfTomorrow, subDays, endOfDay } from 'date-fns';

export default function FlightSearchForm({searchOffers}) {
 const [adults, setAdults] = useState(1);
 const [departureDate, setDepartureDate] = useState('');
 const [returnDate, setReturnDate] = useState('');

  const minusAdult = () => {
    setAdults(prevAdults => prevAdults > 1 ? prevAdults-1 : 1);
  }

  const addAdult = () => {
    setAdults(prevAdults => prevAdults < 10 ? prevAdults+1 : 9);
  }

  const searchFlightOffers = formData => {
    searchOffers(formData);
  }

  const departureDisabledDates = () => {
    if (!returnDate) return (date) => isBefore(date, startOfTomorrow());
    if (returnDate) return (date) => isBefore(date, startOfTomorrow()) || isAfter(date, subDays(returnDate, 1));
  }

  const returnDisabledDates = () => {
    if (!departureDate) return (date) => isBefore(date, startOfTomorrow());
    if (departureDate) return (date) => isBefore(date, endOfDay(departureDate));
  }

  const handleDateChange = (field, selectedDate) => {
    if (field === 'departureDate') return setDepartureDate(selectedDate);
    if (field === 'returnDate') return setReturnDate(selectedDate);
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 md:p-8 shadow-2xl">
      <form action={searchFlightOffers}>
        <div className="pb-4">
          <AirportSearch label="Origin" field="originLocationCode"/>
        </div>

        <div className="pb-4">
          <AirportSearch label="Destination" field="destinationLocationCode"/>
        </div>

       <div className="pb-4">
          <DatePicker
            label="Departure"
            field="departureDate"
            disabledDates={departureDisabledDates}
            handleDateChange={handleDateChange}
          />
        </div>

        <div className="pb-4">
          <DatePicker
            label="Return"
            field="returnDate"
            disabledDates={returnDisabledDates}
            handleDateChange={handleDateChange}
          />
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