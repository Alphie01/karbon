"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateUserActivity() {
    const session = await auth();
    if (!session?.user?.email) return { success: false };

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { lastSeen: new Date() }
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating user activity:", error);
        return { success: false };
    }
}
