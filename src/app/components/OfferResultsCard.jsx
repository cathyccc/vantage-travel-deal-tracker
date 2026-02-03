import {Card, CardContent, CardHeader} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import { PlaneTakeoff, PlaneLanding, Luggage, Utensils } from 'lucide-react'

export default function OfferResultsCard() {
  return (
    <Card className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-none ">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="text-sm font-extrabold">
            <span className="block">Air Canada + </span>
            <span className="block">United Airlines</span>
          </div>
          <div>
            <div className="block text-right">
              <span className="text-xs text-violet-400">CA $ </span>
              <span className="text-2xl text-violet-400 font-bold">507.83</span>
            </div>
            <span className="text-xs block">Roundtrip per traveller</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-row justify-between">
          <div>
            <div className="flex flex-row">
              <span className="p-1"><PlaneTakeoff size={16} strokeWidth={1}/></span>
              <div className="px-1">
                <div className="text-xl font-thin">9:30 a.m.</div>
                <div className="text-xs font-thin">Toronto</div>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="relative flex flex-col items-center h-16 py-1 ml-10 mr-5">
                <div className="h-full w-0.5 bg-zinc-400 rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white bg-white shadow-sm"></div>
              </div>
              <div className="py-4">
                <span className="text-xs text-violet-400 block">17h 10m • 1 stop</span>
                <span className="text-xs text-violet-500 block">1h 2m in Denver</span>
              </div>
            </div>

            <div className="flex flex-row">
              <span className="p-1"><PlaneLanding size={16} strokeWidth={1}/></span>
              <div className="px-1">
                <div className="text-xl font-thin">9:40 p.m.</div>
                <div className="text-xs font-thin">Tokyo</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="justify-items-end">
              <div>
                <span className="inline-block"><Luggage size={16} strokeWidth={1}/></span>
                <span className="inline-block"><Luggage size={16} strokeWidth={1}/></span>
              </div>
              <span className="block"><Utensils size={16} strokeWidth={1}/></span>
            </div>

            <Button className="border-1 border-violet-400 text-xs px-2 text-violet-400">VIEW DETAILS</Button>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}