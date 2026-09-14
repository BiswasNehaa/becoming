import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({ value, onChange, readOnly }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange?.(n === value ? 0 : n)}
          className={cn("p-0.5", !readOnly && "cursor-pointer")}
        >
          <Star className={cn("size-4", n <= value ? "fill-amber text-amber" : "text-line")} />
        </button>
      ))}
    </div>
  );
}
