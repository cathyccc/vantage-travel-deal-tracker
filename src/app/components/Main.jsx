"use client"

import { useState } from 'react';
import OffersSearchForm from './OffersSearchForm';
import FeaturedOffers from './FeaturedOffers';
import OfferResultsCard from './OfferResultsCard';
import { getFlightOffers } from '../actions/flight-search';
import { extractUniqueAirlines,
         getLocationName,
         getDepartureTimeToDestination,
         getArrivalTimeToDestination,
         getLayoverInfo,
         parseISODuration } from '@/lib/flightUtils';

export default function Main() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState();

  let originLocationName = formData?.originLocationCode? getLocationName(formData.originLocationCode) : '';
  let destinationLocationName = formData?.destinationLocationCode? getLocationName(formData.destinationLocationCode) : '';

  const searchOffers = async (form) => {
    setIsLoading(true);
    setFormData(Object.fromEntries(form));

    try {
      const offerResults = await getFlightOffers(form);
      console.log(offerResults.data)
      setOffers(offerResults.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  }

  const listOfferCards = () => {
    return offers.map(offer => {
      const {itineraries} = offer;
      return (
        <OfferResultsCard
          key={offer.id}
          id={offer.id}
          duration={parseISODuration(itineraries[0].duration)}
          layoverInfo={getLayoverInfo(itineraries[0].segments)}
          carriers={extractUniqueAirlines(itineraries)}
          departureTime={getDepartureTimeToDestination(itineraries, formData)}
          arrivalTime={getArrivalTimeToDestination(itineraries, formData)}
          departureLocation={originLocationName}
          arrivalLocation={destinationLocationName}
          price={offer.price.grandTotal}
          checkedBagsQuantity={offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity}
        />
      )
    })
  }

  return (
    <div className="grid md:grid-cols-4 p-8 text-white lg:grid-cols-6">
      <div className="col-span-1 md:col-span-3 lg:col-span-2">
        <div className="text-3xl font-light mb-8">FIND BEST OFFERS</div>
        <OffersSearchForm searchOffers={searchOffers}/>
      </div>
      {/* <FeaturedOffers offers={offers}/> */}
      <div className="col-span-3 md:px-3 md:mt-5 lg:col-span-4">
        {!isLoading && offers.length > 0 && (
          <>
            <div className="text-xl font-light mb-3">OFFERS FOR {originLocationName.toUpperCase()} TO {destinationLocationName.toUpperCase()}</div>
            <div className="grid md:grid-cols-2 gap-4">
              {listOfferCards()}
            </div>
          </>
        )}
        {!isLoading && offers.length === 0 && formData && (
          <div className="text-center py-8">No offers found</div>
        )}
      </div>
    </div>
  )
}