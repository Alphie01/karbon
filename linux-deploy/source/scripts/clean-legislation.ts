import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetLegislationCategories() {
    console.log("🧹 Veritabanındaki eski mevzuatları ve kategorileri temizliyorum...");

    // Tüm mevzuat linkleri ve kategoriler veritabanından siliniyor
    const deleteLegislation = await prisma.legislation.deleteMany({});
    console.log(`🗑️ ${deleteLegislation.count} mevzuat bağlantısı silindi.`);

    const deleteCategories = await prisma.legislationCategory.deleteMany({});
    console.log(`🗑️ ${deleteCategories.count} kategori silindi.`);

    console.log("✅ Veritabanı temizlendi! Lütfen sync-legislation bitiş noktasını yeniden çalıştırarak yeşil kategorilerin temiz bir şekilde inmesini sağlayın.");
}

resetLegislationCategories()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
