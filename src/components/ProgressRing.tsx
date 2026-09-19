import type { ReactNode } from "react";

/**
 * A conic-gradient ring gauge — same technique as the reference app's
 * progress-ring utility, generalized to any percentage instead of a fixed
 * set of hardcoded classes.
 */
export function ProgressRing({
  percent,
  size = 96,
  thickness = 10,
  color = "var(--primary)",
  trackColor = "var(--line)",
  children,
}: {
  percent: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(${color} ${clamped}%, ${trackColor} ${clamped}%)` }}
    >
      <div className="absolute grid place-items-center rounded-full bg-card" style={{ width: size - thickness * 2, height: size - thickness * 2 }}>
        {children}
      </div>
    </div>
  );
}
