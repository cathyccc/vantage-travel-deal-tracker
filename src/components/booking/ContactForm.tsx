"use client";
import { Input } from "../ui/input";
import PhoneInput from "react-phone-number-input";
import { useFormContext, Controller } from "react-hook-form";

export default function ContactForm() {
  const { register, control, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  return (
    <div className="px-6 py-5 text-xs">
      <p className="text-xs text-gray-400 mb-6">Tell us where we can reach you in the event of a change in itinerary. Your email will be the main point of contact.</p>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Input
            {...register("contactEmail")}
            type="email"
            id="contactEmail"
            placeholder="Email*"
            className="w-full border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
          />
          {errors.contactEmail && <p className="text-red-400 text-xs">{errors.contactEmail.message as string}</p>}
        </div>

        <div>
          <Controller
            name="contactPhone"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <PhoneInput
                  international
                  defaultCountry="CA"
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 123 456 7890"
                  onChange={(val) => onChange(val ?? "")}
                  value={value || undefined}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                />
              )
            }}
          />
          {errors.contactPhone && <p className="text-red-400 text-xs">{errors.contactPhone.message as string}</p>}
        </div>
      </div>
    </div>
  )
}