import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const phoneSchema = z.string()
  .min(1, "Phone number is required")
  .refine((val) => isValidPhoneNumber(val), {
    message: "Invalid phone number format",
  });

export const BookingSchema = z.object({
  // passenger
  passengers: z.array(
    z.object({
      passengerId: z.string(),
      passengerType: z.enum(["adult", "child", "infant_without_seat"]),
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Last name is required"),
      dob: z.string().min(1, "Date of birth is required"),
      gender: z.string({ error: "Gender is required" }).min(1, "Please select a gender"),
      loyaltyProgram: z.string().optional(),
      frequentFlyerNumber: z.string().optional(),
      knownTravellerId: z.string().optional(),
    })
  ).min(1, "At least one passenger is required"),

  // contact details
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: phoneSchema,

  // payment details  
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  cardHolderName: z.string().min(1, "Card holder name is required"),
  expiryYYYY: z.string()
    .min(1, "Expiry year is required")
    .regex(/^\d{4}$/, "Invalid year")
    .refine(val => parseInt(val) >= new Date().getFullYear(), "Card has expired"),
  expiryMM: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
  cvv: z.coerce.string().regex(/^[0-9]{3,4}$/, "Invalid CVV"),

  // billing
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postalCodeOrZip: z.string()
    .min(1, "Postal code/ Zip code is required")
    .regex(/^(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d)$/, "Invalid postal/zip code"),
  stateOrProvince: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email address"),
  phone: phoneSchema,
}).superRefine((data, ctx) => {
  data.passengers.forEach((passenger, index) => {
    if (passenger.loyaltyProgram && !passenger.frequentFlyerNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Frequent flyer number is required when a loyalty program is selected",
        path: [`passengers.${index}.frequentFlyerNumber`]
      });
    }
  });
})

export type BookingFormFields = z.infer<typeof BookingSchema>;