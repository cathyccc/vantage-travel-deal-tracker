"use client";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";

export default function ContactForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="px-6 py-5 text-xs">
      <p className="text-xs text-gray-400 mb-6">Tell us where we can reach you in the event of a change in itinerary. Your email will be the main point of contact.</p>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Input
            {...register("contactEmail")}
            type="email"
            id="contactEmail"
            name="contactEmail"
            placeholder="Email*"
            className="w-full border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
          />
          {errors.contactEmail && <p className="text-red-400 text-xs">{errors.contactEmail.message as string}</p>}
        </div>

        <div>
          <Input
            {...register("contactPhone")}
            type="tel"
            id="contactPhone"
            name="contactPhone"
            placeholder="Phone Number*"
            className="w-full border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
          />
          {errors.contactPhone && <p className="text-red-400 text-xs">{errors.contactPhone.message as string}</p>}
        </div>
      </div>
    </div>
  )
}