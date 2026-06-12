import { useEffect, useRef, useState } from "react";

const SEARCH_LINKS = [
  {
    label: "Wikipedia",
    href: (topic) =>
      `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topic)}`,
  },
  {
    label: "YouTube",
    href: (topic) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
  },
  {
    label: "Reddit",
    href: (topic) =>
      `https://www.reddit.com/search/?q=${encodeURIComponent(topic)}`,
  },
  {
    label: "Google",
    href: (topic) =>
      `https://www.google.com/search?q=${encodeURIComponent(topic)}`,
  },
];

export default function TopicLinksPopover({ topic }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleToggle(event) {
    event.stopPropagation();
    event.preventDefault();
    setOpen((prev) => !prev);
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={`Search links for ${topic}`}
        aria-expanded={open}
        onClick={handleToggle}
        className="flex h-full items-center border border-l-0 border-zinc-800 px-3 text-zinc-500 transition-colors hover:border-amber-200/30 hover:bg-zinc-900 hover:text-amber-200/80"
      >
        🔗
      </button>

      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute right-0 top-full z-50 mt-1 min-w-[10.5rem] overflow-hidden rounded-lg border border-amber-200/15 bg-zinc-900 shadow-xl shadow-black/40"
        >
          <p className="border-b border-zinc-800 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Search web
          </p>
          <ul>
            {SEARCH_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  role="menuitem"
                  href={link.href(topic)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-amber-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
