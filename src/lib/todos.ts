/**
 * A flat, rolling to-do list rather than one list per day: an item stays
 * "open" — and keeps showing up — until it's checked off or removed,
 * regardless of which day it was added on. `completedDate` is only used
 * to decide what counts toward "done today" and to fade older completed
 * items out of the list.
 */
export type Priority = "high" | "medium" | "low";

export const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: "high", label: "High", color: "var(--rose)" },
  { id: "medium", label: "Medium", color: "var(--amber)" },
  { id: "low", label: "Low", color: "var(--sky)" },
];

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
  createdDate: string;
  completedDate?: string;
  priority?: Priority;
};

const PRIORITY_ORDER: Record<Priority | "none", number> = { high: 0, medium: 1, low: 2, none: 3 };

/** Priority first (unset sorts last), most recently added first within
 * the same priority — keeps the list from reshuffling older items above
 * newer ones just because they share a level. */
export function sortByPriority(items: TodoItem[]): TodoItem[] {
  return [...items].sort((a, b) => PRIORITY_ORDER[a.priority ?? "none"] - PRIORITY_ORDER[b.priority ?? "none"]);
}
