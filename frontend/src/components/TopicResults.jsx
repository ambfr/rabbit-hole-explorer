import { useApp } from "../context/AppContext";

export default function TopicResults() {
  const { topic, result, loading, error, searchTopic } = useApp();

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Expanding
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-zinc-200">
          {topic}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 border border-red-900/50 bg-red-950/20 px-6 py-5 text-center">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <section className="mt-20 w-full max-w-3xl animate-fade-in text-left">
      <div className="mb-10 border-b border-zinc-800 pb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-200/60">
          Current topic
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium text-zinc-50 sm:text-5xl">
          {topic}
        </h2>
      </div>

      <div className="mb-12">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
          Summary
        </p>
        <p className="text-lg leading-relaxed text-zinc-400">{result.summary}</p>
      </div>

      <div>
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-zinc-500">
          Related topics
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {result.related_topics.map((related) => (
            <li key={related}>
              <button
                type="button"
                onClick={() => searchTopic(related)}
                className="group w-full border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-left transition-colors hover:border-amber-200/30 hover:bg-zinc-900"
              >
                <span className="text-zinc-300 transition-colors group-hover:text-amber-100">
                  {related}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
