import { Duffel } from '@duffel/api';

const duffel = new Duffel ({token: process.env.DUFFEL_ACCESS_TOKEN})

// Toggle for testing
const isMock = () => process.env.NODE_ENV === 'development' && process.env.USE_MOCK === 'true'; // Set to false when ready to use real API

export async function searchOffers({originLocationCode, destinationLocationCode, adults, children, departureDate, returnDate}) {
  if (isMock()) {
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
  const adultPassengers = Array.from({ length: adults }, () => ({ type: "adult" }));
  const childrenPassengers = Array.from({ length: children}, () => ({ age: 10 }));
  const passengers = [...adultPassengers, ...childrenPassengers];

  const offerRequest =  await duffel.offerRequests.create({
    slices,
    passengers,
    cabin_class: "economy",
    return_offers: true
  });

  const offers = await duffel.offers.list({
    offer_request_id: offerRequest.data.id,
    sort: 'total_amount'
  })

  return {
    offerRequestId: offerRequest.data.id,
    offers: offers.data
  };
}

export async function getOffer(offerId) {
  if (isMock()) {
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

export async function createDuffelOrder({ offerId, passengers, payment }) {
  try {
    const order = await duffel.orders.create({
      selected_offers: [offerId],
      type: "instant",
      passengers,
      payments: [payment],
    });
  
    return order.data;
  } catch (error) {
    console.error('createDuffelOrder failed:', error);
    const duffelMessage = error?.errors?.[0]?.message;
    const status = error?.meta?.status;

    throw new Error(duffelMessage ?? `Failed to create order (status: ${status ?? 'unknown'})`);
  }
}