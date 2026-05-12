"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createUser(prevState: any, formData: FormData) {
    const session = await auth();

    // Check if current user is ADMIN
    const userRoles = (session?.user as any)?.roles || "";
    if (!userRoles.includes("SUPER_ADMIN")) {
        return { message: "Unauthorized", success: false };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const companyName = formData.get("companyName") as string;
    const role = formData.get("role") as string;

    if (!email || !password || !name) {
        return { message: "Missing required fields", success: false };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                companyName,
                roles: role || "STUDENT",
            },
        });

        revalidatePath("/manage");
        return { message: "User created successfully!", success: true };
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to create user.", success: false };
    }
}
