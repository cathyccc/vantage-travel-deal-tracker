import AIRPORTS from './airports_feb2026.json';
import {
  format,
  parseISO,
  differenceInCalendarDays,
  intervalToDuration
} from 'date-fns';
import { DuffelSegment, DuffelSlice } from './duffel.types';

// export type FormErrors = Record<string, string[] | undefined>

export const FALLBACK_TIME = "Time TBD";

export function getLocationName(iataCode: string): string {
  if (!iataCode) return '';
  const findAirport = AIRPORTS.find(airport => airport.iata === iataCode);
  return findAirport?.city ?? iataCode;
}

export function getDepartureTimeToDestination(slices: DuffelSlice[]): string {
  const departureTime = slices[0]?.segments[0]?.departing_at;
  if (!departureTime) return FALLBACK_TIME;
  return format(departureTime, 'h:mm aaaa');
}
export function getArrivalTimeToDestination(slices: DuffelSlice[]): string {
  const arrivalTime: string = slices[1]?.segments?.[slices[1].segments.length - 1]?.arriving_at;
  if (!arrivalTime) return FALLBACK_TIME;
  return format(arrivalTime, 'h:mm aaaa');
}

interface Duration {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const getDuration = (startTime: string, endTime: string): string => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  const duration: Duration = intervalToDuration({ start, end });

  const timeArr: string[] = [];
  if (duration.days) timeArr.push(`${duration.days}d`)
  if (duration.hours) timeArr.push(`${duration.hours}h`);
  if (duration.minutes) timeArr.push(`${duration.minutes}m`);

  return timeArr.join(' ') || '0m';
}

interface Layover {
  layoverLocationCode: string;
  layoverCityName: string;
  layoverAirportName: string;
  layoverDuration: string;
}

export function getLayoverInfo(segments: DuffelSegment[]): Layover[] {
  const getLayoverCounts = segments.length - 1;
  if (getLayoverCounts <= 0) return [];

  const layovers: Layover[] = segments.slice(0, -1).map((segment, index) => {
    const nextSegment = segments[index + 1];
    return {
      layoverLocationCode: segment.destination.iata_code,
      layoverCityName: segment.destination.city_name,
      layoverAirportName: segment.destination.name,
      layoverDuration: getDuration(segment.arriving_at, nextSegment.departing_at)
    }
  });
  return layovers;
}

export function parseISODuration(isoDuration: string): string {
  if (!isoDuration) return "";
  const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/;
  const match = isoDuration.match(regex);
  if (!match) return "";
  const days = match[1] || null;
  const hours = match[2] || null;
  const min = match[3] || null;

  const durationArr: string[] = [];
  if (days) durationArr.push(`${days}d`);
  if (hours) durationArr.push(`${hours}h`);
  if (min) durationArr.push(`${min}m`);

  return durationArr.join(' ');
}

export function displayStops(num: number): string {
  if (num === 0) return `NON-STOP`;
  if (num === 1) return `1 STOP`;
  return `${num} STOPS`;
}

export function isNonStop(segments: DuffelSegment[]): boolean {
  return segments.length === 1;
}

interface BaggageAllowance { checked: number, carry_on: number }
export function getBaggageAllowanceInfo(segment: DuffelSegment): BaggageAllowance {
  let baggageObj = { checked: 0, carry_on: 0 };
  segment.passengers[0].baggages.forEach(bag => {
    baggageObj[bag.type] = bag.quantity;
  });
  return baggageObj;
}

export function formatCabinClassName(cabin: 'economy' | 'business'): string {
  return cabin.split('_').map(word =>
    word.charAt(0).toUpperCase() +
    word.slice(1).toLowerCase()
  )
    .join(' ');
}
export function displayDateDiff(segment: DuffelSegment): string {
  const dep = parseISO(segment.departing_at);
  const arr = parseISO(segment.arriving_at);
  const dateDiff = differenceInCalendarDays(arr, dep);

  return dateDiff > 0 ? `+${dateDiff}` : ''
}

interface FlightAmenities {
  freeWifi: 'partial' | 'full' | 'none';
  paidWifi: 'partial' | 'full' | 'none';
  extraLegroom: 'partial' | 'full' | 'none';
  power: 'partial' | 'full' | 'none';
}

export function fullFlightAmenities(slices: DuffelSlice[]): FlightAmenities {
  let amenities: Record<keyof FlightAmenities, boolean[]> = {
    freeWifi: [],
    paidWifi: [],
    extraLegroom: [],
    power: []
  }

  slices.forEach(slice => {
    slice.segments.forEach(seg => {
      const { amenities: am } = seg.passengers[0].cabin;
      const powerAvailability = am?.power.available || false;
      const hasExtraLegroom = am?.seat.legroom === 'more' || false;
      const wifiAvailable = am?.wifi.available || false;
      const wifiHasFee = am?.wifi.cost === 'paid' || false;

      amenities.power.push(powerAvailability);
      amenities.extraLegroom.push(hasExtraLegroom);
      amenities.freeWifi.push(wifiAvailable && !wifiHasFee);
      amenities.paidWifi.push(wifiAvailable && wifiHasFee);
    })
  });

  const processedAmenities = Object.fromEntries(
    Object.entries(amenities).map(([key, bools]) => {
      const allTrue = bools.every(val => val === true);
      const allFalse = bools.every(val => val === false);

      let status = 'partial';
      if (allTrue) status = 'full';
      if (allFalse) status = 'none';

      return [key, status];
    })
  )
  return processedAmenities as unknown as FlightAmenities;
}

export function getCarrierNames(slice: DuffelSlice): string {
  let carriers: string[] = [];

  slice.segments.forEach(seg => {
    carriers.push(seg.marketing_carrier.name);
  })

  if (carriers.length === 0) return "UnknownAirline";

  const uniqueCarriers: string[] = [...new Set(carriers)];
  if (uniqueCarriers.length === 1) return uniqueCarriers[0];
  return "Multiple Airlines";
}

export const displayGateNum = (gate: number | string | null): string => {
  if (!gate) return "";
  const isNumeric = !isNaN(Number(gate));
  return isNumeric ? `Terminal ${gate}` : `Concourse ${gate}`;
}