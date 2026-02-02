"use client"

import { useState } from 'react';
import OffersSearchForm from './OffersSearchForm';
import FeaturedOffers from './FeaturedOffers';
import { getFlightOffers } from '../actions/flight-search'

export default function Main() {
  const [offers, setOffers] = useState([]);

  const searchOffers = async (formData) => {
    const offerResults = await getFlightOffers(formData);
    setOffers(offerResults);
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