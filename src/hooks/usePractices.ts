import { DEFAULT_PRACTICES, paletteColor, type Practice, type PracticeIconKey } from "@/lib/practices";
import { makeId, useCollection } from "@/lib/store";

/**
 * A person's own list of streak-worthy practices. Starts out showing
 * DEFAULT_PRACTICES as a working default — nothing is written to their
 * account until they actually add or remove one, at which point it
 * becomes their real, fully custom list.
 */
export function usePractices() {
  const { items, setItems, loading } = useCollection<Practice>("practices");
  const practices = items.length > 0 ? items : DEFAULT_PRACTICES;

  function addPractice(label: string, icon: PracticeIconKey) {
    const next: Practice = { id: makeId(), label, icon, color: paletteColor(practices.length) };
    setItems([...practices, next]);
  }

  function removePractice(id: string) {
    setItems(practices.filter((p) => p.id !== id));
  }

  return { practices, addPractice, removePractice, loading };
}
