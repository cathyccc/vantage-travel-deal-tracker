import { Page, Locator } from '@playwright/test';

export class OfferDetailsDialog {
  readonly page: Page;
  readonly root: Locator;

  // Flight Details panel
  readonly departureLabel: Locator;
  readonly returnLabel: Locator;
  readonly viewFareDetailsButton: Locator;

  // Fare Details panel
  readonly farePrice: Locator;
  readonly fareType: Locator;
  readonly fareDepartureLabel: Locator;
  readonly fareReturnLabel: Locator
  readonly backToFlightDetailsButton: Locator;
  readonly selectFareButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole('dialog');

    this.departureLabel = this.root.getByTestId('flight-details-departure-label');
    this.returnLabel = this.root.getByTestId('flight-details-return-label');
    this.viewFareDetailsButton = this.root.getByTestId('view-fare-details-button');

    this.farePrice = this.root.getByTestId('fare-price');
    this.fareType = this.root.getByTestId('fare-type');
    this.fareDepartureLabel = this.root.getByTestId('fare-departure-label');
    this.fareReturnLabel = this.root.getByTestId('fare-return-label');
    this.backToFlightDetailsButton = this.root.getByTestId('back-to-flight-details-button');
    this.selectFareButton = this.root.getByTestId('select-fare-button');
  }

  flightSegment(index: number) {
    return this.root.getByTestId('flight-detail-segment').nth(index);
  }

  async goToFareDetails() {
    await this.viewFareDetailsButton.click();
    await this.fareDepartureLabel.waitFor();
  }

  async goBackToFlightDetails() {
    await this.backToFlightDetailsButton.click();
    await this.departureLabel.waitFor();
  }

  async selectFare() {
    await this.selectFareButton.click();
  }
}