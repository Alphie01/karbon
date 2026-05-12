"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";import { revalidatePath } from "next/cache";


// Get all legislation items
export async function getLegislation() {
    try {
        const items = await (prisma as any).legislation.findMany({
            orderBy: { createdAt: "desc" }
        });
        return items;
    } catch (error) {
        console.error("Get Legislation Error:", error);
        return [];
    }
}

// Add new legislation
export async function addLegislation(formData: FormData) {
    const session = await auth();
    // In real app, check for Admin role here

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const summary = formData.get("summary") as string;
    const date = formData.get("date") as string;
    const url = formData.get("url") as string;

    if (!title || !category) {
        return { success: false, error: "Başlık ve kategori zorunludur." };
    }

    try {
        await (prisma as any).legislation.create({
            data: {
                title,
                category,
                summary,
                date,
                url
            }
        });

        revalidatePath("/corp/legislation");
        revalidatePath("/manage/legislation");
        return { success: true };
    } catch (error) {
        console.error("Add Legislation Error:", error);
        return { success: false, error: "Ekleme başarısız." };
    }
}

// Delete legislation
export async function deleteLegislation(id: string) {
    try {
        await (prisma as any).legislation.delete({
            where: { id }
        });

        revalidatePath("/corp/legislation");
        revalidatePath("/manage/legislation");
        return { success: true };
    } catch (error) {
        console.error("Delete Legislation Error:", error);
        return { success: false, error: "Silme başarısız." };
    }
}

export async function getLegislationCategories() {
    try {
        return await (prisma as any).legislationCategory.findMany({
            orderBy: { name: "asc" }
        });
    } catch (error) {
        console.error("Get Categories Error:", error);
        return [];
    }
}

export async function updateLegislationCategory(formData: FormData) {
    const id = formData.get("id") as string;
    const description = formData.get("description") as string;
    const name = formData.get("name") as string;

    if (!id) return { success: false };

    try {
        await (prisma as any).legislationCategory.update({
            where: { id },
            data: {
                description,
                ...(name ? { name } : {})
            }
        });
        revalidatePath("/manage/legislation");
        revalidatePath("/corp/legislation");
        return { success: true };
    } catch (error) {
        console.error("Update Category Error:", error);
        return { success: false };
    }
}
