import {
  Briefcase,
  BrainCircuit,
  BookOpen,
  Dumbbell,
  Moon,
  MoreHorizontal,
  Music2,
  Puzzle,
  Smartphone,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  /** Deliberate practices worth a streak (guitar, reading...) vs. life
   * categories (sleep, meals, screen time) that every day has by default
   * and don't make sense to track "consistency" on. */
  practice?: boolean;
};

// Colors are hand-picked oklch values in the same lightness/chroma family
// as the app's existing accent tokens (glow/sage/sky/violet/amber/rose),
// extended with a few more hues so every category reads distinctly.
export const CATEGORIES: Category[] = [
  { id: "sleep", label: "Sleep", icon: Moon, color: "oklch(0.74 0.15 220)" },
  { id: "learning", label: "AI Learning", icon: BrainCircuit, color: "oklch(0.59 0.22 275)", practice: true },
  { id: "reading", label: "Reading", icon: BookOpen, color: "oklch(0.73 0.18 163)", practice: true },
  { id: "guitar", label: "Guitar", icon: Music2, color: "oklch(0.83 0.17 86)", practice: true },
  { id: "chess", label: "Chess", icon: Puzzle, color: "oklch(0.69 0.18 302)", practice: true },
  { id: "crochet", label: "Crochet", icon: Sparkles, color: "oklch(0.7 0.2 8)", practice: true },
  { id: "exercise", label: "Exercise", icon: Dumbbell, color: "oklch(0.74 0.13 195)", practice: true },
  { id: "meals", label: "Meals", icon: Utensils, color: "oklch(0.78 0.13 95)" },
  { id: "screen", label: "Screen / Reels", icon: Smartphone, color: "oklch(0.72 0.17 40)" },
  { id: "work", label: "Work / Life admin", icon: Briefcase, color: "oklch(0.72 0.16 330)" },
  { id: "other", label: "Other", icon: MoreHorizontal, color: "oklch(0.6 0.02 275)" },
];

export const PRACTICE_CATEGORIES = CATEGORIES.filter((c) => c.practice);

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
