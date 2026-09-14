import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { makeId, todayId } from "@/lib/store";
import type { Book, VaultEntry } from "@/lib/reading";

export function VaultForm({ books, onSave }: { books: Book[]; onSave: (entry: VaultEntry) => void }) {
  const [idea, setIdea] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [bookId, setBookId] = useState<string>("none");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    onSave({
      id: makeId(),
      date: todayId(),
      bookId: bookId === "none" ? null : bookId,
      idea: idea.trim(),
      thoughts: thoughts.trim() || undefined,
    });
    setIdea("");
    setThoughts("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-48 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Idea</label>
          <Input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="&ldquo;Attention is the beginning of devotion.&rdquo;" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">From</label>
          <Select value={bookId} onValueChange={setBookId}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No book</SelectItem>
              {books.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Save idea</Button>
      </div>
      <Textarea value={thoughts} onChange={(e) => setThoughts(e.target.value)} placeholder="Your own thoughts on it (optional)" className="min-h-16" />
    </form>
  );
}
