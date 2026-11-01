"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { BootScreen } from "@/components/os/BootScreen";
import { ControlCenter } from "@/components/os/ControlCenter";
import { DesktopContextMenu } from "@/components/os/DesktopContextMenu";
import { DesktopIcons } from "@/components/os/DesktopIcons";
import { Dock } from "@/components/os/Dock";
import { MenuBar } from "@/components/os/MenuBar";
import { Spotlight } from "@/components/os/Spotlight";
import { Wallpaper } from "@/components/os/Wallpaper";
import { WindowFrame } from "@/components/os/WindowFrame";
import { useOSStore } from "@/store/os-store";

type ContextMenuState = { x: number; y: number } | null;

export function NovaOS() {
  const [booting, setBooting] = useState(true);
  const [settingsReady, setSettingsReady] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const skipSaveRef = useRef(true);
  const windows = useOSStore((state) => state.windows);
  const openApp = useOSStore((state) => state.openApp);
  const accent = useOSStore((state) => state.accent);
  const wallpaper = useOSStore((state) => state.wallpaper);
  const dockSize = useOSStore((state) => state.dockSize);
  const dockMagnify = useOSStore((state) => state.dockMagnify);
  const showDesktopIcons = useOSStore((state) => state.showDesktopIcons);
  const showHardDisks = useOSStore((state) => state.showHardDisks);
  const showMenuBarDate = useOSStore((state) => state.showMenuBarDate);
  const clock24 = useOSStore((state) => state.clock24);
  const setSpotlightOpen = useOSStore((state) => state.setSpotlightOpen);
  const setControlCenterOpen = useOSStore(
    (state) => state.setControlCenterOpen,
  );
  const setFullscreen = useOSStore((state) => state.setFullscreen);

  const finishBoot = useCallback(() => setBooting(false), []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    const timeout = window.setTimeout(syncFullscreen, 0);
    document.addEventListener("fullscreenchange", syncFullscreen);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("fullscreenchange", syncFullscreen);
    };
  }, [setFullscreen]);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const settings = await api.getSettings();
        if (!cancelled) {
          useOSStore.getState().applySettings(settings);
        }
      } catch (error) {
        console.error("[nova] Failed to load settings", error);
      } finally {
        if (!cancelled) {
          setSettingsReady(true);
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!settingsReady) {
      return;
    }

    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      void api
        .updateSettings({
          accent,
          wallpaper,
          dockSize,
          dockMagnify,
          showDesktopIcons,
          showHardDisks,
          showMenuBarDate,
          clock24,
        })
        .catch((error) => {
          console.error("[nova] Failed to save settings", error);
        });
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [
    accent,
    clock24,
    dockMagnify,
    dockSize,
    settingsReady,
    showDesktopIcons,
    showHardDisks,
    showMenuBarDate,
    wallpaper,
  ]);

  useEffect(() => {
    if (booting) {
      return undefined;
    }

    const timeout = window.setTimeout(() => openApp("finder"), 320);
    return () => window.clearTimeout(timeout);
  }, [booting, openApp]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.code === "KeyF"
      ) {
        event.preventDefault();
        void useOSStore.getState().toggleFullscreen();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.code === "Space") {
        event.preventDefault();
        const state = useOSStore.getState();
        state.setSpotlightOpen(!state.spotlightOpen);
        state.setControlCenterOpen(false);
      }

      if (event.key === "Escape") {
        setSpotlightOpen(false);
        setControlCenterOpen(false);
        setContextMenu(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setControlCenterOpen, setSpotlightOpen]);

  return (
    <main className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-[#09090B] text-zinc-100">
      <Wallpaper />

      <div
        className="absolute inset-0"
        onContextMenu={(event) => {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
        }}
      >
        <DesktopIcons />

        {windows.map((win) => (
          <WindowFrame key={win.id} win={win} />
        ))}
      </div>

      <MenuBar />
      <Dock />
      <ControlCenter />
      <Spotlight />

      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}

      <AnimatePresence>
        {booting && (
          <motion.div
            className="fixed inset-0 z-[3000]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <BootScreen onComplete={finishBoot} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
