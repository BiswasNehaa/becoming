export type Mood = "difficult" | "normal" | "good" | "excellent";

export const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: "difficult", label: "Difficult", emoji: "😞" },
  { id: "normal", label: "Normal", emoji: "😐" },
  { id: "good", label: "Good", emoji: "🙂" },
  { id: "excellent", label: "Excellent", emoji: "🔥" },
];

export type CheckId = "learned" | "read" | "hobby" | "exercise" | "ateWell" | "avoidedScrolling" | "sleptEnough";

export const CHECK_ITEMS: { id: CheckId; label: string }[] = [
  { id: "learned", label: "I learned today" },
  { id: "read", label: "I read" },
  { id: "hobby", label: "I practiced a hobby" },
  { id: "exercise", label: "I moved my body" },
  { id: "ateWell", label: "I ate reasonably well" },
  { id: "avoidedScrolling", label: "I avoided excessive scrolling" },
  { id: "sleptEnough", label: "I slept enough" },
];

export type DailyReflection = {
  id: string;
  date: string;
  mood: Mood | null;
  checks: Partial<Record<CheckId, boolean>>;
  learned: string;
  improveTomorrow: string;
};

export function emptyReflection(date: string): DailyReflection {
  return { id: date, date, mood: null, checks: {}, learned: "", improveTomorrow: "" };
}
