
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            roles: {
                contains: "SUPER_ADMIN"
            }
        },
        include: {
            company: true
        }
    });
    console.log("Super Admins:", JSON.stringify(users, null, 2));

    // If no company, let's create one or assign one
    if (users.length > 0 && !users[0].companyId) {
        console.log("Super Admin has no company. assigning...");
        // Find a company
        let company = await prisma.company.findFirst();
        if (!company) {
            console.log("No company found. Creating 'Demo Corp'...");
            company = await prisma.company.create({
                data: {
                    name: "Demo Corp",
                    purchasedModules: "ALL",
                    subscriptionStatus: "ACTIVE"
                }
            });
        }

        await prisma.user.update({
            where: { id: users[0].id },
            data: { companyId: company.id }
        });
        console.log("Assigned company", company.name, "to user", users[0].email);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
