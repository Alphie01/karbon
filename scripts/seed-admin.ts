
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@beyondlimits.com";
    const hashedPassword = await bcrypt.hash("admin123", 10);

    console.log("Resetting admin user...");

    try {
        // Delete any existing user with this email to avoid unique constraint errors
        await (prisma as any).user.deleteMany({
            where: { email: email },
        });
        console.log("Cleanup complete.");
    } catch (e) {
        console.log("Cleanup warning (non-fatal):", e);
    }

    console.log("Creating new admin user...");
    try {
        const user = await (prisma as any).user.create({
            data: {
                email,
                name: "Admin User",
                password: hashedPassword,
                roles: "SUPER_ADMIN", // Changed from role
                companyName: "Beyond Limits Admin",
            },
        });
        console.log("Admin user created successfully:", user.email);
    } catch (e) {
        console.error("Failed to create admin:", e);
        throw e;
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
