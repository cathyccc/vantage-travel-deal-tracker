"use client";

import { useSearchParams } from 'next/navigation';
import CollapsibleSearch from "../search/CollapsibleSearch";
import FlightSummaryCard from '../flights/FlightSummaryCard';

export default function BookingView ({offer}) {
  const searchParams = useSearchParams();
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 p-8 text-white gap-5">
      <div className="col-span-1 md:col-span-2">
        <div className="text-3xl font-light mb-8">Offer for</div>
        <div className="bg-zinc-900 rounded-lg px-6 py-4 text-white max-w-[400px]">
          <CollapsibleSearch
            defaultValues={{ originLocationCode, destinationLocationCode, departureDate, returnDate, adults }}
            />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <h3>Flight Summary</h3>
        <FlightSummaryCard offer={offer}/>
      </div>

      <div className="col-span-1 md:col-span-2">
        <h3>Booking Details</h3>
      </div>
    </div>
  )
}