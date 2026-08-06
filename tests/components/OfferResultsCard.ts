import { Page, Locator } from '@playwright/test';

export class OfferResultsCard {
  readonly root: Locator;
  readonly price: Locator;
  readonly departureTime: Locator;
  readonly departureCity: Locator;
  readonly arrivalTime: Locator;
  readonly arrivalCity: Locator;
  readonly duration: Locator;
  readonly viewDetailsButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.price = root.getByTestId('offer-price');
    this.departureTime = root.getByTestId('offer-departure-time');
    this.departureCity = root.getByTestId('offer-departure-city');
    this.arrivalTime = root.getByTestId('offer-arrival-time');
    this.arrivalCity = root.getByTestId('offer-arrival-city');
    this.duration = root.getByTestId('offer-duration');
    this.viewDetailsButton = root.getByRole('button', { name: 'View Details' });
  }

  layoverDuration(location: string) {
    return this.root.getByTestId(`offer-layover-duration-${location}`);
  }

  async clickViewDetails() {
    await this.viewDetailsButton.click();
  }

  async getOfferId() {
    return this.root.getAttribute('data-offer-id');
  }
}