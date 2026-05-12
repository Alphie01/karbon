#!/bin/bash
# Kullanım: bash scripts/deploy.sh
set -e

echo "=== EcoPilot Deploy ==="

# 1. Çalışan container'ları durdur
echo "[1/5] Stopping containers..."
docker compose down

# 2. Local değişiklikleri at, temiz pull yap
echo "[2/5] Pulling latest code..."
git fetch origin main
git checkout origin/main -- nginx/nginx.conf
git reset --hard origin/main

# 3. .env kontrolü
if [ ! -f .env ]; then
    echo "ERROR: .env dosyası bulunamadı!"
    echo "  cp .env.production .env"
    echo "  nano .env   # değerleri doldur"
    exit 1
fi

# NEXTAUTH_SECRET kontrolü
SECRET=$(grep NEXTAUTH_SECRET .env | cut -d= -f2 | tr -d '"')
if [ -z "$SECRET" ] || [ "$SECRET" = "BURAYA_32_KARAKTER_URET_openssl_rand_base64_32" ]; then
    echo "ERROR: .env içinde NEXTAUTH_SECRET ayarlanmamış!"
    echo "  Üret: openssl rand -base64 32"
    exit 1
fi

# 4. Build ve başlat
echo "[3/5] Building app image..."
docker compose build --no-cache app

echo "[4/5] Starting all services..."
docker compose up -d

# 5. Sağlık kontrolü
echo "[5/5] Waiting for services to be healthy..."
sleep 15
docker compose ps

echo ""
echo "=== Kontroller ==="
echo "nginx:    $(curl -s -o /dev/null -w '%{http_code}' http://localhost || echo 'FAIL')"
echo "app:      $(docker compose logs app --tail=3 2>&1 | grep -c 'Ready\|ready' && echo 'OK' || echo 'CHECK LOGS')"
echo ""
echo "Loglar için: docker compose logs -f app"
