"use client";

import { useOSStore, type WallpaperId } from "@/store/os-store";

const backgrounds: Record<WallpaperId, string> = {
  aurora:
    "linear-gradient(145deg, #07111f 0%, #09090b 48%, #120a1f 100%)",
  midnight:
    "linear-gradient(160deg, #050b18 0%, #09090b 68%, #07110f 100%)",
  graphite:
    "linear-gradient(145deg, #18181b 0%, #09090b 58%, #101012 100%)",
};

const orbSets: Record<
  WallpaperId,
  { color: string; className: string; slow?: boolean }[]
> = {
  aurora: [
    {
      color: "rgba(59,130,246,0.34)",
      className: "left-[-9%] top-[-14%] h-[54vw] w-[54vw]",
    },
    {
      color: "rgba(168,85,247,0.24)",
      className: "bottom-[-22%] right-[-6%] h-[48vw] w-[48vw]",
      slow: true,
    },
    {
      color: "rgba(14,165,233,0.13)",
      className: "bottom-[6%] left-[24%] h-[28vw] w-[28vw]",
    },
  ],
  midnight: [
    {
      color: "rgba(14,165,233,0.24)",
      className: "right-[-8%] top-[-18%] h-[50vw] w-[50vw]",
    },
    {
      color: "rgba(16,185,129,0.14)",
      className: "bottom-[-24%] left-[-4%] h-[46vw] w-[46vw]",
      slow: true,
    },
    {
      color: "rgba(59,130,246,0.1)",
      className: "left-[28%] top-[34%] h-[26vw] w-[26vw]",
    },
  ],
  graphite: [
    {
      color: "rgba(255,255,255,0.07)",
      className: "left-[-10%] top-[-18%] h-[52vw] w-[52vw]",
    },
    {
      color: "rgba(255,255,255,0.04)",
      className: "bottom-[-22%] right-[-4%] h-[46vw] w-[46vw]",
      slow: true,
    },
    {
      color: "rgba(161,161,170,0.05)",
      className: "bottom-[16%] left-[30%] h-[26vw] w-[26vw]",
    },
  ],
};

export function Wallpaper() {
  const wallpaper = useOSStore((state) => state.wallpaper);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: backgrounds[wallpaper] }}
      aria-hidden="true"
    >
      {orbSets[wallpaper].map((orb, index) => (
        <div
          key={index}
          className={`orb ${orb.slow ? "orb-slow" : ""} absolute rounded-full ${orb.className}`}
          style={{ backgroundColor: orb.color }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.08), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.42)_100%)]" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
