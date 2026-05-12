"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Carbon Entries ---

export async function createCarbonEntry(data: any) {
    try {
        await prisma.carbonEntry.create({
            data: {
                companyId: data.companyId,
                scope: data.scope,
                category: data.category,
                activity: data.activity,
                amount: parseFloat(data.amount),
                unit: data.unit,
                emissionFactor: parseFloat(data.emissionFactor),
                calculatedEmission: parseFloat(data.emissionStart), // or calculate here
                date: data.date,
                description: data.note,
                businessProcessId: data.businessProcessId,
                status: "APPROVED" // Auto-approve for now
            }
        });
        revalidatePath("/manage/carbon");
        return { success: true };
    } catch (error) {
        console.error("Error creating carbon entry:", error);
        return { success: false, error: "Kayit oluşturulamadı." };
    }
}

export async function updateCarbonEntry(id: string, data: any) {
    try {
        await prisma.carbonEntry.update({
            where: { id },
            data: {
                scope: data.scope,
                category: data.category,
                activity: data.activity,
                amount: parseFloat(data.amount),
                unit: data.unit,
                emissionFactor: parseFloat(data.emissionFactor),
                calculatedEmission: parseFloat(data.emissionStart), // recalculate if factor changed
                date: data.date,
                description: data.note,
            }
        });
        revalidatePath("/manage/carbon");
        return { success: true };
    } catch (error) {
        console.error("Error updating carbon entry:", error);
        return { success: false, error: "Güncelleme başarısız." };
    }
}

export async function copyCarbonEntry(id: string, targetCompanyId: string) {
    try {
        const source = await prisma.carbonEntry.findUnique({ where: { id } });
        if (!source) return { success: false, error: "Kayıt bulunamadı." };

        await prisma.carbonEntry.create({
            data: {
                companyId: targetCompanyId,
                scope: source.scope,
                category: source.category,
                activity: source.activity,
                amount: source.amount,
                unit: source.unit,
                emissionFactor: source.emissionFactor,
                calculatedEmission: source.calculatedEmission,
                date: new Date().toISOString(), // Set to today
                description: `${source.description} (Kopya)`,
                status: "APPROVED"
            }
        });
        revalidatePath("/manage/carbon");
        return { success: true };
    } catch (error) {
        console.error("Error copying carbon entry:", error);
        return { success: false, error: "Kopyalama başarısız." };
    }
}

export async function deleteCarbonEntry(id: string) {
    try {
        await prisma.carbonEntry.delete({ where: { id } });
        revalidatePath("/manage/carbon");
        return { success: true };
    } catch (error) {
        console.error("Error deleting carbon entry:", error);
        return { success: false, error: "Kayıt silinemedi." };
    }
}

// --- Emission Factors ---

export async function createEmissionFactor(data: any) {
    try {
        await prisma.emissionFactor.create({
            data: {
                name: data.name,
                scope: data.scope,
                unit: data.unit,
                value: parseFloat(data.value),
                year: parseInt(data.year),
                source: data.source,
                note: data.note,
                companyId: data.companyId, // Null for global, set for custom
                isCustom: !!data.companyId
            }
        });
        revalidatePath("/manage/carbon");
        return { success: true };
    } catch (error) {
        console.error("Error creating emission factor:", error);
        return { success: false, error: "Faktör oluşturulamadı." };
    }
}

export async function deleteEmissionFactor(id: string) {
    try {
        await prisma.emissionFactor.delete({ where: { id } });
        revalidatePath("/manage/carbon");
        return { success: true };
    } catch (error) {
        console.error("Error deleting emission factor:", error);
        return { success: false, error: "Faktör silinemedi." };
    }
}
