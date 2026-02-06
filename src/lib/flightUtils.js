import { GLOBAL_AIRLINES_300 as CARRIER_NAMES } from './top300carriers_feb2026';
import { AIRPORTS } from './top396airport_hubs_feb2026';
import { format, parseISO, intervalToDuration } from 'date-fns';

export function getLocationName(iataCode) {
  const findAirport = AIRPORTS.find(airport => airport.iata === iataCode);
  return findAirport? findAirport.city : iataCode;
}

export function extractUniqueAirlines(itineraries) {
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

export function getDepartureTimeToDestination(itineraries, formData) {
  if (!formData) return null;
  const originCode = formData.originLocationCode;
  
  const segment = itineraries
    .flatMap(itinerary => itinerary.segments)
    .find(segment => segment.departure.iataCode === originCode);
  
  if (segment) {
    const departureTime = segment.departure.at;
    return format(departureTime, 'h:mm aaaa');
  }
  
  return null;
}

export function getArrivalTimeToDestination(itineraries, formData) {
  if (!formData) return null;
  const destinationCode = formData.destinationLocationCode;

  const segment = itineraries
    .flatMap(itinerary => itinerary.segments)
    .find(segment => segment.arrival.iataCode === destinationCode);
  
  if (segment) {
    const arrivalTime = segment.arrival.at;
    return format(arrivalTime, 'h:mm aaaa');
  }
  
  return null;
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
  if (getLayoverCounts <= 0) return null;

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