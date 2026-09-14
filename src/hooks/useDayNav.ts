import { useState } from "react";

import { todayId } from "@/lib/store";

function shiftDate(dateId: string, days: number): string {
  const d = new Date(`${dateId}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayId(d);
}

function formatDateLabel(dateId: string): string {
  const d = new Date(`${dateId}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

/** Shared "which day am I looking at" state + prev/next/today navigation. */
export function useDayNav(initial = todayId()) {
  const [viewDate, setViewDate] = useState(initial);
  const isToday = viewDate === todayId();

  return {
    viewDate,
    isToday,
    label: formatDateLabel(viewDate),
    goToday: () => setViewDate(todayId()),
    goPrev: () => setViewDate((d) => shiftDate(d, -1)),
    goNext: () => setViewDate((d) => shiftDate(d, 1)),
  };
}
