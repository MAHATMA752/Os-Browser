"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { api } from "@/lib/api-client";
import type { CalendarEvent } from "@/lib/api-types";
import { useOSStore } from "@/store/os-store";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function sameDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCells(cursor: Date) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();
  const cells: { date: Date; currentMonth: boolean }[] = [];

  for (let index = 0; index < 42; index += 1) {
    const offset = index - firstWeekday + 1;

    if (offset < 1) {
      cells.push({
        date: new Date(year, month - 1, daysInPreviousMonth + offset),
        currentMonth: false,
      });
    } else if (offset > daysInMonth) {
      cells.push({
        date: new Date(year, month + 1, offset - daysInMonth),
        currentMonth: false,
      });
    } else {
      cells.push({ date: new Date(year, month, offset), currentMonth: true });
    }
  }

  return cells;
}

export function CalendarApp() {
  const [today, setToday] = useState(() => new Date(2026, 10, 1));
  const [cursor, setCursor] = useState(() =>
    startOfMonth(new Date(2026, 10, 1)),
  );
  const [selected, setSelected] = useState(() => new Date(2026, 10, 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [draftTitle, setDraftTitle] = useState("New event");
  const [draftTime, setDraftTime] = useState("09:00");
  const accent = useOSStore((state) => state.accent);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const actual = new Date();
      setToday(actual);
      setCursor(startOfMonth(actual));
      setSelected(actual);
      setLoading(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const month = monthKey(cursor);

    const loadEvents = async () => {
      try {
        const data = await api.getEvents(month);
        if (!cancelled) {
          setEvents(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load events",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, [cursor]);

  const cells = useMemo(() => getCells(cursor), [cursor]);
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};

    for (const event of events) {
      (grouped[event.date] ??= []).push(event);
    }

    return grouped;
  }, [events]);

  const selectedEvents = eventsByDate[dateKey(selected)] ?? [];
  const todayKey = dateKey(today);
  const selectedKey = dateKey(selected);

  const moveMonth = (delta: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setLoading(true);
    setCursor(next);
    setSelected(next);
    setShowComposer(false);
  };

  const goToday = () => {
    setLoading(true);
    setCursor(startOfMonth(today));
    setSelected(new Date(today));
    setShowComposer(false);
  };

  const openComposer = () => {
    setDraftTitle("New event");
    setDraftTime("09:00");
    setError(null);
    setShowComposer(true);
  };

  const addEvent = async () => {
    const title = draftTitle.trim() || "New event";
    const time = draftTime.trim() || "09:00";

    setBusy(true);
    setError(null);

    try {
      const event = await api.createEvent({
        date: dateKey(selected),
        title,
        time,
        color: accent,
      });
      setEvents((current) =>
        [...current, event].sort(
          (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
        ),
      );
      setShowComposer(false);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create event",
      );
    } finally {
      setBusy(false);
    }
  };

  const removeEvent = async (id: string) => {
    setBusy(true);
    setError(null);

    try {
      await api.deleteEvent(id);
      setEvents((current) => current.filter((event) => event.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete event",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex h-full bg-[#18181B] text-zinc-200">
      <aside className="hidden w-[200px] shrink-0 flex-col border-r border-white/[0.06] bg-[#111113] px-3 py-4 md:flex">
        <div className="flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#F87171] to-[#DC2626] shadow-[0_4px_10px_rgba(220,38,38,0.25)]">
            <CalendarDays className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-zinc-200">Calendar</p>
            <p className="text-[9px] text-zinc-600">
              {cursor.toLocaleDateString("en-US", { year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/[0.06] bg-white/[0.025] p-2.5">
          <p className="text-center text-[10px] font-medium text-zinc-400">
            {cursor.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-[8px] text-zinc-600">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
            {cells.map(({ date, currentMonth }, index) => {
              const isToday = sameDay(date, today);
              const isSelected = sameDay(date, selected);
              return (
                <button
                  key={`${dateKey(date)}-${index}`}
                  type="button"
                  onClick={() => setSelected(date)}
                  className={`mx-auto flex h-4 w-4 items-center justify-center rounded-full text-[8px] transition ${
                    isToday
                      ? "bg-[var(--accent)] font-semibold text-white"
                      : isSelected
                        ? "bg-white/10 text-white"
                        : currentMonth
                          ? "text-zinc-400 hover:bg-white/[0.06]"
                          : "text-zinc-700"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-5 px-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
          My Calendars
        </p>
        <div className="mt-1.5 space-y-1">
          {[
            { label: "Personal", color: "#5AC8FA" },
            { label: "Work", color: "#3B82F6" },
            { label: "Ideas", color: "#A78BFA" },
            { label: "Birthdays", color: "#FB7185" },
          ].map((calendar) => (
            <button
              key={calendar.label}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-zinc-400 transition hover:bg-white/[0.04] hover:text-zinc-200"
            >
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: calendar.color }}
              />
              {calendar.label}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b border-white/[0.06] bg-[#1b1b1f] px-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-zinc-100">
              {cursor.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[9.5px] text-zinc-500">
              {loading && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
              {error
                ? error
                : `${selectedEvents.length} event${
                    selectedEvents.length === 1 ? "" : "s"
                  } selected`}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={goToday}
              className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[10px] text-zinc-300 transition hover:bg-white/[0.05]"
            >
              Today
            </button>
            <div className="flex rounded-md border border-white/[0.08] bg-black/20 p-0.5">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="rounded p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                className="rounded p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
                aria-label="Next month"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={openComposer}
              className="flex items-center gap-1 rounded-md bg-[var(--accent)] px-2.5 py-1 text-[10px] font-medium text-white transition hover:brightness-110"
            >
              <Plus className="h-3 w-3" />
              Event
            </button>
          </div>
        </header>

        <div className="grid shrink-0 grid-cols-7 border-b border-white/[0.06] bg-[#161618]">
          {weekdayLabels.map((day) => (
            <div
              key={day}
              className="py-1.5 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
          {cells.map(({ date, currentMonth }, index) => {
            const key = dateKey(date);
            const dayEvents = eventsByDate[key] ?? [];
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;

            return (
              <button
                key={`${key}-${index}`}
                type="button"
                onClick={() => setSelected(date)}
                className={`group relative flex min-h-0 flex-col border-b border-r border-white/[0.045] p-1.5 text-left transition ${
                  isSelected
                    ? "bg-white/[0.055]"
                    : "hover:bg-white/[0.025]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    isToday
                      ? "bg-[var(--accent)] font-semibold text-white"
                      : currentMonth
                        ? "text-zinc-300"
                        : "text-zinc-700"
                  }`}
                >
                  {date.getDate()}
                </span>
                <div className="mt-0.5 min-h-0 space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <span
                      key={event.id}
                      className="flex items-center gap-1 truncate text-[8px] leading-tight text-zinc-500"
                    >
                      <span
                        className="h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="block text-[8px] text-zinc-600">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <footer className="flex min-h-[62px] shrink-0 items-center gap-3 border-t border-white/[0.06] bg-[#161618] px-4 py-2">
          <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-white/[0.05]">
            <span className="text-[8px] uppercase text-zinc-500">
              {selected.toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-[14px] font-semibold leading-none text-zinc-100">
              {selected.getDate()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium text-zinc-300">
              {selected.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="mt-1 flex gap-3 overflow-hidden">
              {selectedEvents.length > 0 ? (
                selectedEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className="group flex items-center gap-1 text-[9px] text-zinc-500"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    {event.time} · {event.title}
                    <button
                      type="button"
                      onClick={() => void removeEvent(event.id)}
                      disabled={busy}
                      className="rounded p-0.5 text-zinc-600 opacity-0 transition hover:bg-white/[0.06] hover:text-rose-300 group-hover:opacity-100 disabled:opacity-40"
                      aria-label={`Delete ${event.title}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-[9px] text-zinc-600">
                  {loading ? "Loading events…" : "No events scheduled"}
                </span>
              )}
            </div>
          </div>
        </footer>
      </section>

      {showComposer && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void addEvent();
          }}
          className="absolute right-4 top-[68px] z-20 w-[260px] rounded-xl border border-white/[0.12] bg-[#202024]/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-200">New event</p>
            <button
              type="button"
              onClick={() => setShowComposer(false)}
              className="rounded p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
              aria-label="Close event form"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-0.5 text-[9px] text-zinc-600">
            {selected.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>

          <div className="mt-3 space-y-2">
            <input
              autoFocus
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              className="w-full rounded-md border border-white/[0.1] bg-black/20 px-2 py-1.5 text-[11px] text-zinc-200 focus:border-[var(--accent)] focus:outline-none"
              placeholder="Event title"
              aria-label="Event title"
            />
            <input
              value={draftTime}
              onChange={(event) => setDraftTime(event.target.value)}
              className="w-full rounded-md border border-white/[0.1] bg-black/20 px-2 py-1.5 text-[11px] text-zinc-200 focus:border-[var(--accent)] focus:outline-none"
              placeholder="09:00"
              aria-label="Event time"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[9px] text-zinc-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
              Accent color
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[10px] text-zinc-400 transition hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex items-center gap-1 rounded-md bg-[var(--accent)] px-2.5 py-1 text-[10px] font-medium text-white transition hover:brightness-110 disabled:opacity-40"
              >
                {busy && <Loader2 className="h-3 w-3 animate-spin" />}
                Add
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
