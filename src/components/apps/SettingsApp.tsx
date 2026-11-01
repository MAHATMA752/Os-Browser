"use client";

import { useState, type ReactNode } from "react";
import {
  Check,
  Clock3,
  Image as ImageIcon,
  Info,
  Monitor,
  Palette,
  PanelBottom,
  ShieldCheck,
  SunMedium,
  Volume2,
} from "lucide-react";
import { useOSStore, type WallpaperId } from "@/store/os-store";

type CategoryId =
  | "appearance"
  | "wallpaper"
  | "dock"
  | "desktop"
  | "sound"
  | "time"
  | "about";

const categories: {
  id: CategoryId;
  label: string;
  icon: typeof Palette;
}[] = [
  { id: "appearance", label: "Appearance", icon: SunMedium },
  { id: "wallpaper", label: "Wallpaper", icon: ImageIcon },
  { id: "dock", label: "Dock", icon: PanelBottom },
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "sound", label: "Sound", icon: Volume2 },
  { id: "time", label: "Date & Time", icon: Clock3 },
  { id: "about", label: "About", icon: Info },
];

const accents = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Orange", value: "#F97316" },
  { name: "Green", value: "#22C55E" },
  { name: "Graphite", value: "#A1A1AA" },
];

const wallpapers: {
  id: WallpaperId;
  name: string;
  description: string;
  background: string;
}[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Blue and violet light",
    background:
      "radial-gradient(circle at 22% 22%, rgba(59,130,246,.72), transparent 35%), radial-gradient(circle at 78% 72%, rgba(168,85,247,.55), transparent 36%), linear-gradient(145deg,#07111f,#09090b 55%,#120a1f)",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep ocean calm",
    background:
      "radial-gradient(circle at 72% 18%, rgba(14,165,233,.48), transparent 31%), radial-gradient(circle at 20% 82%, rgba(16,185,129,.2), transparent 30%), linear-gradient(160deg,#050b18,#09090b 72%)",
  },
  {
    id: "graphite",
    name: "Graphite",
    description: "Quiet and minimal",
    background:
      "radial-gradient(circle at 30% 24%, rgba(255,255,255,.08), transparent 34%), radial-gradient(circle at 82% 78%, rgba(255,255,255,.04), transparent 30%), linear-gradient(145deg,#18181b,#09090b)",
  },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--accent)]" : "bg-white/[0.14]"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.055] px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11.5px] font-medium text-zinc-200">{title}</p>
        {description && (
          <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-600">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-1.5 px-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-[10px] text-zinc-600">{description}</p>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025]">
        {children}
      </div>
    </section>
  );
}

