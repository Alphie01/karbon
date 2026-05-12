#!/bin/sh
set -e

# --url flag ile config bypass ederek direkt DATABASE_URL kullan
npx --yes prisma@7.8.0 db push --url "$DATABASE_URL"

exec "$@"
