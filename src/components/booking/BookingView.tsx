"use client";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import CollapsibleSearch from "../search/CollapsibleSearch";
import FlightSummaryCard from '../flights/FlightSummaryCard';
import { useForm, FormProvider, useFieldArray, type Resolver } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import PassengerForm from './PassengerForm';
import PaymentForm from './PaymentForm';
import ContactForm from './ContactForm';
import Stepper from '../layout/Stepper';
import { BookingSchema, BookingFormFields } from "@/lib/schemas/booking";
import { createOrder } from '@/app/actions/createOrder';
import { type DuffelOffer } from '@/lib/duffel.types';
import { Button } from '../ui/button';
import { CircleAlert } from 'lucide-react';


export default function BookingView({ offer }: { offer: DuffelOffer }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const infants = searchParams.get('infants');
  const totalPassengers = parseInt(adults || "1") + parseInt(children || "0") + parseInt(infants || "0");
  const confirmedRef = searchParams.get('ref');
  const [bookingReference, setBookingReference] = useState<string | null>(confirmedRef ?? null);

  const methods = useForm<BookingFormFields>({
    resolver: zodResolver(BookingSchema) as Resolver<BookingFormFields>,
    reValidateMode: "onChange",
    defaultValues: {
      passengers: Array.from({ length: totalPassengers }, () => ({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        gender: "",
        loyaltyProgram: "",
        knownTravellerId: "",
      })),
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
  const { fields } = useFieldArray({ control: methods.control, name: "passengers" });
  const { formState: { errors } } = methods;
  const isPassengerError = !!errors.passengers;
  const isPaymentError = errors.cardNumber || errors.cardHolderName || errors.expiryYYYY || errors.expiryMM || errors.cvv;
  const isBillingError = errors.streetAddress || errors.city || errors.stateOrProvince || errors.country || errors.postalCodeOrZip || errors.email || errors.phone;
  const isContactError = errors.contactEmail || errors.contactPhone;

  const handleBookingSubmit = async (data: BookingFormFields) => {
    const result = await createOrder(data, offer);
    if (result?.success) {
      setBookingReference(result.order.booking_reference);
      router.push(`/booking/${offer.id}/confirmation?ref=${result.order.booking_reference}`);
    } else {
      console.error('Order failed:', result);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 p-8 text-white gap-5">
      <div className="col-span-1 md:col-span-2">
        <div className="text-3xl font-light mb-8">Offer for</div>
        <div className="bg-zinc-900 rounded-lg px-6 py-4 text-white max-w-[400px]">
          <CollapsibleSearch
            defaultValues={{ originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children, infants }}
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
          <Stepper currentStep={bookingReference ? 2 : 1} />
          {bookingReference ? (
            <div className="text-center py-8">
              <p className="text-zinc-400 text-sm mb-2">Booking Confirmed</p>
              <p className="text-2xl font-light text-white">{bookingReference}</p>
            </div>
          ) : (
            <FormProvider {...methods}>
              {/* // maybe switch offer to offerId? */}
              <form onSubmit={methods.handleSubmit(handleBookingSubmit, (errors) => console.log(errors))}>
                <Accordion type="single" defaultValue="passengerDetails" collapsible className="rounded-lg border border-zinc-700 overflow-visible text-xs text-white mb-4">
                  <AccordionItem value="passengerDetails">
                    <AccordionTrigger className="rounded-none bg-zinc-800 py-3 px-6 text-sm font-medium hover:no-underline">
                      <span className="flex items-center">
                        Passenger Details
                        {isPassengerError && <CircleAlert size={15} strokeWidth={2} className="text-red-400 ml-2" />}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="overflow-visible">
                      {fields.map((field, index) => (
                        <div key={field.id} className="border-b border-zinc-700 last:border-0">
                          <PassengerForm index={index} passengerType={offer.passengers[index]?.type} passengerAge={offer.passengers[index]?.age} passengerId={offer.passengers[index]?.id} />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="paymentDetails">
                    <AccordionTrigger className="rounded-none bg-zinc-800 py-3 px-6 text-sm font-medium hover:no-underline">
                      <span className="flex items-center">
                        Payment Details
                        {(isPaymentError || isBillingError) && <CircleAlert size={15} strokeWidth={2} className="text-red-400 ml-2" />}
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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  BOOK & PAY
                </Button>
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </div>
  )
}