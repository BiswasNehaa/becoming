import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { progressPct, type Book } from "@/lib/reading";
import { useCollection } from "@/lib/store";

export function ReadingSnapshot() {
  const { items: books } = useCollection<Book>("books");
  const current = books.find((b) => b.status === "reading");

  return (
    <Link to="/reading">
      <Card className="glass-panel h-full rounded-2xl border-0 p-4 shadow-none transition-colors hover:bg-accent/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <BookOpen className="size-3.5" /> Reading
        </div>
        {current ? (
          <>
            <p className="mt-2 truncate font-display text-lg font-bold">{current.title}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-accent">
              <div className="h-full rounded-full bg-sage" style={{ width: `${progressPct(current)}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {current.currentPage}/{current.pages} pg
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No book in progress</p>
        )}
      </Card>
    </Link>
  );
}
