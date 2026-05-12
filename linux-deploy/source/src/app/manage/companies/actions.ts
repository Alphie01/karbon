"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCompany(formData: FormData) {
    const name = formData.get("name") as string;
    const subscriptionStatus = formData.get("subscriptionStatus") as string || "ACTIVE";
    // purchasedModules can be handled similarly to roles if needed, for now default ALL or from form

    try {
        await prisma.company.create({
            data: {
                name,
                subscriptionStatus,
                purchasedModules: "ALL" // Default for now
            }
        });
        revalidatePath("/manage/companies");
        return { success: true };
    } catch (error) {
        console.error("Error creating company:", error);
        return { success: false, error: "Şirket oluşturulamadı." };
    }
}

export async function deleteCompany(companyId: string) {
    try {
        await prisma.company.delete({
            where: { id: companyId }
        });
        revalidatePath("/manage/companies");
        return { success: true };
    } catch (error) {
        console.error("Error deleting company:", error);
        return { success: false, error: "Şirket silinemedi. Kullanıcısı olan şirketler silinemez." };
    }
}
