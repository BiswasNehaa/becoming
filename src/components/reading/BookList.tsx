import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/reading/StarRating";
import { BOOK_STATUSES, progressPct, type Book } from "@/lib/reading";

export function BookList({ books, onEdit, onDelete }: { books: Book[]; onEdit: (book: Book) => void; onDelete: (id: string) => void }) {
  if (books.length === 0) {
    return <p className="text-sm text-muted-foreground">No books yet — add your first one above.</p>;
  }

  return (
    <div className="space-y-5">
      {BOOK_STATUSES.map((statusDef) => {
        const items = books.filter((b) => b.status === statusDef.id);
        if (items.length === 0) return null;
        return (
          <div key={statusDef.id}>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{statusDef.label}</h3>
            <ul className="divide-y divide-line">
              {items.map((book) => (
                <li key={book.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{book.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                    {book.pages > 0 && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1 w-32 overflow-hidden rounded-full bg-accent">
                          <div className="h-full rounded-full bg-sage" style={{ width: `${progressPct(book)}%` }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {book.currentPage}/{book.pages} pg
                        </span>
                      </div>
                    )}
                  </div>
                  {book.rating > 0 && <StarRating value={book.rating} readOnly />}
                  <Button type="button" variant="ghost" size="icon" aria-label="Edit book" onClick={() => onEdit(book)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Delete book" onClick={() => onDelete(book.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
