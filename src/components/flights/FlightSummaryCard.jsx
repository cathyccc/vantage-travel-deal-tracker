import { parseISODuration,
         formatCabinClassName,
         getLayoverInfo,
         displayStops,
         displayDateDiff,
         getCarrierNames,
         displayGateNum,
         formattedAircraftName
       } from "@/lib/flightUtils";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

export default function FlightSummaryCard({offer}) {
  const toDestinationSegs = offer.slices[0].segments;
  const segToDestination = offer.slices[0].segments[0];
  const layoverInfoToDestination = getLayoverInfo(offer.slices[0].segments);
  const toOriginSegs = offer.slices[1].segments;
  const segToOrigin = offer.slices[1].segments[0];
  const layoverInfoToOrigin = getLayoverInfo(offer.slices[1].segments)

  return (
    <div className="rounded-lg border border-zinc-700 text-xs mt-5 py-5">
      <div className="mx-6">
        <div>
          <div className="inline">{format(segToDestination.departing_at, 'EEE, MMM d')}</div>
          <div className="inline ml-5">
            {format(segToDestination.departing_at, 'h:mm aaaa')} - {format(segToDestination.arriving_at, 'h:mm aaaa')}
            <span>{displayDateDiff(segToDestination)}</span>
          </div>
        </div>
        <div className="text-base font-semibold">{offer.slices[0].origin.city_name} ({offer.slices[0].origin.iata_code}) to {offer.slices[0].destination.city_name} ({offer.slices[0].destination.iata_code})</div>
        <div>
          <div className="inline">{`${getCarrierNames(offer.slices[0])}, ${displayStops(layoverInfoToDestination.length).toLowerCase()}`}</div>
          <div className="inline ml-5">{parseISODuration(offer.slices[0].duration)}</div>
        </div>
      </div>

      <div className="border-b-1 border-zinc-700 mx-5">
        <Collapsible className="mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group text-purple-400 flex flex-row items-center gap-2 text-xs hover:bg-inherit hover:text-purple-400 !px-0">
              <ChevronRight size={16} strokeWidth={2} className="group-data-[state=open]:rotate-90"/>
              Show Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            { toDestinationSegs.map(seg => {
              const matchingLayover = layoverInfoToDestination.find(item => item.layoverLocationCode === seg.destination.iata_code)

              return(
                <div key={seg.id} className="pb-3">
                  <div className="px-6 bg-zinc-800 p-2 w-full flex justify-between flex-row">
                    <div className="font-bold">{seg.origin.iata_code} to {seg.destination.iata_code}</div>
                    <div className="font-medium">{format(seg.departing_at, 'EEE, MMM d')}</div>
                  </div>

                  <div className="px-6 py-3 flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-4 ">
                      <Image alt={seg.marketing_carrier.iata_code} src={seg.marketing_carrier.logo_symbol_url} width={20} height={20}/>
                      <div>
                        <div className="text-sm">{seg.marketing_carrier.name}</div>
                        <span className="block text-[10px] font-extralight">
                          { seg.marketing_carrier.id !== seg.operating_carrier.id ? `Operated by ${seg.operating_carrier.name}`: ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div>{seg.marketing_carrier.iata_code} {seg.marketing_carrier_flight_number}</div>
                      <div>{seg.aircraft? formattedAircraftName(seg.aircraft.iata_code): 'Aircraft Unknown'}</div>
                    </div>
                  </div>

                  <div className="px-6">
                    <div className="flex flex-row gap-3 mb-2">
                      <div className="flex flex-col text-right">
                        <div className="text-sm font-medium">{format(seg.departing_at, 'hh:mm aaaa')}</div>
                        <div className="text-[10px]">{seg.origin.iata_code}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">{seg.origin.city_name}, {seg.origin.iata_country_code} </div>
                        <div className="text-[10px]">{seg.origin.name}</div>
                        <div className="text-[10px]">({displayGateNum(seg.origin_terminal)})</div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 mb-3">
                      <div className="flex flex-col text-right">
                        <div className="text-sm font-medium">{format(seg.arriving_at, 'hh:mm aaaa')}</div>
                        <div className="text-[10px]">{seg.destination.iata_code}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">{seg.destination.city_name}, {seg.destination.iata_country_code} </div>
                        <div className="text-[10px]">{seg.destination.name}</div>
                        <div className="text-[10px]">({displayGateNum(seg.destination_terminal)})</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between bg-zinc-800 rounded-sm px-2 py-1 mb-2">
                      <div>Cabin Class</div>
                      <div className="text-xs">{formatCabinClassName(seg.passengers[0].cabin_class_marketing_name)}</div>
                    </div>
                    <div className="flex flex-row justify-between bg-zinc-800 rounded-sm px-2 py-1 mb-2">
                      <div>Flight Time</div>
                      <div className="text-xs">{parseISODuration(seg.duration)}</div>
                    </div>
                    { layoverInfoToDestination.length > 0 && matchingLayover &&
                      <div className="flex flex-row justify-between bg-purple-950 rounded-sm px-2 py-1 mb-2">
                        <div>Layover Time</div>
                        <div className="text-xs">{matchingLayover.layoverDuration}</div>
                      </div>
                    }
                  </div>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mx-6 mt-5">
        <div>
          <div className="inline">{format(segToOrigin.departing_at, 'EEE, MMM d')}</div>
          <div className="inline ml-5">
            {format(segToOrigin.departing_at, 'h:mm aaaa')} - {format(segToOrigin.arriving_at, 'h:mm aaaa')}
            <span>{displayDateDiff(segToOrigin)}</span>
          </div>
        </div>
        <div className="text-base font-semibold">{offer.slices[1].origin.city_name} ({offer.slices[1].origin.iata_code}) to {offer.slices[1].destination.city_name} ({offer.slices[1].destination.iata_code})</div>
        <div>
          <div className="inline">{`${getCarrierNames(offer.slices[1])}, ${displayStops(layoverInfoToDestination.length).toLowerCase()}`}</div>
          <div className="inline ml-5">{parseISODuration(offer.slices[1].duration)}</div>
        </div>
      </div>

      <div className="mx-5">
        <Collapsible className="">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group text-purple-400 flex flex-row items-center gap-2 text-xs hover:bg-inherit hover:text-purple-400 !px-0">
              <ChevronRight size={16} strokeWidth={2} className="group-data-[state=open]:rotate-90"/>
              Show Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            { toOriginSegs.map(seg => {
              const matchingLayover = layoverInfoToOrigin.find(item => item.layoverLocationCode === seg.destination.iata_code)

              return(
                <div key={seg.id}>
                  <div className="px-6 bg-zinc-800 p-2 w-full flex justify-between flex-row">
                    <div className="font-bold">{seg.origin.iata_code} to {seg.destination.iata_code}</div>
                    <div className="font-medium">{format(seg.departing_at, 'EEE, MMM d')}</div>
                  </div>

                  <div className="px-6 py-3 flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-4 ">
                      <Image alt={seg.marketing_carrier.iata_code} src={seg.marketing_carrier.logo_symbol_url} width={20} height={20}/>
                      <div>
                        <div className="text-sm">{seg.marketing_carrier.name}</div>
                        <span className="block text-[10px] font-extralight">
                          { seg.marketing_carrier.id !== seg.operating_carrier.id ? `Operated by ${seg.operating_carrier.name}`: ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div>{seg.marketing_carrier.iata_code} {seg.marketing_carrier_flight_number}</div>
                      <div>{seg.aircraft? formattedAircraftName(seg.aircraft.iata_code): 'Aircraft Unknown'}</div>
                    </div>
                  </div>

                  <div className="px-6">
                    <div className="flex flex-row gap-3 mb-2">
                      <div className="flex flex-col text-right">
                        <div className="text-sm font-medium">{format(seg.departing_at, 'hh:mm aaaa')}</div>
                        <div className="text-[10px]">{seg.origin.iata_code}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">{seg.origin.city_name}, {seg.origin.iata_country_code} </div>
                        <div className="text-[10px]">{seg.origin.name}</div>
                        <div className="text-[10px]">({displayGateNum(seg.origin_terminal)})</div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 mb-3">
                      <div className="flex flex-col text-right">
                        <div className="text-sm font-medium">{format(seg.arriving_at, 'hh:mm aaaa')}</div>
                        <div className="text-[10px]">{seg.destination.iata_code}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">{seg.destination.city_name}, {seg.destination.iata_country_code} </div>
                        <div className="text-[10px]">{seg.destination.name}</div>
                        <div className="text-[10px]">({displayGateNum(seg.destination_terminal)})</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between bg-zinc-800 rounded-sm px-2 py-1 mb-2">
                      <div>Cabin Class</div>
                      <div className="text-xs">{formatCabinClassName(seg.passengers[0].cabin_class_marketing_name)}</div>
                    </div>
                    <div className="flex flex-row justify-between bg-zinc-800 rounded-sm px-2 py-1 mb-2">
                      <div>Flight Time</div>
                      <div className="text-xs">{parseISODuration(seg.duration)}</div>
                    </div>
                    { layoverInfoToOrigin.length > 0 && matchingLayover &&
                      <div className="flex flex-row justify-between bg-purple-950 rounded-sm px-2 py-1 mb-2">
                        <div>Layover Time</div>
                        <div className="text-xs">{matchingLayover.layoverDuration}</div>
                      </div>
                    }
                  </div>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}