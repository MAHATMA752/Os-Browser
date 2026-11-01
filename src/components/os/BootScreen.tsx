"use client";

import { useEffect, useRef, useState } from "react";

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 2.4);
        if (next >= 100 && !finished.current) {
          finished.current = true;
          window.clearInterval(interval);
          window.setTimeout(onComplete, 420);
        }
        return next;
      });
    }, 38);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  const skip = () => {
    if (finished.current) {
      return;
    }

    finished.current = true;
    setProgress(100);
    window.setTimeout(onComplete, 180);
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#060608]"
      onClick={skip}
      role="presentation"
    >
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14),transparent_62%)]" />
      <div className="absolute left-[38%] top-[38%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1),transparent_65%)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-[-26px] rounded-[32px] border border-white/[0.06]" />
          <div className="absolute inset-[-52px] rounded-[44px] border border-white/[0.025]" />
          <div className="flex h-[84px] w-[84px] items-center justify-center rounded-[23px] bg-gradient-to-br from-[#5AC8FA] via-[#3B82F6] to-[#8B5CF6] shadow-[0_24px_70px_rgba(59,130,246,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]">
            <span className="text-[38px] font-semibold tracking-[-0.07em] text-white">
              N
            </span>
          </div>
        </div>

        <h1 className="mt-8 text-[22px] font-semibold tracking-[0.28em] text-zinc-100">
          NOVA
        </h1>
        <p className="mt-2 text-[9px] uppercase tracking-[0.32em] text-zinc-600">
          Browser Operating System
        </p>

        <div className="mt-10 h-[3px] w-[190px] overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5AC8FA] via-[#3B82F6] to-[#8B5CF6] shadow-[0_0_12px_rgba(59,130,246,0.75)] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex w-[190px] items-center justify-between text-[8.5px] text-zinc-600">
          <span>Starting NOVA OS</span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-[8px] uppercase tracking-[0.22em] text-zinc-700">
        <span>Version 1.0</span>
        <span>Click anywhere to skip</span>
      </div>
    </div>
  );
}
