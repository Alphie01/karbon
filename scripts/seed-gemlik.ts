import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Gemlik Belediyesi Demo Data (GHG/ISO Standards)...");

    // 1. Create or Find Company
    let comp = await prisma.company.findFirst({
        where: { name: "Gemlik Belediyesi" }
    });

    if (!comp) {
        comp = await prisma.company.create({
            data: {
                name: "Gemlik Belediyesi",
                purchasedModules: "ALL",
                subscriptionStatus: "ACTIVE",
            }
        });
        console.log("Created Company:", comp.name);
    } else {
        console.log("Found Company:", comp.name);
    }

    // 2. Create User
    const email = "baskan@gemlik.bel.tr";
    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
        const hash = await bcrypt.hash("gemlik123", 10);
        user = await prisma.user.create({
            data: {
                email,
                name: "Belediye Başkanı",
                password: hash,
                roles: "ADMIN",
                companyId: comp.id,
                companyName: comp.name,
                isActive: true,
                allowedModules: "ALL"
            } as any
        });
        console.log("Created User:", user.email);
    }

    // 3. Create Business Processes
    const processNames = [
        "Park ve Bahçeler Sulama",
        "Belediye Hizmet Binası Kullanımı",
        "Araç Yıkama Tesisleri",
        "Çöp Toplama Filosu Operasyonu",
        "Atık Su Arıtma Tesisi (Arıtma & Deşarj)"
    ];
    const processes = [];
    for (const pName of processNames) {
        let p = await prisma.businessProcess.findFirst({ where: { title: pName, companyId: comp.id } });
        if (!p) {
            p = await prisma.businessProcess.create({
                data: {
                    title: pName,
                    companyId: comp.id,
                    description: `${pName} için kaynak tüketimleri.`
                }
            });
            console.log("Created Process:", p.title);
        }
        processes.push(p);
    }

    // 4. Create Carbon Entries (GHG Protocol Scopes) - 2025 and 2026
    console.log("Cleaning old carbon entries for Gemlik...");
    await prisma.carbonEntry.deleteMany({ where: { companyId: comp.id } });

    // Find existing global emission factors
    const efElectricity = await prisma.emissionFactor.findFirst({ where: { name: { contains: "Elektrik" }, isCustom: false } });
    const efDiesel = await prisma.emissionFactor.findFirst({ where: { name: { contains: "Dizel" }, isCustom: false } });
    const efGas = await prisma.emissionFactor.findFirst({ where: { name: { contains: "Doğalgaz" }, isCustom: false } });

    const carbonDataRaw = [
        // 2025 Data (Higher)
        { year: 2025, scope: "SCOPE_1", category: "Sabit Yanma", activity: "Jeneratör & Isınma (Doğalgaz)", amount: 95000, unit: "m³", ef: efGas?.value || 1.9, process: "Belediye Hizmet Binası Kullanımı" },
        { year: 2025, scope: "SCOPE_1", category: "Hareketli Yanma", activity: "Çöp Toplama Filosu (Dizel)", amount: 62000, unit: "L", ef: efDiesel?.value || 2.68, process: "Çöp Toplama Filosu Operasyonu" },
        { year: 2025, scope: "SCOPE_2", category: "Satın Alınan Enerji", activity: "Elektrik Tüketimi (Şebeke)", amount: 250000, unit: "kWh", ef: efElectricity?.value || 0.432, process: "Belediye Hizmet Binası Kullanımı" },
        { year: 2025, scope: "SCOPE_3", category: "Personel Ulaşımı", activity: "Servis Araçları (Mesafe Bazlı)", amount: 15000, unit: "km", ef: 0.18, process: "Belediye Hizmet Binası Kullanımı" },

        // 2026 Data (Improved/Lower)
        { year: 2026, scope: "SCOPE_1", category: "Sabit Yanma", activity: "Jeneratör & Isınma (Doğalgaz)", amount: 82000, unit: "m³", ef: efGas?.value || 1.9, process: "Belediye Hizmet Binası Kullanımı" },
        { year: 2026, scope: "SCOPE_1", category: "Hareketli Yanma", activity: "Çöp Toplama Filosu (Dizel)", amount: 54000, unit: "L", ef: efDiesel?.value || 2.68, process: "Çöp Toplama Filosu Operasyonu" },
        { year: 2026, scope: "SCOPE_2", category: "Satın Alınan Enerji", activity: "Elektrik Tüketimi (Şebeke)", amount: 210000, unit: "kWh", ef: efElectricity?.value || 0.432, process: "Belediye Hizmet Binası Kullanımı" },
        { year: 2026, scope: "SCOPE_3", category: "Personel Ulaşımı", activity: "Servis Araçları (Mesafe Bazlı)", amount: 14000, unit: "km", ef: 0.18, process: "Belediye Hizmet Binası Kullanımı" }
    ];

    for (const c of carbonDataRaw) {
        await prisma.carbonEntry.create({
            data: {
                companyId: comp.id,
                scope: c.scope,
                category: c.category,
                activity: c.activity,
                amount: c.amount,
                unit: c.unit,
                emissionFactor: c.ef,
                calculatedEmission: c.amount * c.ef,
                date: `${c.year}-06-15`,
                status: "FINAL",
                businessProcessId: processes.find(p => p.title === c.process)?.id
            }
        });
    }
    console.log("Seeded Carbon Entries for 2025 & 2026");

    // 5. Create Water Reports (2025 & 2026)
    console.log("Cleaning old water reports for Gemlik...");
    await prisma.waterReport.deleteMany({ where: { companyId: comp.id } });

    // 2025 Water Report
    await prisma.waterReport.create({
        data: {
            companyId: comp.id,
            year: 2025,
            period: "Annual",
            orgName: "Gemlik Belediyesi Çevre Koruma Daire Bşk.",
            status: "FINAL",
            totalWater: 720000,
            blueWater: 180000,
            greenWater: 480000,
            greyWater: 60000,
            blueMethod: "NetConsumption",
            greenMethod: "Manual",
            sources: {
                create: [
                    { type: "Şebeke", name: "BUSKİ Şebeke Suyu", withdraw: 190000, return: 25000 },
                    { type: "Yeraltı", name: "Belediye Park Kuyuları", withdraw: 15000, return: 0 },
                ]
            },
            processes: {
                create: [
                    { date: "2025-01-01", name: "Genel Kullanım", type: "ProcessSum", input: 12000, output: 9000, businessProcessId: processes.find(p => p.title === "Belediye Hizmet Binası Kullanımı")?.id },
                    { date: "2025-02-01", name: "Park Bahçe Sulama", type: "ProcessSum", input: 35000, output: 3500, businessProcessId: processes.find(p => p.title === "Park ve Bahçeler Sulama")?.id }
                ]
            }
        }
    });

    // 2026 Water Report (Improved)
    await prisma.waterReport.create({
        data: {
            companyId: comp.id,
            year: 2026,
            period: "Annual",
            orgName: "Gemlik Belediyesi Çevre Koruma Daire Bşk.",
            basin: "Marmara Havzası",
            methodology: "ISO 14046",
            boundary: "Belediye Sınırları Mülki İdare",
            blueDirect: 0,
            greenDirect: 450000,
            blueMethod: "NetConsumption",
            greenMethod: "Manual",
            status: "FINAL",
            totalWater: 655000,
            blueWater: 155000,
            greenWater: 450000,
            greyWater: 50000,
            sources: {
                create: [
                    { type: "Şebeke", name: "BUSKİ Şebeke Suyu", withdraw: 160000, return: 20000 },
                    { type: "Yeraltı", name: "Belediye Park Kuyuları", withdraw: 15000, return: 0 },
                ]
            },
            processes: {
                create: [
                    { date: "2026-01-01", name: "Araç Yıkama", type: "ProcessSum", input: 8000, output: 6000, product: 1200, productUnit: "Araç", businessProcessId: processes.find(p => p.title === "Araç Yıkama Tesisleri")?.id },
                    { date: "2026-02-01", name: "Park Bahçe Sulama", type: "ProcessSum", input: 25000, output: 2500, product: 1, productUnit: "Sezon", businessProcessId: processes.find(p => p.title === "Park ve Bahçeler Sulama")?.id }
                ]
            },
            greyEntries: {
                create: [
                    {
                        date: "2026-03-01",
                        param: "KİMYASAL OKSİJEN İHTİYACI (KOİ)",
                        Q: 45000,
                        Ceff: 250,
                        Cnat: 10,
                        Cmax: 100,
                        wfgrey: 50000,
                        note: "Belediye Deşarj Noktası Ölçümü"
                    }
                ]
            }
        }
    });
    console.log("Seeded Multi-Year Water Reports (2025 & 2026)");

    // 6. Create Demo Equipments / IoT Devices attached to Processes
    // TO BE REMOVED ONCE IN PRODUCTION: IoT DEMO DATA
    console.log("Seeding Demo IoT Equipment...");
    const buildingProcess = processes.find(p => p.title === "Belediye Hizmet Binası Kullanımı");
    if (buildingProcess) {
        await prisma.facilityEquipment.createMany({
            data: [
                {
                    businessProcessId: buildingProcess.id,
                    name: "Ana Jeneratör (Dizel)",
                    type: "GENERATOR",
                    hasIoT: true,
                    iotStatus: "ONLINE",
                    currentDraw: 45.5,
                    unit: "kVA"
                },
                {
                    businessProcessId: buildingProcess.id,
                    name: "HVAC İklimlendirme Sistemi",
                    type: "MACHINE",
                    hasIoT: true,
                    iotStatus: "ONLINE",
                    currentDraw: 120.0,
                    unit: "kW"
                }
            ]
        });
    }

    const fleetProcess = processes.find(p => p.title === "Çöp Toplama Filosu Operasyonu");
    if (fleetProcess) {
        await prisma.facilityEquipment.create({
            data: {
                businessProcessId: fleetProcess.id,
                name: "Elektrikli Çöp Toplama Araçları Şarj İstasyonu",
                type: "VEHICLE",
                hasIoT: true,
                iotStatus: "ONLINE",
                currentDraw: 350.5,
                unit: "kW"
            }
        });
    }

    console.log("Gemlik Belediyesi seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
