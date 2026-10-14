# Bollywood Night

Party pass page for Vaswani Social's Bollywood Night. Guests claim a Bollywood character (one guest per character, enforced by a shared database) and get a downloadable VIP pass.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Without any configuration, development uses a local SQLite file (`local.db`), so the app works right away on one machine.

## Shared database (Turso)

Guests on different devices only see each other's claims if they share one database.

```bash
turso db create bolly-bash
turso db show bolly-bash --url        # -> TURSO_DATABASE_URL
turso db tokens create bolly-bash     # -> TURSO_AUTH_TOKEN
cp .env.example .env.local            # then paste both values
```

The `passes` table is created automatically on first use. It has a UNIQUE constraint on the normalised character name, so two guests can never lock the same character, even if they submit at the same instant.

When deploying (e.g. Vercel), set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the project's environment variables. Production refuses to start without `TURSO_DATABASE_URL`.

## Scripts

`npm run build` · `npm start` · `npm run lint`
