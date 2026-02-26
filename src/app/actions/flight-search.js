"use server";

import { FlightOffersSearchSchema } from "../../lib/schema";

export async function getFlightOffers(formData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const rawData = Object.fromEntries(formData);
  const validatedData = FlightOffersSearchSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      messages: "Please fix the highlighted fields."
     };
  }
  
  try {
    const {originLocationCode, destinationLocationCode, departureDate, returnDate, adults} = validatedData.data;
    const queryString = new URLSearchParams({originLocationCode, destinationLocationCode, departureDate, returnDate, adults}).toString();
    const response = await fetch(`${baseUrl}/api/flight-offers-search?${queryString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip'
        },
      });

    if(!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        code: errorData.errorCode,
        errors: {'root': errorData.message},
      };
    }

    const data = await response.json();

    return {
      data: data || [], 
      success: true,
      errors: null
    };
  } catch(error) {
    return {
      data:[],
      success: false,
      errors: { root: [error.messages]}
    };
  }
}