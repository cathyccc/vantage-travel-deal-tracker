import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button} from '@/components/ui/button';
import { PlaneTakeoff, PlaneLanding, Luggage } from 'lucide-react';
import OfferDetailsCard from './OfferDetailsCard';
import FareDetailsCard from '../flights/FareDetailsCard';
import { getLocationName,
         getDepartureTimeToDestination,
         getArrivalTimeToDestination,
         getLayoverInfo,
         displayStops,
         displayDateDiff,
         parseISODuration } from '@/lib/flightUtils';

export default function OfferResultsCard({offer}) {
  const [dialogView, setDialogView] = useState('flight'); // 'flight' | 'fare'
  const [slideClass, setSlideClass] = useState('');

  const {slices} = offer;
  const duration = parseISODuration(slices[0].duration);
  const layoverInfo = getLayoverInfo(slices[0].segments);
  const departureTime = getDepartureTimeToDestination(slices);
  const arrivalTime = getArrivalTimeToDestination(slices);
  const departureLocationName = slices[0].segments[0].origin.city_name;
  const arrivalLocationName = slices[0].segments[slices[0].segments.length-1]?.destination.city_name;
  const checkedBagsQuantity = slices[0].segments[0].passengers[0].baggages.find(b => b.type === "checked")?.quantity || 0;

  const getSlideStyle = () => {
    if (slideClass === 'animate-slide-out-left') return {animation: 'slide-out-left 0.3s ease forwards'};
    if (slideClass === 'animate-slide-in-right') return {animation: 'slide-in-right 0.3s ease forwards'};
    if (slideClass === 'animate-slide-out-right') return {animation: 'slide-out-right 0.3s ease forwards'};
    if (slideClass === 'animate-slide-in-left') return {animation: 'slide-in-left 0.3s ease forwards'};
  }

  const goToFare = () => {
    setSlideClass('animate-slide-out-left');
    
    setTimeout(() => {
      setDialogView('fare');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideClass('animate-slide-in-right');
        });
      });
    }, 300);
  }

  const goBackToFlight = () => {
    setSlideClass('animate-slide-out-right');

    setTimeout(()=>{
      setDialogView('flight');
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          setSlideClass('animate-slide-in-left');
        })
      })
    },300);
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

  const displayLayoverTimes = () => {
    const layoverArr = getLayoverInfo(slices[0].segments);

    if (layoverArr.length === 0) {
      return;
    } else {
      return layoverArr.map(layover => {
        return (
          <span key={layover.layoverLocationCode}  className="block text-[10px] text-violet-500 block">
            {layover.layoverDuration} in {getLocationName(layover.layoverLocationCode)}
          </span>
        )
      })
    }
  }

  return (
    <Card data-testid="offer-result-card" data-offer-id={offer.id} className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-none flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="text-sm font-extrabold">
            <span className="block text-base mb-0.5">{offer.owner.name}</span>
          </div>
          <div>
            <div className="block text-right pl-3">
              <span className="text-xs">{offer.base_currency} $ </span>
              <span data-testid="offer-price" className="text-2xl text-violet-400 font-bold">{offer.total_amount}</span>
            </div>
            <span className="text-xs block text-right">Roundtrip</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="flex flex-row justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-row">
              <span className="p-1"><PlaneTakeoff size={16} strokeWidth={1}/></span>
              <div className="px-1 flex items-start flex-col">
                <div data-testid="offer-departure-time" className="block text-xl font-thin">{departureTime}</div>
                <div data-testid="offer-departure-city" className="block text-xs font-thin">{departureLocationName}</div>
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

              <div className="py-4 whitespace-nowrap overflow-visible">
                <span data-testid="offer-duration" className="text-xs text-violet-400 block">{duration} • {displayStops(layoverInfo.length)}</span> 
                {displayLayoverTimes(layoverInfo)}
              </div>
            </div>

            <div className="flex flex-row">
              <span className="p-1"><PlaneLanding size={16} strokeWidth={1}/></span>
              <div className="px-1 flex flex-col items-start">
                <div data-testid="offer-arrival-time" className="block text-xl font-thin flex items-baseline">
                  {arrivalTime}
                  <span className="text-xs text-rose-500 font-light tracking-wider pl-1 self-start">{displayDateDiff(slices[0].segments[0])}</span>
                </div>
                <div data-testid="offer-arrival-city" className="block text-xs font-thin">{arrivalLocationName}</div>
              </div>
            </div>
          </div>

          <div className="flex-none flex flex-col justify-between items-end">
            <div className="text-end">
                { displayLuggages(checkedBagsQuantity) }
            </div>
            <Dialog onOpenChange={(open) => { 
                if (!open) setTimeout(() => {
                  setDialogView('flight');
                  setSlideClass(''); }, 300);
              }}>
              <DialogTrigger asChild>
                <Button className="border-1 border-violet-400 text-xs px-2 text-violet-400">VIEW DETAILS</Button>
              </DialogTrigger>
              <DialogContent
                aria-describedby={undefined}
                style={getSlideStyle()}
                className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-fuchsia-300 md:max-w-3xl"
                onOpenAutoFocus={(e) => e.preventDefault()}>
                  {dialogView === 'flight'? <OfferDetailsCard offer={offer} goToFare={goToFare}/> : 
                  <FareDetailsCard offer={offer} handleViewChange={goBackToFlight}/>}
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}