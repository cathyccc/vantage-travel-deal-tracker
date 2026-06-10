import Header from '@/components/layout/Header'

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const resolvedSearchParams = await searchParams;
  const { ref } = resolvedSearchParams;

  return (
    <main className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">
      <Header />
      <div className="text-center py-12 px-6 bg-zinc-900 rounded-xl shadow-2xl min-h-screen">
        <div className="text-5xl mb-6">✈️</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Adventure Awaits!</h2>
        <div className="text-zinc-400">
          Pack your bags! Your itinerary is locked in and ready to go.
        </div>
        <div className="text-zinc-400">
          We've sent the details to your inbox.
        </div>
        <div className="text-zinc-600 mb-6 text-xs">
          (Just kidding.. this is just a demo project. But I hope you had fun while interacting with Duffel's API)
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg inline-block mb-8">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Booking Reference</p>
          <p className="text-3xl font-mono text-purple-400">{ref}</p>
        </div>

        <div className="text-xs text-zinc-500">
          <p>Questions? Our support team is ready to help.</p>
          <p className="mt-2 text-zinc-600 italic">"The journey of a thousand miles begins with a single click."</p>
        </div>
      </div>
    </main>
  )
}