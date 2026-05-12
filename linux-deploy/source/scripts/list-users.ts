
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Connecting to database...");
    try {
        const users = await prisma.user.findMany();
        console.log("User count:", users.length);
        users.forEach(u => {
            console.log(`- ${u.email} (Roles: ${u.roles}, ID: ${u.id})`);
        });
    } catch (e) {
        console.error("Failed to fetch users:", e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
