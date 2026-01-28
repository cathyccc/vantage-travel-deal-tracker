import Header from './components/Header'
import Main from './components/Main'

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Header />
        <Main />
      </div>
    </main>
  );
}
