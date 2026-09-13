import { Sparkles } from "lucide-react";

import { ComingSoon } from "@/components/ComingSoon";

export function Hobbies() {
  return (
    <ComingSoon
      icon={Sparkles}
      eyebrow="Creative practice"
      title="Make room for the things that make you you."
      description="Guitar, chess, crochet, and anything else you want to practice — with flexible schedules, streaks, and a consistency score that doesn't punish a missed day."
      phase="Arrives in Phase 1"
    />
  );
}
