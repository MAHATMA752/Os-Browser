"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { APP_LIST, type AppId } from "@/lib/apps";
import { AppIcon } from "@/components/os/AppIcon";
import { useOSStore } from "@/store/os-store";

export function Dock() {
  const [hovered, setHovered] = useState<AppId | null>(null);
  const openApp = useOSStore((state) => state.openApp);
  const windows = useOSStore((state) => state.windows);
  const dockSize = useOSStore((state) => state.dockSize);
  const dockMagnify = useOSStore((state) => state.dockMagnify);

  const hoveredIndex = hovered
    ? APP_LIST.findIndex((app) => app.id === hovered)
    : null;

  return (
    <div className="fixed bottom-2.5 left-1/2 z-[900] -translate-x-1/2 sm:bottom-3.5">
      <div className="flex max-w-[96vw] items-end gap-1 rounded-[18px] border border-white/[0.13] bg-[#202024]/70 px-1.5 pb-1.5 pt-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:gap-1.5 sm:rounded-[22px] sm:px-2 sm:pb-2">
        {APP_LIST.map((app, index) => {
          const openWindow = windows.find(
            (window) => window.appId === app.id,
          );
          const distance =
            hoveredIndex === null ? null : Math.abs(index - hoveredIndex);
          const scale =
            dockMagnify && distance !== null
              ? Math.max(1, 1.34 - distance * 0.11)
              : 1;
          const isTrash = app.id === "trash";
          const showSeparator = isTrash;

          return (
            <div key={app.id} className="flex items-end">
              {showSeparator && (
                <span className="mx-0.5 h-9 w-px self-center bg-white/[0.12] sm:mx-1" />
              )}
              <motion.button
                type="button"
                onClick={() => openApp(app.id)}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(app.id)}
                onBlur={() => setHovered(null)}
                animate={{
                  scale,
                  y: -(scale - 1) * dockSize * 0.6,
                }}
                whileTap={{ scale: 0.94 }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 32,
                  mass: 0.55,
                }}
                className="group relative flex flex-col items-center"
                aria-label={`Open ${app.name}`}
              >
                <span className="pointer-events-none absolute bottom-[calc(100%+10px)] whitespace-nowrap rounded-md border border-white/[0.1] bg-[#202024]/95 px-2 py-1 text-[9.5px] text-zinc-200 opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
                  {app.name}
                </span>
                <AppIcon
                  app={app}
                  size={dockSize}
                  className="transition-[filter] duration-200 group-hover:brightness-110"
                />
                <span
                  className={`mt-1 h-1 w-1 rounded-full transition ${
                    openWindow
                      ? openWindow.minimized
                        ? "bg-white/35"
                        : "bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]"
                      : "bg-transparent"
                  }`}
                />
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
