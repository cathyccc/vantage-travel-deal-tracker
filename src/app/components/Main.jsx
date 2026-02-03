"use client"

import { useState} from 'react';
import OffersSearchForm from './OffersSearchForm';
import FeaturedOffers from './FeaturedOffers';
import OfferResultsCard from './OfferResultsCard'
import { getFlightOffers } from '../actions/flight-search'

export default function Main() {
  const [offers, setOffers] = useState([]);

  const searchOffers = async (formData) => {
    const offerResults = await getFlightOffers(formData);
    setOffers(offerResults);
  }

  return (
    <div className="grid md:grid-cols-4 p-8 text-white lg:grid-cols-6">
      <div className="col-span-1 md:col-span-3 lg:col-span-2">
        <div className="text-3xl font-light mb-8">FIND BEST OFFERS</div>
        <OffersSearchForm searchOffers={searchOffers}/>
      </div>
      {/* <FeaturedOffers offers={offers}/> */}
      <div className="col-span-3 md:px-3 md:mt-5 lg:col-span-4">
        <div className="text-xl font-light mb-3">OFFERS FOR TORONTO TO TOKYO</div>
        <div className="grid md:grid-cols-2 gap-4">
          <OfferResultsCard/>
          <OfferResultsCard/>
          <OfferResultsCard/>
          <OfferResultsCard/>
        </div>
      </div>
    </div>
  )
}