This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Admin Login

The admin dashboard at `/admin` requires server-side credentials. Copy `.env.example` to `.env.local` and set:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` to a unique, strong password
- `ADMIN_SESSION_SECRET` to a random secret with at least 32 characters

Keep `.env.local` private and never commit it. Set the same variables in your deployment environment before deploying. The admin session is stored in a signed, HTTP-only cookie and expires after 8 hours.

## Supabase Setup

1. In the Supabase dashboard, open **SQL Editor**, paste and run [`supabase/schema.sql`](./supabase/schema.sql).
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Get the service-role key from **Project Settings → API Keys** and keep it server-only; do not use a `NEXT_PUBLIC_` prefix or expose it in browser code.
3. Restart the Next.js server. The app uses protected server API routes; Row Level Security is enabled and no public table policies are created.

The database starts empty. Existing browser `localStorage` and SQLite data are not imported.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
