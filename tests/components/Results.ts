import { Page, expect, Locator } from '@playwright/test';
import { OfferResultsCard } from './OfferResultsCard';

export class Results {
  readonly page: Page;
  readonly banner: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.getByTestId('offers-route-banner');
    this.cards = page.getByTestId('offer-result-card');
  }

  card(index: number): OfferResultsCard {
    return new OfferResultsCard(this.cards.nth(index));
  }
}
