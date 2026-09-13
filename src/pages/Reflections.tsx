import { PenLine } from "lucide-react";

import { ComingSoon } from "@/components/ComingSoon";

export function Reflections() {
  return (
    <ComingSoon
      icon={PenLine}
      eyebrow="Reflection"
      title="Close the loop gently."
      description="A quick end-of-day check-in — what you learned, how the day felt, and one thing to improve tomorrow."
      phase="Arrives in Phase 5"
    />
  );
}
