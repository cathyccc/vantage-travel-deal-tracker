"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";

export default function PaymentForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="px-6 py-5 text-xs">
      <h2 className="text-sm font-medium mb-4">Payment Information</h2>
      <p className="text-xs text-gray-400 mb-6">This is a demo. No actual payment will be processed.</p>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="cardNumber" className="block font-medium text-gray-300 mb-1">
            Card Number
          </label>
          <Input
            {...register("cardNumber")}
            type="text"
            inputMode="numeric"
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength={16}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {errors.cardNumber && <p className="text-red-400 text-xs">{errors.cardNumber.message as string}</p>}
        </div>

        <div>
          <label htmlFor="cardHolderName" className="block font-medium text-gray-300 mb-1">
            Name on Card
          </label>
          <Input
            {...register("cardHolderName")}
            type="text"
            id="cardHolderName"
            name="cardHolderName"
            placeholder="John Doe"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
          />
          {errors.cardHolderName && <p className="text-red-400 text-xs">{errors.cardHolderName.message as string}</p>}
        </div>

        <div className="flex flex-wrap">
          <div className="w-25 flex-none">
            <label htmlFor="expiryMM" className="block font-medium text-gray-300 mb-1">
              Expiration Month
            </label>
            <Input
              {...register("expiryMM")}
              type="text"
              inputMode="numeric"
              id="expiryMM"
              name="expiryMM"
              placeholder="MM"
              maxLength={2}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
            />
            {errors.expiryMM && <p className="text-red-400 text-xs">{errors.expiryMM.message as string}</p>}
          </div>

          <div className="w-25 flex-none ml-2">
            <label htmlFor="expiryYYYY" className="block font-medium text-gray-300 mb-1">
              Expiration Year
            </label>
            <Input
              {...register("expiryYYYY")}
              type="text"
              inputMode="numeric"
              id="expiryYYYY"
              name="expiryYYYY"
              placeholder="YYYY"
              maxLength={4}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
            />
            {errors.expiryYYYY && <p className="text-red-400 text-xs">{errors.expiryYYYY.message as string}</p>}
          </div>

          <div className="w-25 flex-none ml-2">
            <label htmlFor="cvv" className="block font-medium text-gray-300 mb-1">
              CVV
            </label>
            <Input
              {...register("cvv")}
              type="text"
              inputMode="numeric"
              id="cvv"
              name="cvv"
              placeholder="123"
              maxLength={4}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
            />
            {errors.cvv && <p className="text-red-400 text-xs">{errors.cvv.message as string}</p>}
          </div>
        </div>

        <h2 className="text-sm font-medium mb-4 mt-6">Billing Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="col-span-full">
            <label htmlFor="streetAddress" className="block font-medium text-gray-300 mb-1 text-xs">
              Street Address*
            </label>
            <Input
              {...register("streetAddress")}
              id="streetAddress"
              type="text"
              name="streetAddress"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
            />
            {errors.streetAddress && <p className="text-red-400 text-xs">{errors.streetAddress.message as string}</p>}
          </div>

          <div className="col-span-full">
            <label htmlFor="city" className="block font-medium text-gray-300 mb-1 text-xs">
              City*
            </label>
            <Input
              {...register("city")}
              id="city"
              type="text"
              name="city"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
            />
            {errors.city && <p className="text-red-400 text-xs">{errors.city.message as string}</p>}
          </div>

          <div className="col-span-full">
            <label htmlFor="stateOrProvince" className="block font-medium text-gray-300 mb-1 text-xs">
              State/Province*
            </label>
            <Input
              {...register("stateOrProvince")}
              id="stateOrProvince"
              type="text"
              name="stateOrProvince"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
            />
            {errors.stateOrProvince && <p className="text-red-400 text-xs">{errors.stateOrProvince.message as string}</p>}
          </div>

          <div>
            <label htmlFor="country" className="block font-medium text-gray-300 mb-1 text-xs">
              Country*
            </label>
            <Input
              {...register("country")}
              id="country"
              type="text"
              name="country"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
            />
            {errors.country && <p className="text-red-400 text-xs">{errors.country.message as string}</p>}
          </div>

          <div>
            <label htmlFor="postalCode" className="block font-medium text-gray-300 mb-1 text-xs">
              Zip Code / Postal Code
            </label>
            <Input
              {...register("postalCodeOrZip")}
              id="postalCodeOrZip"
              type="text"
              name="postalCodeOrZip"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
            />
            {errors.postalCodeOrZip && <p className="text-red-400 text-xs">{errors.postalCodeOrZip.message as string}</p>}
          </div>

          <div className="col-span-full">
            <label htmlFor="email" className="block font-medium text-gray-300 mb-1 text-xs">
              Email Address*
            </label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              name="email"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message as string}</p>}
          </div>

          <div className="col-span-full">
            <label htmlFor="phone" className="block font-medium text-gray-300 mb-1 text-xs">
              Phone*
            </label>
            <Input
              {...register("phone")}
              id="phone"
              type="tel"
              name="phone"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
            />
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message as string}</p>}
          </div>
        </div>
      </div >
    </div >
  )
}