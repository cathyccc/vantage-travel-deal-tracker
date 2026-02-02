import {z} from 'zod';
import {parseISO, isAfter, startOfToday, isValid} from 'date-fns';

export const FlightOffersSearchSchema = z.object({
  originLocationCode: z.string()
    .length(3, "Must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Invalid airport code format"),
  destinationLocationCode: z.string()
    .length(3, "Must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Invalid airport code format"),
  departureDate: z.string()
    .min(1, "Departure date is required")
    .refine(date => isAfter(new Date(parseISO(date)), startOfToday), { message: "Departure date must be in the future"}),
  adults: z.coerce.number().min(1, "At least 1 adult").max(9, "Max 9 adults"),
});