
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@beyondlimits.com";
    console.log("Checking for admin user...");

    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (user) {
        console.log("Found user:", user);
        // Delete it to start fresh
        await prisma.user.delete({ where: { id: user.id } });
        console.log("Deleted existing user.");
    }

    const hash = await bcrypt.hash("admin123", 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            name: "Admin User",
            password: hash,
            roles: "SUPER_ADMIN",
            companyName: "Beyond Limits Admin",
            isActive: true
        } as any,
    });

    console.log("Created new user:", newUser);
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
