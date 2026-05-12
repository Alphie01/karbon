const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10);

    console.log("Seeding Companies...");

    const demoCorp = await prisma.company.upsert({
        where: { id: 'demo-corp-id' },
        update: {},
        create: {
            id: 'demo-corp-id',
            name: 'Demo Corp',
            purchasedModules: 'ALL',
            subscriptionStatus: 'ACTIVE'
        }
    });

    const erhanCorp = await prisma.company.upsert({
        where: { id: 'erhan-corp-id' },
        update: {},
        create: {
            id: 'erhan-corp-id',
            name: 'Erhan Geri Dönüşüm',
            purchasedModules: 'ALL',
            subscriptionStatus: 'ACTIVE'
        }
    });

    console.log("Seeding Users...");

    try {
        await prisma.user.upsert({
            where: { email: 'admin@beyondlimits.com' },
            update: { roles: 'SUPER_ADMIN', companyId: null },
            create: {
                email: 'admin@beyondlimits.com',
                name: 'Super Admin',
                password: hashedPassword,
                roles: 'SUPER_ADMIN',
                companyId: null
            },
        });
        console.log("Super Admin seeded.");
    } catch (e) {
        console.error("Error seeding Super Admin:", e);
    }

    try {
        await prisma.user.upsert({
            where: { email: 'demo@demo.com' },
            update: { companyId: demoCorp.id, roles: 'CORP_ADMIN' },
            create: {
                email: 'demo@demo.com',
                name: 'Demo Admin',
                password: hashedPassword,
                roles: 'CORP_ADMIN',
                companyId: demoCorp.id,
            },
        });
        console.log("Demo Admin seeded.");
    } catch (e) {
        console.error("Error seeding Demo Admin:", e);
    }

    try {
        await prisma.user.upsert({
            where: { email: 'admin@erhan.com' },
            update: { companyId: erhanCorp.id, roles: 'CORP_ADMIN' },
            create: {
                email: 'admin@erhan.com',
                name: 'Erhan Admin',
                password: hashedPassword,
                roles: 'CORP_ADMIN',
                companyId: erhanCorp.id,
            },
        });
        console.log("Erhan Admin seeded.");
    } catch (e) {
        console.error("Error seeding Erhan Admin:", e);
    }

    try {
        await prisma.user.upsert({
            where: { email: 'user@erhan.com' },
            update: { companyId: erhanCorp.id, roles: 'USER' },
            create: {
                email: 'user@erhan.com',
                name: 'Erhan Personel',
                password: hashedPassword,
                roles: 'USER',
                companyId: erhanCorp.id,
            },
        });
        console.log("Erhan User seeded.");
    } catch (e) {
        console.error("Error seeding Erhan User:", e);
    }

    console.log("Seeding Business Processes...");
    try {
        // Check if exists first to avoid duplicate errors if I run multiple times and title unique? No title is not unique.
        // But let's just create one.
        await prisma.businessProcess.create({
            data: {
                companyId: erhanCorp.id,
                title: 'Plastik Ayrıştırma Hattı A',
                description: 'Gelen karışık plastiklerin türlerine göre ayrıştırıldığı ana bant süreci.',
            }
        });
        console.log("Business Process seeded.");
    } catch (e) {
        console.error("Error seeding Business Process:", e);
    }

    console.log("Seeding completed.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
