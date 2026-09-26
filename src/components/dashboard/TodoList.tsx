import { useState } from "react";
import { Calendar, Check, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CalendarEvent } from "@/lib/calendarEvents";
import { makeId, todayId, useCollection } from "@/lib/store";
import { PRIORITIES, sortByPriority, type Priority, type TodoItem } from "@/lib/todos";
import { cn } from "@/lib/utils";

function nextPriority(current: Priority | undefined): Priority | undefined {
  const order: (Priority | undefined)[] = ["high", "medium", "low", undefined];
  return order[(order.indexOf(current) + 1) % order.length];
}

export function TodoList() {
  const { items, setItems, loading } = useCollection<TodoItem>("todos");
  const { items: events } = useCollection<CalendarEvent>("calendar_events");
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority | undefined>(undefined);

  const today = todayId();
  const open = sortByPriority(items.filter((t) => !t.done));
  const doneToday = items.filter((t) => t.done && t.completedDate === today);
  const todayEvents = events.filter((e) => e.date === today).sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const next: TodoItem = { id: makeId(), text: text.trim(), done: false, createdDate: today, priority };
    setItems((prev) => [...prev, next]);
    setText("");
    setPriority(undefined);
  }

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done, completedDate: !t.done ? today : undefined } : t)),
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  function cyclePriority(id: string) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, priority: nextPriority(t.priority) } : t)));
  }

  return (
    <div>
      <form onSubmit={addTodo} className="mb-3 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add something for today…" className="flex-1" />
        <div className="flex shrink-0 items-center gap-1 rounded-md border border-input px-1.5">
          {PRIORITIES.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-label={`${p.label} priority`}
              aria-pressed={priority === p.id}
              onClick={() => setPriority((cur) => (cur === p.id ? undefined : p.id))}
              className="grid size-6 place-items-center"
            >
              <span
                className="rounded-full transition-all"
                style={{
                  backgroundColor: p.color,
                  width: priority === p.id ? 10 : 8,
                  height: priority === p.id ? 10 : 8,
                  opacity: priority === undefined || priority === p.id ? 1 : 0.3,
                }}
              />
            </button>
          ))}
        </div>
        <Button type="submit" size="icon" aria-label="Add to-do">
          <Plus className="size-4" />
        </Button>
      </form>

      {todayEvents.length > 0 && (
        <ul className="mb-1 space-y-1">
          {todayEvents.map((event) => (
            <li key={event.id} className="flex items-center gap-3 rounded-lg bg-accent/40 px-1 py-1.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full text-amber">
                <Calendar className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">
                {event.title}
                {event.time && <span className="text-muted-foreground"> · {event.time}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : open.length === 0 && doneToday.length === 0 && todayEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing on the list — add what you're planning for today.</p>
      ) : (
        <ul className="space-y-1">
          {[...open, ...doneToday].map((todo) => (
            <li key={todo.id} className="group flex items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-accent/40">
              <button
                type="button"
                aria-label={todo.done ? "Mark not done" : "Mark done"}
                onClick={() => toggle(todo.id)}
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                  todo.done ? "border-primary bg-primary text-primary-foreground" : "border-line text-transparent hover:border-primary",
                )}
              >
                <Check className="size-3" />
              </button>
              <button
                type="button"
                aria-label={todo.priority ? `${todo.priority} priority — click to change` : "No priority — click to set"}
                onClick={() => cyclePriority(todo.id)}
                className="grid size-5 shrink-0 place-items-center rounded-full hover:bg-line"
              >
                <span
                  className="size-2 rounded-full border border-line"
                  style={todo.priority ? { backgroundColor: PRIORITIES.find((p) => p.id === todo.priority)?.color, borderColor: "transparent" } : undefined}
                />
              </button>
              <span className={cn("min-w-0 flex-1 truncate text-sm", todo.done && "text-muted-foreground line-through decoration-line")}>{todo.text}</span>
              <button
                type="button"
                aria-label="Remove to-do"
                onClick={() => remove(todo.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{open.length} open · carries forward until checked off</p>}
    </div>
  );
}
