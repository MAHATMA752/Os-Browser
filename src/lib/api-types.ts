export type WallpaperId = "aurora" | "midnight" | "graphite";

export type AppSettings = {
  accent: string;
  wallpaper: WallpaperId;
  dockSize: number;
  dockMagnify: boolean;
  showDesktopIcons: boolean;
  showHardDisks: boolean;
  showMenuBarDate: boolean;
  clock24: boolean;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type VirtualFileKind = "folder" | "file" | "code";

export type VirtualFile = {
  id: string;
  parentId: string | null;
  name: string;
  kind: VirtualFileKind;
  size: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time: string;
  color: string;
  createdAt: string;
};
