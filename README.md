# UniBuySell

A secure, closed-ecosystem marketplace for verified university and medical school students.

## Stack

- Next.js App Router + React Server Components
- TypeScript strict mode
- Tailwind CSS with shadcn-style UI primitives
- Supabase Auth, Postgres, RLS, and Realtime

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the SQL migration in `supabase/migrations` against your Supabase project before using the app.

## Development

```bash
npm install
npm run dev
```

The marketplace routes (`/dashboard`, `/listings`, `/chats`, and `/profile`) require a confirmed
institutional email session.
