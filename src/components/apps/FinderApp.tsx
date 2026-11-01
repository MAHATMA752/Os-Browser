"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Clock3,
  Download,
  FileCode2,
  FilePlus2,
  FileText,
  Folder,
  FolderPlus,
  Grid2X2,
  HardDrive,
  Image,
  List,
  Loader2,
  Monitor,
  Search,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { api } from "@/lib/api-client";
import type { VirtualFile, VirtualFileKind } from "@/lib/api-types";

const favorites = [
  { label: "Recents", icon: Clock3 },
  { label: "Applications", icon: AppWindow },
  { label: "Desktop", icon: Monitor },
  { label: "Documents", icon: FileText },
  { label: "Downloads", icon: Download },
  { label: "Pictures", icon: Image },
];

function ItemGlyph({ kind }: { kind: VirtualFileKind }) {
  if (kind === "folder") {
    return (
      <Folder
        className="h-10 w-10 text-[#5AC8FA] drop-shadow-[0_3px_6px_rgba(56,189,248,0.18)]"
        fill="currentColor"
        strokeWidth={1.3}
      />
    );
  }

  if (kind === "code") {
    return (
      <div className="flex h-10 w-8 items-center justify-center rounded-[5px] border border-white/10 bg-[#202024]">
        <FileCode2 className="h-5 w-5 text-emerald-300" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-8 items-center justify-center rounded-[5px] border border-white/10 bg-[#202024]">
      <FileText className="h-5 w-5 text-zinc-300" />
    </div>
  );
}

function formatFileDate(value: string) {
  const date = new Date(value);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function matchesFavorite(file: VirtualFile, favorite: string) {
  if (favorite === "Applications") {
    return file.kind === "code";
  }

  if (favorite === "Desktop") {
    return file.kind === "folder";
  }

  if (favorite === "Documents") {
    return file.kind !== "folder";
  }

  if (favorite === "Downloads") {
    return /\.(zip|dmg|pkg|pdf)$/i.test(file.name);
  }

  if (favorite === "Pictures") {
    return (
      /screenshot|wallpaper/i.test(file.name) ||
      /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)
    );
  }

  return true;
}

export function FinderApp() {
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [selected, setSelected] = useState("Recents");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<VirtualFileKind | null>(null);
  const [draftName, setDraftName] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<VirtualFile | null>(null);
  const [previewName, setPreviewName] = useState("");
  const [previewContent, setPreviewContent] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFiles = async () => {
      try {
        const data = await api.getFiles();
        if (!cancelled) {
          setFiles(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Failed to load files",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFiles();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return files.filter((file) => {
      const matchesQuery =
        !normalized || file.name.toLowerCase().includes(normalized);
      return matchesQuery && matchesFavorite(file, selected);
    });
  }, [files, query, selected]);

  const startCreate = (kind: VirtualFileKind) => {
    setCreating(kind);
    setDraftName(
      kind === "folder" ? "Untitled folder" : kind === "code" ? "snippet.ts" : "Untitled.txt",
    );
    setSelectedId(null);
    setError(null);
  };

  const createItem = async () => {
    if (!creating) {
      return;
    }

    const name = draftName.trim();
    if (!name) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const file = await api.createFile({
        name,
        kind: creating,
        size: creating === "folder" ? "0 items" : "0 KB",
        content: creating === "folder" ? null : "",
      });
      setFiles((current) => [file, ...current]);
      setSelected("Recents");
      setQuery("");
      setSelectedId(file.id);
      setCreating(null);
      setDraftName("");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create item",
      );
    } finally {
      setBusy(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedId) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await api.deleteFile(selectedId);
      setFiles((current) => current.filter((file) => file.id !== selectedId));
      setSelectedId(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete item",
      );
    } finally {
      setBusy(false);
    }
  };

  const openPreview = (file: VirtualFile) => {
    setPreview(file);
    setPreviewName(file.name);
    setPreviewContent(file.content ?? "");
    setSelectedId(file.id);
    setError(null);
  };

  const closePreview = () => {
    setPreview(null);
    setPreviewName("");
    setPreviewContent("");
  };

  const savePreview = async () => {
    if (!preview) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const updated = await api.updateFile(preview.id, {
        name: previewName.trim() || preview.name,
        content: preview.kind === "folder" ? preview.content : previewContent,
      });
      setFiles((current) =>
        current.map((file) => (file.id === updated.id ? updated : file)),
      );
      closePreview();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save item",
      );
    } finally {
      setBusy(false);
    }
  };

  const heading = query ? "Search Results" : selected;

  return (
    <div className="relative flex h-full bg-[#18181B] text-zinc-200">
      <aside className="hidden w-[190px] shrink-0 flex-col border-r border-white/[0.06] bg-[#111113] px-2.5 py-3 sm:flex">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-zinc-500">
          Favorites
        </p>
        <div className="space-y-0.5">
          {favorites.map((item) => {
            const Icon = item.icon;
            const active = selected === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setSelected(item.label);
                  setQuery("");
                  setSelectedId(null);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-[6px] text-left text-[12px] transition ${
                  active
                    ? "bg-white/[0.09] text-white"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    active ? "text-[var(--accent)]" : "text-zinc-500"
                  }`}
                  strokeWidth={1.8}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-1.5 px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-zinc-500">
          <HardDrive className="h-3 w-3" />
          Locations
        </div>
        <button
          type="button"
          onClick={() => {
            setSelected("Recents");
            setQuery("");
          }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-[6px] text-left text-[12px] text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-200"
        >
          <HardDrive className="h-3.5 w-3.5 text-zinc-500" />
          NOVA HD
        </button>

        <div className="mt-auto space-y-1 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-[6px] text-left text-[12px] text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300"
          >
            <Star className="h-3.5 w-3.5" />
            Favorites
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-[6px] text-left text-[12px] text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300"
          >
            <Tag className="h-3.5 w-3.5" />
            Tags
          </button>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-white/[0.06] bg-[#1b1b1f] px-3">
          <div className="flex items-center gap-0.5 text-zinc-500">
            <button
              type="button"
              className="rounded-md p-1.5 transition hover:bg-white/[0.06] hover:text-zinc-200"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-zinc-600 transition hover:bg-white/[0.06] hover:text-zinc-200"
              aria-label="Forward"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="ml-1 flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[13px] font-semibold text-zinc-100">
              {selected}
            </span>
            <span className="text-[10px] text-zinc-600">⌄</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label className="flex h-7 w-36 items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/20 px-2 text-zinc-500 transition focus-within:border-white/20 focus-within:text-zinc-300 sm:w-44">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              />
            </label>

            <div className="flex rounded-md border border-white/[0.08] bg-black/20 p-0.5">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded p-1 transition ${
                  view === "grid"
                    ? "bg-white/[0.1] text-zinc-200"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded p-1 transition ${
                  view === "list"
                    ? "bg-white/[0.1] text-zinc-200"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-5">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-1">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-100">
                {heading}
              </h2>
              <p className="mt-0.5 text-[10.5px] text-zinc-500">
                {loading ? "Loading…" : `${filteredItems.length} items`}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => startCreate("folder")}
                className="flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-300 transition hover:bg-white/[0.05]"
              >
                <FolderPlus className="h-3 w-3" />
                New folder
              </button>
              <button
                type="button"
                onClick={() => startCreate("file")}
                className="flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-300 transition hover:bg-white/[0.05]"
              >
                <FilePlus2 className="h-3 w-3" />
                New file
              </button>
              {selectedId && (
                <button
                  type="button"
                  onClick={() => void deleteSelected()}
                  disabled={busy}
                  className="rounded-md border border-white/[0.08] p-1 text-zinc-500 transition hover:bg-white/[0.05] hover:text-rose-300 disabled:opacity-40"
                  aria-label="Delete selected item"
                  title="Delete selected item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2 text-[10.5px] text-rose-200">
              {error}
            </div>
          )}

          {creating && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void createItem();
              }}
              className="mb-3 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2"
            >
              <ItemGlyph kind={creating} />
              <input
                autoFocus
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="min-w-0 flex-1 rounded-md border border-white/[0.1] bg-black/20 px-2 py-1 text-[11px] text-zinc-200 focus:border-[var(--accent)] focus:outline-none"
                aria-label="New item name"
              />
              <button
                type="submit"
                disabled={busy || !draftName.trim()}
                className="flex items-center gap-1 rounded-md bg-[var(--accent)] px-2.5 py-1 text-[10px] font-medium text-white transition hover:brightness-110 disabled:opacity-40"
              >
                {busy && <Loader2 className="h-3 w-3 animate-spin" />}
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(null);
                  setDraftName("");
                }}
                className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[10px] text-zinc-400 transition hover:bg-white/[0.05]"
              >
                Cancel
              </button>
            </form>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl bg-white/[0.035]"
                />
              ))}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => openPreview(item)}
                  className={`group flex flex-col items-center rounded-xl border px-2 py-3 text-center transition ${
                    selectedId === item.id
                      ? "border-[var(--accent)] bg-white/[0.06]"
                      : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.045]"
                  }`}
                >
                  <div className="flex h-12 items-center justify-center transition duration-200 group-hover:-translate-y-0.5">
                    <ItemGlyph kind={item.kind} />
                  </div>
                  <span className="mt-2 line-clamp-2 text-[11px] font-medium leading-tight text-zinc-300 group-hover:text-white">
                    {item.name}
                  </span>
                  <span className="mt-1 text-[9.5px] text-zinc-600">
                    {item.size}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-white/[0.06]">
              <div className="grid grid-cols-[1fr_110px_80px] border-b border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium text-zinc-500">
                <span>Name</span>
                <span>Date Modified</span>
                <span>Size</span>
              </div>
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => openPreview(item)}
                  className={`grid w-full grid-cols-[1fr_110px_80px] items-center px-3 py-2 text-left text-[11px] transition hover:bg-white/[0.05] ${
                    selectedId === item.id
                      ? "bg-[var(--accent-soft)]"
                      : index % 2
                        ? "bg-white/[0.012]"
                        : ""
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ItemGlyph kind={item.kind} />
                    <span className="truncate text-zinc-300">{item.name}</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {formatFileDate(item.updatedAt)}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {item.size}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="flex h-48 flex-col items-center justify-center text-zinc-500">
              <Search className="mb-2 h-7 w-7 text-zinc-700" />
              <p className="text-xs">
                {query ? `No items match “${query}”.` : "This folder is empty."}
              </p>
            </div>
          )}
        </div>

        <footer className="flex h-7 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#161618] px-3 text-[9.5px] text-zinc-600">
          <span>{filteredItems.length} items</span>
          <span>NOVA HD · SQLite volume</span>
        </footer>
      </section>

      {preview && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div
            className="flex max-h-full w-full max-w-[580px] flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-[#1b1b1f] shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] px-3">
              <span className="flex min-w-0 items-center gap-2 text-[12px] font-semibold text-zinc-200">
                <ItemGlyph kind={preview.kind} />
                <span className="truncate">Quick Look</span>
              </span>
              <button
                type="button"
                onClick={closePreview}
                className="rounded-md p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-4">
              <label className="flex flex-col gap-1 text-[10px] text-zinc-500">
                Name
                <input
                  value={previewName}
                  onChange={(event) => setPreviewName(event.target.value)}
                  className="rounded-md border border-white/[0.1] bg-black/20 px-2.5 py-1.5 text-[12px] text-zinc-200 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              {preview.kind === "folder" ? (
                <p className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-8 text-center text-[11px] text-zinc-600">
                  Folder metadata can be renamed here.
                </p>
              ) : (
                <label className="flex min-h-[180px] flex-1 flex-col gap-1 text-[10px] text-zinc-500">
                  Content
                  <textarea
                    value={previewContent}
                    onChange={(event) => setPreviewContent(event.target.value)}
                    className="min-h-[160px] flex-1 resize-none rounded-md border border-white/[0.1] bg-black/20 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-zinc-300 focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>
              )}
            </div>

            <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.07] px-3 py-2.5">
              <button
                type="button"
                onClick={closePreview}
                className="rounded-md border border-white/[0.08] px-3 py-1 text-[10px] text-zinc-400 transition hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void savePreview()}
                disabled={busy}
                className="flex items-center gap-1 rounded-md bg-[var(--accent)] px-3 py-1 text-[10px] font-medium text-white transition hover:brightness-110 disabled:opacity-40"
              >
                {busy && <Loader2 className="h-3 w-3 animate-spin" />}
                Save
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
