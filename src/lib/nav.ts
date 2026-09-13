import { BookOpen, BrainCircuit, Home, PenLine, Sparkles, Utensils, type LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

// Sections not in this list yet (health, digital, analytics, calendar,
// settings...) are deliberately deferred past the MVP — see the build plan.
export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/learning", label: "Learning", icon: BrainCircuit },
  { to: "/reading", label: "Reading", icon: BookOpen },
  { to: "/hobbies", label: "Hobbies", icon: Sparkles },
  { to: "/nutrition", label: "Nutrition", icon: Utensils },
  { to: "/reflections", label: "Reflections", icon: PenLine },
];
