import AIRPORTS from './airports_feb2026.json';
import { AIRCRAFTS } from './aircraft_codes.js';
import { format, parseISO, intervalToDuration } from 'date-fns';

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

export function getTimezoneAbbr(timezone) {
  const tz = new Intl.DateTimeFormat('en-US', {timezone, timeZoneName: 'short'})
  return tz.formatToParts(new Date()).find(part => part.type === 'timeZoneName').value
}