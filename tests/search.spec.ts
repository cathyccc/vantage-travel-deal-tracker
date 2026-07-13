import { test, expect } from '@playwright/test';
import { addDays, format, startOfTomorrow } from 'date-fns';
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

test.describe('Flight Search Component', () => {
  let flightSearchPage: FlightSearchPage;

  test.beforeEach(async ({ page }) => {
    flightSearchPage = new FlightSearchPage(page);
    await flightSearchPage.goto();
  });

  test('search form has all required fields and submit button @smoke', async () => {
    await flightSearchPage.form.expectAllFieldsToBeVisible();
  });

  test('shows error when search form is empty @smoke @regression', async () => {
    await flightSearchPage.form.submitSearch();
    await expect(flightSearchPage.form.originError).toBeVisible();
    await expect(flightSearchPage.form.destinationError).toBeVisible();
    await expect(flightSearchPage.form.departureDateError).toBeVisible();
    await expect(flightSearchPage.form.returnDateError).toBeVisible();
  });

  test('user can select origin and destinations airports @regression', async () => {
    await flightSearchPage.form.fillOrigin("YYZ");
    await flightSearchPage.form.fillDestination("YVR");
    await expect(flightSearchPage.form.originInput).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
    await expect(flightSearchPage.form.destinationInput).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");
  });

  test('shows no results when user types unmatched search @regression', async () => {
    await flightSearchPage.form.inputOrigin("ZZZZ");
    await flightSearchPage.form.expectNoAirportResults();
  });

  test('shows error when origin and destination are the same @regression', async () => {
    await flightSearchPage.form.fillOrigin("YYZ");
    await flightSearchPage.form.fillDestination("YYZ");
    await expect(flightSearchPage.form.destinationError).toHaveText('Origin and destination cannot be the same');
  });

  test('user can select departure and return dates @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 3);
    const returnDate = addDays(startOfTomorrow(), 7);

    await flightSearchPage.form.fillDateSelector('departure', departureDate);
    await flightSearchPage.form.fillDateSelector('return', returnDate);
    await expect(flightSearchPage.form.dateDisplay(departureDate)).toBeVisible();
    await expect(flightSearchPage.form.dateDisplay(returnDate)).toBeVisible();
  });

  test('user cannot select an arrival date before the selected departure date @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 8);
    const returnDate = addDays(startOfTomorrow(), 2);

    await flightSearchPage.form.fillDateSelector('departure', departureDate);
    await flightSearchPage.form.expectDateToBeDisabled('return', returnDate);
  });

  test('user cannot select a departure date after the selected return date @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 8);
    const returnDate = addDays(startOfTomorrow(), 2);

    await flightSearchPage.form.fillDateSelector('return', returnDate);
    await flightSearchPage.form.expectDateToBeDisabled('departure', departureDate);
  });

  test('user can adjust number of adult passenger details @regression', async () => {
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('1');
    await flightSearchPage.form.increasePassengerCounter('adults');
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('2');
    await flightSearchPage.form.decreasePassengerCounter('adults');
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('1');
  })

  test('user can adjust number of children passenger details @regression', async () => {
    await expect(flightSearchPage.form.childPassengerCounter).toHaveText('0');
    await flightSearchPage.form.increasePassengerCounter('children');
    await expect(flightSearchPage.form.childPassengerCounter).toHaveText('1');
    await flightSearchPage.form.decreasePassengerCounter('children');
    await expect(flightSearchPage.form.childPassengerCounter).toHaveText('0');
  })

  test('user can adjust number of infants passenger details @regression', async () => {
    await expect(flightSearchPage.form.infantPassengerCounter).toHaveText('0');
    await flightSearchPage.form.increasePassengerCounter('infants');
    await expect(flightSearchPage.form.infantPassengerCounter).toHaveText('1');
    await flightSearchPage.form.decreasePassengerCounter('infants');
    await expect(flightSearchPage.form.infantPassengerCounter).toHaveText('0');
  })

  test('passenger count cannot exceed 9 @regression', async () => {
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('1');
    for (let i = 0; i < 8; i++) {
      await flightSearchPage.form.increasePassengerCounter('adults');
    }

    await flightSearchPage.form.expectDisabledIncreaseButton('adults');
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('9');
  })

  test('adult passenger count cannot be less than 1 @regression', async () => {
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('1');
    await flightSearchPage.form.increasePassengerCounter('adults');
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('2');
    await flightSearchPage.form.decreasePassengerCounter('adults');;
    await expect(flightSearchPage.form.adultPassengerCounter).toHaveText('1');
    await flightSearchPage.form.expectDisabledDecreaseButton('adults');
  });

  test('children passenger count cannot be less than 0 @regression', async () => {
    await expect(flightSearchPage.form.childPassengerCounter).toHaveText('0');
    await flightSearchPage.form.increasePassengerCounter('children');
    await expect(flightSearchPage.form.childPassengerCounter).toHaveText('1');
    await flightSearchPage.form.decreasePassengerCounter('children');
    await expect(flightSearchPage.form.childPassengerCounter).toHaveText('0');
    await flightSearchPage.form.expectDisabledDecreaseButton('children');
  });

  test('infants passenger count cannot be less than 0 @regression', async () => {
    await expect(flightSearchPage.form.infantPassengerCounter).toHaveText('0');
    await flightSearchPage.form.increasePassengerCounter('infants');
    await expect(flightSearchPage.form.infantPassengerCounter).toHaveText('1');
    await flightSearchPage.form.decreasePassengerCounter('infants');
    await expect(flightSearchPage.form.infantPassengerCounter).toHaveText('0');
    await flightSearchPage.form.expectDisabledDecreaseButton('infants');
  });

  test('valid search updates URL with all expected params @e2e @smoke @regression', async () => {
    const departureDate = addDays(startOfTomorrow(), 3);
    const returnDate = addDays(startOfTomorrow(), 7);

    await flightSearchPage.form.fillOrigin("YYZ");
    await flightSearchPage.form.fillDestination("YVR");
    await flightSearchPage.form.fillDateSelector('departure', departureDate);
    await flightSearchPage.form.fillDateSelector('return', returnDate);
    await flightSearchPage.form.submitSearch();

    await flightSearchPage.form.expectSearchURL({ origin: "YYZ", destination: "YVR", adults: "1", children: "0", infants: "0" });
  });

  test("expect form to be autofilled with URL parameters @regression", async ({ page }) => {
    const departureDate = getDateData(startOfTomorrow(), 2);
    const returnDate = getDateData(startOfTomorrow(), 7);

    await page.goto(`/?originLocationCode=YYZ&destinationLocationCode=YVR&departureDate=${departureDate.url}&returnDate=${returnDate.url}&adults=2&children=2&infants=1&childAges=2%2C2&infantAges=0`);
    await expect(page.locator("[aria-label='Origin']")).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
    await expect(page.locator("[aria-label='Destination']")).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");

    await expect(page.getByText(departureDate.displayedValue)).toBeVisible();
    await expect(page.getByText(returnDate.displayedValue)).toBeVisible();
  });

  test('infant counter is disabled once it reaches the adult count @regression', async () => {
    await flightSearchPage.form.increasePassengerCounter('adults');
    for (let i = 0; i < 2; i++) {
      await flightSearchPage.form.increasePassengerCounter('infants');
    };
    await expect(flightSearchPage.form.expectDisabledIncreaseButton('infants'));
  });

  test('error is shown when user tries to decrease adult count lower than infant count @regression', async () => {
    await flightSearchPage.form.increasePassengerCounter('adults');
    for (let i = 0; i < 2; i++) {
      await flightSearchPage.form.increasePassengerCounter('infants');
    }
    await flightSearchPage.form.decreasePassengerCounter('adults');
    await expect(flightSearchPage.form.infantPassengerError).toBeVisible();
  })

  test('total passenger count across adults, children and infants cannot exceed 9 @regression', async () => {
    for (let i = 0; i < 4; i++) {
      await flightSearchPage.form.increasePassengerCounter('adults');
      await flightSearchPage.form.increasePassengerCounter('children');
      await flightSearchPage.form.increasePassengerCounter('infants');
    }
    await expect(flightSearchPage.form.adultPassengerError).toBeVisible();
  })

  test('navigating directly to a URL with infants exceeding adults shows no offers found @regression', async ({ page }) => {
    const departureDate = getDateData(startOfTomorrow(), 2);
    const returnDate = getDateData(startOfTomorrow(), 7);
    await page.goto(`/?originLocationCode=YYZ&destinationLocationCode=YVR&departureDate=${departureDate.url}&returnDate=${returnDate.url}&adults=8&children=2&childAges=2%2C2`);
    await expect(page.getByText("No offers found")).toBeVisible();
  })
})