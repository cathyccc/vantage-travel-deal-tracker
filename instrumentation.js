export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.MOCK_DUFFEL === '1'){
    const {server} = await import('./tests/msw/server');
    server.listen({ onUnhandledRequest: 'bypass'});
    console.log('[msw] Duffel API mocking enabled (MOCK_DUFFEL=1)');
  }
}