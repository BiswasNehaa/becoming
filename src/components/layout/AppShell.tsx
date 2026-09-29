import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { useReminderNotifications } from "@/hooks/useReminderNotifications";
import type { Reminder } from "@/lib/reminders";
import { useCollection } from "@/lib/store";

export type RemindersContext = {
  reminders: Reminder[];
  setReminders: (updater: (prev: Reminder[]) => Reminder[]) => void;
  remindersSyncError: string | null;
  remindersLoading: boolean;
};

export function AppShell() {
  // Owned here (not re-fetched in Reminders.tsx) so the same reminder list
  // that the notification checker below is watching is also what the page
  // edits — two separate useCollection("reminders") calls would each keep
  // their own copy, and an edit on the page would never reach the checker
  // until a full reload.
  const { items: reminders, setItems: setReminders, loading: remindersLoading, syncError: remindersSyncError } = useCollection<Reminder>("reminders");
  useReminderNotifications(reminders, setReminders);

  return (
    <div className="ambient-field min-h-screen overflow-x-hidden bg-paper text-foreground">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-7 lg:px-9 lg:pb-10 lg:pt-8">
          <Header />
          <Outlet context={{ reminders, setReminders, remindersSyncError, remindersLoading } satisfies RemindersContext} />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
