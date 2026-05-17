# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

UniBuySell is a single Next.js App Router application backed by Supabase (Postgres + Auth + Realtime). There is no separate backend server; all server-side logic uses Next.js Server Actions and React Server Components. See `package.json` for available npm scripts (`dev`, `build`, `lint`).

### Local Supabase

The project requires a running Supabase instance. For local development, Docker must be running before starting Supabase:

```bash
sudo dockerd &>/tmp/dockerd.log &  # if Docker daemon is not already running
sudo chmod 666 /var/run/docker.sock
npx supabase start                 # pulls images on first run (~2 min)
npx supabase db reset              # applies migrations from supabase/migrations/
```

After `supabase start`, retrieve the local credentials with `npx supabase status`. The **Publishable** key maps to `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the **Project URL** maps to `NEXT_PUBLIC_SUPABASE_URL`. Place them in `.env.local` (gitignored).

Local Supabase auto-confirms emails, so the confirmation-email step is effectively bypassed during local testing. Mailpit runs on port 54324 if you need to inspect outbound emails.

### Running the app

```bash
npm run dev   # starts Next.js dev server on http://localhost:3000
```

### Lint / Build / Test

- **Lint:** `npm run lint` (ESLint with Next.js + TypeScript rules)
- **Build:** `npm run build` (production build with Turbopack)
- No automated test suite exists in this repo yet.

### Sign-up requirements

The app only accepts `.edu` email addresses (enforced in both application code and Postgres RLS constraints). For local testing, use any `*.edu` address (e.g. `testuser@stanford.edu`).
