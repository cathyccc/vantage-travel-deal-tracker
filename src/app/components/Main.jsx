"use client"

import { useState } from 'react';
import OffersSearchForm from './OffersSearchForm';
import FeaturedOffers from './FeaturedOffers';

export default function Main() {
  const [offers, setOffers] = useState([]);

   // QUERY FORMAT: 
  // {
  //   "originLocationCode": "YYZ", 
  //   "destinationLocationCode": "SFO", 
  //   "departureDate": "2026-10-21", 
  //   "adults": 1
  // }

  // const [loading, setLoading] = useState(false)

  const searchOffers = async (formData) => {
    const searchParams = {
      originLocationCode: formData.originLocationCode,
      destinationLocationCode: formData.destinationLocationCode,
      date: formData.departureDate,
      adults: formData.adults
    };

    const queryString = new URLSearchParams(searchParams).toString();

    try {
      const response = await fetch(`/api/flight-offers-search?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setOffers(data)
    } catch(error) {
      setError("Something went wrong. Please try again.");
      console.error("API Error:", error);
    }
  }

  return (
    <div className="grid md:grid-cols-4 p-8 text-white">
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <div className="text-3xl font-light mb-8">FIND BEST OFFERS</div>
        <OffersSearchForm searchOffers={searchOffers}/>
      </div>
      <FeaturedOffers offers={offers}/>
    </div>
  )
}