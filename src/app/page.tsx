import Header from '../components/layout/Header'
import OffersView from '../components/offers/OffersView'
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Header />
        <OffersView />
      </div>
      <Toaster position="top-center" toastOptions={{ classNames: { toast: '!bg-zinc-800 !text-white !border-zinc-700' } }} />
    </main>
  );
}
