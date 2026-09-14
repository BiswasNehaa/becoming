import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Book, VaultEntry } from "@/lib/reading";

export function VaultList({ entries, books, onDelete }: { entries: VaultEntry[]; books: Book[]; onDelete: (id: string) => void }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing saved yet.</p>;
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="space-y-3">
      {sorted.map((entry) => {
        const book = books.find((b) => b.id === entry.bookId);
        return (
          <li key={entry.id} className="rounded-xl bg-accent/40 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-6">{entry.idea}</p>
              <Button type="button" variant="ghost" size="icon" aria-label="Delete idea" className="-mt-1 shrink-0" onClick={() => onDelete(entry.id)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            {entry.thoughts && <p className="mt-1.5 text-xs text-muted-foreground">{entry.thoughts}</p>}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {book ? book.title : "No book"} · {entry.date}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
