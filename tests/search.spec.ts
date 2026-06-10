import { test, expect } from '@playwright/test';
import { addDays, format, startOfTomorrow, startOfToday } from 'date-fns';

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

test('search form has all required fields and submit button @smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText("Origin")).toBeVisible();
  await expect(page.getByText("Destination")).toBeVisible();
  await expect(page.getByText("Departure")).toBeVisible();
  await expect(page.getByText("Return")).toBeVisible();
  await expect(page.getByText("Adults")).toBeVisible();
  await expect(page.getByText("Children")).toBeVisible();
  await expect(page.getByText("Infants")).toBeVisible();
  await expect(page.getByRole('button', { name: "SEARCH OFFERS" })).toBeVisible();
});

test('shows error when search form is empty @smoke @regression', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: "SEARCH OFFERS" }).click();
  await expect(page.locator('.text-red-400').first()).toBeVisible();
});

test('user can select origin and destinations airports @regresion', async ({ page }) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();
  await page.fill("[aria-label='Destination']", "YVR");
  await page.getByText('Vancouver (YVR').first().click();
  await expect(page.locator("[aria-label='Origin']")).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
  await expect(page.locator("[aria-label='Destination']")).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");
})

test('no results show when user types unmatched search @regression', async ({ page }) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "ZZZZ");
  await expect(page.getByText("No matching airports found.")).toBeVisible();
})

test('error shows when user inputs the same origin and destination airports @regression', async ({ page }) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();
  await page.fill("[aria-label='Destination']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();
  await expect(page.locator('.text-red-400').first()).toBeVisible();
})

test('user can select departure and return dates @regression', async ({ page }) => {
  const departureDate: TestDate = getDateData(startOfTomorrow(), 3);
  const returnDate: TestDate = getDateData(startOfTomorrow(), 7)

  await page.goto('/');
  const selectDepartureDate = page.getByRole('button', { name: departureDate.accessibleName });
  await page.click("[aria-label='Select Departure date']");
  const departureDialog = page.getByRole('dialog')

  while (!(await selectDepartureDate.isVisible())) {
    await departureDialog.getByLabel('Go to the Next Month').click();
  }
  await selectDepartureDate.click();
  await expect(departureDialog).not.toBeVisible()

  const selectReturnDate = page.getByRole("button", { name: returnDate.accessibleName });
  await page.click("[aria-label='Select Return date']");
  const returnDialog = page.getByRole('dialog')
  while (!(await selectReturnDate.isVisible())) {
    await returnDialog.getByLabel('Go to the Next Month').click();
  }
  await selectReturnDate.click();
  await expect(returnDialog).not.toBeVisible()

  await expect(page.getByText(departureDate.displayedValue)).toBeVisible();
  await expect(page.getByText(returnDate.displayedValue)).toBeVisible();
})

test('user cannot select an arrival date before the selected departure date @regression', async ({ page }) => {
  const departureDate: TestDate = getDateData(startOfTomorrow(), 8);
  const returnDate: TestDate = getDateData(startOfTomorrow(), 2);

  await page.goto('/');
  const selectDepartureDate = page.getByRole('button', { name: departureDate.accessibleName });
  await page.click("[aria-label='Select Departure date']");
  const departureDialog = page.getByRole('dialog');
  while (!(await selectDepartureDate.isVisible())) {
    await departureDialog.getByRole('button', { name: 'Go to the Next Month' }).click()
  }
  await selectDepartureDate.click();
  await expect(departureDialog).not.toBeVisible();

  const selectReturnDate = page.getByRole("button", { name: returnDate.accessibleName });
  await page.click("[aria-label='Select Return date']");
  const returnDialog = page.getByRole('dialog');
  while (!(await selectReturnDate.isVisible())) {
    await returnDialog.getByRole('button', { name: 'Go to the Next Month' }).click();
  }

  await expect(selectReturnDate).toBeDisabled()
});

test('user cannot select a departure date after the selected return date @regression', async ({ page }) => {
  const departureDate: TestDate = getDateData(startOfTomorrow(), 8);
  const returnDate: TestDate = getDateData(startOfTomorrow(), 2);

  await page.goto('/');
  const selectReturnDate = page.getByRole('button', { name: returnDate.accessibleName });
  await page.click("[aria-label='Select Return date']");
  const returnDialog = page.getByRole('dialog')
  while (!(await selectReturnDate.isVisible())) {
    await returnDialog.getByRole('button', { name: 'Go to the Next Month' }).click();
  }
  await selectReturnDate.click();
  await expect(returnDialog).not.toBeVisible();

  const selectDepartureDate = page.getByRole("button", { name: departureDate.accessibleName });
  await page.click("[aria-label='Select Departure date']");
  const departureDialog = page.getByRole('dialog');
  while (!(await selectDepartureDate.isVisible())) {
    await departureDialog.getByRole('button', { name: 'Go to the Next Month' }).click();
  }

  await expect(selectDepartureDate).toBeDisabled();
});

