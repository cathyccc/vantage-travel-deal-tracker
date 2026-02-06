import { Fragment } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button} from '@/components/ui/button';
import { PlaneTakeoff, PlaneLanding, Luggage } from 'lucide-react';
import { getLocationName, displayStops } from '@/lib/flightUtils';

export default function OfferResultsCard(props) {
  const { id,
          duration,
          layoverInfo,
          carriers,
          departureTime,
          arrivalTime,
          departureLocation,
          arrivalLocation,
          price,
          checkedBagsQuantity,
        } = props;
  
  const displayAirlines = () => {
    const carriersArr = carriers.map((airline, index) => {
      const isLast = index === carriers.length - 1;
    
      return (
        <Fragment key={`${id}-${airline.marketingName}-${airline.operatingName || ''}`}>
          {airline.isCodeShare ? (
            <div className="mb-0.5">
              <span className="block text-base leading-none">{`${airline.marketingName}${!isLast ? ' +':''}`}</span>
              <span className="block text-[10px] font-extralight">Operated by {airline.operatingName}</span>
            </div>
          ) : (
            <span className="block text-base mb-0.5">{`${airline.marketingName}${!isLast ? ' +':''}`}</span>
          )}
        </Fragment>
      )
    })
    return carriersArr;
  }

  const displayLuggages = (count) => {
    if (count <= 0) return null;
    return (
      <span className="inline-flex items-center gap-1">
        <Luggage size={16} strokeWidth={1} />
        {count > 1 && <span className="font-thin text-xs">× {count}</span>}
      </span>
    )
  }

  const displayLayoverTimes = (layoverArr) => {
    return layoverArr.map(layover => {
      return (
        <span key={layover.layoverLocationCode} className="block text-[10px] text-violet-500 block">
          {layover.duration} in {getLocationName(layover.layoverLocationCode)}
        </span>
      )
    })
  }

  return (
    <Card className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-none flex h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="text-sm font-extrabold">
            {displayAirlines()}
          </div>
          <div>
            <div className="block text-right">
              <span className="text-xs">CA $ </span>
              <span className="text-2xl text-violet-400 font-bold">{price}</span>
            </div>
            <span className="text-xs block text-right">Roundtrip per traveller</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="flex flex-row justify-between">
          <div>
            <div className="flex flex-row">
              <span className="p-1"><PlaneTakeoff size={16} strokeWidth={1}/></span>
              <div className="px-1 flex items-start flex-col">
                <div className="block text-xl font-thin">{departureTime}</div>
                <div className="block text-xs font-thin">{departureLocation}</div>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="relative flex flex-col items-center justify-evenly py-1 my-1 ml-10 mr-5">
                <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-1/2 -translate-x-1/2"></div>
                {layoverInfo.map((layover) => (
                  <div 
                    key={layover.layoverLocationCode}
                    className="w-2 h-2 rounded-full border-2 border-white bg-white shadow-sm z-10"
                  />
                ))}
              </div>

              <div className="py-4">
                <span className="text-xs text-violet-400 block">{duration} • {displayStops(layoverInfo.length)}</span> 
                {displayLayoverTimes(layoverInfo)}
              </div>
            </div>

            <div className="flex flex-row">
              <span className="p-1"><PlaneLanding size={16} strokeWidth={1}/></span>
              <div className="px-1 flex flex-col items-start">
                <div className="block text-xl font-thin">{arrivalTime}</div>
                <div className="block text-xs font-thin">{arrivalLocation}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="text-end">
                { displayLuggages(checkedBagsQuantity) }
            </div>

            <Button className="border-1 border-violet-400 text-xs px-2 text-violet-400">VIEW DETAILS</Button>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}