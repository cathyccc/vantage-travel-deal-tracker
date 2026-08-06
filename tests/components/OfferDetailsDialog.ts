import { Page, Locator } from '@playwright/test';

export type SliceType = 'departure' | 'return';

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
  readonly departureSegments: Locator;
  readonly returnSegments: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole('dialog');

    this.departureSegments = page.getByTestId('flight-detail-segment-departure');
    this.returnSegments = page.getByTestId('flight-detail-segment-return');
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

  flightSegment(index: number, sliceType: SliceType) {
    const segment = this.root.getByTestId(`flight-detail-segment-${sliceType}`).nth(index);
    return {
      root: segment,
      originCity: segment.getByTestId('flight-detail-origin-city'),
      destinationCity: segment.getByTestId('flight-detail-destination-city'),
      departureTime: segment.getByTestId('flight-detail-departure-time'),
      arrivalTime: segment.getByTestId('flight-detail-arrival-time'),
      travelTime: segment.getByTestId('flight-detail-travel-time'),
      cabin: segment.getByTestId('flight-detail-travel-time'),
      checkedBags: segment.getByTestId('flight-detail-checked-bags'),
    }
  }

  async countSegments(sliceType: SliceType) {
    sliceType === 'departure' ? this.departureSegments.count() : this.returnSegments.count();
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