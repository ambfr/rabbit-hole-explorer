import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export default function SearchBar() {
  const { topic, searchTopic, loading } = useApp();
  const [input, setInput] = useState(topic);

  useEffect(() => {
    setInput(topic);
  }, [topic]);

  function handleSubmit(event) {
    event.preventDefault();
    searchTopic(input);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-3 border border-zinc-800 bg-zinc-950/80 p-2 sm:flex-row"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a topic to explore"
        disabled={loading}
        className="flex-1 bg-transparent px-5 py-4 text-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading}
        className="border border-amber-200/20 bg-amber-100 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Searching" : "Explore"}
      </button>
    </form>
  );
}
