import { paletteColor, type Practice, type PracticeIconKey } from "@/lib/practices";
import { makeId, useCollection } from "@/lib/store";

/**
 * A person's own list of streak-worthy practices. Starts genuinely empty —
 * no pre-picked hobbies, since this app is for anyone and what's worth a
 * streak (guitar, DSA, running, whatever) is entirely personal. Each
 * account only ever has what they themselves added.
 */
export function usePractices() {
  const { items: practices, setItems, loading } = useCollection<Practice>("practices");

  function addPractice(label: string, icon: PracticeIconKey, targetMinutes?: number) {
    const next: Practice = { id: makeId(), label, icon, color: paletteColor(practices.length), targetMinutes };
    setItems([...practices, next]);
  }

  function removePractice(id: string) {
    setItems(practices.filter((p) => p.id !== id));
  }

  return { practices, addPractice, removePractice, loading };
}
