import { getAirlineName,
         getAirportName,
         getLocationName,
         getAircraftName,
         parseISODuration,
         getTimezoneAbbr, 
         getFareDetailsForSegment} from "@/lib/flightUtils";
import { format } from 'date-fns';

export default function FlightDetailsCard({ segment, fareDetailsForFullTrip }) {
  const displayGateNum = (char) => {
    return !isNaN(char) ? `Terminal ${char}`: `Concourse ${char}` 
  }

  const segmentDetails = getFareDetailsForSegment(segment.id, fareDetailsForFullTrip);
  const displayCheckedBagsQuantity = () => {
    const quantity = segmentDetails.includedCheckedBags.quantity;
    return quantity === 0 ? 'No' : quantity;
  }

  return (
    <div>
      <div className="bg-zinc-800 rounded-lg px-6 py-3 mt-3">
        <div className="text-zinc-200 text-xs">
          {getAirlineName(segment.carrierCode)} – {segment.carrierCode} {segment.number}
        </div>

        <div className="flex flex-row justify-between">
          <div className="relative flex flex-col items-center justify-evenly py-2 ml-4 mr-3 max-w-45">
            <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-0 -translate-x-4 mt-5 mb-12"></div>
            <div className="flex flex-col justify-between">
              <div>
                <span className="block text-lg/5 text-zinc-200 ">{getLocationName(segment.departure.iataCode)}</span>
                <span className="block font-light text-xs text-zinc-200">{`${getAirportName(segment.departure.iataCode)} (${segment.departure.iataCode})`}</span>
                <span className="block font-light text-xs text-zinc-200">{displayGateNum(segment.departure.terminal)}</span>
              </div>
              <div className="my-4">
                <span className="block text-xs text-purple-300">Travel time: {parseISODuration(segment.duration)}</span>
              </div>
              <div>
                <span className="block text-lg/5 text-zinc-200">{getLocationName(segment.arrival.iataCode)}</span>
                <span className="block font-light text-xs text-zinc-200">{`${getAirportName(segment.arrival.iataCode)} (${segment.arrival.iataCode})`}</span>
                <span className="block font-light text-xs text-zinc-200">{displayGateNum(segment.arrival.terminal)}</span>
              </div>
            </div>
            </div>

          <div className="flex flex-col justify-between text-right py-2">
            <div>
              <span className="block text-lg/5 text-zinc-200">{format(segment.departure.at, 'h:mm aaaa')}</span>
              <span className="block font-light text-xs text-zinc-200">{getTimezoneAbbr(segment.departure.iataCode)}</span>
              <span className="block font-light text-xs text-zinc-200">{format(segment.departure.at, 'EEE, MMM M')}</span>
            </div>
            <div>
              <span className="block text-lg/5 text-zinc-200">{format(segment.arrival.at, 'h:mm aaaa')}</span>
              <span className="block font-light text-xs text-zinc-200">{getTimezoneAbbr(segment.arrival.iataCode)}</span>
              <span className="block font-light text-xs text-zinc-200">{format(segment.arrival.at, 'EEE, MMM M')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start basis-1/2 px-5 py-3 text-zinc-200">
        <div className="basis-1/2 text-sm/6 tracking-wide font-light text-xs ">
          <span className="block">Aircraft</span>
          <span className="block">Cabin</span>
          <span className="block">Checked Bags Included</span>
        </div>
        <div className="basis-1/2 text-sm/6 text-right tracking-wide font-medium text-xs">
          <span className="block">{getAircraftName(segment.aircraft.code)}</span>
          <span className="block">{segmentDetails.cabin}</span>
          <span className="block">{displayCheckedBagsQuantity()}</span>
        </div>
      </div>
    </div>
  )
}