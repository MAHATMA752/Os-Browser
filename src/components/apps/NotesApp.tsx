"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Note } from "@/lib/api-types";

function formatNoteDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today · ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, number>>({});

  const activeNote =
    notes.find((note) => note.id === activeId) ?? notes[0] ?? null;

  useEffect(() => {
    let cancelled = false;

    const loadNotes = async () => {
      try {
        const data = await api.getNotes();
        if (!cancelled) {
          setNotes(data);
          setActiveId(data[0]?.id ?? null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Failed to load notes",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadNotes();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timers = saveTimers.current;

    return () => {
      Object.values(timers).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const filteredNotes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return notes;
    }

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalized) ||
        note.body.toLowerCase().includes(normalized),
    );
  }, [notes, query]);

  const persistNote = async (note: Note) => {
    try {
      const saved = await api.updateNote(note.id, {
        title: note.title,
        body: note.body,
      });
      setNotes((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      );
      setSaving(false);
      setError(null);
    } catch (saveError) {
      setSaving(false);
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save note",
      );
    }
  };

  const scheduleSave = (note: Note) => {
    setSaving(true);
    setError(null);

    const existing = saveTimers.current[note.id];
    if (existing) {
      window.clearTimeout(existing);
    }

    saveTimers.current[note.id] = window.setTimeout(() => {
      delete saveTimers.current[note.id];
      void persistNote(note);
    }, 600);
  };

  const flushSave = (note: Note) => {
    const existing = saveTimers.current[note.id];
    if (!existing) {
      return;
    }

    window.clearTimeout(existing);
    delete saveTimers.current[note.id];
    setSaving(true);
    void persistNote(note);
  };

  const updateActiveNote = (patch: Partial<Pick<Note, "title" | "body">>) => {
    if (!activeNote) {
      return;
    }

    const next = {
      ...activeNote,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    setNotes((current) =>
      current.map((note) => (note.id === next.id ? next : note)),
    );
    scheduleSave(next);
  };

  const selectNote = (note: Note) => {
    if (activeNote && activeNote.id !== note.id) {
      flushSave(activeNote);
    }
    setActiveId(note.id);
  };

  const addNote = async () => {
    if (activeNote) {
      flushSave(activeNote);
    }

    setError(null);

    try {
      const note = await api.createNote({ title: "Untitled note", body: "" });
      setNotes((current) => [note, ...current]);
      setActiveId(note.id);
      setQuery("");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create note",
      );
    }
  };

  const deleteNote = async () => {
    if (!activeNote) {
      return;
    }

    const timer = saveTimers.current[activeNote.id];
    if (timer) {
      window.clearTimeout(timer);
      delete saveTimers.current[activeNote.id];
    }

    setError(null);

    try {
      await api.deleteNote(activeNote.id);
      const next = notes.filter((note) => note.id !== activeNote.id);
      setNotes(next);
      setActiveId(next[0]?.id ?? null);
      setSaving(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete note",
      );
    }
  };

  return (
    <div className="flex h-full bg-[#18181B] text-zinc-200">
      <aside className="flex w-[238px] shrink-0 flex-col border-r border-white/[0.06] bg-[#111113]">
        <div className="flex h-12 items-center justify-between px-3">
          <span className="text-[13px] font-semibold text-zinc-100">Notes</span>
          <button
            type="button"
            onClick={() => void addNote()}
            className="rounded-md p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
            aria-label="New note"
            title="New note"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="px-2.5 pb-2">
          <label className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/20 px-2 text-zinc-500 transition focus-within:border-white/20">
            <Search className="h-3.5 w-3.5" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              className="min-w-0 flex-1 bg-transparent text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 space-y-0.5 overflow-auto px-1.5 pb-3">
          <p className="px-2 pb-1 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            {query ? "Results" : "All Notes"}
          </p>

          {loading && (
            <div className="space-y-2 px-2 py-1">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-lg bg-white/[0.04]"
                />
              ))}
            </div>
          )}

          {!loading &&
            filteredNotes.map((note) => {
              const active = note.id === activeNote?.id;
              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => selectNote(note)}
                  className={`w-full rounded-lg border px-2.5 py-2.5 text-left transition ${
                    active
                      ? "border-white/[0.08] bg-white/[0.075]"
                      : "border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <p
                    className={`truncate text-[11.5px] font-semibold ${
                      active ? "text-zinc-50" : "text-zinc-300"
                    }`}
                  >
                    {note.title || "Untitled note"}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                    {formatNoteDate(note.updatedAt)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-zinc-500">
                    {note.body || "No additional text"}
                  </p>
                </button>
              );
            })}

          {!loading && filteredNotes.length === 0 && (
            <p className="px-3 py-6 text-center text-[11px] leading-relaxed text-zinc-600">
              {notes.length === 0
                ? "No notes yet. Create your first note."
                : "No notes found."}
            </p>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center border-b border-white/[0.06] bg-[#1b1b1f] px-4">
          <span className="text-[10px] text-zinc-500">
            {activeNote ? formatNoteDate(activeNote.updatedAt) : "No note selected"}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span
              className={`flex items-center gap-1 text-[10px] ${
                error
                  ? "text-rose-300"
                  : saving
                    ? "text-zinc-500"
                    : "text-zinc-600"
              }`}
              title={error ?? "Notes are stored in SQLite"}
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3 text-emerald-400/80" />
              )}
              {error ? "Save failed" : saving ? "Saving…" : "Saved to SQLite"}
            </span>
            <button
              type="button"
              onClick={() => void deleteNote()}
              disabled={!activeNote}
              className="rounded-md p-1.5 text-zinc-600 transition hover:bg-white/[0.06] hover:text-rose-300 disabled:cursor-default disabled:opacity-40"
              aria-label="Delete note"
              title="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {activeNote ? (
          <div className="mx-auto flex min-h-0 w-full max-w-[680px] flex-1 flex-col px-7 pb-5 pt-6">
            <input
              value={activeNote.title}
              onChange={(event) =>
                updateActiveNote({ title: event.target.value })
              }
              onBlur={() => flushSave(activeNote)}
              className="w-full bg-transparent text-[22px] font-semibold tracking-[-0.025em] text-zinc-50 placeholder:text-zinc-600 focus:outline-none"
              placeholder="Untitled note"
            />
            <div className="my-4 h-px bg-white/[0.06]" />
            <textarea
              value={activeNote.body}
              onChange={(event) =>
                updateActiveNote({ body: event.target.value })
              }
              onBlur={() => flushSave(activeNote)}
              placeholder="Start writing…"
              className="min-h-0 flex-1 resize-none bg-transparent text-[13px] leading-7 text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-zinc-600">
            <p className="text-sm">
              {loading ? "Loading notes…" : "No note selected"}
            </p>
            {!loading && (
              <button
                type="button"
                onClick={() => void addNote()}
                className="mt-3 rounded-md border border-white/10 px-3 py-1.5 text-[11px] text-zinc-300 transition hover:bg-white/[0.06]"
              >
                Create a note
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
