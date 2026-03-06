"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "sonner"
import OffersSearchForm from './OffersSearchForm';
import FeaturedOffers from './FeaturedOffers';
import OfferResultsCard from './OfferResultsCard';
import { getFlightOffers } from '../../app/actions/flight-search';
import { getLocationName } from '@/lib/flightUtils';
import LoadingImg from '../../../public/loading-people.svg';

export default function Main() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState()

  const searchOffers = async (form) => {
    setIsLoading(true);
    setOffers([]);

    const formObj = Object.fromEntries(form);
    setFormData(formObj);

    // temporary delay to test loading state - remove later
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const offerResults = await getFlightOffers(form);
      if (offerResults.errors) {
        setErrors(offerResults.errors);
        if (offerResults.errors?.root) {
          toast.warning(offerResults.errors.root);
        }
        setIsLoading(false)
        return
      }
      setOffers(offerResults.data.offers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
      setIsLoading(false);
    }
  }

  const listOfferCards = () => {
    return offers.map(offer => <OfferResultsCard key={offer.id} offer={offer}/>)
  }

  return (
    <>
      <div className="grid md:grid-cols-4 p-8 text-white lg:grid-cols-6">
        <div className="col-span-1 md:col-span-3 lg:col-span-2">
          <div className="text-3xl font-light mb-8">FIND BEST OFFERS</div>
          <OffersSearchForm searchOffers={searchOffers} errors={errors}/>
        </div>
        {/* <FeaturedOffers offers={offers}/> */}
        <div className="col-span-3 md:px-3 md:mt-5 lg:col-span-4">
          {isLoading && (
            <div className="flex items-center flex-col mt-24">
              <div className="flex items-center"><Spinner className="mr-2"/>Looking out for flexible ticket options ...</div>
              <Image className="w-xs p-8" src={LoadingImg} alt="travellers"/>
            </div>
          )}
          {!isLoading && offers?.length > 0 && (
            <>
              <div className="text-xl font-light mb-3">OFFERS FOR {getLocationName(formData?.originLocationCode).toUpperCase()} TO {getLocationName(formData?.destinationLocationCode).toUpperCase()}</div>
              <div className="grid md:grid-cols-2 gap-4">
                {listOfferCards()}
              </div>
            </>
          )}
          {!isLoading && offers?.length === 0 && formData && (
            <div className="text-center py-8">No offers found</div>
          )}
        </div>
      </div>
    </>
  )
}