import { NavLink } from "react-router-dom";

import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  return (
    <nav className="glass-panel fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 items-center rounded-t-3xl border-b-0 px-1 py-2 lg:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn("flex h-12 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[9px] leading-none text-muted-foreground", isActive && "text-primary")
          }
        >
          <Icon className="size-4 shrink-0" />
          <span className="max-w-full truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
