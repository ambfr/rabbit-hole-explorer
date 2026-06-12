import { useApp } from "../context/AppContext";
import { toId } from "../utils/graph";

export default function SidePanel() {
  const { panelOpen, selectedDetail, loading, selectAndExpand, closePanel } =
    useApp();

  if (!panelOpen || !selectedDetail) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        onClick={closePanel}
        className="absolute inset-0 z-20 bg-black/20 backdrop-blur-[1px] lg:hidden"
      />

      <aside
        className={`absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col border-l border-amber-200/10 bg-zinc-950/98 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/50">
            Topic detail
          </p>
          <button
            type="button"
            onClick={closePanel}
            className="text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium text-zinc-50">
            {selectedDetail.label}
          </h2>

          {selectedDetail.loading || loading ? (
            <p className="mt-6 text-sm uppercase tracking-[0.25em] text-zinc-500">
              Loading summary...
            </p>
          ) : (
            <>
              {selectedDetail.summary && (
                <p className="mt-6 text-sm leading-relaxed text-zinc-400">
                  {selectedDetail.summary}
                </p>
              )}

              {selectedDetail.relatedTopics?.length > 0 && (
                <div className="mt-8">
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Related topics
                  </p>
                  <ul className="space-y-2">
                    {selectedDetail.relatedTopics.map((related) => (
                      <li key={related}>
                        <button
                          type="button"
                          onClick={() => selectAndExpand(toId(related), related)}
                          className="w-full border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-amber-200/30 hover:bg-zinc-900 hover:text-amber-100"
                        >
                          {related}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
