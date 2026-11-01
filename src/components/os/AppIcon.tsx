import { APPS, type AppDefinition, type AppId } from "@/lib/apps";

type AppIconProps = {
  app: AppDefinition;
  size?: number;
  className?: string;
};

export function AppIcon({ app, size = 44, className = "" }: AppIconProps) {
  const Icon = app.icon;
  const radius = Math.round(size * 0.29);
  const iconSize = Math.round(size * 0.5);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${app.gradient} shadow-[0_8px_18px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/15" />
      <Icon
        aria-hidden="true"
        className="relative text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        style={{ width: iconSize, height: iconSize }}
        strokeWidth={1.8}
      />
    </div>
  );
}

export function AppIconById({
  appId,
  ...props
}: Omit<AppIconProps, "app"> & { appId: AppId }) {
  return <AppIcon app={APPS[appId]} {...props} />;
}
