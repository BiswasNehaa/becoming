import { useCallback, useEffect, useState } from "react";

import { isHosted, supabase } from "@/lib/supabaseClient";

/**
 * The data layer every module reads and writes through. Two backends,
 * same interface:
 *
 * - Local (no Supabase configured): a small Express API writing
 *   data/<collection>.json on disk (server/index.ts) — single-user, this
 *   machine only. Also what Claude edits directly when you describe
 *   something in chat instead of using the form.
 * - Hosted (VITE_SUPABASE_URL/ANON_KEY set): one Supabase table
 *   (`records`, see supabase/schema.sql) holding every collection's rows,
 *   scoped by user_id + Row Level Security so each account only ever sees
 *   its own data.
 *
 * Every item in every collection needs a stable string `id` — the hosted
 * backend upserts/deletes by it.
 */

type WithId = { id: string };

function apiUrl(collection: string) {
  return `/api/collections/${collection}`;
}

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  // getSession (not getUser) so the SDK's own auto-refresh runs first if the
  // access token has gone stale — a bare getUser() can fail right after a
  // long-idle tab instead of quietly refreshing.
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

async function readCollectionLocal<T>(collection: string): Promise<T[]> {
  const res = await fetch(apiUrl(collection));
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

async function writeCollectionLocal<T>(collection: string, items: T[]): Promise<void> {
  const res = await fetch(apiUrl(collection), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  if (!res.ok) throw new Error(`Failed to save ${collection} (${res.status})`);
}

async function readCollectionHosted<T>(collection: string): Promise<T[]> {
  if (!supabase) return [];
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await supabase.from("records").select("data").eq("user_id", uid).eq("collection", collection);
  if (error || !data) return [];
  return data.map((row) => row.data as T);
}

async function writeCollectionHosted<T extends WithId>(collection: string, items: T[]): Promise<void> {
  if (!supabase) throw new Error("Not connected to your account — nothing was saved.");
  const uid = await currentUserId();
  if (!uid) throw new Error("Your session expired — sign in again, then redo this.");

  const { data: existing, error: readError } = await supabase.from("records").select("id").eq("user_id", uid).eq("collection", collection);
  if (readError) throw readError;
  const existingIds = new Set((existing ?? []).map((r) => r.id as string));
  const nextIds = new Set(items.map((i) => i.id));
  const staleIds = [...existingIds].filter((id) => !nextIds.has(id));

  if (items.length > 0) {
    const { error: upsertError } = await supabase
      .from("records")
      .upsert(
        items.map((item) => ({ user_id: uid, collection, id: item.id, data: item })),
        { onConflict: "user_id,collection,id" },
      );
    if (upsertError) throw upsertError;
  }
  if (staleIds.length > 0) {
    const { error: deleteError } = await supabase.from("records").delete().eq("user_id", uid).eq("collection", collection).in("id", staleIds);
    if (deleteError) throw deleteError;
  }
}

export async function readCollection<T>(collection: string): Promise<T[]> {
  return isHosted ? readCollectionHosted<T>(collection) : readCollectionLocal<T>(collection);
}

export async function writeCollection<T extends WithId>(collection: string, items: T[]): Promise<void> {
  return isHosted ? writeCollectionHosted(collection, items) : writeCollectionLocal(collection, items);
}

/**
 * React hook: loads one collection and exposes a setter that persists
 * changes back to whichever backend is active. `refresh()` re-fetches —
 * useful after you expect data to have changed outside this tab (e.g.
 * Claude logged something, or you edited it on another device).
 */
export function useCollection<T extends WithId>(collection: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  // Set when a save silently failed (expired session, network blip, RLS
  // error, ...) so the UI can say so instead of looking saved and quietly
  // not being there on the next reload.
  const [syncError, setSyncError] = useState<string | null>(null);

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
        writeCollection(collection, resolved)
          .then(() => setSyncError(null))
          .catch((err: unknown) => setSyncError(err instanceof Error ? err.message : "Couldn't save that — check your connection and try again."));
        return resolved;
      });
    },
    [collection],
  );

  return { items, setItems: setAndPersist, loading, refresh, syncError };
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
