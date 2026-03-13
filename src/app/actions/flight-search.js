"use server";

import { FlightOffersSearchSchema } from "../../lib/schemas/flight-search";
import { searchOffers } from "@/lib/api/flights";

export async function getFlightOffers(formData) {
  const validatedData = FlightOffersSearchSchema.safeParse(formData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      messages: "Please fix the highlighted fields."
     };
  }
  
  try {
    const data = await searchOffers(validatedData.data);
    return {
      data,
      success: true,
      errors: null
    };
  } catch(error) {
    return {
      data:[],
      success: false,
      errors: { root: error.message }
    };
  }
}
