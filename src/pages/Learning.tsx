import { useMemo, useState } from "react";
import { BrainCircuit, Clock3, Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoadmapBoard } from "@/components/learning/RoadmapBoard";
import { TopicForm } from "@/components/learning/TopicForm";
import { useCollection, todayId } from "@/lib/store";
import { computeCategoryStreak } from "@/lib/streaks";
import { formatDuration } from "@/lib/timeMath";
import { uniqueGroups, type LearningTopic } from "@/lib/learning";
import type { TimeEntry } from "@/lib/types";

export function Learning() {
  const { items: topics, setItems: setTopics, loading } = useCollection<LearningTopic>("learning_topics");
  const { items: timeEntries } = useCollection<TimeEntry>("time_entries");
  const [editingTopic, setEditingTopic] = useState<LearningTopic | null>(null);

  const streak = useMemo(() => computeCategoryStreak("learning", timeEntries), [timeEntries]);
  const monthMinutes = useMemo(() => {
    const monthPrefix = todayId().slice(0, 7);
    return timeEntries
      .filter((e) => e.categoryId === "learning" && e.date.startsWith(monthPrefix))
      .reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
  }, [timeEntries]);

  function saveTopic(topic: LearningTopic) {
    setTopics((prev) => {
      const exists = prev.some((t) => t.id === topic.id);
      return exists ? prev.map((t) => (t.id === topic.id ? topic : t)) : [...prev, topic];
    });
    setEditingTopic(null);
  }

  function deleteTopic(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    if (editingTopic?.id === id) setEditingTopic(null);
  }

  return (
    <div className="subtle-rise space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-panel rounded-2xl border-0 p-4 text-center shadow-none">
          <Clock3 className="mx-auto size-5 text-glow" />
          <p className="mt-1 font-display text-xl font-bold">{formatDuration(monthMinutes)}</p>
          <p className="text-[11px] text-muted-foreground">This month</p>
        </Card>
        <Card className="glass-panel rounded-2xl border-0 p-4 text-center shadow-none">
          <Flame className="mx-auto size-5 text-glow" />
          <p className="mt-1 font-display text-xl font-bold">{streak.current}d</p>
          <p className="text-[11px] text-muted-foreground">Learning streak</p>
        </Card>
        <Card className="glass-panel rounded-2xl border-0 p-4 text-center shadow-none">
          <BrainCircuit className="mx-auto size-5 text-glow" />
          <p className="mt-1 font-display text-xl font-bold">{topics.filter((t) => t.status === "completed").length}</p>
          <p className="text-[11px] text-muted-foreground">Topics completed</p>
        </Card>
      </div>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingTopic ? "Edit topic" : "Add a topic"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <TopicForm editingTopic={editingTopic} existingGroups={uniqueGroups(topics)} onSave={saveTopic} onCancelEdit={() => setEditingTopic(null)} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Roadmap</CardTitle>
          <p className="text-sm text-muted-foreground">Organized however you group it &mdash; your own topics, your own groups.</p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : <RoadmapBoard topics={topics} onEdit={setEditingTopic} onDelete={deleteTopic} />}
        </CardContent>
      </Card>
    </div>
  );
}
