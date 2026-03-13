"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocationName } from '@/lib/flightUtils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ArrowDownUp, MoveHorizontal } from 'lucide-react';
import OffersSearchForm from "../offers/OffersSearchForm"

export default function CollapsibleSearch ({defaultValues}) {
  const [errors, setErrors] = useState();
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  const router = useRouter();
  const origin = defaultValues.originLocationCode;
  const destination = defaultValues.destinationLocationCode;
  const departureDate = parseISO(defaultValues.departureDate);
  const returnDate = parseISO(defaultValues.returnDate);
  const adults = defaultValues.adults;

  const handleSearch = async (formData) => {
    const params = new URLSearchParams({
      originLocationCode: origin || formData.originLocationCode,
      destinationLocationCode: destination || formData.destinationLocationCode,
      departureDate: (departureDate || formData.departureDate) ?? '',
      returnDate: (returnDate || formData.returnDate) ?? '',
      adults,
    });
    router.push(`/?${params.toString()}`);
  }

  return (
    <Collapsible
      open={collapsibleOpen}
      onOpenChange={() => setCollapsibleOpen(prev => !prev)}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="text-sm font-semibold">
          {getLocationName(defaultValues.originLocationCode)} ({defaultValues.originLocationCode}) <MoveHorizontal size={20} strokeWidth={2} className="mx-1 inline"/> {getLocationName(defaultValues.destinationLocationCode)} ({defaultValues.destinationLocationCode})
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ArrowDownUp />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
        <span className="text-muted-foreground">Travel Date</span>
        <span className="font-medium">{format(departureDate, "EEE, MMM d")} - {format(returnDate, "EEE, MMM d")}</span>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <OffersSearchForm/>
      </CollapsibleContent>
    </Collapsible>
  )
}