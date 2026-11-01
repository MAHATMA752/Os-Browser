"use client";

import { useEffect } from "react";
import {
  FolderSearch,
  Image as ImageIcon,
  Info,
  Monitor,
  SquareTerminal,
  ToggleLeft,
} from "lucide-react";
import { useOSStore } from "@/store/os-store";

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
};

export function DesktopContextMenu({ x, y, onClose }: ContextMenuProps) {
  const openApp = useOSStore((state) => state.openApp);
  const showDesktopIcons = useOSStore((state) => state.showDesktopIcons);
  const setShowDesktopIcons = useOSStore(
    (state) => state.setShowDesktopIcons,
  );

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  const menuWidth = 220;
  const menuHeight = 250;
  const left = Math.min(x, window.innerWidth - menuWidth - 8);
  const top = Math.min(y, window.innerHeight - menuHeight - 8);

  const items = [
    {
      label: "Open Finder",
      icon: FolderSearch,
      action: () => openApp("finder"),
    },
    {
      label: "Open Terminal",
      icon: SquareTerminal,
      action: () => openApp("terminal"),
    },
    { separator: true as const },
    {
      label: "Change Wallpaper",
      icon: ImageIcon,
      action: () => openApp("settings"),
    },
    {
      label: "Show Desktop Icons",
      icon: ToggleLeft,
      checked: showDesktopIcons,
      action: () => setShowDesktopIcons(!showDesktopIcons),
    },
    {
      label: "Desktop Settings",
      icon: Monitor,
      action: () => openApp("settings"),
    },
    { separator: true as const },
    {
      label: "About NOVA OS",
      icon: Info,
      action: () => openApp("settings"),
    },
  ];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[1100] cursor-default"
        aria-label="Close context menu"
        onClick={onClose}
        onContextMenu={(event) => {
          event.preventDefault();
          onClose();
        }}
      />
      <div
        className="glass-panel fixed z-[1200] rounded-lg p-1"
        style={{ left, top, width: menuWidth }}
        role="menu"
      >
        {items.map((item, index) => {
          if ("separator" in item) {
            return (
              <div
                key={`sep-${index}`}
                className="my-1 h-px bg-white/[0.08]"
              />
            );
          }

          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                item.action();
                onClose();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-left text-[11px] text-zinc-300 transition hover:bg-[var(--accent)] hover:text-white"
            >
              <Icon className="h-3.5 w-3.5 opacity-75" />
              <span className="flex-1">{item.label}</span>
              {item.checked && (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
