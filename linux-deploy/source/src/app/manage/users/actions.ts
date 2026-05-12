"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roles = formData.get("roles") as string || "STUDENT";
    const allowedModules = formData.get("allowedModules") as string || "ALL";
    const companyId = formData.get("companyId") as string;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles,
                allowedModules,
                companyId: companyId || null,
                isActive: true
            } as any
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: "Kullanıcı oluşturulamadı." };
    }
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !currentStatus } as any,
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error toggling user status:", error);
        return { success: false, error: "Durum değiştirilemedi." };
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Kullanıcı silinemedi." };
    }
}

export async function updateUserRole(userId: string, formData: FormData) {
    const roles = formData.get("roles") as string;
    const allowedModules = formData.get("allowedModules") as string;
    const companyId = formData.get("companyId") as string;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                roles: roles,
                allowedModules: allowedModules,
                companyId: companyId === "NO_COMPANY" ? null : companyId
            } as any,
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: "Kullanıcı güncellenemedi." };
    }
}

export async function approveRequest(requestId: string) {
    try {
        const request = await prisma.membershipRequest.findUnique({ where: { id: requestId } });
        if (!request) return { success: false, error: "Talep bulunamadı" };

        // Transaction: Create Company -> Create User -> Update Request
        await prisma.$transaction(async (tx: any) => {
            const company = await tx.company.create({
                data: {
                    name: request.companyName,
                    subscriptionStatus: "ACTIVE",
                    purchasedModules: "ALL"
                }
            });

            // Create temporary password
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            await tx.user.create({
                data: {
                    name: request.contactName,
                    email: request.email,
                    password: hashedPassword,
                    companyId: company.id,
                    roles: "CORP_ADMIN",
                    allowedModules: "ALL",
                    isActive: true
                } as any
            });

            await tx.membershipRequest.update({
                where: { id: requestId },
                data: { status: "APPROVED" }
            });
        });

        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error approving request:", error);
        return { success: false, error: "Talep onaylanamadı." };
    }
}

export async function rejectRequest(requestId: string) {
    try {
        await prisma.membershipRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" }
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error rejecting request:", error);
        return { success: false, error: "Talep reddedilemedi." };
    }
}

export async function deleteRequest(requestId: string) {
    try {
        await prisma.membershipRequest.delete({
            where: { id: requestId }
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting request:", error);
        return { success: false, error: "Talep silinemedi." };
    }
}

export async function updateUserPassword(userId: string, formData: FormData) {
    const password = formData.get("password") as string;

    if (!password || password.length < 6) {
        return { success: false, error: "Parola en az 6 karakter olmalıdır." };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword } as any,
        });
        revalidatePath("/manage/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false, error: "Parola güncellenemedi." };
    }
}
