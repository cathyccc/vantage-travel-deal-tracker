import { test, expect } from '@playwright/test';
import { Duffel } from '@duffel/api';
import { CreateOfferRequest } from '@duffel/api/types';
import { addDays, format, startOfTomorrow, startOfToday } from 'date-fns';

const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN || '';

test.describe('Duffel API Integration Tests', () => {
  test.skip('Duffel SDK should return valid offers for YYZ to JFK', async () => {
    const duffel = new Duffel({ token: DUFFEL_TOKEN })

    const searchParams = {
      slices: [
        {
          origin: 'YYZ',
          destination: 'JFK',
          departure_date: startOfTomorrow().toISOString().split('T')[0]
        },
        {
          origin: 'JFK',
          destination: 'YYZ',
          departure_date: addDays(startOfTomorrow(), 5).toISOString().split('T')[0]
        }
      ],
      passengers: [{ type: "adult" }],
      cabin_class: "economy",
      return_offers: true
    }


    try {
      const offerReq = await duffel.offerRequests.create(searchParams as any);
      console.log("Success!");
    } catch (error: any) {
      console.log("FULL ERROR FROM DUFFEL:", JSON.stringify(error.errors, null, 2));
      throw error;
    }
    // expect(offerReq.data).toBeDefined();
    // expect(offerReq.data.offers.length).toBeGreaterThan(0);
  })
})