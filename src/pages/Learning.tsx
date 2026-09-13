import { BrainCircuit } from "lucide-react";

import { ComingSoon } from "@/components/ComingSoon";

export function Learning() {
  return (
    <ComingSoon
      icon={BrainCircuit}
      eyebrow="Roadmap"
      title="Learn with a longer horizon."
      description="Your AI and computer-science roadmap — grouped into Foundations, AI, and Engineering — with per-topic status, hours logged, and notes."
      phase="Arrives in Phase 3"
    />
  );
}
