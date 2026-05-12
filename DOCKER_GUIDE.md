# EcoPilot — Docker Deployment Guide

## Prerequisites

- Docker Engine 24+ or Docker Desktop
- Docker Compose v2.20+
- A running `.env` file (copy from `.env.example`)

---

## Quick Start

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env — set DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
nano .env

# 3. Build and start all services
docker compose build
docker compose up -d

# 4. Run database migration (first time only)
docker compose exec app npx prisma db push

# 5. (Optional) Seed initial data
# docker compose exec app npx tsx scripts/seed-admin.ts

# 6. Check logs
docker compose logs -f app
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@db:5432/ecopilot_db` |
| `NEXTAUTH_URL` | Public URL of the application | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT signing secret (32+ chars) | `openssl rand -base64 32` |
| `POSTGRES_USER` | PostgreSQL username | `ecopilot_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `changeme` |
| `POSTGRES_DB` | PostgreSQL database name | `ecopilot_db` |

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Docker Services

### `db` — PostgreSQL 16
- Image: `postgres:16-alpine`
- Data persisted in Docker volume `postgres_data`
- Healthcheck ensures app only starts after DB is ready

### `app` — Next.js Application
- Built from the local `Dockerfile` (multi-stage, Node 20 Alpine)
- Runs on port 3000
- Depends on `db` service health

---

## Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View app logs (live)
docker compose logs -f app

# Rebuild after code changes
docker compose build app
docker compose up -d app

# Run Prisma commands inside the container
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate
docker compose exec app npx prisma studio   # (dev only)

# Access PostgreSQL shell
docker compose exec db psql -U ecopilot_user -d ecopilot_db

# Remove all data (DESTRUCTIVE — removes volumes)
docker compose down -v
```

---

## Nginx Reverse Proxy (Production)

For production, place the app behind Nginx with HTTPS. Example configuration:

```nginx
server {
    listen 80;
    server_name app.ecopilot.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.ecopilot.com;

    ssl_certificate     /etc/letsencrypt/live/app.ecopilot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.ecopilot.com/privkey.pem;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Set `NEXTAUTH_URL=https://app.ecopilot.com` in your `.env` for production.

---

## Volume Management

PostgreSQL data is stored in a named Docker volume `postgres_data`. To backup:

```bash
# Backup
docker run --rm -v ecopilot_postgres_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/postgres_backup_$(date +%Y%m%d).tar.gz -C /data .

# Restore
docker run --rm -v ecopilot_postgres_data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/postgres_backup_YYYYMMDD.tar.gz -C /data
```

---

## Production Notes

1. **Never use default passwords** — Change all values in `.env` before going live.
2. **Set `NEXTAUTH_URL`** to your actual public HTTPS URL.
3. **SSL is required** — NextAuth v5 requires HTTPS in production. Use Let's Encrypt via Certbot.
4. **File uploads** — If the app serves uploaded files, mount a volume for the `public/uploads` directory so data persists across container restarts.
5. **Prisma migrations** — For production schema changes, use `npx prisma migrate deploy` instead of `db push`.
