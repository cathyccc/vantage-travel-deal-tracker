"use client";

import { useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import CollapsibleSearch from "../search/CollapsibleSearch";
import FlightSummaryCard from '../flights/FlightSummaryCard';
import { useForm, FormProvider } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import PassengerForm from './PassengerForm';
import PaymentForm from './PaymentForm';
import ContactForm from './ContactForm';
import Stepper from '../layout/Stepper';
import { BookingSchema, BookingFormFields } from "@/lib/schemas/booking";
import { type DuffelOffer } from '@/lib/duffel.types';
import { Button } from '../ui/button';
import { CircleAlert } from 'lucide-react';


export default function BookingView({ offer, offerId }: { offer: DuffelOffer; offerId: string }) {
  const methods = useForm<BookingFormFields>({
    resolver: zodResolver(BookingSchema),
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      loyaltyProgram: "",
      knownTravellerId: "",
      contactEmail: "",
      contactPhone: "",
      cardNumber: "",
      cardHolderName: "",
      expiryYYYY: "",
      expiryMM: "",
      cvv: "",
      streetAddress: "",
      city: "",
      stateOrProvince: "",
      country: "",
      email: "",
      phone: "",
    }
  });
  const { formState: { errors } } = methods;
  const searchParams = useSearchParams();
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const isPassengerError = errors.firstName || errors.lastName || errors.dob || errors.gender;
  const isPaymentError = errors.cardNumber || errors.cardHolderName || errors.expiryYYYY || errors.expiryMM || errors.cvv;
  const isContactError = errors.contactEmail || errors.contactPhone;

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 p-8 text-white gap-5">
      <div className="col-span-1 md:col-span-2">
        <div className="text-3xl font-light mb-8">Offer for</div>
        <div className="bg-zinc-900 rounded-lg px-6 py-4 text-white max-w-[400px]">
          <CollapsibleSearch
            defaultValues={{ originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children }}
          />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <h3>Flight Summary</h3>
        <FlightSummaryCard offer={offer} />
      </div>

      <div className="col-span-1 md:col-span-2">
        <h3>Booking Details</h3>
        <div className="text-zinc-500 text-sm">
          <Stepper currentStep={1} />
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => console.log(data), (errors) => console.log(errors))}>
              <Accordion type="single" defaultValue="passengerDetails" collapsible className="rounded-lg border border-zinc-700 overflow-visible text-xs text-white mb-4">
                <AccordionItem value="passengerDetails">
                  <AccordionTrigger className="rounded-none bg-zinc-800 py-3 px-6 text-sm font-medium hover:no-underline">
                    <span className="flex items-center">
                      Passenger Details
                      {isPassengerError && <CircleAlert size={15} strokeWidth={2} className="text-red-400 ml-2" />}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="overflow-visible">
                    <PassengerForm />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="paymentDetails">
                  <AccordionTrigger className="rounded-none bg-zinc-800 py-3 px-6 text-sm font-medium hover:no-underline">
                    <span className="flex items-center">
                      Payment Details
                      {isPaymentError && <CircleAlert size={15} strokeWidth={2} className="text-red-400 ml-2" />}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PaymentForm />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contactInfo">
                  <AccordionTrigger className="rounded-none bg-zinc-800 py-3 px-6 text-sm font-medium hover:no-underline">
                    <span className="flex items-center">
                      Contact Information
                      {isContactError && <CircleAlert size={15} strokeWidth={2} className="text-red-400 ml-2" />}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ContactForm />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                type="submit"
                onClick={() => methods.trigger()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
              >
                BOOK & PAY
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}