export function SettingsApp() {
  const [category, setCategory] = useState<CategoryId>("appearance");
  const [volume, setVolume] = useState(72);
  const [stageManager, setStageManager] = useState(false);
  const [dynamicWallpaper, setDynamicWallpaper] = useState(true);
  const [wallpaperAll, setWallpaperAll] = useState(true);
  const [minimizeIntoDock, setMinimizeIntoDock] = useState(true);
  const [snapping, setSnapping] = useState(true);
  const [uiSounds, setUiSounds] = useState(true);
  const [startupSound, setStartupSound] = useState(false);
  const [autoTime, setAutoTime] = useState(true);

  const accent = useOSStore((state) => state.accent);
  const setAccent = useOSStore((state) => state.setAccent);
  const wallpaper = useOSStore((state) => state.wallpaper);
  const setWallpaper = useOSStore((state) => state.setWallpaper);
  const dockSize = useOSStore((state) => state.dockSize);
  const setDockSize = useOSStore((state) => state.setDockSize);
  const dockMagnify = useOSStore((state) => state.dockMagnify);
  const setDockMagnify = useOSStore((state) => state.setDockMagnify);
  const showDesktopIcons = useOSStore((state) => state.showDesktopIcons);
  const setShowDesktopIcons = useOSStore(
    (state) => state.setShowDesktopIcons,
  );
  const showHardDisks = useOSStore((state) => state.showHardDisks);
  const setShowHardDisks = useOSStore((state) => state.setShowHardDisks);
  const showMenuBarDate = useOSStore((state) => state.showMenuBarDate);
  const setShowMenuBarDate = useOSStore(
    (state) => state.setShowMenuBarDate,
  );
  const clock24 = useOSStore((state) => state.clock24);
  const setClock24 = useOSStore((state) => state.setClock24);

  const currentCategory = categories.find((item) => item.id === category);

  return (
    <div className="flex h-full bg-[#18181B] text-zinc-200">
      <aside className="flex w-[205px] shrink-0 flex-col border-r border-white/[0.06] bg-[#111113] px-2 py-3">
        <div className="mb-3 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 text-[11px] font-semibold text-white">
            N
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-zinc-200">
              Nova User
            </p>
            <p className="truncate text-[9px] text-zinc-600">
              nova@nova-os
            </p>
          </div>
        </div>

        <div className="space-y-0.5">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-[6px] text-left text-[11.5px] transition ${
                  active
                    ? "bg-white/[0.085] text-white"
                    : "text-zinc-400 hover:bg-white/[0.045] hover:text-zinc-200"
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

        <div className="mt-auto flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-2 text-[9px] text-zinc-600">
          <ShieldCheck className="h-3 w-3" />
          Local SQLite storage
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b border-white/[0.06] bg-[#1b1b1f] px-5">
          <div>
            <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-zinc-100">
              {currentCategory?.label}
            </h2>
            <p className="mt-0.5 text-[9.5px] text-zinc-600">
              Personalize your NOVA desktop
            </p>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-5">
          {category === "appearance" && (
            <div className="mx-auto max-w-[560px] space-y-5">
              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025]">
                <div
                  className="relative h-36 overflow-hidden"
                  style={{
                    background:
                      wallpapers.find((item) => item.id === wallpaper)
                        ?.background ?? wallpapers[0].background,
                  }}
                >
                  <div className="absolute inset-x-0 top-0 flex h-5 items-center gap-2 border-b border-white/[0.07] bg-black/25 px-2 backdrop-blur-md">
                    <span className="text-[6px] font-semibold text-white">
                      NOVA
                    </span>
                    <span className="text-[5px] text-white/60">File</span>
                    <span className="text-[5px] text-white/60">Edit</span>
                    <span className="text-[5px] text-white/60">View</span>
                    <span className="ml-auto text-[5px] text-white/60">
                      9:41 AM
                    </span>
                  </div>
                  <div className="absolute left-1/2 top-1/2 h-20 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-white/20 bg-[#18181b]/95 shadow-2xl">
                    <div className="flex h-3 items-center gap-0.5 border-b border-white/10 bg-black/25 px-1">
                      <span className="h-1 w-1 rounded-full bg-[#FF5F57]" />
                      <span className="h-1 w-1 rounded-full bg-[#FEBC2E]" />
                      <span className="h-1 w-1 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex h-[calc(100%-12px)]">
                      <div className="w-8 border-r border-white/10 bg-white/[0.03]" />
                      <div className="flex flex-1 gap-1 p-1">
                        <span
                          className="h-4 w-4 rounded-[3px]"
                          style={{ backgroundColor: accent }}
                        />
                        <span className="h-4 w-4 rounded-[3px] bg-white/20" />
                        <span className="h-4 w-4 rounded-[3px] bg-white/10" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md border border-white/15 bg-black/30 px-1.5 py-1 backdrop-blur-md">
                    {["#5AC8FA", "#F59E0B", "#A1A1AA", "#F87171"].map(
                      (color) => (
                        <span
                          key={color}
                          className="h-3.5 w-3.5 rounded-[4px]"
                          style={{ backgroundColor: color }}
                        />
                      ),
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-[11.5px] font-medium text-zinc-200">
                      NOVA Dark
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-600">
                      The default dark experience
                    </p>
                  </div>
                  <span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[9px] text-zinc-400">
                    Active
                  </span>
                </div>
              </div>

              <Card
                title="Accent color"
                description="Used for highlights, selections, and controls."
              >
                <div className="flex flex-wrap gap-2.5 px-4 py-3.5">
                  {accents.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setAccent(item.value)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-110 ${
                        accent === item.value
                          ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#18181b]"
                          : "ring-1 ring-white/15"
                      }`}
                      style={{ backgroundColor: item.value }}
                      aria-label={`${item.name} accent`}
                      title={item.name}
                    >
                      {accent === item.value && (
                        <Check className="h-3.5 w-3.5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              <Card
                title="Appearance mode"
                description="NOVA is designed dark-first."
              >
                <div className="grid grid-cols-2 gap-2.5 p-3.5">
                  <button
                    type="button"
                    className="flex items-center gap-2.5 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-3 text-left"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#09090b] text-zinc-300">
                      <Monitor className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-medium text-zinc-100">
                        Dark
                      </span>
                      <span className="block text-[9px] text-zinc-500">
                        Current
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex cursor-not-allowed items-center gap-2.5 rounded-lg border border-white/[0.06] p-3 text-left opacity-45"
                    disabled
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-200 text-zinc-700">
                      <SunMedium className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-medium text-zinc-300">
                        Light
                      </span>
                      <span className="block text-[9px] text-zinc-600">
                        Coming soon
                      </span>
                    </span>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {category === "wallpaper" && (
            <div className="mx-auto max-w-[600px] space-y-5">
              <div>
                <h3 className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Choose a wallpaper
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {wallpapers.map((item) => {
                    const active = wallpaper === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWallpaper(item.id)}
                        className={`group overflow-hidden rounded-xl border text-left transition ${
                          active
                            ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <div
                          className="relative h-24"
                          style={{ background: item.background }}
                        >
                          <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/50 to-transparent" />
                          {active && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)]">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </span>
                          )}
                        </div>
                        <div className="bg-white/[0.025] px-2.5 py-2">
                          <p className="text-[10.5px] font-medium text-zinc-200">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[9px] text-zinc-600">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Card title="Wallpaper options">
                <SettingRow
                  title="Dynamic wallpaper"
                  description="Shift the light slowly throughout the day."
                >
                  <Toggle
                    checked={dynamicWallpaper}
                    onChange={setDynamicWallpaper}
                    label="Dynamic wallpaper"
                  />
                </SettingRow>
                <SettingRow
                  title="Show on all desktops"
                  description="Apply this wallpaper everywhere."
                >
                  <Toggle
                    checked={wallpaperAll}
                    onChange={setWallpaperAll}
                    label="Show on all desktops"
                  />
                </SettingRow>
              </Card>
            </div>
          )}

          {category === "dock" && (
            <div className="mx-auto max-w-[560px] space-y-5">
              <Card
                title="Dock size"
                description="Drag to make the Dock smaller or larger."
              >
                <div className="flex items-center gap-4 px-4 py-4">
                  <span className="text-[10px] text-zinc-600">Small</span>
                  <input
                    type="range"
                    min={36}
                    max={62}
                    value={dockSize}
                    onChange={(event) =>
                      setDockSize(Number(event.target.value))
                    }
                    className="nova-range"
                    aria-label="Dock size"
                  />
                  <span className="text-[10px] text-zinc-600">Large</span>
                  <span className="w-10 text-right text-[10px] tabular-nums text-zinc-500">
                    {dockSize}px
                  </span>
                </div>
              </Card>

              <Card title="Dock behavior">
                <SettingRow
                  title="Magnification"
                  description="Enlarge icons as the pointer moves over them."
                >
                  <Toggle
                    checked={dockMagnify}
                    onChange={setDockMagnify}
                    label="Dock magnification"
                  />
                </SettingRow>
                <SettingRow
                  title="Minimize windows into the Dock"
                  description="Use the genie effect when minimizing."
                >
                  <Toggle
                    checked={minimizeIntoDock}
                    onChange={setMinimizeIntoDock}
                    label="Minimize"
                  />
                </SettingRow>
                <SettingRow
                  title="Position on screen"
                  description="Bottom placement is used in this preview."
                >
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-500">
                    Bottom
                  </span>
                </SettingRow>
              </Card>
            </div>
          )}

          {category === "desktop" && (
            <div className="mx-auto max-w-[560px] space-y-5">
              <Card title="Desktop items">
                <SettingRow
                  title="Show items on desktop"
                  description="Display shortcuts and folders on the workspace."
                >
                  <Toggle
                    checked={showDesktopIcons}
                    onChange={setShowDesktopIcons}
                    label="Show desktop items"
                  />
                </SettingRow>
                <SettingRow
                  title="Show hard disks"
                  description="Display NOVA HD on the desktop."
                >
                  <Toggle
                    checked={showHardDisks}
                    onChange={setShowHardDisks}
                    label="Show hard disks"
                  />
                </SettingRow>
                <SettingRow
                  title="Sort by"
                  description="Choose how desktop items are arranged."
                >
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-500">
                    Name
                  </span>
                </SettingRow>
              </Card>

              <Card title="Window management">
                <SettingRow
                  title="Stage Manager"
                  description="Keep the active window centered and tidy."
                >
                  <Toggle
                    checked={stageManager}
                    onChange={setStageManager}
                    label="Stage Manager"
                  />
                </SettingRow>
                <SettingRow
                  title="Drag windows to screen edges"
                  description="Show snap previews while dragging."
                >
                  <Toggle
                    checked={snapping}
                    onChange={setSnapping}
                    label="Snapping"
                  />
                </SettingRow>
              </Card>
            </div>
          )}

          {category === "sound" && (
            <div className="mx-auto max-w-[560px] space-y-5">
              <Card title="Output">
                <div className="px-4 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11.5px] font-medium text-zinc-200">
                      Output volume
                    </p>
                    <span className="text-[10px] tabular-nums text-zinc-500">
                      {volume}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-zinc-600" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(event) =>
                        setVolume(Number(event.target.value))
                      }
                      className="nova-range"
                      aria-label="Output volume"
                    />
                    <Volume2 className="h-4 w-4 text-zinc-400" />
                  </div>
                </div>
                <SettingRow
                  title="Output device"
                  description="Built-in Browser Audio"
                >
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-500">
                    Default
                  </span>
                </SettingRow>
              </Card>

              <Card title="Sound effects">
                <SettingRow
                  title="Play user interface sound effects"
                  description="Subtle feedback for clicks and actions."
                >
                  <Toggle
                    checked={uiSounds}
                    onChange={setUiSounds}
                    label="UI sounds"
                  />
                </SettingRow>
                <SettingRow
                  title="Play sound on startup"
                  description="A soft chime after the boot screen."
                >
                  <Toggle
                    checked={startupSound}
                    onChange={setStartupSound}
                    label="Startup sound"
                  />
                </SettingRow>
              </Card>
            </div>
          )}

          {category === "time" && (
            <div className="mx-auto max-w-[560px] space-y-5">
              <Card title="Clock">
                <SettingRow
                  title="Use 24-hour time"
                  description="Show the menu bar clock in 24-hour format."
                >
                  <Toggle
                    checked={clock24}
                    onChange={setClock24}
                    label="24-hour time"
                  />
                </SettingRow>
                <SettingRow
                  title="Show date in menu bar"
                  description="Include the weekday and date beside the clock."
                >
                  <Toggle
                    checked={showMenuBarDate}
                    onChange={setShowMenuBarDate}
                    label="Show date"
                  />
                </SettingRow>
              </Card>

              <Card title="Date & Time">
                <SettingRow
                  title="Set time automatically"
                  description="Use the time reported by your browser."
                >
                  <Toggle
                    checked={autoTime}
                    onChange={setAutoTime}
                    label="Set time automatically"
                  />
                </SettingRow>
                <SettingRow
                  title="Time zone"
                  description="Asia/Jakarta · GMT+7"
                >
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-500">
                    Automatic
                  </span>
                </SettingRow>
              </Card>
            </div>
          )}

          {category === "about" && (
            <div className="mx-auto max-w-[560px] space-y-5">
              <div className="flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-6 py-7 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#5AC8FA] via-[#3B82F6] to-[#8B5CF6] shadow-[0_16px_40px_rgba(59,130,246,0.28)]">
                  <span className="text-[26px] font-semibold tracking-[-0.06em] text-white">
                    N
                  </span>
                </div>
                <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-zinc-50">
                  NOVA OS
                </h3>
                <p className="mt-1 text-[10.5px] text-zinc-500">
                  Version 1.1 · SQLite-backed
                </p>
                <p className="mt-3 max-w-xs text-[10.5px] leading-relaxed text-zinc-500">
                  A browser-based desktop experience. Minimal, premium, and
                  built to feel at home on the web.
                </p>
              </div>

              <Card title="Device">
                {[
                  ["Name", "NOVA Studio"],
                  ["Chip", "Nova Silicon N1"],
                  ["Memory", "16 GB"],
                  ["Storage", "256 GB"],
                  ["Display", "Browser viewport"],
                  ["Serial", "NOVA-2026-001"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-white/[0.055] px-4 py-2.5 text-[10.5px] last:border-b-0"
                  >
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-zinc-300">{value}</span>
                  </div>
                ))}
              </Card>

              <Card title="System">
                <SettingRow
                  title="Built with"
                  description="Next.js · React · TypeScript · Tailwind CSS · SQLite"
                >
                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">
                    Connected
                  </span>
                </SettingRow>
                <SettingRow
                  title="Persistence"
                  description="Settings, notes, files, and calendar events are stored in SQLite."
                >
                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">
                    Active
                  </span>
                </SettingRow>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
