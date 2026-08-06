import { http, HttpResponse } from 'msw';
import offerRequestCreated from '../fixtures/duffel/offer-request-created.json';
import nonStopLaxJfk from '../fixtures/offers/stops/lax-jfk-nonstop-1adult.json';
import oneStopYyzHnl from '../fixtures/offers/stops/yyz-hnl-1stop-1adult.json';
import twoStopsLgwSyd from '../fixtures/offers/stops/lgw-syd-2stops-1adult.json';
import twoAdultsYyzYvr from '../fixtures/offers/passengers/yyz-yvr-2adults.json';
import familyYyzMco from '../fixtures/offers/passengers/yyz-mco-2adults-1child-aged5-1infant-aged1.json';
import empty from '../fixtures/duffel/offers-empty.json';
import selectedOffer1 from '../fixtures/selectedOffer/off_0000B8Kb42aGVOBGhFjQnI.json';
import selectedOffer2 from '../fixtures/selectedOffer/off_0000B8KbRmoDG2P3gPoOq9.json';
import selectedOffer3 from '../fixtures/selectedOffer/off_0000B8KcFMxr95eQ9okUuU.json';
import selectedOffer4 from '../fixtures/selectedOffer/off_0000B8KohCBXvsLT11m1f9.json';
import selectedOffer5 from '../fixtures/selectedOffer/off_0000B8KYuBDCXq9ouY2jcC.json';
import { scenarioContext } from './scenario-context';

export const OFFER_LIST_SCENARIOS = {
  // stops
  'nonstopLaxJfk': nonStopLaxJfk,
  'oneStopYyzHnl': oneStopYyzHnl,
  'twoStopsLgwSyd': twoStopsLgwSyd,
  // passengers
  '1adult': nonStopLaxJfk,
  '2adults': twoAdultsYyzYvr,
  'family': familyYyzMco, // 2 adults, 1 child (5yo), 1 infant(1yo)
  // empty
  'offers-empty': empty
}

export const SELECTED_OFFERS = {
  'off_0000B8Kb42aGVOBGhFjQnI': selectedOffer1,
  'off_0000B8KbRmoDG2P3gPoOq9': selectedOffer2,
  'off_0000B8KcFMxr95eQ9okUuU': selectedOffer3,
  'off_0000B8KohCBXvsLT11m1f9': selectedOffer4,
  'off_0000B8KYuBDCXq9ouY2jcC': selectedOffer5,
}

export const SCENARIOS = Object.keys(OFFER_LIST_SCENARIOS);
export const DEFAULT_SCENARIO = 'nonstopLaxJfk';

const currentScenario = () => scenarioContext.getStore() ?? DEFAULT_SCENARIO;

export const handlers = [
  http.post('https://api.duffel.com/air/offer_requests', () => {
    return HttpResponse.json(offerRequestCreated, { status: 201 });
  }),

  http.get('https://api.duffel.com/air/offers', () => {
    const scenario = currentScenario();
    const fixture = OFFER_LIST_SCENARIOS[scenario];
    if(!fixture) {
      return HttpResponse.json(
        {errors: [{message: `Unknown test scenario "${scenario}"`}]},
        {status: 501},
      )
    }
    return HttpResponse.json(fixture);
  }),

  http.get('https://api.duffel.com/air/offers/:offerId', ({params}) => {
    const fixture = SELECTED_OFFERS[params.offerId];
    if (!fixture) {
      return HttpResponse.json(
        {errors: [{message: `Unknown test offerId "${params.offerId}"`}]},
        {status: 404},
      )
    }
    return HttpResponse.json(fixture);
  })
]