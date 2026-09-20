import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { makeId } from "@/lib/store";
import { TOPIC_STATUSES, type LearningTopic, type TopicStatus } from "@/lib/learning";

const numberField = (v: string) => (v.trim() === "" ? 0 : Number(v));
const GROUP_DATALIST_ID = "learning-group-suggestions";

export function TopicForm({
  editingTopic,
  existingGroups,
  onSave,
  onCancelEdit,
}: {
  editingTopic: LearningTopic | null;
  existingGroups: string[];
  onSave: (topic: LearningTopic) => void;
  onCancelEdit: () => void;
}) {
  const [group, setGroup] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<TopicStatus>("not-started");
  const [targetHours, setTargetHours] = useState("");
  const [hoursSpent, setHoursSpent] = useState("0");
  const [resources, setResources] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTopic) {
      setGroup(editingTopic.group);
      setName(editingTopic.name);
      setStatus(editingTopic.status);
      setTargetHours(editingTopic.targetHours ? String(editingTopic.targetHours) : "");
      setHoursSpent(String(editingTopic.hoursSpent));
      setResources(editingTopic.resources ?? "");
      setError("");
    }
  }, [editingTopic]);

  function reset() {
    setName("");
    setStatus("not-started");
    setTargetHours("");
    setHoursSpent("0");
    setResources("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!group.trim()) {
      setError("Give the topic a group — your own, whatever you're organizing this under.");
      return;
    }
    if (!name.trim()) {
      setError("Give the topic a name.");
      return;
    }
    onSave({
      id: editingTopic?.id ?? makeId(),
      group: group.trim(),
      name: name.trim(),
      status,
      hoursSpent: numberField(hoursSpent),
      targetHours: numberField(targetHours),
      resources: resources.trim() || undefined,
    });
    if (!editingTopic) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <datalist id={GROUP_DATALIST_ID}>
        {existingGroups.map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Group</label>
          <Input list={GROUP_DATALIST_ID} value={group} onChange={(e) => setGroup(e.target.value)} placeholder="e.g. Foundations" className="w-36" />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Topic</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Neural networks" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as TopicStatus)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPIC_STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Hours spent</label>
          <Input type="number" min="0" step="any" inputMode="decimal" value={hoursSpent} onChange={(e) => setHoursSpent(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Target hrs (optional)</label>
          <Input type="number" min="0" step="any" inputMode="decimal" value={targetHours} onChange={(e) => setTargetHours(e.target.value)} className="w-24" />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Resources (optional)</label>
          <Input value={resources} onChange={(e) => setResources(e.target.value)} placeholder="course, book, link…" />
        </div>
        <Button type="submit">{editingTopic ? "Save changes" : "Add topic"}</Button>
        {editingTopic && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" onClick={onCancelEdit}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
