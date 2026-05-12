#!/bin/sh
set -e

# Push schema to DB (idempotent)
npx --yes prisma@7.8.0 db push --url "$DATABASE_URL"

# Seed initial users if not already present (upsert — safe to run multiple times)
node /app/prisma/seed.js

exec "$@"
