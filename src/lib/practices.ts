import {
  Bike,
  BookOpen,
  BrainCircuit,
  Camera,
  Code2,
  Dumbbell,
  Footprints,
  Gamepad2,
  Languages,
  Mic2,
  Music2,
  Paintbrush,
  Puzzle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { Category } from "@/lib/categories";

/** A small curated set instead of the whole icon library — easy to scan
 * when picking one for a new streak. */
export const PRACTICE_ICONS = {
  brain: BrainCircuit,
  book: BookOpen,
  music: Music2,
  mic: Mic2,
  puzzle: Puzzle,
  sparkles: Sparkles,
  paintbrush: Paintbrush,
  dumbbell: Dumbbell,
  footprints: Footprints,
  bike: Bike,
  code: Code2,
  camera: Camera,
  gamepad: Gamepad2,
  languages: Languages,
} satisfies Record<string, LucideIcon>;

export type PracticeIconKey = keyof typeof PRACTICE_ICONS;

export const PRACTICE_ICON_KEYS = Object.keys(PRACTICE_ICONS) as PracticeIconKey[];

// Same oklch lightness/chroma family as the app's fixed category colors,
// spread across the hue wheel so any number of custom streaks stay distinct.
const PALETTE = [
  "oklch(0.59 0.22 275)", // glow
  "oklch(0.73 0.18 163)", // sage
  "oklch(0.83 0.17 86)", // amber
  "oklch(0.69 0.18 302)", // violet
  "oklch(0.7 0.2 8)", // rose
  "oklch(0.74 0.13 195)", // teal
  "oklch(0.72 0.17 40)", // coral
  "oklch(0.72 0.16 330)", // magenta
  "oklch(0.74 0.15 220)", // sky
  "oklch(0.78 0.16 130)", // green
];

export function paletteColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

/** A person's own list of deliberate practices worth a streak on — not
 * every hobby fits guitar/chess/crochet, so this is fully user-managed
 * rather than a fixed list. `isFocus` marks it as one of today's one-or-two
 * highlighted priorities (separate from just being a streak worth logging);
 * `targetMinutes` is the time goal for that focus, shown as progress
 * instead of a plain yes/no. */
export type Practice = {
  id: string;
  label: string;
  icon: PracticeIconKey;
  color: string;
  isFocus?: boolean;
  targetMinutes?: number;
};

export function practiceToCategory(practice: Practice): Category {
  return { id: practice.id, label: practice.label, icon: PRACTICE_ICONS[practice.icon], color: practice.color };
}
