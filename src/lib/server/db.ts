import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  AppSettings,
  CalendarEvent,
  Note,
  VirtualFile,
  VirtualFileKind,
  WallpaperId,
} from "@/lib/api-types";

type SettingsRow = { key: string; value: string };
type NoteRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};
type FileRow = {
  id: string;
  parent_id: string | null;
  name: string;
  kind: VirtualFileKind;
  size: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};
type EventRow = {
  id: string;
  date: string;
  title: string;
  time: string;
  color: string;
  created_at: string;
};

const DEFAULT_SETTINGS: AppSettings = {
  accent: "#3B82F6",
  wallpaper: "aurora",
  dockSize: 46,
  dockMagnify: true,
  showDesktopIcons: true,
  showHardDisks: true,
  showMenuBarDate: true,
  clock24: false,
};

const globalForDb = globalThis as unknown as {
  novaDb?: DatabaseSync;
};

function nowIso() {
  return new Date().toISOString();
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function mapNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFile(row: FileRow): VirtualFile {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    kind: row.kind,
    size: row.size,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    time: row.time,
    color: row.color,
    createdAt: row.created_at,
  };
}

function seed(db: DatabaseSync) {
  const timestamp = nowIso();

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    db.prepare(
      "INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?)",
    ).run(key, JSON.stringify(value), timestamp);
  }

  const noteCount = db
    .prepare("SELECT COUNT(*) AS count FROM notes")
    .get() as { count: number };

  if (Number(noteCount.count) === 0) {
    const insertNote = db.prepare(
      "INSERT INTO notes (id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    );
    const notes = [
      {
        title: "NOVA OS launch notes",
        body: "The desktop should feel calm before it feels powerful.\n\nFocus for the first release:\n• Window manager\n• Finder\n• Notes\n• Terminal\n• Settings\n\nLess UI, more experience.",
      },
      {
        title: "Window manager ideas",
        body: "Every app lives in the same desktop shell. No separate pages, no hard reloads.\n\nStretch goal: snap a window to the left or right edge, then show a subtle preview of the target area.",
      },
      {
        title: "Design tokens",
        body: "Background  #09090B\nWindow      #18181B\nSidebar     #111113\nText        #FAFAFA\nMuted       #A1A1AA\nAccent      #3B82F6",
      },
    ];

    for (const note of notes) {
      insertNote.run(randomUUID(), note.title, note.body, timestamp, timestamp);
    }
  }

  const fileCount = db
    .prepare("SELECT COUNT(*) AS count FROM files")
    .get() as { count: number };

  if (Number(fileCount.count) === 0) {
    const insertFile = db.prepare(
      `INSERT INTO files
        (id, parent_id, name, kind, size, content, created_at, updated_at)
       VALUES (?, NULL, ?, ?, ?, ?, ?, ?)`,
    );
    const files: {
      name: string;
      kind: VirtualFileKind;
      size: string;
      content?: string;
    }[] = [
      { name: "NOVA Design", kind: "folder", size: "12 items" },
      { name: "Project Aurora", kind: "folder", size: "8 items" },
      { name: "Screenshots", kind: "folder", size: "24 items" },
      { name: "Design Notes.md", kind: "file", size: "4 KB", content: "# NOVA Design\n\nA calm, dark desktop for the web." },
      { name: "brand-assets.fig", kind: "file", size: "18 MB" },
      { name: "roadmap.pdf", kind: "file", size: "2.4 MB" },
      { name: "window-manager.ts", kind: "code", size: "8 KB", content: "export type WindowState = { id: string };\n" },
      { name: "Wallpapers", kind: "folder", size: "6 items" },
    ];

    for (const file of files) {
      insertFile.run(
        randomUUID(),
        file.name,
        file.kind,
        file.size,
        file.content ?? null,
        timestamp,
        timestamp,
      );
    }
  }

  const eventCount = db
    .prepare("SELECT COUNT(*) AS count FROM calendar_events")
    .get() as { count: number };

  if (Number(eventCount.count) === 0) {
    const insertEvent = db.prepare(
      "INSERT INTO calendar_events (id, date, title, time, color, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = (day: number) => `${year}-${pad(month)}-${pad(day)}`;
    const events = [
      { date: date(5), title: "Design review", time: "10:00", color: "#5AC8FA" },
      { date: date(5), title: "Lunch with Maya", time: "12:30", color: "#F59E0B" },
      { date: date(12), title: "NOVA OS sync", time: "09:30", color: "#3B82F6" },
      { date: date(18), title: "Focus block", time: "14:00", color: "#A78BFA" },
      { date: date(21), title: "Ship Phase 1", time: "All day", color: "#34D399" },
      { date: date(26), title: "Team retro", time: "16:00", color: "#FB7185" },
    ];

    for (const event of events) {
      insertEvent.run(
        randomUUID(),
        event.date,
        event.title,
        event.time,
        event.color,
        timestamp,
      );
    }
  }
}

export function getDb() {
  if (globalForDb.novaDb) {
    return globalForDb.novaDb;
  }

  const dataDirectory = join(process.cwd(), "data");
  mkdirSync(dataDirectory, { recursive: true });

  const db = new DatabaseSync(join(dataDirectory, "nova.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      name TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('folder', 'file', 'code')),
      size TEXT NOT NULL DEFAULT '',
      content TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      FOREIGN KEY (parent_id) REFERENCES files(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      time TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON notes (updated_at);
    CREATE INDEX IF NOT EXISTS files_parent_id_idx ON files (parent_id);
    CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON calendar_events (date);
  `);

  seed(db);
  globalForDb.novaDb = db;
  return db;
}

export function readSettings(): AppSettings {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM settings").all() as SettingsRow[];
  const settings: AppSettings = { ...DEFAULT_SETTINGS };

  for (const row of rows) {
    if (!(row.key in settings)) {
      continue;
    }

    try {
      (settings as Record<string, unknown>)[row.key] = JSON.parse(row.value);
    } catch {
      // Ignore malformed values and keep the default.
    }
  }

  return settings;
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const db = getDb();
  const timestamp = nowIso();
  const statement = db.prepare(
    `INSERT INTO settings (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  );

  db.exec("BEGIN IMMEDIATE");

  try {
    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) {
        statement.run(key, JSON.stringify(value), timestamp);
      }
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return readSettings();
}

export function listNotes(): Note[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM notes ORDER BY updated_at DESC")
    .all() as NoteRow[];

  return rows.map(mapNote);
}

export function createNote(input: { title: string; body: string }): Note {
  const db = getDb();
  const timestamp = nowIso();
  const id = randomUUID();

  db.prepare(
    "INSERT INTO notes (id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
  ).run(id, input.title, input.body, timestamp, timestamp);

  return {
    id,
    title: input.title,
    body: input.body,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateNote(
  id: string,
  patch: { title?: string; body?: string },
): Note | null {
  const db = getDb();
  const current = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(id) as NoteRow | undefined;

  if (!current) {
    return null;
  }

  const title = patch.title ?? current.title;
  const body = patch.body ?? current.body;
  const updatedAt = nowIso();

  db.prepare(
    "UPDATE notes SET title = ?, body = ?, updated_at = ? WHERE id = ?",
  ).run(title, body, updatedAt, id);

  return {
    id,
    title,
    body,
    createdAt: current.created_at,
    updatedAt,
  };
}

export function deleteNote(id: string): boolean {
  const result = getDb().prepare("DELETE FROM notes WHERE id = ?").run(id);
  return result.changes > 0;
}

export function listFiles(): VirtualFile[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM files
       WHERE deleted_at IS NULL
       ORDER BY CASE kind WHEN 'folder' THEN 0 ELSE 1 END, name COLLATE NOCASE`,
    )
    .all() as FileRow[];

  return rows.map(mapFile);
}

export function createFile(input: {
  name: string;
  kind: VirtualFileKind;
  parentId?: string | null;
  size?: string;
  content?: string | null;
}): VirtualFile {
  const db = getDb();
  const timestamp = nowIso();
  const id = randomUUID();
  const size = input.size ?? (input.kind === "folder" ? "0 items" : "0 KB");

  db.prepare(
    `INSERT INTO files
      (id, parent_id, name, kind, size, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.parentId ?? null,
    input.name,
    input.kind,
    size,
    input.content ?? null,
    timestamp,
    timestamp,
  );

  return {
    id,
    parentId: input.parentId ?? null,
    name: input.name,
    kind: input.kind,
    size,
    content: input.content ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateFile(
  id: string,
  patch: {
    name?: string;
    kind?: VirtualFileKind;
    parentId?: string | null;
    size?: string;
    content?: string | null;
  },
): VirtualFile | null {
  const db = getDb();
  const current = db
    .prepare("SELECT * FROM files WHERE id = ? AND deleted_at IS NULL")
    .get(id) as FileRow | undefined;

  if (!current) {
    return null;
  }

  const next = {
    name: patch.name ?? current.name,
    kind: patch.kind ?? current.kind,
    parentId: patch.parentId === undefined ? current.parent_id : patch.parentId,
    size: patch.size ?? current.size,
    content: patch.content === undefined ? current.content : patch.content,
  };
  const updatedAt = nowIso();

  db.prepare(
    `UPDATE files
     SET name = ?, kind = ?, parent_id = ?, size = ?, content = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    next.name,
    next.kind,
    next.parentId,
    next.size,
    next.content,
    updatedAt,
    id,
  );

  return {
    id,
    parentId: next.parentId,
    name: next.name,
    kind: next.kind,
    size: next.size,
    content: next.content,
    createdAt: current.created_at,
    updatedAt,
  };
}

export function deleteFile(id: string): boolean {
  const db = getDb();
  const result = db
    .prepare(
      `WITH RECURSIVE tree(id) AS (
         SELECT id FROM files WHERE id = ?
         UNION ALL
         SELECT child.id FROM files child JOIN tree parent ON child.parent_id = parent.id
       )
       UPDATE files SET deleted_at = ?
       WHERE id IN (SELECT id FROM tree) AND deleted_at IS NULL`,
    )
    .run(id, nowIso());

  return result.changes > 0;
}

export function listEvents(month: string): CalendarEvent[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM calendar_events WHERE date LIKE ? ORDER BY date, time",
    )
    .all(`${month}-%`) as EventRow[];

  return rows.map(mapEvent);
}

export function createEvent(input: {
  date: string;
  title: string;
  time: string;
  color: string;
}): CalendarEvent {
  const db = getDb();
  const id = randomUUID();
  const createdAt = nowIso();

  db.prepare(
    "INSERT INTO calendar_events (id, date, title, time, color, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, input.date, input.title, input.time, input.color, createdAt);

  return { id, ...input, createdAt };
}

export function deleteEvent(id: string): boolean {
  const result = getDb()
    .prepare("DELETE FROM calendar_events WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function isWallpaperId(value: string): value is WallpaperId {
  return value === "aurora" || value === "midnight" || value === "graphite";
}
