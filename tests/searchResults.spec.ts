import { test, expect } from '@playwright/test';
import { FlightSearchPage } from './pages/FlightSearchPage';
import { addDays, format, startOfTomorrow } from 'date-fns';

test.describe('Search Results', () => {
  let flightSearchPage: FlightSearchPage;

  test.beforeEach(async ({ page }) => {
    flightSearchPage = new FlightSearchPage(page);
    await flightSearchPage.goto();
  })

  test('displays the correct route banner', async () => {
    await flightSearchPage.setScenario('nonstopLaxJfk');
    await flightSearchPage.completeSearchForm('LAX', 'JFK', addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8), 1, 0, 0);
    await expect(flightSearchPage.results.banner).toHaveText(/LOS ANGELES.*NEW YORK/);
  })

  test('shows nonstop itinerary', async () => {
    await flightSearchPage.setScenario('nonstopLaxJfk');
    await flightSearchPage.completeSearchForm('LAX', 'JFK', addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8), 1, 0, 0);
    const card = flightSearchPage.results.card(0);

    await expect(card.departureCity).toHaveText(/Los Angeles/);
    await expect(card.arrivalCity).toHaveText(/New York/);
    await expect(card.price).not.toBeEmpty();
    await expect(card.duration).toContainText(/NON-STOP/);
  })

  test('shows one-stop itinerary', async () => {
    await flightSearchPage.setScenario('oneStopYyzHnl');
    await flightSearchPage.completeSearchForm('YYZ', 'HNL', addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8), 1, 0, 0);
    const card = flightSearchPage.results.card(0);

    await expect(card.departureCity).toHaveText(/Toronto/);
    await expect(card.arrivalCity).toHaveText(/Honolulu/);
    await expect(card.price).not.toBeEmpty();
    await expect(card.duration).toContainText(/1 STOP/);
  })

  test('shows two-stop itinerary', async () => {
    await flightSearchPage.setScenario('twoStopsLgwSyd');
    await flightSearchPage.completeSearchForm('LGW', 'SYD', addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8), 1, 0, 0);
    const card = flightSearchPage.results.card(0);

    await expect(card.departureCity).toHaveText(/London/);
    await expect(card.arrivalCity).toHaveText(/Sydney/);
    await expect(card.price).not.toBeEmpty();
    await expect(card.duration).toContainText(/2 STOPS/);
  })
})