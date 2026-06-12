"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "sonner"
import OffersSearchForm from '../search/OffersSearchForm';
import FeaturedOffers from './FeaturedOffers';
import OfferResultsCard from './OfferResultsCard';
import { getFlightOffers } from '../../app/actions/flight-search';
import { getLocationName } from '@/lib/flightUtils';
import LoadingImg from '../../../public/loading-people.svg';
import { useSearchParams } from 'next/navigation';

export default function OffersView() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState();

  const searchParams = useSearchParams();

  useEffect(() => {
    const originLocationCode = searchParams.get('originLocationCode');
    const destinationLocationCode = searchParams.get('destinationLocationCode');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = parseInt(searchParams.get('adults') || "1");
    const children = parseInt(searchParams.get('children')|| "0");
    const infants = parseInt(searchParams.get('infants') || "0");
    const parseAges = (param) => {
      if (!param) return [];
      return param.split(',').map(Number).filter(n => !isNaN(n));  // don't filter 0
    };
    const childAges = parseAges(searchParams.get('childAges'));
    const infantAges = parseAges(searchParams.get('infantAges')?.split(','));

    if (originLocationCode && destinationLocationCode && departureDate && adults) {
      setFormData({ originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children, childAges, infantAges, infants });

      const performSearch = async () => {
        setIsLoading(true);
        setErrors(null);
        setOffers([]);

        try {
          const offerResults = await getFlightOffers({
            originLocationCode,
            destinationLocationCode,
            departureDate,
            returnDate,
            adults,
            children,
            childAges,
            infants,
            infantAges
          });

          if (offerResults.errors) {
            setErrors(offerResults.errors);
            if (offerResults.errors?.root) {
              toast.warning(offerResults.errors.root)
            }
          }
          setOffers(offerResults.data.offers);
        } catch (err) {
          console.error("Search failed:", err);
          setErrors(err.message || "Something went wrong fetching flights.");
          setOffers([]);
        } finally {
          setIsLoading(false);
        }
      };
      performSearch();
    } else {
      setOffers([]);
      setFormData(null);
      setErrors(null);
    }
  }, [searchParams]);

  const listOfferCards = () => {
    return offers.map(offer => <OfferResultsCard key={offer.id} offer={offer}/>)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 p-8 text-white lg:grid-cols-6">
        <div className="col-span-1 md:col-span-3 lg:col-span-2">
          <div className="text-3xl font-light mb-8">FIND BEST OFFERS</div>
          <OffersSearchForm/>
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