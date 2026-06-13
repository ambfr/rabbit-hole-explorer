import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGraphs } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function SavedMaps() {
  const { token, isAuthenticated } = useAuth();
  const { loadSavedGraph } = useApp();
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    getGraphs(token)
      .then(setGraphs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="text-center">
          <p className="mb-4 text-zinc-500">You need to be logged in to view saved maps.</p>
          <Link to="/login" className="text-amber-100/80 hover:underline">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-xs uppercase tracking-[0.35em] text-zinc-500 hover:text-amber-100/80">
          ← Home
        </Link>
        <h1 className="mt-8 mb-8 font-[family-name:var(--font-display)] text-4xl text-zinc-50">
          My Saved Maps
        </h1>

        {loading && <p className="text-zinc-500">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && graphs.length === 0 && (
          <p className="text-zinc-500">No saved explorations yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {graphs.map((g) => (
            <button
              key={g.id}
              onClick={() => loadSavedGraph(g)}
              className="border border-zinc-800 px-5 py-4 text-left transition hover:border-amber-500/50"
            >
              <p className="text-lg text-zinc-100">{g.title}</p>
              <p className="text-xs text-zinc-500">{g.nodes.length} topics</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}