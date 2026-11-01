import {
  Calculator,
  CalendarDays,
  Compass,
  FolderOpen,
  Settings2,
  SquareTerminal,
  StickyNote,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export type AppId =
  | "finder"
  | "browser"
  | "terminal"
  | "notes"
  | "calculator"
  | "calendar"
  | "settings"
  | "trash";

export type AppDefinition = {
  id: AppId;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
};

export const APP_LIST: AppDefinition[] = [
  {
    id: "finder",
    name: "Finder",
    description: "Browse your virtual files",
    icon: FolderOpen,
    gradient: "from-[#5AC8FA] to-[#007AFF]",
    defaultSize: { width: 940, height: 580 },
    minSize: { width: 620, height: 400 },
  },
  {
    id: "browser",
    name: "Browser",
    description: "Explore the web",
    icon: Compass,
    gradient: "from-[#38BDF8] to-[#2563EB]",
    defaultSize: { width: 960, height: 620 },
    minSize: { width: 640, height: 420 },
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Simulated command line",
    icon: SquareTerminal,
    gradient: "from-[#3F3F46] to-[#09090B]",
    defaultSize: { width: 760, height: 480 },
    minSize: { width: 500, height: 320 },
  },
  {
    id: "notes",
    name: "Notes",
    description: "Capture a thought",
    icon: StickyNote,
    gradient: "from-[#FDE68A] to-[#F59E0B]",
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 600, height: 400 },
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Quick arithmetic",
    icon: Calculator,
    gradient: "from-[#FB923C] to-[#EA580C]",
    defaultSize: { width: 340, height: 500 },
    minSize: { width: 300, height: 440 },
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Plan your month",
    icon: CalendarDays,
    gradient: "from-[#F87171] to-[#DC2626]",
    defaultSize: { width: 900, height: 580 },
    minSize: { width: 640, height: 420 },
  },
  {
    id: "settings",
    name: "Settings",
    description: "Make NOVA yours",
    icon: Settings2,
    gradient: "from-[#A1A1AA] to-[#52525B]",
    defaultSize: { width: 860, height: 580 },
    minSize: { width: 620, height: 420 },
  },
  {
    id: "trash",
    name: "Trash",
    description: "Recently deleted items",
    icon: Trash2,
    gradient: "from-[#71717A] to-[#27272A]",
    defaultSize: { width: 720, height: 480 },
    minSize: { width: 460, height: 320 },
  },
];

export const APPS = Object.fromEntries(
  APP_LIST.map((app) => [app.id, app]),
) as Record<AppId, AppDefinition>;
