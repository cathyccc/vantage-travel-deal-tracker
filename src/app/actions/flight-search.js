"use server";

import { headers } from "next/headers";
import { FlightOffersSearchSchema } from "../../lib/schemas/flight-search";
import { searchOffers } from "@/lib/api/flights";
import { scenarioContext } from "@/../tests/msw/scenario-context"

export async function getFlightOffers(formData) {
  const validatedData = FlightOffersSearchSchema.safeParse(formData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      messages: "Please fix the highlighted fields."
     };
  }
  
  const runSearch = async () => {
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

  if (process.env.MOCK_DUFFEL === '1') {
    const scenario = (await headers()).get('x-scenario');
    return scenarioContext.run(scenario ?? undefined, runSearch);
  }

  return runSearch();
}
