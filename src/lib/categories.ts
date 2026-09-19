import { Briefcase, Moon, MoreHorizontal, Smartphone, Utensils, type LucideIcon } from "lucide-react";

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
};

// Universal life categories every day has by default — not something to
// build a streak on. Deliberate practices (guitar, reading, whatever a
// given person actually wants to track) are fully user-managed instead of
// hardcoded here; see src/lib/practices.ts.
export const CATEGORIES: Category[] = [
  { id: "sleep", label: "Sleep", icon: Moon, color: "oklch(0.74 0.15 220)" },
  { id: "meals", label: "Meals", icon: Utensils, color: "oklch(0.78 0.13 95)" },
  { id: "screen", label: "Screen / Reels", icon: Smartphone, color: "oklch(0.72 0.17 40)" },
  { id: "work", label: "Work / Life admin", icon: Briefcase, color: "oklch(0.72 0.16 330)" },
  { id: "other", label: "Other", icon: MoreHorizontal, color: "oklch(0.6 0.02 275)" },
];

/** Looks up a category by id across the fixed list plus any extra
 * (usually a person's own practices, converted to Category shape) —
 * falls back to "Other" so a since-deleted practice's old log entries
 * still render something sensible. */
export function getCategory(id: string, extra: Category[] = []): Category {
  return CATEGORIES.find((c) => c.id === id) ?? extra.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
