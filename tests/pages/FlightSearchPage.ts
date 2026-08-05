import { test, expect, Page, Locator } from '@playwright/test';
import { FlightSearchForm } from '../components/FlightSearchForm';
import { Results } from '../components/Results';
import { format } from 'date-fns';
import { OfferDetailsDialog } from '../components/OfferDetailsDialog';

export class FlightSearchPage {
  readonly page: Page;
  readonly form: FlightSearchForm;
  readonly results: Results;
  readonly offerDialog: OfferDetailsDialog;

  constructor(page: Page) {
    this.page = page;
    this.form = new FlightSearchForm(page);
    this.results = new Results(page);
    this.offerDialog = new OfferDetailsDialog(page);
  }

  async goto() {
    await this.page.goto('/')
  }

  async setScenario(scenario: string) {
    await this.page.setExtraHTTPHeaders({ 'x-scenario': scenario });
  }

  async gotoWithScenario(scenario: string, path = '/') {
    await this.setScenario(scenario);
    await this.page.goto(path);
  }

  async completeSearchForm(origin: string, destination: string, departureDate: Date, returnDate: Date, adults: number, children: number, infants: number) {
    await test.step(`search: ${origin} → ${destination}, ${format(departureDate, 'MMM d')}–${format(returnDate, 'MMM d')}`, async () => {
      await this.form.fillOrigin(origin);
      await this.form.fillDestination(destination);
      await this.form.fillDateSelector('departure', departureDate);
      await this.form.fillDateSelector('return', returnDate);
    });

    await test.step('set passenger counts', async () => {
      for (let i = 0; i < adults; i++) {
        await this.form.increasePassengerCounter('adults');
      }
      for (let i = 0; i < children; i++) {
        await this.form.increasePassengerCounter('children');
      }
      for (let i = 0; i < infants; i++) {
        await this.form.increasePassengerCounter('infants');
      }
    })

    await test.step('submit search', async () => {
      await this.form.searchOffersButton.click();
    })
  }
}