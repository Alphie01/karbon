#!/bin/bash
set -e

DOMAIN="karbon.monolithsoftware.com.tr"
EMAIL="${1:-admin@monolithsoftware.com.tr}"
COMPOSE_PROJECT="karbon"

echo "==> [1/4] Stopping stuck containers if any..."
docker compose down 2>/dev/null || true

echo "==> [2/4] Starting nginx with HTTP-only config for ACME challenge..."
cp nginx/nginx.conf nginx/nginx.conf.bak
cp nginx/nginx.init.conf nginx/nginx.conf
docker compose up -d db app nginx

echo "==> Waiting for nginx to be ready..."
sleep 3

echo "==> [3/4] Obtaining Let's Encrypt certificate for $DOMAIN..."
docker run --rm \
  --volume "${COMPOSE_PROJECT}_certbot_www:/var/www/certbot" \
  --volume "${COMPOSE_PROJECT}_certbot_certs:/etc/letsencrypt" \
  certbot/certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

echo "==> [4/4] Restoring full nginx config with SSL..."
cp nginx/nginx.conf.bak nginx/nginx.conf
rm -f nginx/nginx.conf.bak
docker compose exec ecopilot-nginx nginx -s reload

echo ""
echo "Done! Site is live at https://$DOMAIN"
echo ""
echo "To set up auto-renewal, add this cron job (crontab -e):"
echo "0 3 * * * cd $(pwd) && docker run --rm -v ${COMPOSE_PROJECT}_certbot_www:/var/www/certbot -v ${COMPOSE_PROJECT}_certbot_certs:/etc/letsencrypt certbot/certbot renew --webroot -w /var/www/certbot --quiet && docker compose exec ecopilot-nginx nginx -s reload"
