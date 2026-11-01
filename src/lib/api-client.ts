import type {
  AppSettings,
  CalendarEvent,
  Note,
  VirtualFile,
  VirtualFileKind,
} from "@/lib/api-types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // Keep the generic message when the response is not JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const api = {
  getSettings: () => request<AppSettings>("/api/settings"),
  updateSettings: (patch: Partial<AppSettings>) =>
    request<AppSettings>("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  getNotes: () => request<Note[]>("/api/notes"),
  createNote: (input: { title?: string; body?: string } = {}) =>
    request<Note>("/api/notes", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateNote: (id: string, patch: { title?: string; body?: string }) =>
    request<Note>(`/api/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteNote: (id: string) =>
    request<{ ok: true }>(`/api/notes/${id}`, { method: "DELETE" }),

  getFiles: () => request<VirtualFile[]>("/api/files"),
  createFile: (input: {
    name: string;
    kind: VirtualFileKind;
    parentId?: string | null;
    size?: string;
    content?: string | null;
  }) =>
    request<VirtualFile>("/api/files", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateFile: (
    id: string,
    patch: {
      name?: string;
      kind?: VirtualFileKind;
      parentId?: string | null;
      size?: string;
      content?: string | null;
    },
  ) =>
    request<VirtualFile>(`/api/files/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteFile: (id: string) =>
    request<{ ok: true }>(`/api/files/${id}`, { method: "DELETE" }),

  getEvents: (month: string) =>
    request<CalendarEvent[]>(
      `/api/calendar/events?month=${encodeURIComponent(month)}`,
    ),
  createEvent: (input: {
    date: string;
    title: string;
    time: string;
    color: string;
  }) =>
    request<CalendarEvent>("/api/calendar/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteEvent: (id: string) =>
    request<{ ok: true }>(`/api/calendar/events/${id}`, {
      method: "DELETE",
    }),
};
