import { useEffect } from "react";

import type { Reminder } from "@/lib/reminders";
import { readCollection, todayId } from "@/lib/store";
import type { TimeEntry } from "@/lib/types";

const CHECK_INTERVAL_MS = 30_000;

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/**
 * Fires a browser Notification for any due reminder — checked on an
 * interval while the app is open in a tab. This is NOT true background
 * push: without a server sending the notification, nothing fires once the
 * tab/app is fully closed. That would need a push service (VAPID keys,
 * subscriptions, a server or scheduled function to trigger it) that
 * doesn't exist yet — this covers "the app is open somewhere," which is
 * what's achievable without adding backend infrastructure.
 *
 * Reads time_entries directly from the data layer (not a prop) rather
 * than trusting whatever's in React state: this hook lives in the layout
 * shell, which mounts once and never remounts as you navigate — a plain
 * prop would go stale forever the moment you logged something on a page
 * with its own separate useCollection("time_entries") instance.
 */
export function useReminderNotifications(reminders: Reminder[], setReminders: (updater: (prev: Reminder[]) => Reminder[]) => void) {
  const reminderKey = reminders.map((r) => `${r.id}:${r.time}:${r.onlyIfNothingLogged}:${r.lastNotifiedDate}`).join("|");

  useEffect(() => {
    if (reminders.length === 0) return;
    if (typeof Notification === "undefined") return;

    async function check() {
      if (Notification.permission !== "granted") return;
      const today = todayId();
      const nowHHMM = currentHHMM();

      const due = reminders.filter((r) => r.lastNotifiedDate !== today && nowHHMM >= r.time);
      if (due.length === 0) return;

      const needsLogCheck = due.some((r) => r.onlyIfNothingLogged);
      const hasLoggedToday = needsLogCheck ? (await readCollection<TimeEntry>("time_entries")).some((e) => e.date === today) : false;

      for (const reminder of due) {
        if (reminder.onlyIfNothingLogged && hasLoggedToday) continue;
        new Notification(reminder.label, { body: "Becoming", tag: reminder.id });
        setReminders((prev) => prev.map((r) => (r.id === reminder.id ? { ...r, lastNotifiedDate: today } : r)));
      }
    }

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
    // reminderKey (not `reminders`, a new array each render) drives
    // re-checks; setReminders is stable from useCollection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminderKey, setReminders]);
}
