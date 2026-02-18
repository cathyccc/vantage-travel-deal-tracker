import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Toggle for testing
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && process.env.USE_MOCK === 'true'; // Set to false when ready to use real API

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');

  try {
    // Use mock data during development
    if (USE_MOCK_DATA) {
      const mockModule = await import('../mock-data/api-results.json');
      const mockAPIResults = mockModule.default;
      return NextResponse.json(mockAPIResults);
    }

    // receives 30 offers from API
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      currencyCode: "CAD",
      max:30
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