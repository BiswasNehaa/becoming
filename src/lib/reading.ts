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
};

export function progressPct(book: Book): number {
  if (book.pages <= 0) return 0;
  return Math.min(100, Math.round((book.currentPage / book.pages) * 100));
}

export type VaultEntry = {
  id: string;
  date: string;
  bookId: string | null;
  idea: string;
  thoughts?: string;
};
