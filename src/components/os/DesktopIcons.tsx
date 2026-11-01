"use client";

import { useState } from "react";
import { Folder, HardDrive } from "lucide-react";
import { APPS, type AppId } from "@/lib/apps";
import { AppIcon } from "@/components/os/AppIcon";
import { useOSStore } from "@/store/os-store";

type DesktopItem =
  | { id: string; label: string; kind: "app"; appId: AppId }
  | { id: string; label: string; kind: "folder" | "disk"; appId: AppId };

const items: DesktopItem[] = [
  { id: "finder", label: "Finder", kind: "app", appId: "finder" },
  { id: "notes", label: "Notes", kind: "app", appId: "notes" },
  { id: "terminal", label: "Terminal", kind: "app", appId: "terminal" },
  { id: "projects", label: "Projects", kind: "folder", appId: "finder" },
  { id: "nova-hd", label: "NOVA HD", kind: "disk", appId: "finder" },
];

export function DesktopIcons() {
  const [selected, setSelected] = useState<string | null>(null);
  const openApp = useOSStore((state) => state.openApp);
  const showDesktopIcons = useOSStore((state) => state.showDesktopIcons);
  const showHardDisks = useOSStore((state) => state.showHardDisks);

  if (!showDesktopIcons) {
    return null;
  }

  const visibleItems = items.filter(
    (item) => item.kind !== "disk" || showHardDisks,
  );

  return (
    <div
      className="absolute right-3 top-10 z-10 flex w-[82px] flex-col gap-0.5 sm:right-5 sm:top-12"
      onContextMenu={(event) => event.stopPropagation()}
    >
      {visibleItems.map((item) => {
        const isSelected = selected === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item.id)}
            onDoubleClick={() => openApp(item.appId)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                openApp(item.appId);
              }
            }}
            className={`flex flex-col items-center rounded-lg px-1 py-1.5 outline-none transition ${
              isSelected
                ? "bg-white/[0.14] ring-1 ring-white/20"
                : "hover:bg-white/[0.055]"
            }`}
            title="Double-click to open"
          >
            {item.kind === "app" ? (
              <AppIcon app={APPS[item.appId]} size={46} />
            ) : item.kind === "folder" ? (
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-gradient-to-br from-[#5AC8FA] to-[#007AFF] shadow-[0_8px_18px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]">
                <Folder
                  className="h-7 w-7 text-white drop-shadow"
                  fill="currentColor"
                  strokeWidth={1.3}
                />
              </div>
            ) : (
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] border border-white/10 bg-gradient-to-br from-[#3f3f46] to-[#18181b] shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
                <HardDrive className="h-6 w-6 text-zinc-300" strokeWidth={1.4} />
              </div>
            )}
            <span className="desktop-label mt-1.5 line-clamp-2 max-w-full text-[9.5px] font-medium leading-tight text-white/90">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
