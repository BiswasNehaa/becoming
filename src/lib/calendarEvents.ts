/** A date-specific thing to remember — a meeting, a deadline, anything
 * that isn't a daily habit or a one-off focus. Single-date only (no
 * recurrence): once its date passes, it naturally stops surfacing. */
export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time?: string;
  notes?: string;
};
