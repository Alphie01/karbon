# EcoPilot — Bütünleşik Kurumsal Sürdürülebilirlik Platformu

EcoPilot, şirketlerin karbon ayak izi, su ayak izi, hibe & teşvik takibi, ESG raporlaması, CRM süreçleri ve sürdürülebilirlik eğitimlerini tek bir dijital platformdan yönetmesini sağlayan kurumsal bir SaaS uygulamasıdır.

---

## Ana Modüller

| Modül | Açıklama |
|---|---|
| **Karbon Ayak İzi** | ISO 14064 standartlarında Scope 1/2/3 emisyon hesaplama ve raporlama |
| **Su Ayak İzi** | ISO 14046 uyumlu mavi/yeşil/gri su ayak izi ölçümü |
| **Hibe & Teşvik Robotu** | Şirkete uygun hibe, teşvik ve kredi programlarını AI ile eşleştirme |
| **CRM & Teklif Yönetimi** | Lead takibi, teklif oluşturma, aktivite takvimi, finansal kayıtlar |
| **Akademi** | Sürdürülebilirlik eğitim videoları, quiz'ler ve interaktif kurslar |
| **Mevzuat Kütüphanesi** | Güncel çevre mevzuatı, yönetmelikler ve rehberler |
| **Danışmanlık** | EkoKompass sihirbazı ve süreç danışmanlığı |
| **Kurumsal Panel** | Şirket yöneticileri için analiz, rapor ve simülasyon ekranları |
| **Yönetim Paneli** | SUPER_ADMIN için kullanıcı, şirket ve modül yönetimi |

---

## Teknoloji Yığını

| Teknoloji | Versiyon |
|---|---|
| Framework | Next.js 16 (App Router + Server Actions) |
| Dil | TypeScript 5 |
| Stil | Tailwind CSS v4 |
| Animasyon | Framer Motion 12 |
| Veritabanı | PostgreSQL (Prisma ORM 5) |
| Authentication | NextAuth.js v5 (beta) |
| UI Primitives | Lucide React, react-hook-form, Zod |
| Runtime | Node.js 20 |

---

## Klasör Yapısı

```
src/
├── app/                     # Next.js App Router rotaları
│   ├── page.tsx             # Root → /home yönlendirmesi
│   ├── home/                # Landing page (herkese açık)
│   ├── login/               # Giriş sayfası
│   ├── carbon/              # Kişisel karbon hesaplama (genel)
│   ├── water/               # Kişisel su hesaplama (genel)
│   ├── robot/               # Hibe robotu (genel)
│   ├── learn/               # Akademi (genel)
│   ├── legislation/         # Mevzuat (genel)
│   ├── consultancy/         # Danışmanlık (genel)
│   ├── corp/                # Kurumsal panel (giriş gerekli)
│   ├── manage/              # Admin panel (ADMIN gerekli)
│   ├── crm/                 # CRM (ADMIN gerekli)
│   └── api/                 # API route handler'ları
├── components/
│   ├── ui/                  # Temel UI bileşenleri
│   ├── layout/              # Header, Sidebar yapıları
│   ├── admin/               # Admin-specific bileşenler
│   ├── corp/                # Corporate panel bileşenleri
│   └── crm/                 # CRM bileşenleri
├── lib/                     # Prisma istemcisi, yardımcı fonksiyonlar
├── actions/                 # Server Actions
├── context/                 # LanguageContext, translations
├── auth.ts                  # NextAuth.js yapılandırması
├── auth.config.ts           # Auth callbacks ve RBAC
└── middleware.ts            # Subdomain routing + erişim koruması
prisma/
└── schema.prisma            # Veritabanı modelleri
public/                      # Statik dosyalar (logo, resimler)
scripts/                     # Seed ve yardımcı scriptler
```

---

## Yerel Geliştirme Kurulumu

### Gereksinimler
- Node.js 20+
- PostgreSQL 14+ (yerel veya Docker)

### Adımlar

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle

# 3. Prisma client oluştur
npx prisma generate

# 4. Veritabanı şemasını uygula
npx prisma db push

# 5. (Opsiyonel) Seed verisi ekle
npx tsx scripts/seed-admin.ts
npx tsx scripts/seed-factors.ts

# 6. Geliştirme sunucusunu başlat
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışır.

---

## Docker ile Çalıştırma

```bash
# 1. .env dosyasını oluştur
cp .env.example .env
# .env içindeki değerleri doldur (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)

# 2. İmajı build et ve servisleri başlat
docker compose build
docker compose up -d

# 3. İlk kurulum: veritabanı şemasını uygula
docker compose exec app npx prisma db push

# 4. Log takibi
docker compose logs -f app
```

Detaylı Docker rehberi için → [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

---

## Ortam Değişkenleri

```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/ecopilot_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32 ile oluştur"
NODE_ENV="production"
```

---

## Prisma Komutları

```bash
npx prisma generate          # Prisma Client oluştur
npx prisma db push           # Şemayı DB'ye uygula (dev)
npx prisma migrate deploy    # Migration uygula (prod)
npx prisma studio            # Veritabanı GUI
npx prisma db seed           # Seed verisi ekle
```

---

## Production Build

```bash
npm run build
npm run start
```

---

## Rol ve Yetkilendirme (RBAC)

| Rol | Erişim |
|---|---|
| `SUPER_ADMIN` | Tüm sistem, kullanıcı yönetimi, tüm şirketler |
| `CORP_ADMIN` | Kendi şirketi, kurumsal panel, kısıtlı yönetim |
| `USER` / `ENGINEER` | Sadece atanmış modüller (`allowedModules` alanı) |

Modül kodları: `CARBON`, `WATER`, `INCENTIVES`, `ACADEMY`, `LIBRARY`, `ALL`

---

## Deployment Seçenekleri

### Docker (Önerilen)
Bkz. [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

### Legacy / Önceki Deployment (Hostinger VPS + PM2)
Üretim sunucusu Hostinger VPS üzerinde Node.js + PM2 + Nginx ile çalışıyordu.
- **URL:** https://beyondlimitsturkiye.tech
- **Process Manager:** `pm2 start npm --name "ecopilot" -- run start`
- **Reverse Proxy:** Nginx (port 80/443, Let's Encrypt SSL)
- Detaylar için: [DEPLOY_README.md](./DEPLOY_README.md)

---

## İlgili Dokümanlar

| Dosya | İçerik |
|---|---|
| [PROJE_YAPISI.md](./PROJE_YAPISI.md) | Teknik mimari ve klasör yapısı |
| [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) | Docker kurulum ve yönetim rehberi |
| [CLEANUP_REPORT.md](./CLEANUP_REPORT.md) | Temizlenen dosyalar ve nedenler |
| [UI_REDESIGN_REPORT.md](./UI_REDESIGN_REPORT.md) | UI/UX değişiklik raporu |
| [DEPLOY_README.md](./DEPLOY_README.md) | Eski VPS deployment notları |

---

*Geliştirici: Monolith Yazılım*
