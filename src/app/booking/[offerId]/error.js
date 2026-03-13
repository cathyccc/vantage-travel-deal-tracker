"use client";
import { useRouter } from "next/navigation";
import Header from '../../../components/layout/Header'

export default function BookingError({ error }) {
  const router = useRouter();
  const isExpired = error.message.includes('does not exist');

  return (
    <main className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Header />
        <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl font-light">
            {isExpired
              ? 'This offer has expired — please search again for current prices.'
              : error.message}
          </p>
          <button onClick={() => router.push('/')}>Back to search</button>
        </div>
      </div>
    </main>
  )
}