# Daybook — Personal Growth Tracker

A private habit, learning, reading, and nutrition tracker, built in phases. The design language and shadcn/ui primitives are borrowed from [life-weave-insight](https://github.com/BiswasNehaa/life-weave-insight) for reference, but rebuilt from scratch on a simpler stack with real, working data underneath.

## Stack

Vite + React 19 + TypeScript, React Router, Tailwind CSS v4, shadcn/ui. Data lives in a small local JSON store served by a local API (`server/`) — see `src/lib/store.ts` for the client-side interface every module reads and writes through. A later phase swaps that backend for Supabase (Postgres + Auth) so each person gets their own private, always-on account.

## Development

```sh
npm install
npm run dev
```

This starts both the Vite dev server and the local data API together.

## Build status

- [x] Phase 0 — scaffold, design system, navigation shell
- [ ] Phase 1 — habits & hobbies + streaks
- [ ] Phase 2 — reading tracker
- [ ] Phase 3 — learning / AI roadmap tracker
- [ ] Phase 4 — nutrition tracker
- [ ] Phase 5 — daily check-in & reflections
- [ ] Phase 6 — dashboard
- [ ] Phase 7 — auth + Supabase (multi-user, hosted)
