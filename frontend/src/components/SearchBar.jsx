import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export default function SearchBar({ compact = false }) {
  const { topic, startExploring, loading } = useApp();
  const [input, setInput] = useState(topic);

  useEffect(() => {
    setInput(topic);
  }, [topic]);

  function handleSubmit(event) {
    event.preventDefault();
    startExploring(input);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full ${compact ? "max-w-xl flex-row gap-2" : "max-w-2xl flex-col gap-3 sm:flex-row"} ${compact ? "" : "border border-zinc-800 bg-zinc-950/80 p-2"}`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a topic to explore"
        disabled={loading}
        className={`flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 ${
          compact
            ? "border border-zinc-800 px-4 py-2 text-sm"
            : "px-5 py-4 text-lg"
        }`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`shrink-0 border border-amber-200/20 bg-amber-100 font-medium uppercase tracking-[0.2em] text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 ${
          compact ? "px-5 py-2 text-xs" : "px-8 py-4 text-sm"
        }`}
      >
        {loading ? "Searching" : "Explore"}
      </button>
    </form>
  );
}
