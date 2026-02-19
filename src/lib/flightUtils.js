import { GLOBAL_AIRLINES_300 as CARRIER_NAMES } from './top300carriers_feb2026';
import AIRPORTS from './airports_feb2026.json';
import { AIRCRAFTS } from './aircraft_codes.js';
import { format, parseISO, intervalToDuration } from 'date-fns';

export function getLocationName(iataCode) {
  if (!iataCode) return '';
  const findAirport = AIRPORTS.find(airport => airport.iata === iataCode);
  return findAirport? findAirport.city : iataCode;
}

export function getAirportName(iataCode) {
  if (!iataCode) return '';
  const findAirport = AIRPORTS.find(airport => airport.iata === iataCode);
  return findAirport? findAirport.name : iataCode;
}

export function getAirlineName(carrierCode) {
  if (!carrierCode) return '';
  const findAirline = CARRIER_NAMES[carrierCode];
  return findAirline? findAirline : carrierCode;
}

export function extractUniqueAirlinesForFullTrip(itineraries) {
  const uniqueAirlines = new Map();
  
  itineraries.forEach(itinerary => {
    itinerary.segments.forEach(segment => {
      const marketingCarrier = segment.carrierCode;
      const operatingCarrier = segment.operating?.carrierCode;
      const operatingName = segment.operating?.carrierName;
      const isCodeShare = operatingCarrier !== marketingCarrier

      const airline = {
        marketingCarrier,
        marketingName: CARRIER_NAMES[marketingCarrier] || marketingCarrier,
        operatingCarrier: isCodeShare ? operatingCarrier : undefined,
        operatingName: isCodeShare ? (operatingName || CARRIER_NAMES[operatingCarrier] || operatingCarrier) : undefined,
        isCodeShare
      }

      const key = JSON.stringify(airline);

      if (!uniqueAirlines.has(key)) {
        uniqueAirlines.set(key, airline)
      }
    })
  })

  return Array.from(uniqueAirlines.values());
}

export function getDepartureTimeToDestination(itineraries) {
  const departureTime = itineraries[0].segments[0].departure.at;
  return format(departureTime, 'h:mm aaaa');
}

export function getArrivalTimeToDestination(itineraries) {
  const arrivalTime = itineraries[1].segments[itineraries[1].segments.length-1].arrival.at;
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

  const layovers = segments.slice(0, `-${getLayoverCounts}`).map((segment, index) => {
    const nextSegment = segments[index+1];
    return {
      layoverLocationCode: segment.arrival.iataCode,
      duration: getDuration(segment.arrival.at, nextSegment.departure.at)
    }
  });

  return layovers;
}

export function parseISODuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = match[1];
  const min = match[2];

  const durationArr = [];
  if (hours) durationArr.push(`${hours}h`);
  if (min) durationArr.push(`${min}m`);
  
  return durationArr.join(' ');
}

export function displayStops(num) {
  if (num === 0) return `NON-STOP`;
  if (num === 1) return `1 STOP`;
  if (num > 1) return `${stops} STOPS`;
}

export function isNonStop(segments) {
  return segments.length === 1;
}

export function getAircraftName(iataCode) {
  if (!iataCode) return '';
  const findAircraft = AIRCRAFTS[iataCode];
  return findAircraft? findAircraft : 'Unknown aircraft';
}

export function getFareDetailsForSegment(id, fullDetails) {
  const segmentDetails = fullDetails.find((seg) => seg.segmentId === id);
  return segmentDetails ? segmentDetails : {};
}

export function getTimezoneAbbr(iata) {
  const airport = AIRPORTS.find(airport => airport.iata === iata);
  const timeZone = airport.timezone;
  try {
    const tz = new Intl.DateTimeFormat('en-US', {timeZone, timeZoneName: 'short'})
    return tz.formatToParts(new Date()).find(part => part.type === 'timeZoneName').value
  } catch (err) {
    console.error(err)
    return null;
  }
}