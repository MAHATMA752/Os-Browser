"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { APP_LIST } from "@/lib/apps";
import { AppIcon } from "@/components/os/AppIcon";
import { useOSStore } from "@/store/os-store";

export function Spotlight() {
  const open = useOSStore((state) => state.spotlightOpen);
  const setSpotlightOpen = useOSStore((state) => state.setSpotlightOpen);
  const openApp = useOSStore((state) => state.openApp);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return APP_LIST;
    }

    return APP_LIST.filter(
      (app) =>
        app.name.toLowerCase().includes(normalized) ||
        app.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setQuery("");
      setSelected(0);
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [open]);

  const safeSelected =
    results.length === 0 ? -1 : Math.min(selected, results.length - 1);

  const launch = (appId: (typeof APP_LIST)[number]["id"]) => {
    openApp(appId);
    setSpotlightOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/35 px-4 pt-[16vh] backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSpotlightOpen(false);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.975, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel w-full max-w-[610px] overflow-hidden rounded-2xl"
            role="dialog"
            aria-label="Spotlight search"
          >
            <div className="flex h-[54px] items-center gap-3 border-b border-white/[0.08] px-4">
              <Search className="h-5 w-5 shrink-0 text-zinc-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setSelected((current) =>
                      Math.min(
                        Math.max(0, results.length - 1),
                        current + 1,
                      ),
                    );
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setSelected((current) => Math.max(0, current - 1));
                  }
                  if (event.key === "Enter" && results[safeSelected]) {
                    event.preventDefault();
                    launch(results[safeSelected].id);
                  }
                  if (event.key === "Escape") {
                    setSpotlightOpen(false);
                  }
                }}
                placeholder="Search apps, files, and settings"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-light tracking-[-0.01em] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                aria-label="Spotlight search"
              />
              <span className="rounded border border-white/[0.1] px-1.5 py-0.5 text-[9px] text-zinc-600">
                ESC
              </span>
            </div>

            <div className="max-h-[330px] overflow-auto p-1.5">
              <p className="px-2.5 pb-1.5 pt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                {query ? "Top Results" : "Applications"}
              </p>

              {results.map((app, index) => (
                <button
                  key={app.id}
                  type="button"
                  onMouseEnter={() => setSelected(index)}
                  onClick={() => launch(app.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                    safeSelected === index
                      ? "bg-[var(--accent)] text-white"
                      : "text-zinc-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <AppIcon app={app} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-medium">
                      {app.name}
                    </span>
                    <span
                      className={`block truncate text-[9.5px] ${
                        safeSelected === index
                          ? "text-white/70"
                          : "text-zinc-600"
                      }`}
                    >
                      {app.description}
                    </span>
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8.5px] ${
                      safeSelected === index
                        ? "bg-white/15 text-white/80"
                        : "bg-white/[0.04] text-zinc-600"
                    }`}
                  >
                    Application
                  </span>
                </button>
              ))}

              {results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <Search className="mb-2 h-6 w-6 text-zinc-700" />
                  <p className="text-[11px]">No results for “{query}”</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2 text-[8.5px] text-zinc-600">
              <span className="flex items-center gap-1.5">
                <span>↑↓</span>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="h-2.5 w-2.5" />
                Open
              </span>
              <span className="flex items-center gap-1.5">
                <span>⌘ Space</span>
                Toggle Spotlight
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
