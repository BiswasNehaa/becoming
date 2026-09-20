import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/reading/StarRating";
import { makeId } from "@/lib/store";
import { BOOK_STATUSES, type Book, type BookStatus } from "@/lib/reading";

const numberField = (v: string) => (v.trim() === "" ? 0 : Number(v));

export function BookForm({ editingBook, onSave, onCancelEdit }: { editingBook: Book | null; onSave: (book: Book) => void; onCancelEdit: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [status, setStatus] = useState<BookStatus>("want");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setPages(String(editingBook.pages));
      setCurrentPage(String(editingBook.currentPage));
      setStatus(editingBook.status);
      setRating(editingBook.rating);
      setError("");
    }
  }, [editingBook]);

  function reset() {
    setTitle("");
    setAuthor("");
    setPages("");
    setCurrentPage("");
    setStatus("want");
    setRating(0);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the book a title.");
      return;
    }
    onSave({
      id: editingBook?.id ?? makeId(),
      title: title.trim(),
      author: author.trim(),
      pages: numberField(pages),
      currentPage: numberField(currentPage),
      status,
      rating,
    });
    if (!editingBook) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Creative Act" />
        </div>
        <div className="flex min-w-32 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Author</label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Rick Rubin" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Pages</label>
          <Input type="number" min="0" inputMode="numeric" value={pages} onChange={(e) => setPages(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Current pg</label>
          <Input type="number" min="0" inputMode="numeric" value={currentPage} onChange={(e) => setCurrentPage(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as BookStatus)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOK_STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {status === "completed" && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Rating</label>
            <div className="flex h-9 items-center">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>
        )}
        <Button type="submit">{editingBook ? "Save changes" : "Add book"}</Button>
        {editingBook && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" onClick={onCancelEdit}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
