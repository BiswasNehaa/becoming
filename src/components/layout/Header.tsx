import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/nav";
import { useTheme } from "@/lib/theme";

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDashboard = location.pathname === "/";
  const title = isDashboard
    ? new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : (navItems.find((item) => item.to === location.pathname)?.label ?? "Daybook");

  return (
    <header className="subtle-rise mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-line pb-6 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{isDashboard ? "Today" : "Your space"}</p>
        <h1 className="mt-1 truncate font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
          onClick={toggleTheme}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  );
}
