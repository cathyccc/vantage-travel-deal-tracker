import { Suspense } from 'react'
import Header from '../components/layout/Header'
import OffersView from '../components/offers/OffersView'
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-950">
      <div className="flex flex-col min-h-screen text-white">
        <Header />
        <Suspense fallback={<div className="p-10 text-center">Loading Flights...</div>}>
          <OffersView />
        </Suspense>
      </div>
      <Toaster position="top-center" toastOptions={{ classNames: { toast: '!bg-zinc-800 !text-white !border-zinc-700' } }} />
    </main>
  );
}
