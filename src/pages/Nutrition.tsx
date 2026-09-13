import { Utensils } from "lucide-react";

import { ComingSoon } from "@/components/ComingSoon";

export function Nutrition() {
  return (
    <ComingSoon
      icon={Utensils}
      eyebrow="Body signals"
      title="Eat with information, not judgment."
      description="Log meals against calorie and protein targets, see the shape of your day, and get non-judgmental status labels instead of pass/fail grades."
      phase="Arrives in Phase 4"
    />
  );
}
