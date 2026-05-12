#!/bin/sh
set -e

# DATABASE_URL'yi .env'e yaz — Prisma config sandbox'ı sadece .env okur
printf "DATABASE_URL=%s\n" "$DATABASE_URL" > /app/.env

# Schema push (tablolar varsa skip, yoksa oluşturur)
npx --yes prisma@7.8.0 db push --skip-generate

rm -f /app/.env

exec "$@"
