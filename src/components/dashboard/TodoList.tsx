import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeId, todayId, useCollection } from "@/lib/store";
import type { TodoItem } from "@/lib/todos";
import { cn } from "@/lib/utils";

export function TodoList() {
  const { items, setItems, loading } = useCollection<TodoItem>("todos");
  const [text, setText] = useState("");

  const today = todayId();
  const open = items.filter((t) => !t.done);
  const doneToday = items.filter((t) => t.done && t.completedDate === today);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const next: TodoItem = { id: makeId(), text: text.trim(), done: false, createdDate: today };
    setItems((prev) => [...prev, next]);
    setText("");
  }

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done, completedDate: !t.done ? today : undefined } : t)),
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <form onSubmit={addTodo} className="mb-3 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add something for today…" className="flex-1" />
        <Button type="submit" size="icon" aria-label="Add to-do">
          <Plus className="size-4" />
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : open.length === 0 && doneToday.length === 0 ? (
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
