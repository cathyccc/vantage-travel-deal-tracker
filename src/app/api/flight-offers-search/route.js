import { NextResponse } from 'next/server';
import { Duffel } from '@duffel/api';

const duffel = new Duffel ({token: process.env.DUFFEL_ACCESS_TOKEN})

// Toggle for testing
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && process.env.USE_MOCK === 'true'; // Set to false when ready to use real API

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');

  try {
    if (USE_MOCK_DATA) {
      const mockModule = await import('../mock-data/duffel-api-results.json');
      const mockAPIResults = mockModule.default.data;
      return NextResponse.json(mockAPIResults);
    }
    const slices = [
      {
        origin: originLocationCode,
        destination: destinationLocationCode,
        departure_date: departureDate
      },
      {
        origin: destinationLocationCode,
        destination: originLocationCode,
        departure_date: returnDate
      }
    ];
    const passengers = Array.from({ length: adults }, () => ({ type: "adult" }));

    const offerRequest =  await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class: "economy",
      return_offers: true
    })

    const offers = await duffel.offers.list({
      offer_request_id: offerRequest.data.id,
      sort: 'total_amount',
      currency: 'CAD'
    })

    return NextResponse.json({
      offerRequestId: offerRequest.data.id,
      offers: offers.data
    });
  } catch (error) {
    console.error("Duffel API Failure:", error.errors);
    const statusCode = error.meta?.status || 500;

    return NextResponse.json({
      message: error.errors[0]?.message,
      type: error.errors[0].type || "api_error"
    }, { status: statusCode});
  }
}