import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { navItems } from "@/lib/nav";
import { isHosted } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="glass-panel sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 rounded-r-3xl p-5 lg:flex">
      <div className="mb-5 flex items-center gap-3 px-2 py-3">
        <div className="rainbow-bar grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-glow-foreground shadow-lg">B</div>
        <div>
          <p className="font-display font-semibold leading-none">Becoming</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Personal growth, logged daily</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 text-sm" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 font-body font-medium text-muted-foreground transition-colors hover:bg-paper/70 hover:text-foreground",
                isActive && "bg-paper/80 text-primary shadow-sm",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      {isHosted && user && (
        <div className="mt-auto border-t border-line pt-3">
          <p className="truncate px-3 text-[11px] text-muted-foreground">{user.email}</p>
          <Button variant="ghost" size="sm" onClick={signOut} className="mt-1 w-full justify-start gap-2 text-muted-foreground">
            <LogOut className="size-3.5" /> Sign out
          </Button>
        </div>
      )}
    </aside>
  );
}
