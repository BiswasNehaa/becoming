import { readCollection, todayId, writeCollection } from "@/lib/store";

const RETENTION_DAYS = 60;

/** Date-stamped daily logs only — practices/books/learning topics aren't
 * per-day records themselves (only their point-in-time values, like
 * currentPage, are "current"), so they're never touched here. */
export const PRUNABLE_COLLECTIONS = ["time_entries", "food_entries", "water_entries", "reading_sessions", "steps_logs", "exercise_entries", "reflections"] as const;

export type PrunableCollection = (typeof PRUNABLE_COLLECTIONS)[number];

type DatedRecord = { id: string; date: string };

export function cutoffDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - RETENTION_DAYS);
  return todayId(d);
}

export type PruneScan = { collection: PrunableCollection; oldCount: number; totalCount: number };

/** Read-only pass: how much WOULD be removed, without touching anything —
 * so the cleanup action can show a real number before asking for
 * confirmation, instead of deleting blind. */
export async function scanPrunableData(): Promise<PruneScan[]> {
  const cutoff = cutoffDate();
  const results: PruneScan[] = [];
  for (const collection of PRUNABLE_COLLECTIONS) {
    const items = await readCollection<DatedRecord>(collection);
    const oldCount = items.filter((i) => i.date < cutoff).length;
    results.push({ collection, oldCount, totalCount: items.length });
  }
  return results;
}

/** Actually deletes anything older than the retention window. Only ever
 * called after the person has seen the scan result and explicitly
 * confirmed — never runs on its own. */
export async function pruneOldData(): Promise<number> {
  const cutoff = cutoffDate();
  let removed = 0;
  for (const collection of PRUNABLE_COLLECTIONS) {
    const items = await readCollection<DatedRecord>(collection);
    const kept = items.filter((i) => i.date >= cutoff);
    removed += items.length - kept.length;
    if (kept.length !== items.length) {
      await writeCollection(collection, kept);
    }
  }
  return removed;
}
