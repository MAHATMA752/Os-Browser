"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Globe2,
  Lock,
  Plus,
  RotateCw,
  Search,
  Shield,
  Star,
  X,
} from "lucide-react";

const quickLinks = [
  {
    name: "Example",
    description: "A safe page to embed",
    url: "https://example.com",
    color: "from-sky-400 to-blue-600",
  },
  {
    name: "Wikipedia",
    description: "The free encyclopedia",
    url: "https://www.wikipedia.org",
    color: "from-zinc-300 to-zinc-500",
  },
  {
    name: "MDN",
    description: "Web development docs",
    url: "https://developer.mozilla.org",
    color: "from-emerald-400 to-teal-600",
  },
  {
    name: "GitHub",
    description: "Build something great",
    url: "https://github.com",
    color: "from-zinc-500 to-zinc-800",
  },
];

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "New Tab";
  }
}

export function BrowserApp() {
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const openUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    setUrl(normalized);
    setAddress(normalized);
  };

  const submitAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = address.trim();
    if (!value) {
      return;
    }

    const looksLikeUrl =
      /^https?:\/\//i.test(value) || /^[^\s]+\.[^\s]+/.test(value);

    if (looksLikeUrl) {
      openUrl(value);
      return;
    }

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(value)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!search.trim()) {
      return;
    }

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(search.trim())}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const goHome = () => {
    setUrl(null);
    setAddress("");
  };

  return (
    <div className="flex h-full flex-col bg-[#18181B]">
      <div className="flex h-9 shrink-0 items-end gap-1 border-b border-black/30 bg-[#141417] px-2 pt-1.5">
        <div className="flex h-[26px] min-w-0 flex-1 items-center gap-2 rounded-t-lg border border-b-0 border-white/[0.08] bg-[#202024] px-2.5 text-[10px] text-zinc-300">
          <Globe2 className="h-3 w-3 shrink-0 text-zinc-500" />
          <span className="truncate">
            {url ? hostnameOf(url) : "Start Page"}
          </span>
          <button
            type="button"
            onClick={goHome}
            className="ml-auto rounded p-0.5 text-zinc-600 transition hover:bg-white/10 hover:text-zinc-300"
            aria-label="Close tab"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={goHome}
          className="mb-1 rounded-md p-1 text-zinc-600 transition hover:bg-white/[0.06] hover:text-zinc-300"
          aria-label="New tab"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <header className="flex h-11 shrink-0 items-center gap-1.5 border-b border-white/[0.07] bg-[#1d1d21] px-2.5">
        <button
          type="button"
          onClick={goHome}
          className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
          aria-label="Back"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="cursor-default rounded-md p-1.5 text-zinc-700"
          aria-label="Forward"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (url) {
              setReloadKey((current) => current + 1);
            }
          }}
          className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
          aria-label="Refresh"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        <form onSubmit={submitAddress} className="mx-1 min-w-0 flex-1">
          <label className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/25 px-2.5 text-zinc-500 transition focus-within:border-white/20">
            {url ? (
              <Lock className="h-3 w-3 shrink-0 text-emerald-400/80" />
            ) : (
              <Search className="h-3 w-3 shrink-0" />
            )}
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Search or enter website"
              className="min-w-0 flex-1 bg-transparent text-center text-[10.5px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
              aria-label="Address bar"
            />
            {url && (
              <span className="flex items-center gap-1 text-[8.5px] text-emerald-400/80">
                <Shield className="h-2.5 w-2.5" />
                Secure
              </span>
            )}
          </label>
        </form>

        <button
          type="button"
          className="rounded-md p-1.5 text-zinc-600 transition hover:bg-white/[0.06] hover:text-zinc-300"
          aria-label="Bookmark"
        >
          <Star className="h-3.5 w-3.5" />
        </button>
        {url && (
          <button
            type="button"
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
            aria-label="Open in main browser"
            title="Open in main browser"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#111114]">
        {url ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-amber-400/[0.055] px-3 py-1.5 text-[9px] text-amber-200/70">
              <Globe2 className="h-3 w-3 shrink-0" />
              <span className="truncate">
                Some sites block embedding. If the page stays blank, open it in
                your main browser.
              </span>
              <button
                type="button"
                onClick={() =>
                  window.open(url, "_blank", "noopener,noreferrer")
                }
                className="ml-auto shrink-0 rounded border border-amber-200/20 px-1.5 py-0.5 transition hover:bg-amber-200/10"
              >
                Open
              </button>
            </div>
            <iframe
              key={reloadKey}
              src={url}
              title={hostnameOf(url)}
              className="min-h-0 w-full flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center overflow-auto px-6 py-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#5AC8FA] via-[#3B82F6] to-[#8B5CF6] shadow-[0_16px_40px_rgba(59,130,246,0.28)]">
              <span className="text-[24px] font-semibold tracking-[-0.06em] text-white">
                N
              </span>
            </div>
            <h2 className="mt-3 text-[18px] font-semibold tracking-[-0.025em] text-zinc-100">
              NOVA Browser
            </h2>
            <p className="mt-1 text-[10px] text-zinc-600">
              A quiet window to the web
            </p>

            <form onSubmit={submitSearch} className="mt-5 w-full max-w-[440px]">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.055] px-3 text-zinc-500 shadow-xl shadow-black/20 transition focus-within:border-white/25">
                <Search className="h-4 w-4" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search the web"
                  className="min-w-0 flex-1 bg-transparent text-[12px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  aria-label="Search the web"
                />
                <span className="rounded border border-white/10 px-1 py-0.5 text-[8px] text-zinc-600">
                  ↵
                </span>
              </label>
            </form>

            <div className="mt-7 w-full max-w-[520px]">
              <p className="mb-2 px-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                Favorites
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => openUrl(link.url)}
                    className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-left transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.045]"
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br ${link.color} shadow-md`}
                    >
                      <Globe2 className="h-3.5 w-3.5 text-white" />
                    </span>
                    <span className="mt-2 block text-[10.5px] font-medium text-zinc-300 group-hover:text-white">
                      {link.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[8.5px] text-zinc-600">
                      {link.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 text-center text-[9px] text-zinc-700">
              Embedded pages may be limited by the site’s security policy.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
