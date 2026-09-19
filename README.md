# Becoming — Personal Growth Tracker

A private habit, learning, reading, and nutrition tracker, built in phases. The design language and shadcn/ui primitives are borrowed from [life-weave-insight](https://github.com/BiswasNehaa/life-weave-insight) for reference, but rebuilt from scratch on a simpler stack with real, working data underneath.

## Stack

Vite + React 19 + TypeScript, React Router, Tailwind CSS v4, shadcn/ui. Every module reads and writes through one interface (`src/lib/store.ts`) backed by either:

- **Local** (default, no setup) — a small Express API (`server/`) writing `data/<collection>.json` on disk. Single machine, no account.
- **Hosted** (once `.env.local` has Supabase credentials) — one Supabase table (`records`, see `supabase/schema.sql`) with email/password sign-in and Row Level Security, so each account only ever sees its own data.

### Switching to hosted mode

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard: **SQL Editor > New query**, paste the contents of `supabase/schema.sql`, run it once.
3. In **Project Settings > API**, copy the **Project URL** and the **anon public** key.
4. Copy `.env.example` to `.env.local` and paste those two values in.
5. Restart `npm run dev`. The app now asks for sign-in, and data is private per account.

Leaving `.env.local` absent keeps everything local-only — nothing else about the app changes.

### Deploying (for phone/anywhere access)

Hosted mode (above) is required first — a static host has no server to run `server/`'s local API. Once `.env.local` is set:

1. Push this repo to GitHub (already done).
2. Import it on [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com) (both have a free tier; sign in with GitHub, pick this repo).
3. Add the same two `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` values as environment variables in that host's project settings.
4. Deploy. `vercel.json` / `public/_redirects` are already in the repo so client-side routing (`/nutrition`, `/reading`, etc.) works correctly on either host.

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
- [x] Auth + Supabase — sign-in and hosted storage are built; **activates once `.env.local` is set up** (see above)
- [x] Deploy config (Vercel/Netlify SPA rewrites) — ready; the deploy itself needs a Vercel/Netlify account, so it's the one remaining manual step
