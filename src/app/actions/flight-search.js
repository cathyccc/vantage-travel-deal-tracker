"use server";

import { FlightOffersSearchSchema } from "../../lib/schema";

export async function getFlightOffers(formData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const rawData = Object.fromEntries(formData);
  const validatedData = FlightOffersSearchSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      messages: "Please fix the highlighted fields."
     };
  }
  
  try {
    const {originLocationCode, destinationLocationCode, departureDate, returnDate, adults} = validatedData.data;
    const queryString = new URLSearchParams({originLocationCode, destinationLocationCode, departureDate, returnDate, adults}).toString();
    const response = await fetch(`${baseUrl}/api/flight-offers-search?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    const data = await response.json();
    return {
      data: data || [], 
      success: true,
      errors: null 
    };
  } catch(error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again."
    };
  }
}