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
         getLayoverInfo
 } from '@/lib/flightUtils';

export default function OfferDetailsCard({offer}) {
  const {slices} = offer;

  return ( 
    <DialogContent
      className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-fuchsia-300 md:max-w-3xl"
      onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader className="text-left">
        <DialogTitle className="font-bold">Flight Details</DialogTitle>
        <DialogDescription asChild>
          {/* Scrollable Area */}
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">

            <div className="text-purple-200">Departure</div>
            <div className={`grid sm:grid-cols-1 ${isNonStop(slices[0].segments) ? 'md:grid-cols-1':'md:grid-cols-2'} gap-5 flex items-stretch`}>
              {
                slices[0].segments.map(s => {
                  return (
                    <FlightDetailsCard key={s.id} segment={s}/>
                  )
                })
              }
              { !isNonStop(slices[0].segments) &&
                <div className="col-span-full border-y-1 border-zinc-500 text-zinc-100 text-xs mt-2 px-3 py-2 font-light">
                  { getLayoverInfo(slices[0].segments).map(layover => {
                      return (
                        <div key={layover.layoverLocationCode} className="flex justify-between">
                          <span>{layover.layoverDuration} in <span className="font-normal text-purple-300">{layover.layoverCityName}</span></span>
                          <span>Change planes in <span className="font-normal text-purple-300">{layover.layoverAirportName}</span></span>
                        </div>
                      )
                    })
                  }
                </div>
              }
            </div>

            <div className="text-purple-200 mt-10">Return</div>
            <div className={`grid sm:grid-cols-1 ${isNonStop(slices[1].segments) ? 'md:grid-cols-1':'md:grid-cols-2'} gap-5`}>
              {
                slices[1].segments.map(s => {
                  return (
                    <FlightDetailsCard key={s.id} segment={s}/>
                  )
                })
              }
              { !isNonStop(slices[1].segments) &&
                <div className="col-span-full border-y-1 border-zinc-500 text-zinc-100 text-xs mt-2 px-3 py-2 font-light">
                  { getLayoverInfo(slices[1].segments).map(layover => {
                      return (
                        <div key={layover.layoverLocationCode} className="flex justify-between">
                          <span>{layover.layoverDuration} in <span className="font-normal text-purple-300">{layover.layoverCityName}</span></span>
                          <span>Change planes in <span className="font-normal text-purple-300">{layover.layoverAirportName}</span></span>
                        </div>
                      )
                    })
                  }
                </div>
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