test('user can adjust number of adult passenger details @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('adults-count');
  await expect(counter).toHaveText('1')
  await page.getByTestId('adults-add').click();
  await expect(counter).toHaveText('2');
  await expect(page.locator('input[name="adults"]')).toHaveValue('2');
  await page.getByTestId('adults-minus').click();
  await expect(counter).toHaveText('1');
  await expect(page.locator('input[name="adults"]')).toHaveValue('1');
})

test('passenger count cannot exceed 9 @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('adults-count');
  await expect(counter).toHaveText('1')
  for (let i = 0; i < 8; i++) {
    await page.getByTestId('adults-add').click();
  }

  await expect(page.getByTestId('adults-add')).toBeDisabled();
  await expect(counter).toHaveText('9');
})

test('adult passenger count cannot be less than 1 @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('adults-count');
  await expect(counter).toHaveText('1')

  await page.getByTestId('adults-add').click();
  await expect(counter).toHaveText('2');
  await expect(page.getByTestId('adults-minus')).toBeEnabled();

  await page.getByTestId('adults-minus').click();
  await expect(counter).toHaveText('1');
  await expect(page.getByTestId('adults-minus')).toBeDisabled();
});

test('children passenger count cannot be less than 0 @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('children-count');
  await expect(counter).toHaveText('0')

  await page.getByTestId('children-add').click();
  await expect(counter).toHaveText('1');
  await expect(page.getByTestId('children-minus')).toBeEnabled();

  await page.getByTestId('children-minus').click();
  await expect(counter).toHaveText('0');
  await expect(page.getByTestId('children-minus')).toBeDisabled();
});

test('infants passenger count cannot be less than 0 @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('infants-count');
  await expect(counter).toHaveText('0')

  await page.getByTestId('infants-add').click();
  await expect(counter).toHaveText('1');
  await expect(page.getByTestId('infants-minus')).toBeEnabled();

  await page.getByTestId('infants-minus').click();
  await expect(counter).toHaveText('0');
  await expect(page.getByTestId('infants-minus')).toBeDisabled();
});

test('user can adjust number of children passenger details @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('children-count');
  await expect(counter).toHaveText('0')
  await page.getByTestId('children-add').click();
  await expect(counter).toHaveText('1');
  await expect(page.locator('input[name="children"]')).toHaveValue('1');
  await page.getByTestId('children-minus').click();
  await expect(counter).toHaveText('0');
  await expect(page.locator('input[name="children"]')).toHaveValue('0');
})

test('user can adjust number of infants passenger details @regression', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('infants-count');
  await expect(counter).toHaveText('0')
  await page.getByTestId('infants-add').click();
  await expect(counter).toHaveText('1');
  await expect(page.locator('input[name="infants"]')).toHaveValue('1');
  await page.getByTestId('infants-minus').click();
  await expect(counter).toHaveText('0');
  await expect(page.locator('input[name="infants"]')).toHaveValue('0');
})

test('valid search updates URL with all expected params @e2e @smoke @regression', async ({ page }) => {
  const departureDate: TestDate = getDateData(startOfTomorrow(), 3);
  const returnDate: TestDate = getDateData(startOfTomorrow(), 7);

  await page.goto('/');
  await page.fill("[aria-label='Origin']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();

  await page.fill("[aria-label='Destination']", "Vancouver");
  await page.getByText('Vancouver (YVR').first().click();

  const selectDepartureDate = page.getByRole('button', { name: departureDate.accessibleName })
  await page.click("[aria-label='Select Departure date']");
  const departureDialog = page.getByRole('dialog');
  while (!(await selectDepartureDate.isVisible())) {
    await departureDialog.getByLabel('Go to the Next Month').click();
  }
  await selectDepartureDate.click();
  await expect(departureDialog).not.toBeVisible();

  const selectReturnDate = page.getByRole("button", { name: returnDate.accessibleName })
  await page.click("[aria-label='Select Return date']");
  while (!(await selectReturnDate.isVisible())) {
    await page.getByRole('button', { name: 'Go to the Next Month' }).click();
  }
  await selectReturnDate.click();

  await page.getByRole('button', { name: "SEARCH OFFERS" }).click();

  await expect(page).toHaveURL(/originLocationCode=YYZ/);
  await expect(page).toHaveURL(/destinationLocationCode=YVR/);
  await expect(page).toHaveURL(/departureDate=/);
  await expect(page).toHaveURL(/adults=1/);
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