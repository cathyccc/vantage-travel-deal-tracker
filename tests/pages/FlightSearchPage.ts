import { expect, Page, Locator } from '@playwright/test';
import { format, startOfToday } from 'date-fns';

const monthOfToday = format(startOfToday(), 'M');

export class FlightSearchPage {
  readonly page: Page;
  readonly originInput: Locator;
  readonly destinationInput: Locator;
  readonly departureDateButton: Locator;
  readonly returnDateButton: Locator;
  readonly adultPassengerCounter: Locator;
  readonly childPassengerCounter: Locator;
  readonly infantPassengerCounter: Locator;
  readonly searchOffersButton: Locator;
  readonly originError: Locator;
  readonly destinationError: Locator;
  readonly departureDateError: Locator;
  readonly returnDateError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.originInput = page.getByRole('combobox', { name: "Origin" });
    this.destinationInput = page.getByRole('combobox', { name: "Destination" });
    this.departureDateButton = page.getByRole('button', { name: 'Select Departure date' });
    this.returnDateButton = page.getByRole('button', { name: 'Select Return date' });
    this.adultPassengerCounter = page.getByTestId('adults-count');
    this.childPassengerCounter = page.getByTestId('children-count');
    this.infantPassengerCounter = page.getByTestId('infants-count');
    this.originError = page.getByTestId('origin-error');
    this.destinationError = page.getByTestId('destination-error');
    this.departureDateError = page.getByTestId('departureDate-error');
    this.returnDateError = page.getByTestId('returnDate-error');
    this.searchOffersButton = page.getByRole('button', { name: "SEARCH OFFERS" });
  }

  async goto() {
    await this.page.goto('/')
  }

  async expectAllFieldsToBeVisible() {
    const flightSearchFields = [
      this.originInput,
      this.destinationInput,
      this.departureDateButton,
      this.returnDateButton,
      this.adultPassengerCounter,
      this.childPassengerCounter,
      this.infantPassengerCounter,
      this.searchOffersButton
    ]

    for (const field of flightSearchFields) {
      await expect(field).toBeVisible();
    }
  }

  async inputOrigin(cityCode: string) {
    await this.originInput.fill(cityCode);
  }

  async fillOrigin(cityCode: string) {
    await this.inputOrigin(cityCode);
    await this.page.getByText(cityCode).first().click();
  }

  async fillDestination(cityCode: string) {
    await this.destinationInput.fill(cityCode);
    await this.page.getByText(cityCode).first().click();
  }

  async expectNoAirportResults() {
    await expect(this.page.locator('[data-slot="command-empty"]')).toHaveText('No matching airports found.');
  }

  getDateData(date: Date) {
    return {
      date,
      accessibleName: format(date, 'EEEE, MMMM do, yyyy'),
      month: format(date, 'M'),
      displayedValue: format(date, 'MMM d, yyyy'),
      url: format(date, "yyyy-MM-dd")
    }
  }

  async expectDateToBeDisabled(dateType: 'departure' | 'return', date: Date) {
    const dateObj = this.getDateData(date);
    const dateSelector = dateType === 'departure' ? this.departureDateButton : this.returnDateButton;
    await dateSelector.click();

    const dialog = this.page.getByRole('dialog');
    if (dateObj.month !== monthOfToday) {
      await dialog.getByRole('button', { name: 'Go to the Next Month' }).click();
    }
    await expect(this.page.getByRole('button', { name: dateObj.accessibleName })).toBeDisabled();
  }

  async fillDateSelector(dateType: 'departure' | 'return', date: Date) {
    const dateObj = this.getDateData(date);
    const dateSelector = dateType === 'departure' ? this.departureDateButton : this.returnDateButton;
    await dateSelector.click();

    const dialog = this.page.getByRole('dialog');
    if (dateObj.month !== monthOfToday) {
      await dialog.getByRole('button', { name: 'Go to the Next Month' }).click();
    }
    this.page.getByRole('button', { name: dateObj.accessibleName }).click();
    await expect(dialog).not.toBeVisible();
  }

  dateDisplay(date: Date): Locator {
    const dateObj = this.getDateData(date);
    return this.page.getByText(dateObj.displayedValue);
  }

  async increasePassengerCounter(type: 'adults' | 'children' | 'infants') {
    await this.page.getByTestId(`${type}-add`).click();
  }

  async decreasePassengerCounter(type: 'adults' | 'children' | 'infants') {
    await this.page.getByTestId(`${type}-minus`).click();
  }

  async expectDisabledIncreaseButton(type: 'adults' | 'children' | 'infants') {
    await expect(this.page.getByTestId(`${type}-add`)).toBeDisabled();
  }

  async expectDisabledDecreaseButton(type: 'adults' | 'children' | 'infants') {
    await expect(this.page.getByTestId(`${type}-minus`)).toBeDisabled();
  }

  async submitSearch() {
    this.searchOffersButton.click();
  }

  async expectSearchURL({ origin, destination, adults, children, infants }: { origin: string, destination: string, adults: string, children: string, infants: string }) {
    await expect(this.page).toHaveURL(new RegExp(`originLocationCode=${origin}`));
    await expect(this.page).toHaveURL(new RegExp(`destinationLocationCode=${destination}`));
    await expect(this.page).toHaveURL(new RegExp(`adults=${adults}`));
    await expect(this.page).toHaveURL(new RegExp(`children=${children}`));
    await expect(this.page).toHaveURL(new RegExp(`infants=${infants}`));
  }
}