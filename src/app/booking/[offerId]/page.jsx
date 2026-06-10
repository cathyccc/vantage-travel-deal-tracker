import { getOffer } from '@/lib/api/flights';
import Header from '../../../components/layout/Header'
import BookingView from '../../../components/booking/BookingView';

export default async function BookingPage({params, searchParams}) {
  const {offerId} = await params;
  const resolvedSearchParams = await searchParams;
  const offer = await getOffer(offerId);

  return (
    <main className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Header />
        <BookingView offer={offer} searchParams={resolvedSearchParams} />
      </div>
    </main>
  )
}