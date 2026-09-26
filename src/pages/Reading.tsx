import { useMemo, useState } from "react";
import { BookOpen, Flame, Library } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookForm } from "@/components/reading/BookForm";
import { BookList } from "@/components/reading/BookList";
import { ReadingWeeklyReviewCard } from "@/components/reading/ReadingWeeklyReviewCard";
import { VaultForm } from "@/components/reading/VaultForm";
import { VaultList } from "@/components/reading/VaultList";
import { computeReadingWeekStats, generateReadingWeeklyReview } from "@/lib/readingReview";
import { makeId, todayId, useCollection } from "@/lib/store";
import { computeCategoryStreak, lastDateIds } from "@/lib/streaks";
import type { Book, ReadingSession, VaultEntry } from "@/lib/reading";
import type { TimeEntry } from "@/lib/types";

export function Reading() {
  const { items: books, setItems: setBooks, loading: booksLoading } = useCollection<Book>("books");
  const { items: vault, setItems: setVault } = useCollection<VaultEntry>("reading_vault");
  const { items: sessions, setItems: setSessions } = useCollection<ReadingSession>("reading_sessions");
  const { items: timeEntries } = useCollection<TimeEntry>("time_entries");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const streak = useMemo(() => computeCategoryStreak("reading", timeEntries), [timeEntries]);
  const completedCount = books.filter((b) => b.status === "completed").length;
  const pagesRead = books.reduce((sum, b) => sum + (b.status === "completed" ? b.pages : b.currentPage), 0);

  const weeklyReview = useMemo(() => {
    const thisWeekDays = lastDateIds(7);
    const lastWeekDays = lastDateIds(14).slice(0, 7);
    const thisWeek = computeReadingWeekStats(books, sessions, thisWeekDays);
    const lastWeek = computeReadingWeekStats(books, sessions, lastWeekDays);
    return generateReadingWeeklyReview(thisWeek, lastWeek, thisWeekDays.length);
  }, [books, sessions]);

  function saveBook(book: Book) {
    // Book only stores where you currently are, not a history of when
    // pages were read — log the delta as a session so the weekly review
    // has real day-by-day data to compare instead of a lifetime total.
    const existing = books.find((b) => b.id === book.id);
    const pagesDelta = book.currentPage - (existing?.currentPage ?? 0);
    const completedDate = book.status === "completed" ? (existing?.completedDate ?? todayId()) : existing?.completedDate;
    const finalBook: Book = { ...book, completedDate };

    setBooks((prev) => {
      const exists = prev.some((b) => b.id === finalBook.id);
      return exists ? prev.map((b) => (b.id === finalBook.id ? finalBook : b)) : [...prev, finalBook];
    });

    if (pagesDelta > 0) {
      setSessions((prev) => [...prev, { id: makeId(), date: todayId(), bookId: finalBook.id, pagesRead: pagesDelta }]);
    }

    setEditingBook(null);
  }

  function deleteBook(id: string) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    if (editingBook?.id === id) setEditingBook(null);
  }

  function saveIdea(entry: VaultEntry) {
    setVault((prev) => [...prev, entry]);
  }

  function deleteIdea(id: string) {
    setVault((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="subtle-rise space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-panel rounded-2xl border-0 p-4 text-center shadow-none">
          <Library className="mx-auto size-5 text-sage" />
          <p className="mt-1 font-display text-xl font-bold">{completedCount}</p>
          <p className="text-[11px] text-muted-foreground">Completed</p>
        </Card>
        <Card className="glass-panel rounded-2xl border-0 p-4 text-center shadow-none">
          <BookOpen className="mx-auto size-5 text-sage" />
          <p className="mt-1 font-display text-xl font-bold">{pagesRead}</p>
          <p className="text-[11px] text-muted-foreground">Pages read</p>
        </Card>
        <Card className="glass-panel rounded-2xl border-0 p-4 text-center shadow-none">
          <Flame className="mx-auto size-5 text-sage" />
          <p className="mt-1 font-display text-xl font-bold">{streak.current}d</p>
          <p className="text-[11px] text-muted-foreground">Reading streak</p>
        </Card>
      </div>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingBook ? "Edit book" : "Add a book"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <BookForm editingBook={editingBook} onSave={saveBook} onCancelEdit={() => setEditingBook(null)} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Books</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">{booksLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : <BookList books={books} onEdit={setEditingBook} onDelete={deleteBook} />}</CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Knowledge vault</CardTitle>
          <p className="text-sm text-muted-foreground">Ideas worth carrying into your own work.</p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pt-4">
          <VaultForm books={books} onSave={saveIdea} />
          <VaultList entries={vault} books={books} onDelete={deleteIdea} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Weekly review</p>
          <CardTitle className="mt-1 font-display text-2xl font-semibold">Your week</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-5">
          <ReadingWeeklyReviewCard review={weeklyReview} />
        </CardContent>
      </Card>
    </div>
  );
}
