import { ReactFlowProvider } from "@xyflow/react";
import { Link } from "react-router-dom";
import GraphView from "../components/GraphView";
import SearchBar from "../components/SearchBar";
import SidePanel from "../components/SidePanel";
import { useApp } from "../context/AppContext";

export default function Explore() {
  const { graph, loading, error } = useApp();

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <header className="z-20 flex shrink-0 items-center gap-4 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-4 backdrop-blur-sm sm:px-6">
        <Link
          to="/"
          className="shrink-0 text-xs uppercase tracking-[0.35em] text-zinc-500 transition-colors hover:text-amber-100/80"
        >
          ← Home
        </Link>
        <div className="min-w-0 flex-1">
          <SearchBar compact />
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {graph.nodes.length === 0 && !loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-600">
              Search a topic to begin
            </p>
          </div>
        )}

        <ReactFlowProvider>
          <GraphView />
        </ReactFlowProvider>

        <SidePanel />

        {loading && (
          <div className="pointer-events-none absolute bottom-6 left-6 z-10">
            <p className="border border-zinc-800 bg-zinc-950/90 px-5 py-2 text-xs uppercase tracking-[0.35em] text-zinc-400">
              Expanding...
            </p>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-1/2 z-20 max-w-md -translate-x-1/2 border border-red-900/50 bg-red-950/30 px-5 py-3 text-sm text-red-300 backdrop-blur-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
