import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "mehtap@beyondlimits.com.tr";
    const password = "Mehtap123!"; // Default password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                roles: "SUPER_ADMIN",
                isActive: true,
            },
            create: {
                email,
                name: "Mehtap",
                password: hashedPassword,
                roles: "SUPER_ADMIN",
                allowedModules: "ALL",
                isActive: true,
            },
        });

        console.log("✅ User 'Mehtap' created or updated successfully.");
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log("⚠️ Please remember to change the password after the first login.");
    } catch (error) {
        console.error("❌ Error creating user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
