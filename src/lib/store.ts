import { useCallback, useEffect, useState } from "react";

/**
 * Client for the local data API (server/index.ts). Every module reads and
 * writes through useCollection() so there's one consistent interface —
 * when Phase 7 adds Supabase, only this file's internals change.
 *
 * Data lives in data/<collection>.json on disk, which means it can also be
 * edited directly (by Claude, when you describe something in chat instead
 * of clicking through the UI yourself) — the next fetch/reload here just
 * picks up whatever is on disk.
 */

function apiUrl(collection: string) {
  return `/api/collections/${collection}`;
}

export async function readCollection<T>(collection: string): Promise<T[]> {
  const res = await fetch(apiUrl(collection));
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

export async function writeCollection<T>(collection: string, items: T[]): Promise<void> {
  await fetch(apiUrl(collection), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
}

/**
 * React hook: loads one collection and exposes a setter that persists
 * changes back to the API. `refresh()` re-fetches — useful after you expect
 * data to have changed outside this tab (e.g. Claude logged something).
 */
export function useCollection<T>(collection: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await readCollection<T>(collection);
    setItems(next);
    setLoading(false);
  }, [collection]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setAndPersist = useCallback(
    (next: T[] | ((prev: T[]) => T[])) => {
      setItems((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T[]) => T[])(prev) : next;
        writeCollection(collection, resolved);
        return resolved;
      });
    },
    [collection],
  );

  return { items, setItems: setAndPersist, loading, refresh };
}

export function makeId() {
  return crypto.randomUUID();
}

/**
 * A day's id, built from LOCAL date parts (not toISOString, which is UTC
 * and would roll over at the wrong wall-clock moment for anyone east of
 * UTC — e.g. flipping to "tomorrow" mid-evening in India).
 */
export function todayId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
