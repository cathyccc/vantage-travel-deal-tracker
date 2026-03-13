import Header from '../../../components/layout/Header'
export default function BookingLoading() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Header />
        <div className="skeleton skeleton--offer" />
        <div className="skeleton skeleton--form" />
      </div>
    </main>
  );
}