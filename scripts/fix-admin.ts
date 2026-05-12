
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up users...");
    try {
        // Delete all users to ensure a clean state
        await prisma.user.deleteMany();
        console.log("All users deleted.");
    } catch (e) {
        console.log("Delete failed:", e);
    }

    const email = "admin@beyondlimits.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Creating admin user: ${email}`);

    const user = await prisma.user.create({
        data: {
            email,
            name: "Admin User",
            password: hashedPassword,
            roles: "SUPER_ADMIN", // Changed from role
            companyName: "Beyond Limits Admin",
        },
    });

    console.log("Admin user created:", user);
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
