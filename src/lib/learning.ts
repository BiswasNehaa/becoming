export type TopicGroup = "Foundations" | "AI" | "Engineering";

export const TOPIC_GROUPS: TopicGroup[] = ["Foundations", "AI", "Engineering"];

export type TopicStatus = "not-started" | "learning" | "completed";

export const TOPIC_STATUSES: { id: TopicStatus; label: string }[] = [
  { id: "not-started", label: "Not started" },
  { id: "learning", label: "Learning" },
  { id: "completed", label: "Completed" },
];

export type LearningTopic = {
  id: string;
  group: TopicGroup;
  name: string;
  status: TopicStatus;
  progressPct: number;
  hoursSpent: number;
  resources?: string;
  notes?: string;
};
