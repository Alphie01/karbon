import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@beyondlimits.com";
    const newPassword = "Blt_Admin_2026!"; // Temporary secure password

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword
            }
        });

        console.log(`✅ Password reset successfully for ${email}.`);
        console.log(`New Password: ${newPassword}`);
        console.log("Please change this password after logging in.");
    } catch (error) {
        console.error("❌ Error resetting password:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
