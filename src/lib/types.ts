/**
 * A block of time on one day. `date` is a YYYY-MM-DD id (see todayId() in
 * store.ts); `startMin`/`endMin` are minutes since midnight (0-1439),
 * `endMin` exclusive so a block runs [startMin, endMin).
 *
 * This is the shape Claude writes directly into data/time_entries.json
 * when you describe your day in chat instead of using the form.
 */
export type TimeEntry = {
  id: string;
  date: string;
  startMin: number;
  endMin: number;
  categoryId: string;
  note?: string;
};
