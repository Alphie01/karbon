import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseFactors = [
    { name: "Elektrik Tüketimi (TR Ortalama)", scope: "SCOPE_2", value: 0.432, unit: "kWh", sourceBase: "TEİAŞ / EPA" },
    { name: "Doğalgaz (Şebeke)", scope: "SCOPE_1", value: 2.02, unit: "m3", sourceBase: "DEFRA" },
    { name: "Motorin/Dizel (Araç Filosu)", scope: "SCOPE_1", value: 2.68, unit: "L", sourceBase: "DEFRA" },
    { name: "Benzin (Araç Filosu)", scope: "SCOPE_1", value: 2.31, unit: "L", sourceBase: "DEFRA" },
    { name: "Şebeke Suyu Temini", scope: "SCOPE_3", value: 0.149, unit: "m3", sourceBase: "DEFRA" },
    { name: "Linyit Kömürü (Yakma)", scope: "SCOPE_1", value: 1.05, unit: "kg", sourceBase: "IPCC" },
    { name: "LPG (Araç/Isınma)", scope: "SCOPE_1", value: 1.55, unit: "L", sourceBase: "DEFRA" },
    { name: "Personel İşe Gidiş Geliş (Ort. Dizel Araç)", scope: "SCOPE_3", value: 0.170, unit: "km", sourceBase: "DEFRA" },
];

const globalFactors: any[] = [];
for (const year of [2024, 2025, 2026]) {
    for (const bf of baseFactors) {
        let source = bf.sourceBase;
        if (source === "DEFRA") source = `DEFRA ${year}`;
        globalFactors.push({
            name: bf.name,
            scope: bf.scope,
            value: bf.value,
            unit: bf.unit,
            year: year,
            source: source,
            isCustom: false,
        });
    }
}

async function main() {
    console.log("Seeding global emission factors...");

    // First, let's just create global ones if they don't exist
    // Alternatively, we can clear the existing global ones and re-insert them to update
    await prisma.emissionFactor.deleteMany({
        where: {
            isCustom: false,
        }
    });

    for (const factor of globalFactors) {
        await prisma.emissionFactor.create({
            data: factor
        });
        console.log(`Added: ${factor.name} -> ${factor.value} kgCO2e/${factor.unit}`);
    }

    console.log("Done! Global factors updated successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
