"use client";

import { Trash2 } from "lucide-react";

export function TrashApp() {
  return (
    <div className="flex h-full flex-col bg-[#18181B]">
      <header className="flex h-12 shrink-0 items-center border-b border-white/[0.06] bg-[#1b1b1f] px-4">
        <span className="text-[11px] font-medium text-zinc-400">Trash</span>
        <span className="ml-2 rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] text-zinc-600">
          0 items
        </span>
        <button
          type="button"
          disabled
          className="ml-auto cursor-not-allowed rounded-md border border-white/[0.06] px-2.5 py-1 text-[10px] text-zinc-700"
        >
          Empty
        </button>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <Trash2 className="h-7 w-7 text-zinc-700" strokeWidth={1.4} />
        </div>
        <p className="mt-4 text-[13px] font-medium text-zinc-400">
          Trash is empty
        </p>
        <p className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-zinc-600">
          Items you delete from the desktop will appear here.
        </p>
      </div>
    </div>
  );
}
