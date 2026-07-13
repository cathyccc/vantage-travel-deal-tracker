import { test, expect } from '@playwright/test';
import { FlightSearchPage } from './pages/FlightSearchPage';
import { addDays, format, startOfTomorrow } from 'date-fns';

test.describe('Search Results', () => {
  let flightSearchPage: FlightSearchPage;

  test.beforeEach(async ({ page }) => {
    flightSearchPage = new FlightSearchPage(page);
    await flightSearchPage.goto();
    await flightSearchPage.completeSearchForm('LAX', 'JFK', addDays(startOfTomorrow(), 1), addDays(startOfTomorrow(), 8), 2, 1, 0);
  })

  test('displays the correct route banner', async () => {
    await expect(flightSearchPage.results.banner).toHaveText(/LAX.*JFK/)
  })

  test('first offer card shows correct flight summary', async () => {
    const card = flightSearchPage.results.card(0);

    await expect(card.departureCity).toHaveText('Los Angeles');
    await expect(card.arrivalCity).toHaveText('New York');
    await expect(card.price).not.toBeEmpty();
    await expect(card.duration).toContainText('stop')
  })
})