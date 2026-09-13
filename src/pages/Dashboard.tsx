import { Home } from "lucide-react";

import { ComingSoon } from "@/components/ComingSoon";

export function Dashboard() {
  return (
    <ComingSoon
      icon={Home}
      eyebrow="Today"
      title="Your day, in one place."
      description="The dashboard pulls together today's habits, learning, reading, and nutrition once those modules have real data to show. For now, use the sections in the nav to start logging."
      phase="Arrives in Phase 6"
    />
  );
}
