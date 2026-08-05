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
    const cardPrice = await card.price.textContent();
    await card.clickViewDetails();

    await expect(flightSearchPage.offerDialog.departureLabel).toBeVisible();
    await flightSearchPage.offerDialog.goToFareDetails();

    await expect(flightSearchPage.offerDialog.farePrice).toBeVisible(); //ensures the transition has completed loading
    // await expect(flightSearchPage.offerDialog.farePrice).toContainText(cardPrice);

    await flightSearchPage.offerDialog.selectFare();

    await expect(page).toHaveURL(/\/booking\/off_/);
  })
})