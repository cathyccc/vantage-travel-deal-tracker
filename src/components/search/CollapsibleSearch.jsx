"use client";

import { useState } from 'react';
import { getLocationName } from '@/lib/flightUtils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ArrowDownUp, MoveHorizontal } from 'lucide-react';
import OffersSearchForm from "./OffersSearchForm"

export default function CollapsibleSearch ({defaultValues}) {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  const departureDate = parseISO(defaultValues.departureDate);
  const returnDate = parseISO(defaultValues.returnDate);

  return (
    <Collapsible
      open={collapsibleOpen}
      onOpenChange={() => setCollapsibleOpen(prev => !prev)}
      className="flex flex-col"
    >
      <div className="flex items-center justify-between px-4">
        <div>
          <h4 className="text-sm font-semibold">
            {getLocationName(defaultValues.originLocationCode)} ({defaultValues.originLocationCode}) <MoveHorizontal size={20} strokeWidth={2} className="mx-1 inline"/> {getLocationName(defaultValues.destinationLocationCode)} ({defaultValues.destinationLocationCode})
          </h4>
          <div className="font-medium text-sm">{format(departureDate, "EEE, MMM d")} - {format(returnDate, "EEE, MMM d")}</div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ArrowDownUp />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <OffersSearchForm/>
      </CollapsibleContent>
    </Collapsible>
  )
}