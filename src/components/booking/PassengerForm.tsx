"use client";

import { FieldSeparator } from "@/components/ui/field";
import { Input } from "../ui/input";
import { BookingFormFields } from "@/lib/schemas/booking";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "../ui/select";
import { useFormContext, Controller, type Path } from "react-hook-form";
import { formatPassengerType } from "@/lib/flightUtils";
import LoyaltyProgramSearch from "../search/LoyaltyProgramSearch";

export default function PassengerForm({ index, passengerType, passengerAge, passengerId }: { index: number; passengerType?: "adult" | "child" | "infant_without_seat"; passengerAge?: string, passengerId?: string }) {
  const { register, control, formState: { errors } } = useFormContext<BookingFormFields>();
  const path = `passengers.${index}`;
  const getError = (fieldName: keyof BookingFormFields['passengers'][number]) => {
    const error = errors?.passengers?.[index]?.[fieldName];
    return error ? (error.message as string) : null;
  };

  return (
    <div className="px-6 py-5 text-xs">
      <p className="text-xs font-medium text-white mb-6">
        {`Traveller ${index + 1} - ${formatPassengerType(passengerType ?? "adult")}`} {passengerType !== "adult" && ` (Age: ${passengerAge})`}
      </p>
      <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input type="hidden" value={passengerId} {...register(`${path}.passengerId` as Path<BookingFormFields>)} />
        <Input type="hidden" value={passengerType} {...register(`${path}.passengerType` as Path<BookingFormFields>)} />
        <div>
          <label htmlFor="firstName" className="block font-medium text-xs text-gray-300 mb-1">
            First Name*
          </label>
          <Input
            {...register(`${path}.firstName` as Path<BookingFormFields>)}
            id="firstName"
            type="text"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {getError("firstName") && <p className="text-red-400 text-xs">{getError("firstName")}</p>}
        </div>

        <div>
          <label htmlFor="middleName" className="block font-medium text-xs text-gray-300 mb-1">
            Middle Name
          </label>
          <Input
            {...register(`${path}.middleName` as Path<BookingFormFields>)}
            type="text"
            id="middleName"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {getError("middleName") && <p className="text-red-400 text-xs">{getError("middleName")}</p>}
        </div>

        <div className="col-span-full">
          <label htmlFor="lastName" className="block font-medium text-xs text-gray-300 mb-1">
            Last Name*
          </label>
          <Input
            {...register(`${path}.lastName` as Path<BookingFormFields>)}
            type="text"
            id="lastName"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {getError("lastName") && <p className="text-red-400 text-xs">{getError("lastName")}</p>}
        </div>

        <div>
          <label htmlFor="dob" className="block font-medium text-xs text-gray-300 mb-1">
            Date of Birth*
          </label>
          <Input
            {...register(`${path}.dob` as Path<BookingFormFields>)}
            type="date"
            id="dob"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {getError("dob") && <p className="text-red-400 text-xs">{getError("dob")}</p>}
        </div>

        <Controller
          name={`passengers.${index}.gender` as const}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <label htmlFor="gender" className="block font-medium text-xs text-gray-300 mb-1">Gender*</label>
              <Select onValueChange={onChange} value={value ?? ""}>
                <SelectTrigger className="w-full border-zinc-700">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-white text-sm  border-zinc-700" position="popper">
                  <SelectItem className="p-1 hover:bg-zinc-600" value="male">Male</SelectItem>
                  <SelectItem className="p-1 hover:bg-zinc-600" value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {getError("gender") && <p className="text-red-400 text-xs">{getError("gender")}</p>}
            </div>
          )}
        />

        <div className="col-span-full">
          <LoyaltyProgramSearch path={`passengers.${index}.loyaltyProgram` as Path<BookingFormFields>} />
        </div>

        <div className="col-span-full">
          <label htmlFor="frequentFlyerNumber" className="block font-medium text-xs text-gray-300 mb-1">
            Frequent Flyer Number
          </label>
          <Input
            {...register(`${path}.frequentFlyerNumber` as Path<BookingFormFields>)}
            type="text"
            id="frequentFlyerNumber"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-transparent"
          />
          {getError("frequentFlyerNumber") && <p className="text-red-400 text-xs">{getError("frequentFlyerNumber")}</p>}
        </div>
      </div>

      <FieldSeparator className="border-zinc-700 mb-2" />
      <div className="font-white text-xs mb-1">Known Traveller Details </div>
      <Input
        {...register(`${path}.knownTravellerId` as Path<BookingFormFields>)}
        type="text"
        id="knownTravellerId"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-transparent"
        placeholder="Global Entry, NEXUS or SENTRI" />
    </div>
  )
}