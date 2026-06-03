"use client";

import { FieldSeparator } from "@/components/ui/field";
import { Input } from "../ui/input";

import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "../ui/select";
import { useFormContext, Controller } from "react-hook-form";
import LoyaltyProgramSearch from "../search/LoyaltyProgramSearch";

export default function PassengerForm() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="px-6 py-5 text-xs">
      <p className="text-xs font-medium text-white mb-6">Traveller 1</p>
      <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block font-medium text-xs text-gray-300 mb-1">
            First Name*
          </label>
          <Input
            {...register("firstName")}
            id="firstName"
            type="text"
            name="firstName"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName.message as string}</p>}
        </div>

        <div>
          <label htmlFor="middleName" className="block font-medium text-xs text-gray-300 mb-1">
            Middle Name
          </label>
          <Input
            {...register("middleName")}
            type="text"
            id="middleName"
            name="middleName"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
        </div>

        <div className="col-span-full">
          <label htmlFor="lastName" className="block font-medium text-xs text-gray-300 mb-1">
            Last Name*
          </label>
          <Input
            {...register("lastName")}
            type="text"
            id="lastName"
            name="lastName"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName.message as string}</p>}
        </div>

        <div>
          <label htmlFor="dob" className="block font-medium text-xs text-gray-300 mb-1">
            Date of Birth*
          </label>
          <Input
            {...register("dob")}
            type="date"
            id="dob"
            name="dob"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {errors.dob && <p className="text-red-400 text-xs">{errors.dob.message as string}</p>}
        </div>

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="gender" className="block font-medium text-xs text-gray-300 mb-1">Gender*</label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full border-zinc-700">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-white text-sm  border-zinc-700" position="popper">
                  <SelectItem className="p-1 hover:bg-zinc-600" value="male">Male</SelectItem>
                  <SelectItem className="p-1 hover:bg-zinc-600" value="female">Female</SelectItem>
                  <SelectItem className="p-1 hover:bg-zinc-600" value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-400 text-xs">{errors.gender.message as string}</p>}
            </div>
          )}
        />

        <div className="col-span-full">
          <LoyaltyProgramSearch />
        </div>

        <div className="col-span-full">
          <label htmlFor="frequentFlyerNumber" className="block font-medium text-xs text-gray-300 mb-1">
            Frequent Flyer Number
          </label>
          <Input
            {...register("frequentFlyerNumber")}
            type="text"
            id="frequentFlyerNumber"
            name="frequentFlyerNumber"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {errors.frequentFlyerNumber && <p className="text-red-400 text-xs">{errors.frequentFlyerNumber.message as string}</p>}
        </div>
      </div>

      <FieldSeparator className="border-zinc-700 mb-2" />
      <div className="font-white text-xs mb-1">Known Traveller Details </div>
      <Input type="text" id="knownTravellerId" name="knownTravellerId" className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
        placeholder="Global Entry, NEXUS or SENTRI" />
    </div>
  )
}