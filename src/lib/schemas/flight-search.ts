import { z } from 'zod';
import { parseISO, isAfter, isBefore, endOfToday } from 'date-fns';

export const FlightOffersSearchSchema = z.object({
  originLocationCode: z.string({ message: 'Origin is required' })
    .min(1, "Origin is required")
    .length(3, "Must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Invalid airport code format"),
  destinationLocationCode: z.string({ message: 'Destination is required' })
    .min(1, "Destination is required")
    .length(3, "Must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Invalid airport code format"),
  departureDate: z.string({ message: 'Departure date is required' })
    .min(1, "Departure date is required")
    .refine(date => isAfter(parseISO(date), endOfToday()), { message: "Departure date must be in the future" }),
  returnDate: z.string({ message: 'Return date is required' })
    .min(1, "Return date is required")
    .refine(date => isAfter(parseISO(date), endOfToday()), { message: "Return date must be in the future" }),
  adults: z.coerce.number({ message: 'The number of adults is required' })
    .min(1, "At least 1 adult")
    .max(9, "Max 9 adults"),
  children: z.coerce.number()
    .min(0)
    .max(8, "Max 8 children"),
  infants: z.coerce.number()
    .min(0)
    .max(8, "Max 8 infants"),
  childAges: z.array(z.number().int().min(2).max(12)).optional().default([]),
  infantAges: z.array(z.number().int().min(0).max(1)).optional().default([]),
}).superRefine((data, ctx) => {
  if (data.originLocationCode === data.destinationLocationCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Origin and destination cannot be the same",
      path: ["destinationLocationCode"]
    });
  }

  if (data.departureDate && data.returnDate) {
    const dep = parseISO(data.departureDate);
    const ret = parseISO(data.returnDate);
    if (isBefore(ret, dep)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Return date must be after departure date",
        path: ["returnDate"]
      });
    }
  }

  if (data.infants > data.adults) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Number of infants cannot exceed number of adults",
      path: ["infants"]
    });
  }

  if (data.adults + data.children + data.infants > 9) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Total passengers cannot exceed 9",
      path: ["adults", "children", "infants"]
    })
  }
});