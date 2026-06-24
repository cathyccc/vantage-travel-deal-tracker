import { test, expect } from '@playwright/test';
import { addDays, format, startOfTomorrow, startOfToday } from 'date-fns';
import { FlightSearchPage } from './pages/FlightSearchPage';

interface TestDate {
  date: Date,
  accessibleName: string,
  month: string,
  displayedValue: string,
  url: string
}

const getDateData = (baseDate: Date, daysToAdd = 0): TestDate => {
  const date = addDays(baseDate, daysToAdd)
  return {
    date,
    accessibleName: format(date, 'EEEE, MMMM do, yyyy'),
    month: format(date, 'M'),
    displayedValue: format(date, 'MMM d, yyyy'),
    url: format(date, "yyyy-MM-dd")
  }
}

test.describe('Flight Search Page', () => {
  let searchPage: FlightSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new FlightSearchPage(page);
    await searchPage.goto();
  });

  test('search form has all required fields and submit button @smoke', async () => {
    await searchPage.expectAllFieldsToBeVisible();
  });

  test('shows error when search form is empty @smoke @regression', async () => {
    await searchPage.submitSearch();
    await expect(searchPage.originError).toBeVisible();
    await expect(searchPage.destinationError).toBeVisible();
    await expect(searchPage.departureDateError).toBeVisible();
    await expect(searchPage.returnDateError).toBeVisible();
  });

  test('user can select origin and destinations airports @regression', async () => {
    await searchPage.fillOrigin("YYZ");
    await searchPage.fillDestination("YVR");
    await expect(searchPage.originInput).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
    await expect(searchPage.destinationInput).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");
  });

  test('shows no results when user types unmatched search @regression', async () => {
    await searchPage.inputOrigin("ZZZZ");
    await searchPage.expectNoAirportResults();
  });

  test('shows error when origin and destination are the same @regression', async () => {
    await searchPage.fillOrigin("YYZ");
    await searchPage.fillDestination("YYZ");
    await expect(searchPage.destinationError).toHaveText('Origin and destination cannot be the same');
  });

  test('user can select departure and return dates @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 3);
    const returnDate = addDays(startOfTomorrow(), 7);

    await searchPage.fillDateSelector('departure', departureDate);
    await searchPage.fillDateSelector('return', returnDate);
    await expect(searchPage.dateDisplay(departureDate)).toBeVisible();
    await expect(searchPage.dateDisplay(returnDate)).toBeVisible();
  });

  test('user cannot select an arrival date before the selected departure date @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 8);
    const returnDate = addDays(startOfTomorrow(), 2);

    await searchPage.fillDateSelector('departure', departureDate);
    await searchPage.expectDateToBeDisabled('return', returnDate);
  });

  test('user cannot select a departure date after the selected return date @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 8);
    const returnDate = addDays(startOfTomorrow(), 2);

    await searchPage.fillDateSelector('return', returnDate);
    await searchPage.expectDateToBeDisabled('departure', departureDate);
  });

  test('user can adjust number of adult passenger details @regression', async () => {
    await expect(searchPage.adultPassengerCounter).toHaveText('1');
    await searchPage.increasePassengerCounter('adults');
    await expect(searchPage.adultPassengerCounter).toHaveText('2');
    await searchPage.decreasePassengerCounter('adults');
    await expect(searchPage.adultPassengerCounter).toHaveText('1');
  })

  test('user can adjust number of children passenger details @regression', async () => {
    await expect(searchPage.childPassengerCounter).toHaveText('0');
    await searchPage.increasePassengerCounter('children');
    await expect(searchPage.childPassengerCounter).toHaveText('1');
    await searchPage.decreasePassengerCounter('children');
    await expect(searchPage.childPassengerCounter).toHaveText('0');
  })

  test('user can adjust number of infants passenger details @regression', async () => {
    await expect(searchPage.infantPassengerCounter).toHaveText('0');
    await searchPage.increasePassengerCounter('infants');
    await expect(searchPage.infantPassengerCounter).toHaveText('1');
    await searchPage.decreasePassengerCounter('infants');
    await expect(searchPage.infantPassengerCounter).toHaveText('0');
  })

  test('passenger count cannot exceed 9 @regression', async () => {
    await expect(searchPage.adultPassengerCounter).toHaveText('1');
    for (let i = 0; i < 8; i++) {
      await searchPage.increasePassengerCounter('adults');
    }

    await searchPage.expectDisabledIncreaseButton('adults');
    await expect(searchPage.adultPassengerCounter).toHaveText('9');
  })

  test('adult passenger count cannot be less than 1 @regression', async () => {
    await expect(searchPage.adultPassengerCounter).toHaveText('1');
    await searchPage.increasePassengerCounter('adults');
    await expect(searchPage.adultPassengerCounter).toHaveText('2');
    await searchPage.decreasePassengerCounter('adults');;
    await expect(searchPage.adultPassengerCounter).toHaveText('1');
    await searchPage.expectDisabledDecreaseButton('adults');
  });

  test('children passenger count cannot be less than 0 @regression', async () => {
    await expect(searchPage.childPassengerCounter).toHaveText('0');
    await searchPage.increasePassengerCounter('children');
    await expect(searchPage.childPassengerCounter).toHaveText('1');
    await searchPage.decreasePassengerCounter('children');
    await expect(searchPage.childPassengerCounter).toHaveText('0');
    await searchPage.expectDisabledDecreaseButton('children');
  });

  test('infants passenger count cannot be less than 0 @regression', async () => {
    await expect(searchPage.infantPassengerCounter).toHaveText('0');
    await searchPage.increasePassengerCounter('infants');
    await expect(searchPage.infantPassengerCounter).toHaveText('1');
    await searchPage.decreasePassengerCounter('infants');
    await expect(searchPage.infantPassengerCounter).toHaveText('0');
    await searchPage.expectDisabledDecreaseButton('infants');
  });

  test('valid search updates URL with all expected params @e2e @smoke @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 3);
    const returnDate = addDays(startOfTomorrow(), 7);

    await searchPage.fillOrigin("YYZ");
    await searchPage.fillDestination("YVR");
    await searchPage.fillDateSelector('departure', departureDate);
    await searchPage.fillDateSelector('return', returnDate);
    await searchPage.submitSearch();

    await searchPage.expectSearchURL({ origin: "YYZ", destination: "YVR", adults: "1", children: "0", infants: "0" });
  });

  test("expect form to be autofilled with URL parameters @regression", async ({ page }) => {
    const departureDate: TestDate = getDateData(startOfTomorrow(), 2);
    const returnDate: TestDate = getDateData(startOfTomorrow(), 7);

    await page.goto(`/?originLocationCode=YYZ&destinationLocationCode=YVR&departureDate=${departureDate.url}&returnDate=${returnDate.url}&adults=2&children=1`);
    await expect(page.locator("[aria-label='Origin']")).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
    await expect(page.locator("[aria-label='Destination']")).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");

    await expect(page.getByText(departureDate.displayedValue)).toBeVisible();
    await expect(page.getByText(returnDate.displayedValue)).toBeVisible();
  });
})