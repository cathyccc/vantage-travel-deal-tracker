import { Duffel } from '@duffel/api';

const duffel = new Duffel ({token: process.env.DUFFEL_ACCESS_TOKEN})

// Toggle for testing
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && process.env.USE_MOCK === 'true'; // Set to false when ready to use real API

export async function searchOffers({originLocationCode, destinationLocationCode, adults, departureDate, returnDate}) {
  if (USE_MOCK_DATA) {
    const mockModule = await import('./mock-data/duffel-api-results.json');
    return mockModule.default.data;
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
  });

  const offers = await duffel.offers.list({
    offer_request_id: offerRequest.data.id,
    sort: 'total_amount',
    currency: 'CAD'
  })

  return {
    offerRequestId: offerRequest.data.id,
    offers: offers.data
  };
}

export async function getOffer(offerId) {
  if (USE_MOCK_DATA) {
    const mockModule = await import('./mock-data/duffel-api-results.json');
    const mockOffer = mockModule.default.data.offers.find(o => o.id === offerId);
    if (!mockOffer) throw new Error("Mock offer not found");
    return mockOffer;
  }

  try {
    const offer = await duffel.offers.get(offerId);
    return offer.data;
  } catch (error) {
    console.error('getOffer failed:', error);
    const duffelMessage = error?.errors?.[0]?.message;
    const status = error?.meta?.status;

    throw new Error(duffelMessage ?? `Failed to load offer (status: ${status ?? 'unknown'})`);
  }
}