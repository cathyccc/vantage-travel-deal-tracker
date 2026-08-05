import { test, expect } from '@playwright/test';
import { FlightSearchPage } from '../pages/FlightSearchPage';
import { add, addDays, format, startOfTomorrow } from 'date-fns';

test.describe('Offer to Booking Flow @e2e', () => {
  let flightSearchPage: FlightSearchPage;

  test.beforeEach(async ({ page }) => {
    flightSearchPage = new FlightSearchPage(page);
    await flightSearchPage.goto();
  })

  test('user can go from search results to booking page with matching offer data', async ({ page }) => {
    await flightSearchPage.gotoWithScenario('nonstopLaxJfk');
    await flightSearchPage.completeSearchForm(
      'LAX', 'JFK', addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8), 1, 0, 0
    )

    const card = flightSearchPage.results.card(0);
    await expect(card.price).toContainText('306.57'); // total_amount from fixture
    await card.clickViewDetails();

    await expect(flightSearchPage.offerDialog.departureLabel).toBeVisible();
    await flightSearchPage.offerDialog.goToFareDetails();
    await expect(flightSearchPage.offerDialog.farePrice).toContainText('259.81'); // base_amount from fixture

    await expect(flightSearchPage.offerDialog.farePrice).toBeVisible();
    await flightSearchPage.offerDialog.selectFare();

    const offerId = await card.getOfferId();
    await expect(page).toHaveURL(new RegExp(`/booking/${offerId}`));
  })
})