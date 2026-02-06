import {z} from 'zod';
import {parseISO, isAfter, endOfToday} from 'date-fns';

export const FlightOffersSearchSchema = z.object({
  originLocationCode: z.string()
    .length(3, "Must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Invalid airport code format"),
  destinationLocationCode: z.string()
    .length(3, "Must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Invalid airport code format"),
  departureDate: z.string()
    .min(1, "Departure date is required")
    .refine(date => isAfter(parseISO(date), endOfToday()), { message: "Departure date must be in the future" }),
  returnDate: z.string()
    .min(1, "Return date is required")
    .refine(date => isAfter(parseISO(date), endOfToday()), { message: "Return date must be in the future" }),
  adults: z.coerce.number()
    .min(1, "At least 1 adult")
    .max(9, "Max 9 adults"),
}).refine(data => data.originLocationCode !== data.destinationLocationCode, {
  message: "Origin and destination cannot be the same",
  path: ["destinationLocationCode"]
  
}).refine(data => isAfter(parseISO(data.returnDate), parseISO(data.departureDate)), {
  message: "Return date must be after departure date",
  path: ["returnDate"]
});