"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bluetooth,
  Maximize2,
  Minimize2,
  Moon,
  Music2,
  Pause,
  Play,
  SkipForward,
  SlidersHorizontal,
  Sun,
  Volume2,
  Wifi,
} from "lucide-react";
import { useOSStore } from "@/store/os-store";

function QuickToggle({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Wifi;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition hover:bg-white/[0.05]"
      aria-pressed={active}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
          active
            ? "bg-[var(--accent)] text-white"
            : "bg-white/[0.09] text-zinc-400"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10.5px] font-medium text-zinc-200">
          {label}
        </span>
        <span className="block text-[8.5px] text-zinc-600">
          {active ? "On" : "Off"}
        </span>
      </span>
    </button>
  );
}

export function ControlCenter() {
  const open = useOSStore((state) => state.controlCenterOpen);
  const setOpen = useOSStore((state) => state.setControlCenterOpen);
  const fullscreen = useOSStore((state) => state.fullscreen);
  const toggleFullscreen = useOSStore((state) => state.toggleFullscreen);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [focus, setFocus] = useState(false);
  const [stageManager, setStageManager] = useState(true);
  const [brightness, setBrightness] = useState(78);
  const [volume, setVolume] = useState(64);
  const [playing, setPlaying] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[30px] z-[1010] cursor-default"
            aria-label="Close Control Center"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel fixed right-2 top-[36px] z-[1020] w-[324px] rounded-2xl p-2.5"
            role="dialog"
            aria-label="Control Center"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-300">
                <SlidersHorizontal className="h-3 w-3 text-zinc-500" />
                Control Center
              </span>
              <span className="text-[8.5px] text-zinc-600">NOVA OS</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.045] p-1">
                <QuickToggle
                  icon={Wifi}
                  label="Wi-Fi"
                  active={wifi}
                  onClick={() => setWifi(!wifi)}
                />
                <QuickToggle
                  icon={Bluetooth}
                  label="Bluetooth"
                  active={bluetooth}
                  onClick={() => setBluetooth(!bluetooth)}
                />
                <QuickToggle
                  icon={fullscreen ? Minimize2 : Maximize2}
                  label="Full Screen"
                  active={fullscreen}
                  onClick={() => void toggleFullscreen()}
                />
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.045] p-1">
                <QuickToggle
                  icon={Moon}
                  label="Focus"
                  active={focus}
                  onClick={() => setFocus(!focus)}
                />
                <QuickToggle
                  icon={SlidersHorizontal}
                  label="Stage Manager"
                  active={stageManager}
                  onClick={() => setStageManager(!stageManager)}
                />
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-white/[0.07] bg-white/[0.045] px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-300">
                  <Sun className="h-3 w-3 text-zinc-500" />
                  Display
                </span>
                <span className="text-[8.5px] tabular-nums text-zinc-600">
                  {brightness}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={brightness}
                onChange={(event) => setBrightness(Number(event.target.value))}
                className="nova-range"
                aria-label="Display brightness"
              />
            </div>

            <div className="mt-2 rounded-xl border border-white/[0.07] bg-white/[0.045] px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-300">
                  <Volume2 className="h-3 w-3 text-zinc-500" />
                  Sound
                </span>
                <span className="text-[8.5px] tabular-nums text-zinc-600">
                  {volume}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="nova-range"
                aria-label="Sound volume"
              />
            </div>

            <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.045] p-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#5AC8FA] via-[#3B82F6] to-[#8B5CF6]">
                <Music2 className="h-5 w-5 text-white/90" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10.5px] font-medium text-zinc-200">
                  Midnight Drive
                </p>
                <p className="truncate text-[8.5px] text-zinc-600">
                  NOVA Sessions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlaying(!playing)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.09] text-zinc-200 transition hover:bg-white/[0.15]"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="h-3.5 w-3.5" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
                )}
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 transition hover:bg-white/[0.07] hover:text-zinc-300"
                aria-label="Next track"
              >
                <SkipForward className="h-3.5 w-3.5" fill="currentColor" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
