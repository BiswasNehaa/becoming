/** A user-defined reminder — a time, and what to be reminded about.
 * `onlyIfNothingLogged` ties it to the day's actual activity instead of
 * firing no matter what: "remind me at 8pm, but only if I haven't logged
 * anything yet today" rather than a nudge you'd get even on a day you
 * already did everything. `lastNotifiedDate` stops it firing more than
 * once per day once it's due. */
export type Reminder = {
  id: string;
  label: string;
  time: string; // "HH:MM", 24h
  onlyIfNothingLogged?: boolean;
  lastNotifiedDate?: string;
};
