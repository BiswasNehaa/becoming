export type TopicStatus = "not-started" | "learning" | "completed";

export const TOPIC_STATUSES: { id: TopicStatus; label: string }[] = [
  { id: "not-started", label: "Not started" },
  { id: "learning", label: "Learning" },
  { id: "completed", label: "Completed" },
];

/**
 * `group` is free text the person types themselves (e.g. "Foundations",
 * "Spanish", "Design") rather than a fixed AI/CS-specific list — this app
 * is for anyone, and what someone is studying is entirely their own.
 *
 * Progress isn't typed in by hand: it's `hoursSpent` against an optional
 * `targetHours`, computed the same way a book's progress comes from
 * currentPage/pages (see topicProgressPct below). `targetHours` of 0
 * means no target was set — the topic just tracks hours, no percentage.
 */
export type LearningTopic = {
  id: string;
  group: string;
  name: string;
  status: TopicStatus;
  hoursSpent: number;
  targetHours: number;
  resources?: string;
  notes?: string;
};

export function topicProgressPct(topic: LearningTopic): number {
  if (topic.targetHours <= 0) return 0;
  return Math.min(100, Math.round((topic.hoursSpent / topic.targetHours) * 100));
}

/** Every distinct group currently in use, in first-seen order — the
 * roadmap board is built from this instead of a fixed list. */
export function uniqueGroups(topics: LearningTopic[]): string[] {
  const seen = new Set<string>();
  const groups: string[] = [];
  for (const t of topics) {
    const g = t.group.trim() || "Other";
    if (!seen.has(g)) {
      seen.add(g);
      groups.push(g);
    }
  }
  return groups;
}
