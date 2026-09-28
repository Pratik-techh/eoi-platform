## Setting Up Supabase (Local Development)

Docker Desktop is required to run Supabase locally. Since Docker is not available in this environment, follow one of these two paths:

### Option A — Supabase Cloud (Recommended for quick demo)

1. Create a free project at https://supabase.com/dashboard
2. Copy your project URL and anon key from **Project Settings → API**
3. Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase URL and keys
```

4. Run migrations against Supabase cloud:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

5. Run the seed script:

```bash
pnpm seed
```

6. Start the app:

```bash
pnpm dev
```

### Option B — Docker Desktop (Full local)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Start Docker Desktop
3. Run the one-command bootstrap:

```bash
pnpm setup
```

This runs: `supabase start` → `supabase db push` → `pnpm seed` → `pnpm dev`

### Verifying migrations ran

After setup, all 11 migrations should appear in your Supabase dashboard under **Database → Migrations**. The seed will have created 500 students, 50 employers, 300 employment events, and the 6 demo accounts listed in the README.

### Resetting

```bash
npx supabase db reset    # wipes and re-runs all migrations
pnpm seed               # re-seeds
```
