import SearchBar from "../components/SearchBar";
import { useApp } from "../context/AppContext";

const SUGGESTIONS = [
  "Renaissance art",
  "Game theory",
  "Deep sea",
  "Urban planning",
  "Consciousness",
];

export default function Home() {
  const { startExploring } = useApp();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(120,113,108,0.12)_0%,_transparent_55%)]" />

      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-20 sm:py-28">
        <header className="mb-16 w-full text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-amber-200/50">
            Internet Rabbit Hole Explorer
          </p>

          <h1 className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-5xl font-medium leading-[1.1] text-zinc-50 sm:text-7xl">
            Descend into
            <span className="block italic text-amber-100/90">curiosity</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            A refined gateway into ideas — search any subject and follow the
            threads that connect it to the wider world.
          </p>
        </header>

        <SearchBar />

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => startExploring(suggestion)}
              className="border border-zinc-800 px-4 py-2 text-sm text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
