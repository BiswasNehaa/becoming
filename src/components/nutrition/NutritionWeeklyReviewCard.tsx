import type { NutritionWeeklyReview } from "@/lib/nutritionReview";

export function NutritionWeeklyReviewCard({ review }: { review: NutritionWeeklyReview | null }) {
  if (!review) {
    return <p className="text-sm text-muted-foreground">Once you&rsquo;ve logged a few days, this will compare your week to the one before.</p>;
  }

  return (
    <div>
      <p className="text-sm font-medium leading-5">{review.headline}</p>

      {(review.improved.length > 0 || review.workOn.length > 0) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {review.improved.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Improved</p>
              <ul className="mt-1.5 space-y-1">
                {review.improved.map((i) => (
                  <li key={i.label} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{i.label}</span> &mdash; {i.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.workOn.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Could use more attention</p>
              <ul className="mt-1.5 space-y-1">
                {review.workOn.map((i) => (
                  <li key={i.label} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{i.label}</span> &mdash; {i.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">This week&rsquo;s goals</p>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {review.goals.map((g) => (
            <div key={g.label}>
              <p className="font-display text-lg font-bold">
                {g.achieved}
                <span className="text-sm font-normal text-muted-foreground">/{g.total}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{g.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
