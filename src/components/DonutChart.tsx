import type { ReactNode } from "react";

export type DonutSegment = { id: string; label: string; value: number; color: string };

/** An SVG ring chart — stacked stroke-dasharray arcs starting at 12
 * o'clock, going clockwise. `value` is whatever unit the caller uses
 * (minutes, count, percent); segments are shown proportional to their
 * share of the total. */
export function DonutChart({
  segments,
  size = 160,
  thickness = 22,
  center,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  center?: ReactNode;
}) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetAccum = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {total === 0 ? (
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={thickness} />
          ) : (
            segments.map((seg) => {
              const fraction = seg.value / total;
              const dash = fraction * circumference;
              const dashoffset = -offsetAccum;
              offsetAccum += dash;
              return (
                <circle
                  key={seg.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={dashoffset}
                >
                  <title>{seg.label}</title>
                </circle>
              );
            })
          )}
        </g>
      </svg>
      {center && <div className="absolute inset-0 grid place-items-center text-center">{center}</div>}
    </div>
  );
}
