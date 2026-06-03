import { z } from "zod";

export const BookingSchema = z.object({
  // passenger
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string({ error: "Gender is required" }).min(1, "Please select a gender"),
  loyaltyProgram: z.string().optional(),
  knownTravellerId: z.string().optional(),

  // contact details
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(7, "Phone number is required").max(15, "Phone number is too long"),

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
  phone: z.string().min(7, "Phone number is required").max(15, "Phone number is too long"),
})

export type BookingFormFields = z.infer<typeof BookingSchema>;