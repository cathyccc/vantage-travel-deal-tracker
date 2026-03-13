import AIRPORTS from './airports_feb2026.json';
import { AIRCRAFTS } from './aircraft_codes.js';
import { format,
         parseISO,
         differenceInCalendarDays,
         intervalToDuration } from 'date-fns';

export function getLocationName(iataCode) {
  if (!iataCode) return '';
  const findAirport = AIRPORTS.find(airport => airport.iata === iataCode);
  return findAirport? findAirport.city : iataCode;
}

export function getDepartureTimeToDestination(slices) {
  const departureTime = slices[0].segments[0].departing_at;
  return format(departureTime, 'h:mm aaaa');
}

export function getArrivalTimeToDestination(slice) {
  const arrivalTime = slice[1].segments[slice[1].segments.length-1].arriving_at;
  return format(arrivalTime, 'h:mm aaaa');
}

const getDuration = (startTime, endTime) => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  const duration = intervalToDuration({start, end});

  const timeArr = [];
  if (duration.hours) timeArr.push(`${duration.hours}h`);
  if (duration.minutes) timeArr.push(`${duration.minutes}m`);

  return timeArr.join(' ');
}

export function getLayoverInfo(segments) {
  const getLayoverCounts = segments.length - 1;
  if (getLayoverCounts <= 0) return [];

  const layovers = segments.slice(0, -1).map((segment, index) => {
    const nextSegment = segments[index+1];
    return {
      layoverLocationCode: segment.destination.iata_code,
      layoverCityName: segment.destination.city_name,
      layoverAirportName: segment.destination.name,
      layoverDuration: getDuration(segment.arriving_at, nextSegment.departing_at)
    }
  });
  return layovers;
}

export function parseISODuration(isoDuration) {
  if (!isoDuration) return "";
  const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/;
  const match = isoDuration.match(regex);
  if (!match) return "";
  const days = match[1] || null;
  const hours = match[2] || null;
  const min = match[3] || null;

  const durationArr = [];
  if (days) durationArr.push(`${days}d`);
  if (hours) durationArr.push(`${hours}h`);
  if (min) durationArr.push(`${min}m`);
  
  return durationArr.join(' ');
}

export function displayStops(num) {
  if (num === 0) return `NON-STOP`;
  if (num === 1) return `1 STOP`;
  if (num > 1) return `${num} STOPS`;
}

export function isNonStop(segments) {
  return segments.length === 1;
}

export function getAircraftName(iataCode) {
  if (!iataCode) return '';
  const findAircraft = AIRCRAFTS[iataCode];
  return findAircraft? findAircraft : 'Unknown aircraft';
}

export function getBaggageAllowanceInfo(segment) {
  let baggageObj = {};
  segment.passengers[0].baggages.forEach(bag => baggageObj[bag.type] = bag.quantity);
  return baggageObj;
}

export function formatCabinClassName(cabin) {
  return cabin.split('_').map(word =>
      word.charAt(0).toUpperCase() + 
      word.slice(1).toLowerCase()
    )
    .join(' ');
}

export function displayDateDiff(segment) {
  const dep = parseISO(segment.departing_at);
  const arr = parseISO(segment.arriving_at);
  const dateDiff = differenceInCalendarDays(arr, dep);

  return dateDiff > 0? `+${dateDiff}`: ''
}

export function fullFlightAmenities(slices) {
  let amenities = {
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
    Object.entries(amenities).map(([key, subArray]) => {
      const allTrue = subArray.every(val => val === true);
      const allFalse = subArray.every(val => val === false);

      let status = 'partial';
      if (allTrue) status = 'full';
      if (allFalse) status = 'none';

      return [key, status];
    })
  )
  return processedAmenities;
}

export function getCarrierNames(slice) {
  let carriers = [];

  slice.segments.forEach(seg => {
    carriers.push(seg.marketing_carrier.name);
  })

  const uniqueCarriers = [...new Set(carriers)];;
  if (uniqueCarriers.length === 0) return "Unknown Airline";
  if (uniqueCarriers.length === 1) return uniqueCarriers[0];
  if (uniqueCarriers.length === 2) return "Multiple Airlines";
}

export const displayGateNum = (char) => {
  return !isNaN(char) ? `Terminal ${char}`: `Concourse ${char}`;
}