import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    setPermission(Notification.permission);
  }, []);

  if (permission === "unsupported") {
    return <p className="text-sm text-muted-foreground">Notifications aren&rsquo;t supported in this browser.</p>;
  }

  if (permission === "granted") {
    return (
      <p className="flex items-center gap-1.5 text-sm text-sage">
        <Bell className="size-4" /> Notifications are on.
      </p>
    );
  }

  if (permission === "denied") {
    return (
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <BellOff className="size-4" /> Notifications are blocked for this site — enable them in your browser&rsquo;s site settings to get reminders.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-muted-foreground">Turn on notifications to actually get reminders while the app is open.</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={async () => {
          const result = await Notification.requestPermission();
          setPermission(result);
        }}
      >
        <Bell className="size-3.5" /> Enable
      </Button>
    </div>
  );
}
