import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';
import mockAPIResults from '../mock-data/api-results.json';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Toggle for testing
const USE_MOCK_DATA = true; // Set to false when ready to use real API

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const adults = searchParams.get('adults');

  try {
    // Use mock data during development
    if (USE_MOCK_DATA) {
      return NextResponse.json(mockAPIResults);
    }

    // receives 30 offers from API
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        errorCode: error.code,
        errorStatusCode: error.response?.statusCode,
        errorMessage: error.response?.result?.error,
        error: "Failed to search flights. Please try again"
      },
      { status: 500 }
    );
  }
}