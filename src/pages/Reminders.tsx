import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncErrorBanner } from "@/components/SyncErrorBanner";
import type { RemindersContext } from "@/components/layout/AppShell";
import { NotificationPermission } from "@/components/reminders/NotificationPermission";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { ReminderList } from "@/components/reminders/ReminderList";
import type { Reminder } from "@/lib/reminders";

export function Reminders() {
  const { reminders, setReminders, remindersSyncError: syncError, remindersLoading: loading } = useOutletContext<RemindersContext>();
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  function saveReminder(reminder: Reminder) {
    setReminders((prev) => {
      const exists = prev.some((r) => r.id === reminder.id);
      return exists ? prev.map((r) => (r.id === reminder.id ? reminder : r)) : [...prev, reminder];
    });
    setEditingReminder(null);
  }

  function deleteReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (editingReminder?.id === id) setEditingReminder(null);
  }

  return (
    <div className="subtle-rise space-y-5">
      <SyncErrorBanner error={syncError} />

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Notifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Reminders fire while Becoming is open in a tab or installed as an app — not a true background push when it&rsquo;s fully closed, since that needs a
            server behind it.
          </p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <NotificationPermission />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingReminder ? "Edit reminder" : "Add a reminder"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <ReminderForm editingReminder={editingReminder} onSave={saveReminder} onCancelEdit={() => setEditingReminder(null)} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Your reminders</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : <ReminderList reminders={reminders} onEdit={setEditingReminder} onDelete={deleteReminder} />}
        </CardContent>
      </Card>
    </div>
  );
}
