import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting RBAC Seeding...");

    // 1. Cleanup existing data (optional but recommended for clean state)
    // Note: We are nuking everything to ensure clean relations.
    try {
        await prisma.membershipRequest.deleteMany();
        await prisma.video.deleteMany();
        await prisma.user.deleteMany();
        await prisma.company.deleteMany();
        console.log("🧹 Cleaned up existing data.");
    } catch (e) {
        console.log("⚠️ Access denied or tables empty, skipping cleanup.");
    }

    const passwordHash = await bcrypt.hash("123456", 10);

    // 2. Create Companies
    const demoCorp = await prisma.company.create({
        data: {
            name: "Demo Corp",
            purchasedModules: "ALL", // "CARBON,WATER,INCENTIVES,ACADEMY,LIBRARY"
            subscriptionStatus: "ACTIVE",
        }
    });
    console.log("🏢 Created Company: Demo Corp");

    const academyCorp = await prisma.company.create({
        data: {
            name: "Beyond Limits Academy",
            purchasedModules: "ACADEMY",
            subscriptionStatus: "ACTIVE",
        }
    });
    console.log("🏢 Created Company: Beyond Limits Academy");


    // 3. Create Users based on Matrix
    const users = [
        // 1. Superior Roles
        {
            email: "admin@beyondlimits.com",
            name: "Super Admin",
            roles: "SUPER_ADMIN",
            allowedModules: "ALL",
            companyId: null, // Platform owner
        },
        {
            email: "ata@beyondlimits.com",
            name: "Ata Ertürk",
            roles: "SUPER_ADMIN",
            allowedModules: "ALL",
            companyId: null,
        },
        {
            email: "ibrahim@beyondlimits.com",
            name: "İbrahim Nebili",
            roles: "SUPER_ADMIN",
            allowedModules: "ALL",
            companyId: null,
        },
        {
            email: "elif@beyondlimits.com",
            name: "Elif Nebili",
            roles: "SUPER_ADMIN",
            allowedModules: "ALL",
            companyId: null,
        },
        // 2. Corporate Roles (Demo Corp)
        {
            email: "gm@demo-corp.com",
            name: "Genel Müdür",
            roles: "EXECUTIVE",
            allowedModules: "CARBON,WATER,INCENTIVES",
            companyId: demoCorp.id,
        },
        {
            email: "manager@demo-corp.com",
            name: "Şirket Yöneticisi",
            roles: "CORP_ADMIN",
            allowedModules: "ALL",
            companyId: demoCorp.id,
        },
        {
            email: "engineer@demo-corp.com",
            name: "Çevre Mühendisi",
            roles: "ENGINEER",
            allowedModules: "CARBON,WATER",
            companyId: demoCorp.id,
        },
        {
            email: "staff@demo-corp.com",
            name: "Saha Personeli",
            roles: "DATA_ENTRY",
            allowedModules: "CARBON,WATER",
            companyId: demoCorp.id,
        },
        {
            email: "student@demo-corp.com",
            name: "Kurumsal Öğrenci",
            roles: "STUDENT",
            allowedModules: "ACADEMY",
            companyId: demoCorp.id,
        },
        {
            email: "grants@demo-corp.com",
            name: "Teşvik Uzmanı",
            roles: "GRANT_VIEWER",
            allowedModules: "INCENTIVES",
            companyId: demoCorp.id,
        },
    ];

    for (const u of users) {
        await prisma.user.create({
            data: {
                email: u.email,
                name: u.name,
                password: passwordHash,
                roles: u.roles,
                allowedModules: u.allowedModules,
                companyId: u.companyId,
                companyName: u.companyId === demoCorp.id ? "Demo Corp" : (u.companyId === academyCorp.id ? "Beyond Limits Academy" : "Platform"),
            }
        });
        console.log(`👤 Created User: ${u.email} (${u.roles})`);
    }

    console.log("✅ Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
