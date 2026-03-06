import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBaggageAllowanceInfo,
         parseISODuration,
         displayStops,
         fullFlightAmenities,
         getCarrierNames,
         displayDateDiff
 } from "@/lib/flightUtils";
import { format } from 'date-fns';
import { CircleCheck, X, ArrowLeft, Plane, HandCoins, Wifi, Plug } from "lucide-react";

export default function FareDetailsCard({handleViewChange, offer}) {
  const {conditions} = offer;
  const departureSliceCondition = offer.slices[0].conditions;
  const passengerBaggageAllowance = getBaggageAllowanceInfo(offer.slices[0].segments[0]);
  const isFlexible = Object.hasOwn(conditions, "refund_before_departure") ||
                     Object.hasOwn(conditions, "change_before_departure");
  const hasSeatOptions = departureSliceCondition?.advance_seat_selection
  const cabinClass = offer.slices[0].fare_brand_name;
  const amenitiesForFullFlight = fullFlightAmenities(offer.slices);

  return (
    <div className="px-4">
      <DialogHeader className="text-left mb-4">
        <DialogTitle className="font-bold text-sm">Fare Details</DialogTitle>
      </DialogHeader>

      <DialogDescription asChild>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 text-white">
          <div className="flex flex-row justify-between">
            <div>
              <div className="text-2xl font-medium">{`$${offer.base_amount}`}<span className="text-xs"> (tax excl.)</span></div>
              <div className="font-extralight">{`${offer.base_currency} $${(offer.base_amount/offer.passengers.length).toFixed(2)} roundtrip for 1 traveller`}</div>
            </div>
            <div className="flex flex-col justify-between text-right">
              <div className="font-extralight">{`Type: ${cabinClass}`}</div>
              <div className="font-normal">{`${format(offer.slices[0].segments[0].departing_at, 'EEE, MMM d')} - ${format(offer.slices[1].segments[0].departing_at, 'EEE, MMM d')}`}</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 items-start">
            <div>
              <div className="my-6">
                { hasSeatOptions && (
                  <>
                    <span className="font-bold">Seat</span>
                    {departureSliceCondition.advanced_seat_selection && <div>
                      <CircleCheck strokeWidth={2} size={16} className="text-purple-400 inline"/>
                      <span className="font-extralight text-xs pl-3">Seat choice included</span>
                    </div>}
                  </>
                )}
              </div>

              <div className="my-6">
                <span className="font-bold">Bags</span>
                <div className="pt-1">
                  <CircleCheck strokeWidth={2} size={16} className="text-purple-400 inline"/>
                  <span className="font-extralight text-xs pl-3">Personal item included</span>
                </div>
                {passengerBaggageAllowance.carry_on > 0 && <div className="pt-1">
                  <CircleCheck strokeWidth={2} size={16} className="text-purple-400 inline"/>
                  <span className="font-extralight text-xs pl-3">Carry-on bag included</span>
                </div>}
                {passengerBaggageAllowance.checked > 0 && <div className="pt-1">
                  <CircleCheck strokeWidth={2} size={16} className="text-purple-400 inline"/>
                  <span className="font-extralight text-xs pl-3">{`${passengerBaggageAllowance.checked} Checked bag(s) included`}</span>
                </div>}
              </div>
            </div>

            <div className="my-6">
              {isFlexible && (
                <>
                  <span className="font-bold">Flexibility</span>

                  {!conditions.refund_before_departure.allowed &&
                    <div className="pt-1">
                      <X strokeWidth={2.5} size={16} className="inline"/>
                      <span className="font-extralight text-xs pl-3">Non-refundable</span>
                    </div>}

                  {conditions.refund_before_departure.penalty_amount && 
                    <div className="pt-1">
                      <HandCoins strokeWidth={2} size={16} className="text-purple-400 inline"/>
                      <span className="font-extralight text-xs pl-3">Refundable, fees applies</span>
                    </div>}

                  {conditions.change_before_departure.allowed && 
                    <div className="pt-1">
                      <HandCoins strokeWidth={2} size={16} className="text-purple-400 inline"/>
                      <span className="font-extralight text-xs pl-3">Changeable, fees applies</span>
                    </div>}
                </>
              )}

              <div className="my-6">
                <span className="font-bold">Amenities</span>
                {amenitiesForFullFlight.freeWifi !== 'none' || amenitiesForFullFlight.paidWifi !== 'none' &&
                  <div className="pt-1">
                    <Wifi strokeWidth={2} size={16} className="text-purple-400 inline"/>
                    <span className="font-extralight text-xs pl-3">
                      {['full', 'partial'].includes(amenitiesForFullFlight.freeWifi) &&
                        `Free Wi-Fi available ${amenitiesForFullFlight.freeWifi === 'partial'? ' (partial)':''}`}
                      {['full', 'partial'].includes(amenitiesForFullFlight.paidWifi) &&
                        `Wi-Fi available, with fees ${amenitiesForFullFlight.paidWifi === 'partial'? ' (partial)':''}`}
                    </span>
                  </div>}
                {amenitiesForFullFlight.extraLegroom !== 'none' &&
                  <div className="pt-1">
                    <CircleCheck strokeWidth={2} size={16} className="text-purple-400 inline"/>
                    <span className="font-extralight text-xs pl-3">
                      {`Extra legroom${amenitiesForFullFlight.extraLegroom === 'partial' ? ' (partial)':''}`}
                    </span>
                  </div>}
                {amenitiesForFullFlight.power !== 'none' && <div className="pt-1">
                  <Plug strokeWidth={2} size={16} className="text-purple-400 inline"/>
                  <span className="font-extralight text-xs pl-3">
                    {`In-seat power${amenitiesForFullFlight.power === 'partial' ? ' (partial)':''}`}
                  </span>
                </div>}
              </div>
            </div>
          </div>
          
          <div className="mb-6 rounded-2xl bg-zinc-800 mx-15 py-5 px-7">
            <div className="text-xs text-purple-500 mb-1">Departure</div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <div className="text-xl tracking-light flex items-start">
                  {`${format(offer.slices[0].segments[0].departing_at, 'h:mm aaaa')} - ${format(offer.slices[0].segments[offer.slices[0].segments.length-1].arriving_at,'h:mm aaaa')}`}
                  <span className="text-xs text-rose-500 font-light tracking-wider pl-1 self-start">{displayDateDiff(offer.slices[0].segments[0])}</span>
                </div>
                <div className="font-light text-xs">{`(${parseISODuration(offer.slices[0].duration)}, ${displayStops(offer.slices[0].segments.length-1).toLowerCase()})`}</div>
              </div>
              <div className="text-end">
                <div className="font-semibold">{getCarrierNames(offer.slices[0])}</div>
                <div className="font-light text-xs">{format(offer.slices[0].segments[0].departing_at, 'EEE, MMM d')}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-800 mx-15 py-5 px-7">
            <div className="text-xs text-purple-500 mb-1">Return</div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <div className="text-xl tracking-light flex items-start">
                  {`${format(offer.slices[1].segments[0].departing_at, 'h:mm aaaa')} - ${format(offer.slices[1].segments[offer.slices[1].segments.length-1].arriving_at, 'h:mm aaaa')}`}
                  <span className="text-xs text-rose-500 font-light tracking-wider pl-1 self-start">{displayDateDiff(offer.slices[1].segments[0])}</span>
                </div>
                <div className="font-light text-xs">{`(${parseISODuration(offer.slices[1].duration)}, ${displayStops(offer.slices[1].segments.length-1).toLowerCase()})`}</div>
              </div>
              <div className="text-end">
                <div className="font-semibold">{getCarrierNames(offer.slices[1])}</div>
                <div className="font-light text-xs">{format(offer.slices[1].segments[0].departing_at, 'EEE, MMM d')}</div>
              </div>
            </div>
          </div>

        </div>
      </DialogDescription>

      <DialogFooter className="sm:justify-between">
        <Button onClick={()=>{handleViewChange()}} size="sm" variant="outline" className="text-xs font-light mt-3 text-white hover:text-white bg-zinc-800 hover:bg-zinc-700 border-1 border-zinc-600">
          <ArrowLeft size={14} strokeWidth={1.5} className="text-white inline"/>
          BACK TO FLIGHT DETAILS
        </Button>
        <Button variant="outline" size="sm" className="text-xs mt-3 tracking-tight text-white border-none hover:text-white bg-purple-600 hover:bg-purple-500">
          <Plane />{`SELECT FARE TO ${offer.slices[0].destination.city_name.toUpperCase()}`}
        </Button>
      </DialogFooter>
    </div>
  )
}