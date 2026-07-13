import { Page, expect, Locator } from '@playwright/test';
import { OfferCard } from './OfferCard';

export class Results {
  readonly page: Page;
  readonly banner: Locator;
  private readonly offerCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.getByTestId('offers-route-banner');
    this.offerCards = page.getByTestId('offer-result-card');
  }

  async count() {
    return this.offerCards.count();
  }

  card(index: number): OfferCard {
    return new OfferCard(this.offerCards.nth(index));
  }
}
