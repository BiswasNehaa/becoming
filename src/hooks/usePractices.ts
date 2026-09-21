import { paletteColor, type Practice, type PracticeIconKey } from "@/lib/practices";
import { makeId, useCollection } from "@/lib/store";

/**
 * A person's own list of streak-worthy practices. Starts genuinely empty —
 * no pre-picked hobbies, since this app is for anyone and what's worth a
 * streak (guitar, DSA, running, whatever) is entirely personal. Each
 * account only ever has what they themselves added.
 */
export function usePractices() {
  const { items: practices, setItems, loading, syncError } = useCollection<Practice>("practices");

  function addPractice(label: string, icon: PracticeIconKey, targetMinutes?: number): Practice {
    const next: Practice = { id: makeId(), label, icon, color: paletteColor(practices.length), targetMinutes };
    // Functional update: addPractice + updatePractice sometimes get called
    // back-to-back in the same event handler (e.g. create-and-focus in one
    // go) — computing the next array from the stale `practices` closure
    // would let the second call silently clobber the first.
    setItems((prev) => [...prev, next]);
    return next;
  }

  function removePractice(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function updatePractice(id: string, changes: Partial<Omit<Practice, "id">>) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  return { practices, addPractice, removePractice, updatePractice, loading, syncError };
}
