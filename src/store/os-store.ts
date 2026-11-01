"use client";

import { create } from "zustand";
import type { AppSettings } from "@/lib/api-types";
import { APPS, type AppId } from "@/lib/apps";

export type WallpaperId = "aurora" | "midnight" | "graphite";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

type WindowBounds = Pick<
  WindowState,
  "x" | "y" | "width" | "height"
>;

type OSStore = {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZ: number;
  spotlightOpen: boolean;
  controlCenterOpen: boolean;
  fullscreen: boolean;
  accent: string;
  wallpaper: WallpaperId;
  dockSize: number;
  dockMagnify: boolean;
  showDesktopIcons: boolean;
  showHardDisks: boolean;
  showMenuBarDate: boolean;
  clock24: boolean;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updateBounds: (id: string, bounds: Partial<WindowBounds>) => void;
  setSpotlightOpen: (open: boolean) => void;
  setControlCenterOpen: (open: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => Promise<void>;
  setAccent: (accent: string) => void;
  setWallpaper: (wallpaper: WallpaperId) => void;
  setDockSize: (dockSize: number) => void;
  setDockMagnify: (dockMagnify: boolean) => void;
  setShowDesktopIcons: (showDesktopIcons: boolean) => void;
  setShowHardDisks: (showHardDisks: boolean) => void;
  setShowMenuBarDate: (showMenuBarDate: boolean) => void;
  setClock24: (clock24: boolean) => void;
  applySettings: (settings: Partial<AppSettings>) => void;
};

function topWindowId(windows: WindowState[], excludeId?: string) {
  const top = windows
    .filter((window) => !window.minimized && window.id !== excludeId)
    .sort((a, b) => b.z - a.z)[0];

  return top?.id ?? null;
}

export const useOSStore = create<OSStore>()((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZ: 10,
  spotlightOpen: false,
  controlCenterOpen: false,
  fullscreen: false,
  accent: "#3B82F6",
  wallpaper: "aurora",
  dockSize: 46,
  dockMagnify: true,
  showDesktopIcons: true,
  showHardDisks: true,
  showMenuBarDate: true,
  clock24: false,

  openApp: (appId) => {
    const app = APPS[appId];
    const state = get();
    const existing = state.windows.find((window) => window.appId === appId);

    if (existing) {
      const z = state.nextZ + 1;
      set({
        nextZ: z,
        activeWindowId: existing.id,
        windows: state.windows.map((window) =>
          window.id === existing.id
            ? { ...window, minimized: false, z }
            : window,
        ),
      });
      return;
    }

    const viewportWidth =
      typeof window === "undefined" ? 1440 : window.innerWidth;
    const viewportHeight =
      typeof window === "undefined" ? 900 : window.innerHeight;
    const width = Math.min(
      app.defaultSize.width,
      Math.max(app.minSize.width, viewportWidth - 40),
    );
    const height = Math.min(
      app.defaultSize.height,
      Math.max(app.minSize.height, viewportHeight - 170),
    );
    const offset = (state.windows.length % 5) * 22;
    const x = Math.max(
      14,
      Math.round((viewportWidth - width) / 2 + offset),
    );
    const y = Math.max(
      52,
      Math.round((viewportHeight - height) / 2 - 22 + offset),
    );
    const z = state.nextZ + 1;
    const id = `${appId}-${Date.now().toString(36)}`;

    set({
      nextZ: z,
      activeWindowId: id,
      windows: [
        ...state.windows,
        {
          id,
          appId,
          title: app.name,
          x,
          y,
          width,
          height,
          z,
          minimized: false,
          maximized: false,
        },
      ],
    });
  },

  closeWindow: (id) => {
    const state = get();
    const windows = state.windows.filter((window) => window.id !== id);
    const activeWindowId =
      state.activeWindowId === id
        ? topWindowId(windows)
        : state.activeWindowId;

    set({ windows, activeWindowId });
  },

  minimizeWindow: (id) => {
    const state = get();
    const windows = state.windows.map((window) =>
      window.id === id ? { ...window, minimized: true } : window,
    );

    set({
      windows,
      activeWindowId:
        state.activeWindowId === id
          ? topWindowId(windows, id)
          : state.activeWindowId,
    });
  },

  toggleMaximize: (id) => {
    const state = get();
    const z = state.nextZ + 1;

    set({
      nextZ: z,
      activeWindowId: id,
      windows: state.windows.map((window) =>
        window.id === id
          ? { ...window, maximized: !window.maximized, z }
          : window,
      ),
    });
  },

  focusWindow: (id) => {
    const state = get();
    const target = state.windows.find((window) => window.id === id);

    if (!target) {
      return;
    }

    if (state.activeWindowId === id && !target.minimized) {
      return;
    }

    const z = state.nextZ + 1;
    set({
      nextZ: z,
      activeWindowId: id,
      windows: state.windows.map((window) =>
        window.id === id
          ? { ...window, minimized: false, z }
          : window,
      ),
    });
  },

  updateBounds: (id, bounds) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, ...bounds } : window,
      ),
    }));
  },

  setSpotlightOpen: (spotlightOpen) => set({ spotlightOpen }),
  setControlCenterOpen: (controlCenterOpen) => set({ controlCenterOpen }),
  setFullscreen: (fullscreen) => set({ fullscreen }),
  toggleFullscreen: async () => {
    if (typeof document === "undefined") {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn("[nova] Unable to toggle fullscreen", error);
    }
  },
  setAccent: (accent) => set({ accent }),
  setWallpaper: (wallpaper) => set({ wallpaper }),
  setDockSize: (dockSize) => set({ dockSize }),
  setDockMagnify: (dockMagnify) => set({ dockMagnify }),
  setShowDesktopIcons: (showDesktopIcons) => set({ showDesktopIcons }),
  setShowHardDisks: (showHardDisks) => set({ showHardDisks }),
  setShowMenuBarDate: (showMenuBarDate) => set({ showMenuBarDate }),
  setClock24: (clock24) => set({ clock24 }),
  applySettings: (settings) => set(settings),
}));
