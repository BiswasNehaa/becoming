import { BookOpen } from "lucide-react";

import { ComingSoon } from "@/components/ComingSoon";

export function Reading() {
  return (
    <ComingSoon
      icon={BookOpen}
      eyebrow="Library"
      title="Keep the ideas close."
      description="Track books by status, log pages and sessions, and save ideas worth carrying into your own work in a small knowledge vault."
      phase="Arrives in Phase 2"
    />
  );
}
