"use client";

import { useEffect, useState } from "react";
import {
  BatteryMedium,
  Check,
  Maximize2,
  Minimize2,
  Search,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import { APPS } from "@/lib/apps";
import { useOSStore } from "@/store/os-store";

type MenuItem =
  | {
      label: string;
      shortcut?: string;
      action?: () => void;
      disabled?: boolean;
      checked?: boolean;
    }
  | { separator: true };

export function MenuBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const windows = useOSStore((state) => state.windows);
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const openApp = useOSStore((state) => state.openApp);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const minimizeWindow = useOSStore((state) => state.minimizeWindow);
  const toggleMaximize = useOSStore((state) => state.toggleMaximize);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const setSpotlightOpen = useOSStore((state) => state.setSpotlightOpen);
  const controlCenterOpen = useOSStore((state) => state.controlCenterOpen);
  const setControlCenterOpen = useOSStore(
    (state) => state.setControlCenterOpen,
  );
  const clock24 = useOSStore((state) => state.clock24);
  const showMenuBarDate = useOSStore((state) => state.showMenuBarDate);
  const fullscreen = useOSStore((state) => state.fullscreen);
  const toggleFullscreen = useOSStore((state) => state.toggleFullscreen);
  const showDesktopIcons = useOSStore((state) => state.showDesktopIcons);
  const setShowDesktopIcons = useOSStore(
    (state) => state.setShowDesktopIcons,
  );

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const interval = window.setInterval(() => setNow(new Date()), 1000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  const activeWindow = windows.find(
    (window) => window.id === activeWindowId,
  );
  const activeAppName = activeWindow
    ? APPS[activeWindow.appId].name
    : "Finder";

  const time = now
    ? now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: !clock24,
      })
    : "--:--";
  const date = now
    ? now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  const run = (action?: () => void) => {
    action?.();
    setOpenMenu(null);
  };

  const menus: { label: string; items: MenuItem[] }[] = [
    {
      label: "File",
      items: [
        {
          label: "New Finder Window",
          shortcut: "⌘N",
          action: () => openApp("finder"),
        },
        {
          label: "New Note",
          shortcut: "⌘⇧N",
          action: () => openApp("notes"),
        },
        { separator: true },
        {
          label: "Close Window",
          shortcut: "⌘W",
          action: activeWindow
            ? () => closeWindow(activeWindow.id)
            : undefined,
          disabled: !activeWindow,
        },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo", shortcut: "⌘Z", disabled: true },
        { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
        { separator: true },
        { label: "Cut", shortcut: "⌘X", disabled: true },
        { label: "Copy", shortcut: "⌘C", disabled: true },
        { label: "Paste", shortcut: "⌘V", disabled: true },
      ],
    },
    {
      label: "View",
      items: [
        {
          label: "Show Desktop Icons",
          checked: showDesktopIcons,
          action: () => setShowDesktopIcons(!showDesktopIcons),
        },
        {
          label: "Open Settings",
          shortcut: "⌘,",
          action: () => openApp("settings"),
        },
        { separator: true },
        {
          label: fullscreen ? "Exit Full Screen" : "Enter Full Screen",
          shortcut: "⌘⇧F",
          action: () => void toggleFullscreen(),
        },
      ],
    },
    {
      label: "Window",
      items: [
        {
          label: "Minimize",
          shortcut: "⌘M",
          action: activeWindow
            ? () => minimizeWindow(activeWindow.id)
            : undefined,
          disabled: !activeWindow,
        },
        {
          label: "Zoom",
          action: activeWindow
            ? () => toggleMaximize(activeWindow.id)
            : undefined,
          disabled: !activeWindow,
        },
        { separator: true },
        {
          label: "Bring All to Front",
          action: activeWindow
            ? () => focusWindow(activeWindow.id)
            : undefined,
          disabled: !activeWindow,
        },
      ],
    },
    {
      label: "Help",
      items: [
        {
          label: "NOVA OS Help",
          action: () => openApp("settings"),
        },
        {
          label: "About NOVA OS",
          action: () => openApp("settings"),
        },
      ],
    },
  ];

  return (
    <>
      {openMenu && (
        <button
          type="button"
          className="fixed inset-0 z-[990] cursor-default"
          aria-label="Close menu"
          onClick={() => setOpenMenu(null)}
        />
      )}

      <header className="fixed inset-x-0 top-0 z-[1000] flex h-[30px] select-none items-center border-b border-white/[0.08] bg-[#0c0c10]/75 px-2 text-[11px] text-zinc-300 shadow-[0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-2xl">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => openApp("settings")}
            className="mr-0.5 flex h-[22px] items-center gap-1.5 rounded-md px-1.5 transition hover:bg-white/[0.08]"
            aria-label="NOVA menu"
          >
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px] bg-gradient-to-br from-[#5AC8FA] via-[#3B82F6] to-[#8B5CF6] text-[8px] font-bold leading-none text-white shadow-[0_1px_3px_rgba(59,130,246,0.4)]">
              N
            </span>
            <span className="hidden text-[10px] font-semibold tracking-[0.02em] text-zinc-200 sm:inline">
              NOVA
            </span>
          </button>

          <span className="hidden px-1.5 text-[10.5px] font-semibold text-zinc-100 sm:inline">
            {activeAppName}
          </span>

          <nav className="hidden items-center md:flex">
            {menus.map((menu) => (
              <div key={menu.label} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === menu.label ? null : menu.label,
                    )
                  }
                  onMouseEnter={() => {
                    if (openMenu) {
                      setOpenMenu(menu.label);
                    }
                  }}
                  className={`rounded-md px-2 py-[3px] text-[10.5px] transition ${
                    openMenu === menu.label
                      ? "bg-white/[0.12] text-white"
                      : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                  }`}
                >
                  {menu.label}
                </button>

                {openMenu === menu.label && (
                  <div className="absolute left-0 top-[calc(100%+4px)] min-w-[220px] rounded-lg border border-white/[0.1] bg-[#202024]/95 p-1 shadow-[0_22px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                    {menu.items.map((item, index) => {
                      if ("separator" in item) {
                        return (
                          <div
                            key={`separator-${index}`}
                            className="my-1 h-px bg-white/[0.08]"
                          />
                        );
                      }

                      return (
                        <button
                          key={item.label}
                          type="button"
                          disabled={item.disabled}
                          onClick={() => run(item.action)}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-left text-[11px] transition ${
                            item.disabled
                              ? "cursor-default text-zinc-600"
                              : "text-zinc-300 hover:bg-[var(--accent)] hover:text-white"
                          }`}
                        >
                          <span className="flex h-3 w-3 items-center justify-center">
                            {item.checked && (
                              <Check className="h-3 w-3" strokeWidth={2.5} />
                            )}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {item.shortcut && (
                            <span className="text-[9px] text-zinc-500">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setSpotlightOpen(true)}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100"
            aria-label="Open Spotlight"
            title="Spotlight (Ctrl/Cmd + Space)"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <span className="hidden items-center gap-1 rounded-md px-1.5 py-1 text-zinc-400 sm:flex">
            <Wifi className="h-3.5 w-3.5" />
          </span>
          <span className="hidden items-center gap-1 rounded-md px-1.5 py-1 text-zinc-400 sm:flex">
            <BatteryMedium className="h-4 w-4" />
            <span className="text-[9px] tabular-nums text-zinc-500">82%</span>
          </span>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className={`rounded-md p-1.5 transition ${
              fullscreen
                ? "bg-white/[0.14] text-white"
                : "text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-100"
            }`}
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-pressed={fullscreen}
            title={
              fullscreen
                ? "Exit fullscreen (Ctrl/Cmd + Shift + F)"
                : "Enter fullscreen (Ctrl/Cmd + Shift + F)"
            }
          >
            {fullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setControlCenterOpen(!controlCenterOpen)}
            className={`rounded-md p-1.5 transition ${
              controlCenterOpen
                ? "bg-white/[0.14] text-white"
                : "text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-100"
            }`}
            aria-label="Control Center"
            title="Control Center"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-3 w-px bg-white/[0.1]" />

          <div className="flex items-center gap-1.5 px-1">
            {date && showMenuBarDate && (
              <span
                className="hidden text-[10px] text-zinc-500 sm:inline"
                suppressHydrationWarning
              >
                {date}
              </span>
            )}
            <span
              className="text-[10px] tabular-nums text-zinc-300"
              suppressHydrationWarning
            >
              {time}
            </span>
          </div>

          <button
            type="button"
            className="ml-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 text-[8px] font-semibold text-white ring-1 ring-white/20 transition hover:brightness-110"
            aria-label="User profile"
            title="Nova User"
          >
            N
          </button>
        </div>
      </header>
    </>
  );
}
