export type BookStatus = "want" | "reading" | "completed" | "paused";

export const BOOK_STATUSES: { id: BookStatus; label: string }[] = [
  { id: "want", label: "Want to read" },
  { id: "reading", label: "Reading" },
  { id: "completed", label: "Completed" },
  { id: "paused", label: "Paused" },
];

export type Book = {
  id: string;
  title: string;
  author: string;
  pages: number;
  currentPage: number;
  status: BookStatus;
  rating: number; // 0 = unrated, else 1-5
  notes?: string;
  /** Set automatically the first time status flips to "completed" — lets a
   * weekly/monthly review count completions in a date range without a
   * separate completion log. */
  completedDate?: string;
};

export function progressPct(book: Book): number {
  if (book.pages <= 0) return 0;
  return Math.min(100, Math.round((book.currentPage / book.pages) * 100));
}

/** One page-progress update, logged automatically whenever a book's
 * currentPage increases — Book itself only ever stores where you currently
 * are, so this is the only record of *when* pages were actually read. */
export type ReadingSession = {
  id: string;
  date: string;
  bookId: string;
  pagesRead: number;
};

export type VaultEntry = {
  id: string;
  date: string;
  bookId: string | null;
  idea: string;
  thoughts?: string;
};
