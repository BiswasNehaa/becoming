import { BarChart3, BookOpen, BrainCircuit, HeartPulse, Home, PenLine, Utensils, type LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

// Sections not in this list yet (digital, calendar, settings...) are
// deliberately deferred past the MVP — see the build plan. Hobbies/streaks
// live on the Dashboard itself (the time log + streak board already cover
// guitar/chess/crochet), so there's no separate page.
export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/learning", label: "Learning", icon: BrainCircuit },
  { to: "/reading", label: "Reading", icon: BookOpen },
  { to: "/nutrition", label: "Nutrition", icon: Utensils },
  { to: "/health", label: "Health", icon: HeartPulse },
  { to: "/reflections", label: "Reflections", icon: PenLine },
  { to: "/analysis", label: "Analysis", icon: BarChart3 },
];
