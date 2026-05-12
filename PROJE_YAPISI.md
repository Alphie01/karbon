# 🏗️ Proje Yapısı ve Mimari Dokümantasyonu

Bu belge, **Sürdürülebilirlik Asistanı (BLT)** projesinin teknik yapısını, klasör düzenini ve kullanılan teknolojilerin nasıl organize edildiğini açıklar. Geliştiricilerin projeye hızlıca adapte olabilmesi için hazırlanmıştır.

## 📂 Genel Dizin Yapısı

Proje kök dizinindeki temel klasörler ve amaçları şöyledir:

- **src/**: Uygulamanın kaynak kodlarını barındıran ana dizin.
- **prisma/**: Veritabanı şeması (`schema.prisma`) ve migrasyon dosyaları burada bulunur.
- **public/**: Resimler, logolar ve diğer statik dosyalar.
- **scripts/**: Veritabanı tohumlama (seed), bakım ve dağıtım için yardımcı betikler.
- **.env**: Veritabanı bağlantı bilgileri ve gizli anahtarların bulunduğu (git'e atılmayan) dosya.
- **next.config.ts**: Next.js çerçevesinin konfigürasyon dosyası.

---

## 💻 Kaynak Kod Yapısı (`src/`)

Uygulamanın kalbi `src` klasörüdür. Next.js 15 App Router mimarisi kullanılmaktadır.

### 1. `src/app/` (Sayfalar ve Rotalar)
Next.js App Router yapısında, klasör isimleri URL yollarını belirler.
- **app/page.tsx**: Karşılama sayfası (Landing page).
- **app/login/**: Kullanıcı giriş sayfası.
- **app/home/**: Giriş yapmış kullanıcıların yönlendirildiği ana gösterge paneli.
- **app/manage/**: Admin paneli sayfaları.
    - `/manage/users`: Kullanıcı yönetimi.
    - `/manage/companies`: Şirket yönetimi.
    - `/manage/modules`: Modül erişim ayarları.
- **app/corp/**: Kurumsal paneller (Şirket yöneticileri için).
- **app/carbon/**: Karbon ayak izi hesaplama modülü.
- **app/water/**: Su ayak izi hesaplama modülü.
- **app/robot/**: Hibe ve teşvik robotu.
- **app/api/**: Backend API uç noktaları (Route Handlers).

### 2. `src/components/` (Bileşenler)
Uygulama genelinde tekrar kullanılan UI parçaları.
- **ui/**: Düğmeler, form elemanları, kartlar gibi temel bileşenler (Genellikle Shadcn/ui tabanlı).
- **layout/**: Üst menü (Header), yan menü (Sidebar) gibi yapısal bileşenler.
- **auth/**: Giriş formları, korumalı alan sarmalayıcıları.

### 3. `src/lib/` (Yardımcı Kütüphaneler)
Uygulama genelinde kullanılan yardımcı fonksiyonlar ve konfigürasyonlar.
- **prisma.ts**: Veritabanı bağlantısını sağlayan Prisma istemcisi.
- **utils.ts**: Genel yardımcı fonksiyonlar (tarih formatlama, sınıf birleştirme vb.).
- **validations/**: Form doğrulama şemaları (Zod ile).

### 4. `src/actions/` (Server Actions)
Sunucu tarafında çalışan ve güvenli işlemler yapan fonksiyonlar. API rotaları yerine doğrudan bileşenlerden çağrılabilirler.
- Veritabanı ekleme/güncelleme/silme işlemleri burada yapılır.

### 5. `src/auth.ts` & `src/middleware.ts`
- **auth.ts**: NextAuth.js konfigürasyonu (Kimlik doğrulama ayarları).
- **middleware.ts**: Sayfa erişimlerini kontrol eden ve yetkisiz girişleri engelleyen ara katman.

---

## 🛢️ Veritabanı ve Prisma

Veritabanı yönetimi için **Prisma ORM** kullanılmaktadır.
- **`prisma/schema.prisma`**: Veritabanı tablolarını (Modelleri) tanımladığımız dosya.
    - `User`: Kullanıcılar.
    - `Company`: Şirketler.
    - `CarbonEntry`, `WaterReport`: Modül verileri.
- Veritabanı değişiklikleri için `npx prisma db push` komutu kullanılır.

## 🔑 Yetkilendirme (RBAC)

Rol tabanlı yetkilendirme sistemi mevcuttur.
- **SUPER_ADMIN**: Sistemin tamamına erişir.
- **CORP_ADMIN**: Kendi şirketini yönetir.
- **USER/ENGINEER**: Sadece atandığı modüllere erişir.

Bu yapı, projenin ölçeklenebilir ve bakımı kolay olmasını sağlamak amacıyla kurulmuştur.
