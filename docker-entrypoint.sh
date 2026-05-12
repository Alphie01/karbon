#!/bin/sh
set -e

# Push schema to DB (idempotent)
npx --yes prisma@7.8.0 db push --url "$DATABASE_URL"

exec "$@"
