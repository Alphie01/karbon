import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Usage: npx tsx scripts/assign-crm-role.ts [email]
    const email = process.argv[2] || "mehtap@beyondlimits.com.tr";

    if (!email) {
        console.error("❌ Please provide an email address.");
        process.exit(1);
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error(`❌ User with email ${email} not found.`);
            process.exit(1);
        }

        // Add CRM role if not already present
        const currentRoles = user.roles || "";
        const roleList = currentRoles.split(',').map(r => r.trim()).filter(r => r !== "");

        if (!roleList.includes("CRM")) {
            roleList.push("CRM");
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                roles: roleList.join(',')
            }
        });

        console.log(`✅ Role 'CRM' assigned successfully to ${email}.`);
        console.log(`Current Roles: ${updatedUser.roles}`);
    } catch (error) {
        console.error("❌ Error assigning role:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
