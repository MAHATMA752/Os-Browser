"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Maximize2, Minus, X } from "lucide-react";
import { APPS } from "@/lib/apps";
import { AppContent } from "@/components/apps/AppContent";
import { useOSStore, type WindowState } from "@/store/os-store";

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type ResizeState = DragState & {
  originWidth: number;
  originHeight: number;
};

export function WindowFrame({ win }: { win: WindowState }) {
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const minimizeWindow = useOSStore((state) => state.minimizeWindow);
  const toggleMaximize = useOSStore((state) => state.toggleMaximize);
  const updateBounds = useOSStore((state) => state.updateBounds);
  const drag = useRef<DragState | null>(null);
  const resize = useRef<ResizeState | null>(null);
  const isActive = activeWindowId === win.id;
  const app = APPS[win.appId];

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (win.maximized || event.button !== 0) {
      return;
    }

    focusWindow(win.id);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: win.x,
      originY: win.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;

    if (!state || state.pointerId !== event.pointerId) {
      return;
    }

    const nextX = state.originX + event.clientX - state.startX;
    const nextY = state.originY + event.clientY - state.startY;

    updateBounds(win.id, {
      x: Math.min(
        Math.max(nextX, -win.width + 140),
        window.innerWidth - 140,
      ),
      y: Math.min(
        Math.max(nextY, 36),
        window.innerHeight - 86,
      ),
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) {
      drag.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (win.maximized || event.button !== 0) {
      return;
    }

    event.stopPropagation();
    focusWindow(win.id);
    resize.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: win.x,
      originY: win.y,
      originWidth: win.width,
      originHeight: win.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = resize.current;

    if (!state || state.pointerId !== event.pointerId) {
      return;
    }

    const width = Math.max(
      app.minSize.width,
      Math.min(
        state.originWidth + event.clientX - state.startX,
        window.innerWidth - win.x - 10,
      ),
    );
    const height = Math.max(
      app.minSize.height,
      Math.min(
        state.originHeight + event.clientY - state.startY,
        window.innerHeight - win.y - 98,
      ),
    );

    updateBounds(win.id, { width, height });
  };

  const endResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (resize.current?.pointerId === event.pointerId) {
      resize.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const frameStyle = win.maximized
    ? {
        left: 10,
        top: 40,
        width: "calc(100vw - 20px)",
        height: "calc(100dvh - 138px)",
        zIndex: win.z,
        display: win.minimized ? "none" : "flex",
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.z,
        display: win.minimized ? "none" : "flex",
      };

  return (
    <div
      className={`os-window window-shell window-enter absolute flex flex-col overflow-hidden rounded-[14px] ${
        isActive ? "ring-1 ring-white/10" : "opacity-[0.98]"
      }`}
      style={frameStyle}
      onPointerDown={() => focusWindow(win.id)}
      onContextMenu={(event) => event.stopPropagation()}
      role="dialog"
      aria-label={`${app.name} window`}
      aria-hidden={win.minimized}
    >
      <div
        className={`relative flex h-[38px] shrink-0 select-none items-center px-3.5 ${
          isActive ? "bg-[#202024]" : "bg-[#1b1b1f]"
        }`}
        style={{ touchAction: "none" }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="group/lights flex items-center gap-2">
          <button
            type="button"
            className="traffic-light flex h-3 w-3 items-center justify-center rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]"
            aria-label={`Close ${app.name}`}
            title="Close"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => closeWindow(win.id)}
          >
            <X className="h-2 w-2 text-[#4c0000]" strokeWidth={3} />
          </button>
          <button
            type="button"
            className="traffic-light flex h-3 w-3 items-center justify-center rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]"
            aria-label={`Minimize ${app.name}`}
            title="Minimize"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => minimizeWindow(win.id)}
          >
            <Minus className="h-2 w-2 text-[#5c3a00]" strokeWidth={3} />
          </button>
          <button
            type="button"
            className="traffic-light flex h-3 w-3 items-center justify-center rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]"
            aria-label={`Maximize ${app.name}`}
            title={win.maximized ? "Restore" : "Maximize"}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => toggleMaximize(win.id)}
          >
            <Maximize2 className="h-1.5 w-1.5 text-[#004d00]" strokeWidth={3} />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-1.5">
          <span className="text-[12px] font-medium tracking-[-0.01em] text-zinc-300">
            {app.name}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AppContent appId={win.appId} windowId={win.id} />
      </div>

      {!win.maximized && (
        <div
          className="resize-handle absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
          style={{ touchAction: "none" }}
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
          aria-hidden="true"
        >
          <span className="absolute bottom-[3px] right-[3px] h-2 w-2 border-b border-r border-white/25" />
          <span className="absolute bottom-[6px] right-[6px] h-1 w-1 border-b border-r border-white/15" />
        </div>
      )}
    </div>
  );
}
