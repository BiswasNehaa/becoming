import type { Book, ReadingSession } from "@/lib/reading";

export type ReadingWeekStats = {
  booksCompleted: number;
  pagesRead: number;
  daysWithReading: number;
};

export function computeReadingWeekStats(books: Book[], sessions: ReadingSession[], days: string[]): ReadingWeekStats {
  const daySet = new Set(days);
  const booksCompleted = books.filter((b) => b.completedDate && daySet.has(b.completedDate)).length;
  const inRange = sessions.filter((s) => daySet.has(s.date));
  const pagesRead = inRange.reduce((sum, s) => sum + s.pagesRead, 0);
  const daysWithReading = new Set(inRange.map((s) => s.date)).size;
  return { booksCompleted, pagesRead, daysWithReading };
}

export type ReviewPoint = { label: string; detail: string };

export type ReadingWeeklyReview = {
  headline: string;
  improved: ReviewPoint[];
  workOn: ReviewPoint[];
  daysWithReading: number;
  daysInWeek: number;
};

/** Real week-over-week comparison, not a scripted insight — null when
 * there's nothing logged in either week to compare. */
export function generateReadingWeeklyReview(thisWeek: ReadingWeekStats, lastWeek: ReadingWeekStats, daysInWeek: number): ReadingWeeklyReview | null {
  if (thisWeek.pagesRead === 0 && lastWeek.pagesRead === 0 && thisWeek.booksCompleted === 0 && lastWeek.booksCompleted === 0) return null;

  const improved: ReviewPoint[] = [];
  const workOn: ReviewPoint[] = [];

  if (thisWeek.pagesRead > lastWeek.pagesRead) {
    improved.push({ label: "Pages read", detail: `${thisWeek.pagesRead} pages this week, up from ${lastWeek.pagesRead} last week.` });
  } else if (thisWeek.pagesRead < lastWeek.pagesRead) {
    workOn.push({ label: "Pages read", detail: `${thisWeek.pagesRead} pages this week, down from ${lastWeek.pagesRead} last week.` });
  }

  if (thisWeek.booksCompleted > lastWeek.booksCompleted) {
    improved.push({ label: "Books completed", detail: `${thisWeek.booksCompleted} finished this week, vs ${lastWeek.booksCompleted} last week.` });
  } else if (thisWeek.booksCompleted < lastWeek.booksCompleted) {
    workOn.push({ label: "Books completed", detail: `${thisWeek.booksCompleted} finished this week, vs ${lastWeek.booksCompleted} last week.` });
  }

  const headline =
    improved.length > 0 && workOn.length > 0
      ? `${improved[0].label} improved this week — ${workOn[0].label.toLowerCase()} eased off a bit.`
      : improved.length > 0
        ? `${improved.map((i) => i.label).join(" and ")} trending up this week.`
        : workOn.length > 0
          ? `${workOn[0].label} slipped a bit this week.`
          : "Reading has been steady this week.";

  return { headline, improved, workOn, daysWithReading: thisWeek.daysWithReading, daysInWeek };
}
