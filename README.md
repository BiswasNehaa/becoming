# Ascend — Personal Growth OS

A private habit, learning, reading, and nutrition tracker, built in phases. See the design language and shadcn/ui primitives borrowed from [life-weave-insight](https://github.com/BiswasNehaa/life-weave-insight) for reference, but rebuilt from scratch on a simpler stack with real, working data underneath.

## Stack

Vite + React 19 + TypeScript, React Router, Tailwind CSS v4, shadcn/ui. Data currently lives in the browser's `localStorage` behind a small collection-based interface (`src/lib/store.ts`); a later phase swaps that for Supabase (Postgres + Auth) so each person gets their own private account.

## Development

```sh
npm install
npm run dev
```

## Build status

See the phase plan for what's built and what's next.

- [x] Phase 0 — scaffold, design system, navigation shell
- [ ] Phase 1 — habits & hobbies + streaks
- [ ] Phase 2 — reading tracker
- [ ] Phase 3 — learning / AI roadmap tracker
- [ ] Phase 4 — nutrition tracker
- [ ] Phase 5 — daily check-in & reflections
- [ ] Phase 6 — dashboard
- [ ] Phase 7 — auth + Supabase (multi-user)
