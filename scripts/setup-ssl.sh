#!/bin/bash
set -e

DOMAIN="karbon.monolithsoftware.com.tr"
EMAIL="${1:-admin@monolithsoftware.com.tr}"

echo "==> [1/4] Starting nginx with HTTP-only config for ACME challenge..."
cp nginx/nginx.conf nginx/nginx.conf.bak
cp nginx/nginx.init.conf nginx/nginx.conf
docker compose up -d nginx

echo "==> [2/4] Obtaining Let's Encrypt certificate for $DOMAIN..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "==> [3/4] Restoring full nginx config with SSL..."
cp nginx/nginx.conf.bak nginx/nginx.conf
rm nginx/nginx.conf.bak
docker compose exec nginx nginx -s reload

echo "==> [4/4] Done! Site is live at https://$DOMAIN"
