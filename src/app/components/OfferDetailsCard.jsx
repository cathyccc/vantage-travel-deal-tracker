import FlightDetailsCard from './FlightDetailsCard'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { isNonStop,
         getLayoverInfo,
         getLocationName,
         getAirportName
 } from '@/lib/flightUtils';

export default function OfferDetailsCard({offer}) {
  const {itineraries} = offer;

  return ( 
    <DialogContent
      className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-purple-300 md:max-w-3xl"
      onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader className="text-left">
        <DialogTitle className="font-bold">Flight Details</DialogTitle>
        <DialogDescription asChild>
          {/* Scrollable Area */}
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">

            <div className="text-purple-200">Departure</div>
            <div className={`grid sm:grid-cols-1 ${isNonStop(itineraries[0].segments) ? 'md:grid-cols-1':'md:grid-cols-2'} gap-5`}>
              {
                itineraries[0].segments.map(s => {
                  return (
                    <FlightDetailsCard key={s.id} segment={s} itinerary={itineraries[0]} fareDetailsForFullTrip={offer.travelerPricings[0].fareDetailsBySegment}/>
                  )
                })
              }
              { !isNonStop(itineraries[0].segments) &&
                getLayoverInfo(itineraries[0].segments).map(layover => {
                  return <div key={layover.layoverLocationCode} className="col-span-full border-y-1 border-zinc-500 flex justify-between text-zinc-100 text-xs px-3 py-2 font-light">
                    <span>{layover.duration} in {getLocationName(layover.layoverLocationCode)}</span>
                    <span>Change planes in {getAirportName(layover.layoverLocationCode)}</span>
                  </div>
                })
              }
            </div>

            <div className="text-purple-200 mt-10">Return</div>
            <div className={`grid sm:grid-cols-1 ${isNonStop(itineraries[1].segments) ? 'md:grid-cols-1':'md:grid-cols-2'} gap-5`}>
              {
                itineraries[1].segments.map(s => {
                  return (
                    <FlightDetailsCard key={s.id} segment={s} itinerary={itineraries[1]} fareDetailsForFullTrip={offer.travelerPricings[0].fareDetailsBySegment}/>
                  )
                })
              }
              { !isNonStop(itineraries[1].segments) &&
                getLayoverInfo(itineraries[1].segments).map(layover => {
                  return <div key={layover.layoverLocationCode} className="col-span-full border-y-1 border-zinc-500 flex justify-between text-zinc-100 text-xs px-3 py-2 font-light">
                    <span>{layover.duration} in {getLocationName(layover.layoverLocationCode)}</span>
                    <span>Change planes in {getAirportName(layover.layoverLocationCode)}</span>
                  </div>
                })
              }
            </div>


            <DialogFooter>
              <Button className="mt-3 text-purple-400">Continue to Fare Details <ArrowRight/></Button>
            </DialogFooter>

          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}