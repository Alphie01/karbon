
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const company = await prisma.company.findFirst({
        where: { name: "Beyond Limits Academy" }
    });

    if (company) {
        await prisma.company.update({
            where: { id: company.id },
            data: { purchasedModules: "ALL" }
        });
        console.log("Updated 'Beyond Limits Academy' to have ALL modules.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
