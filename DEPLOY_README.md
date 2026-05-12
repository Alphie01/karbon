# BEYOND LIMITS TÜRKİYE - KURULUM VE TAŞIMA KILAVUZU

Bu doküman, projenin Hostinger veya herhangi bir Ubuntu VPS (AWS, DigitalOcean, Vultr vb.) üzerine sıfırdan nasıl kurulacağını açıklar.

## 1. Sunucu Hazırlığı (İlk Kez)

Yeni bir sunucu aldığınızda, temel bağımlılıkları yüklemek için `scripts/setup-server.sh` betiğini çalıştırın:

```bash
chmod +x scripts/setup-server.sh
sudo ./scripts/setup-server.sh
```

Bu betik şunları yükleyecektir:

- Node.js 20+
- PM2 (Süreç Yöneticisi)
- Nginx (Web Sunucusu)
- Certbot (SSL için)
- UFW (Güvenlik Duvarı)

## 2. Veritabanı Kurulumu (Docker ile)

Sunucuda Docker yüklü ise (yüklemek için `apt install docker-compose`), veritabanını tek komutla başlatabilirsiniz:

```bash
docker-compose up -d
```

## 3. Uygulama Yayına Alma (Deploy)

1. **Dosyaları Yükleyin**: Proje dosyalarını `/var/www/beyondlimitsturkiye.tech` altına kopyalayın.
2. **Bağımlılıkları Yükleyin**:

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Prisma Şemasını Güncelleyin**:

   ```bash
   npx prisma generate
   ```

4. **PM2 ile Başlatın**:

   ```bash
   pm2 start ecosystem.remote.js
   ```

## 4. Nginx ve SSL Yapılandırması

Nginx şablonunu `/etc/nginx/sites-available/beyondlimitsturkiye.tech` olarak kopyalayın ve sembolik link oluşturun:

```bash
sudo ln -s /etc/nginx/sites-available/beyondlimitsturkiye.tech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

SSL sertifikası almak için:
```bash
sudo certbot --nginx -d yourdomain.com
```

## 5. Önemli Erişim Bilgileri (Backup)

- **Database User**: `blt_user`
- **Database Pass**: `Blt2026.db#Key*`
- **PM2 App Name**: `blt-platform`

---
*Not: .env dosyanızın yedeğini güvenli bir yerde saklamayı unutmayın.*
