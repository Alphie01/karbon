const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Initializing Mail Accounts...");

    // 1. info@beyondlimitsturkiye.tech
    await prisma.mailAccount.upsert({
        where: { email: "info@beyondlimitsturkiye.tech" },
        update: {},
        create: {
            email: "info@beyondlimitsturkiye.tech",
            username: "info"
        }
    });

    // 2. elifn@beyondlimitsturkiye.tech
    await prisma.mailAccount.upsert({
        where: { email: "elifn@beyondlimitsturkiye.tech" },
        update: {},
        create: {
            email: "elifn@beyondlimitsturkiye.tech",
            username: "elifn"
        }
    });

    console.log("Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
