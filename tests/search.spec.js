const { test, expect } = require('@playwright/test');
const { addDays, format, startOfTomorrow, startOfToday } = require('date-fns');

test('search form has all required fields and submit button @smoke', async ({page}) => {
  await page.goto('/');
  await expect(page.getByText("Origin")).toBeVisible();
  await expect(page.getByText("Destination")).toBeVisible();
  await expect(page.getByText("Departure")).toBeVisible();
  await expect(page.getByText("Return")).toBeVisible();
  await expect(page.getByText("Adults")).toBeVisible();
  await expect(page.getByText("Children")).toBeVisible();
  await expect(page.getByRole('button', {name: "SEARCH OFFERS"})).toBeVisible();
});

test('shows error when search form is empty @smoke @regression', async({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name: "SEARCH OFFERS"}).click();
  await expect(page.locator('.text-red-400').first()).toBeVisible();
});

test('user can select origin and destinations airports @regresion', async({page}) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();
  await page.fill("[aria-label='Destination']", "YVR");
  await page.getByText('Vancouver (YVR').first().click();
  await expect(page.locator("[aria-label='Origin']")).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
  await expect(page.locator("[aria-label='Destination']")).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");
})

test('no results show when user types unmatched search @regression', async({page}) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "ZZZZ");
  await expect(page.getByText("No matching airports found."))
})

test('error shows when user inputs the same origin and destination airports @regression', async({page}) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();
  await page.fill("[aria-label='Destination']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();
  await expect(page.locator('.text-red-400').first()).toBeVisible();
})

test('user can select departure and return dates @regression', async({page}) => {
  await page.goto('/');
  await page.click("[aria-label='Select Departure date']");
  const tomorrow = startOfTomorrow();
  const formattedTmr = format(tomorrow, 'd');
  await page.getByRole('button', { name: formattedTmr }).click();

  await page.click("[aria-label='Select Return date']");
  const returnDate = addDays(tomorrow, 7);
  const formattedReturn = format(returnDate, 'EEEE, LLLL do,');
  const tomorrowMonth = format(tomorrow,'m');
  const returnMonth = format(returnDate, 'm');
  if (tomorrowMonth !== returnMonth) {
    await page.getByRole('button', {name: 'Go to the Next Month'}).click();
  }
  await page.getByRole("button", {name: formattedReturn }).click();
  const formattedTmrDateView = format(tomorrow, "MMM d, yyyy")
  const formattedRetDateView = format(returnDate, "MMM d, yyyy")
  await expect(page.getByText(formattedTmrDateView)).toBeVisible();
  await expect(page.getByText(formattedRetDateView)).toBeVisible();
})

test('user cannot select an arrival date before the selected departure date @regression', async ({page}) => {
  await page.goto('/');
  await page.click("[aria-label='Select Departure date']");
  const tomorrow = startOfTomorrow();
  const formattedTmr = format(tomorrow, 'd');
  await page.getByRole('button', { name: formattedTmr }).click();

  await page.click("[aria-label='Select Return date']");
  const returnDate = startOfToday();
  const formattedReturn = format(returnDate, 'EEEE, LLLL do,');

  const tomorrowMonth = format(tomorrow,'m');
  const returnMonth = format(returnDate, 'm');
  if (tomorrowMonth !== returnMonth) {
    await page.getByRole('button', { name: 'Go to the Previous Month' }).click();
  }

  await expect(page.getByRole("button", { name: formattedReturn })).toBeDisabled()
});

test('user cannot select a departure date after the selected return date @regression', async ({page}) => {
  await page.goto('/');
  await page.click("[aria-label='Select Return date']");
  const returnDate = startOfTomorrow();
  const formattedReturn = format(returnDate, 'EEEE, LLLL do,');
  await page.getByRole('button', { name: formattedReturn }).click();

  await page.click("[aria-label='Select Departure date']");
  const tomorrow = addDays(startOfTomorrow(),3);
  const formattedTmr = format(tomorrow, 'd');

  const tomorrowMonth = format(tomorrow,'m');
  const returnMonth = format(returnDate, 'm');
  if (tomorrowMonth !== returnMonth) {
    await page.getByRole('button', { name: 'Go to the Next Month' }).click();
  }

  await expect(page.getByRole("button", { name: formattedTmr })).toBeDisabled()
});

test('user can adjust number of adult passenger details @regression', async({page}) => {
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

test('passenger count cannot exceed 9 @regression', async({page}) => {
  await page.goto('/');
  const counter = page.getByTestId('adults-count');
  await expect(counter).toHaveText('1')
  for (let i=0; i<8 ;i++){
    await page.getByTestId('adults-add').click();
  }

  await expect(page.getByTestId('adults-add')).toBeDisabled();
  await expect(counter).toHaveText('9');
})

test('adult passenger count cannot be less than 1 @regression', async({page}) => {
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

test('children passenger count cannot be less than 0 @regression', async({page}) => {
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

test('user can adjust number of children passenger details @regression', async({page}) => {
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

test('valid search updates URL with all expected params @e2e @smoke @regression', async({page}) => {
  await page.goto('/');
  await page.fill("[aria-label='Origin']", "YYZ");
  await page.getByText('Toronto (YYZ').first().click();

  await page.fill("[aria-label='Destination']", "Vancouver");
  await page.getByText('Vancouver (YVR').first().click();

  await page.click("[aria-label='Select Departure date']");
  const tomorrow = addDays(new Date(), 1);
  const formattedTmr = format(tomorrow, 'd');
  await page.getByRole('button', { name: formattedTmr }).click();

  await page.click("[aria-label='Select Return date']");
  const returnDate = addDays(tomorrow, 7);
  const formattedReturn = format(returnDate, 'EEEE, LLLL do,');
  const tomorrowMonth = format(tomorrow,'m');
  const returnMonth = format(returnDate, 'm');
  if (tomorrowMonth !== returnMonth) {
    await page.getByRole('button', {name: 'Go to the Next Month'}).click();
  }
  await page.getByRole("button", {name: formattedReturn }).click();

  await page.getByRole('button', { name: "SEARCH OFFERS" }).click();

  await expect(page).toHaveURL(/originLocationCode=YYZ/);
  await expect(page).toHaveURL(/destinationLocationCode=YVR/);
  await expect(page).toHaveURL(/departureDate=/);
  await expect(page).toHaveURL(/adults=1/);
});

test("expect form to be autofilled with URL parameters @regression", async ({page}) => {
  const tomorrowDate = startOfTomorrow(); 
  const returnDate = addDays(tomorrowDate, 7);
  const tomorrowUrl = format(tomorrowDate, "yyyy-MM-dd");
  const returnUrl = format(returnDate, "yyyy-MM-dd");

  await page.goto(`/?originLocationCode=YYZ&destinationLocationCode=YVR&departureDate=${tomorrowUrl}&returnDate=${returnUrl}&adults=2&children=1`);
  await expect(page.locator("[aria-label='Origin']")).toHaveValue("Toronto (YYZ - Toronto Pearson Intl. Airport, CA)");
  await expect(page.locator("[aria-label='Destination']")).toHaveValue("Vancouver (YVR - Vancouver Intl. Airport, CA)");

  const formattedTmrDateView = format(tomorrowDate, "MMM d, yyyy")
  const formattedRetDateView = format(returnDate, "MMM d, yyyy")
  await expect(page.getByText(formattedTmrDateView)).toBeVisible();
  await expect(page.getByText(formattedRetDateView)).toBeVisible();
});