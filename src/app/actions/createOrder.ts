"use server";

import { createDuffelOrder } from "@/lib/api/flights";
import { BookingSchema, type BookingFormFields } from "@/lib/schemas/booking";
import { type DuffelOffer } from '@/lib/duffel.types';

export async function createOrder(formData: BookingFormFields, offer: DuffelOffer) {
  const validated = BookingSchema.safeParse(formData);

  if (!validated.success) {
    return { error: validated.error.flatten() };
  }

  const { passengers } = validated.data;
  const hasInfant = passengers.find(passenger => passenger.passengerType === "infant_without_seat");

  const duffelPassengers = passengers.map((p) => {
    const isAdult = p.passengerType === "adult";
    return {
      id: p.passengerId,
      given_name: p.firstName,
      ...(p.middleName && { middle_name: p.middleName }),
      family_name: p.lastName,
      born_on: p.dob,
      title: p.gender === "male" ? "mr" : "ms",
      gender: p.gender === "male" ? "m" : "f",
      email: validated.data.contactEmail,
      phone_number: validated.data.contactPhone,
      ...(isAdult && { type: "adult" }),
      ...(isAdult && hasInfant && { infant_passenger_id: hasInfant.passengerId }),
      ...(p.loyaltyProgram && {
        loyalty_programme_accounts: [{ airline_iata_code: p.loyaltyProgram, account_number: p.frequentFlyerNumber }]
      }),
      ...(p.knownTravellerId && { known_traveller_id: p.knownTravellerId })
    }
  })

  const duffelPayment = {
    type: "balance",
    currency: offer.total_currency,
    amount: offer.total_amount,
  }

  try {
    const order = await createDuffelOrder(offer.id, duffelPassengers, duffelPayment);
    return {
      success: true,
      order
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      errors: {},
      messages: error instanceof Error ? error.message : "An error occurred while creating the order."
    }
  }
}