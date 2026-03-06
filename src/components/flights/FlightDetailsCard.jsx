import { parseISODuration, formatCabinClassName, displayDateDiff } from "@/lib/flightUtils";
import { format } from 'date-fns';

export default function FlightDetailsCard({ segment }) {
  const displayGateNum = (char) => {
    return !isNaN(char) ? `Terminal ${char}`: `Concourse ${char}` 
  }

  const displayCheckedBagsQuantity = () => {
    const quantity = segment.passengers[0].baggages.find(b => b.type === "checked").quantity;
    return quantity === 0 ? 'No' : quantity;
  }

  return (
    <div className="flex flex-col h-full bg-zinc-800 rounded-lg px-6 py-3 mt-3 flex-grow">
        <div className="text-zinc-200 text-xs">
          {segment.marketing_carrier.name} – {segment.marketing_carrier.iata_code} {segment.marketing_carrier_flight_number}
          <span className="block text-[10px] font-extralight">
          { segment.marketing_carrier.id !== segment.operating_carrier.id ? `Operated by ${segment.operating_carrier.name}`: '\u00A0'}
          </span>
        </div>

        <div className="flex flex-row justify-between">
          <div className="relative flex flex-col items-center justify-between py-2 ml-4 mr-3 max-w-40">
            <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-0 -translate-x-4 mt-5 mb-12"></div>
            <div className="flex flex-col justify-between">
              <div>
                <span className="block text-lg/5 text-zinc-200 ">{segment.origin.city_name}</span>
                <span className="block font-light text-xs text-zinc-200">{`${segment.origin.name} (${segment.origin.iata_code})`}</span>
                <span className="block font-light text-xs text-zinc-200">{displayGateNum(segment.origin_terminal)}</span>
              </div>
              <div className="my-4">
                <span className="block text-xs text-purple-300">Travel time: {parseISODuration(segment.duration)}</span>
              </div>
              <div>
                <span className="block text-lg/5 text-zinc-200">{segment.destination.city_name}</span>
                <span className="block font-light text-xs text-zinc-200">{`${segment.destination.name} (${segment.destination.iata_code})`}</span>
                <span className="block font-light text-xs text-zinc-200">{displayGateNum(segment.destination_terminal)}</span>
              </div>
            </div>
            </div>

          <div className="flex flex-col justify-between text-right py-2">
            <div>
              <span className="block text-lg/5 text-zinc-200">{format(segment.departing_at, 'h:mm aaaa')}</span>
              <span className="block font-light text-[10px] text-zinc-500">{`(Local Time)`}</span>
              <span className="block font-light text-xs text-zinc-200">{format(segment.departing_at, 'EEE, MMM d')}</span>
            </div>
            <div>
              <span className="flex items-baseline">
                <span className="text-lg/5 text-zinc-200">{format(segment.arriving_at, 'h:mm aaaa')}</span>
                <span className="text-xs text-rose-500 font-light tracking-wider pl-1 self-start">{displayDateDiff(segment)}</span>
              </span>
              <span className="block font-light text-[10px] text-zinc-500">{`(Local Time)`}</span>
              <span className="block font-light text-xs text-zinc-200">{format(segment.arriving_at, 'EEE, MMM d')}</span>
            </div>
          </div>
        </div>


      <div className="mt-auto pt-3 border-t border-zinc-700 flex flex-row items-start px-0 py-3 text-zinc-200">
        <div className="basis-1/2 text-sm/6 tracking-wide font-light text-xs">
          <span className="block">Cabin</span>
          <span className="block">Checked Bags Included</span>
        </div>
        <div className="basis-1/2 text-sm/6 text-right text-xs">
          <span className="block">{formatCabinClassName(segment.passengers[0].cabin_class)}</span>
          <span className="block">{displayCheckedBagsQuantity()}</span>
        </div>
      </div>
    </div>
  )
}