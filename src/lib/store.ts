import { useCallback, useEffect, useState } from "react";

/**
 * A small localStorage-backed data layer. Every module (habits, reading,
 * learning, nutrition, reflections...) reads and writes through this same
 * interface. When Phase 7 adds Supabase, only this file's internals change —
 * callers keep using useCollection/readCollection/writeCollection as-is.
 */

const NAMESPACE = "ascend";

function storageKey(collection: string) {
  return `${NAMESPACE}:${collection}`;
}

export function readCollection<T>(collection: string): T[] {
  try {
    const raw = localStorage.getItem(storageKey(collection));
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(collection: string, items: T[]) {
  localStorage.setItem(storageKey(collection), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(storageEventName(collection)));
}

function storageEventName(collection: string) {
  return `ascend:collection-changed:${collection}`;
}

/**
 * React hook: subscribes to one collection and re-renders when it changes,
 * including changes made from other components via writeCollection.
 */
export function useCollection<T>(collection: string) {
  const [items, setItems] = useState<T[]>(() => readCollection<T>(collection));

  useEffect(() => {
    const handler = () => setItems(readCollection<T>(collection));
    window.addEventListener(storageEventName(collection), handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(storageEventName(collection), handler);
      window.removeEventListener("storage", handler);
    };
  }, [collection]);

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

  return [items, setAndPersist] as const;
}

export function makeId() {
  return crypto.randomUUID();
}

export function todayId(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
