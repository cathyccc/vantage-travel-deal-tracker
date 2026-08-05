import { AsyncLocalStorage } from 'async_hooks';

const GLOBAL_KEY = '__duffelScenarioContext__';

if (!globalThis[GLOBAL_KEY]) {
  globalThis[GLOBAL_KEY] = new AsyncLocalStorage();
}

export const scenarioContext = globalThis[GLOBAL_KEY];