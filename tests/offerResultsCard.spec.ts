import { test, expect } from '@playwright/test';
import { FlightSearchPage } from './pages/FlightSearchPage';
import { addDays, startOfTomorrow } from 'date-fns';

test.describe('Offer Results Card Details', () => {
  let flightSearchPage: FlightSearchPage;

  test.beforeEach(async ({ page }) => {
    flightSearchPage = new FlightSearchPage(page);
    await flightSearchPage.goto();
  })

  test('shows correct details for non-stop itinerary', async () => {
    await flightSearchPage.setScenario('nonstopLaxJfk');
    await flightSearchPage.completeSearchForm(
      'LAX', 'JFK',
      addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8),
      1, 0, 0
    );

    await expect(flightSearchPage.results.cards).toHaveCount(2);

    const card = flightSearchPage.results.card(0);
    await expect(card.departureCity).toHaveText('Los Angeles');
    await expect(card.arrivalCity).toHaveText('New York');
    await expect(card.price).toContainText(/306.57/);
    await expect(card.duration).toContainText('5h 52m');
    await expect(card.duration).toContainText(/NON-STOP/);
  })

  test('shows correct details for one-stop itinerary', async () => {
    await flightSearchPage.setScenario('oneStopYyzHnl');
    await flightSearchPage.completeSearchForm(
      'YYZ', 'HNL',
      addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8),
      1, 0, 0
    );

    await expect(flightSearchPage.results.cards).toHaveCount(2);

    const card = flightSearchPage.results.card(0);
    await expect(card.departureCity).toHaveText('Toronto');
    await expect(card.arrivalCity).toHaveText('Honolulu');
    await expect(card.price).toContainText(/1181.75/);
    await expect(card.duration).toContainText('12h 18m');
    await expect(card.duration).toContainText(/1 STOP/);
    await expect(card.layoverDuration('SFO')).toContainText('San Francisco');
    await expect(card.layoverDuration('SFO')).toContainText('1h 23m');
  })

  test('shows correct details for two-stop itinerary', async () => {
    await flightSearchPage.setScenario('twoStopsLgwSyd');
    await flightSearchPage.completeSearchForm(
      'LGW', 'SYD',
      addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8),
      1, 0, 0
    );

    await expect(flightSearchPage.results.cards).toHaveCount(1);

    const card = flightSearchPage.results.card(0);
    await expect(card.departureCity).toHaveText('London');
    await expect(card.arrivalCity).toHaveText('Sydney');
    await expect(card.price).toContainText(/1160.15/);
    await expect(card.duration).toContainText('1d 2h 35m');
    await expect(card.duration).toContainText(/2 STOP/);
    await expect(card.layoverDuration('ZRH')).toContainText('Zurich');
    await expect(card.layoverDuration('ZRH')).toContainText('1h 25m');
    await expect(card.layoverDuration('HKG')).toContainText('Hong Kong');
    await expect(card.layoverDuration('HKG')).toContainText('2h 25m');
  })
})