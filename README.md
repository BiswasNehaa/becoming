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

- [x] Scaffold — design system, navigation shell
- [x] Daily time log (dashboard) — full 24h accounting across 11 categories, day navigation
- [x] Streaks & consistency — per-practice streak and weekly count, derived from the time log
- [x] Nutrition — food log by meal, macro totals vs. targets
- [x] Reflections — mood, quick check-in, learned / improve-tomorrow notes
- [x] Reading tracker — book progress, knowledge vault
- [x] Learning / AI roadmap tracker — Foundations/AI/Engineering, hours & streak from the time log
- [ ] Auth + Supabase (multi-user, hosted) — needed before this is usable by more than one person on one machine
