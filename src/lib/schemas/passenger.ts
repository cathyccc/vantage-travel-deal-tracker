import { z } from 'zod';
import { parse, isValid, isBefore } from 'date-fns';

export const PassengerSchema = z.object({
  given_name: z.string({ message: "First name is required" })
    .trim()
    .min(1, "First name is required")
    .max(30, "Name is too long")
    .regex(/^[a-zA-Z]([a-zA-Z -]*[a-zA-Z])?$/, "Only letters, spaces, and hyphens are allowed"),
  family_name: z.string({ message: "Last name is required" })
    .trim()
    .min(1, "Last name is required")
    .max(30, "Name is too long")
    .regex(/^[a-zA-Z]([a-zA-Z -]*[a-zA-Z])?$/, "Only letters, spaces, and hyphens are allowed"),
  phone_number: z.string({ message: "Phone number is required" })
    .trim()
    .min(8, "Phone number is too short")
    .max(16, "Phone number is too long")
    .regex(/^\+[1-9]\d{1,14}$/, "Please provide a valid phone number"),
  email: z.string().email("Please provide a valid email"),
  born_on: z.string({ message: "Birthdate is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD")
    .refine((dateStr) => {
      const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) return false;
      return isBefore(parsedDate, new Date());
    }, { message: "Please provide a valid birthdate in the past" }),
  gender: z.enum(["m", "f"], { message: "Please select a gender" }),
  title: z.enum(["mr", "ms", "mrs", "miss", "dr"], { message: "Please select a title" }),
  passenger_type: z.enum(["adult", "child", "infant_without_seat"], { message: "Passenger type required" }),
  loyalty_programme_accounts: z.array(
    z.object({
      account_number: z.string({ message: "Account number is required" })
        .trim()
        .min(1, "Account number cannot be empty"),
      airline_aita_code: z.string({ message: "Airline code is required" })
        .trim()
        .toUpperCase()
        .length(2, "Airline IATA code must be 2 characters")
        .regex(/^[A-Z0-9]{2}$/, "Invalid IATA code format"),
    })
  ).default([])
})