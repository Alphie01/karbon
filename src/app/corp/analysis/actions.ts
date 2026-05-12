"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Business Process Actions ---

export async function createBusinessProcess(formData: FormData) {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    // Resolve companyId: User's own OR Admin's override
    let companyId = user.companyId;
    const formCompanyId = formData.get("companyId") as string;

    // If Admin and form has companyId, use it
    const userRoles = (user as any).roles || "";
    if ((userRoles.includes('ADMIN') || userRoles === 'ADMIN') && formCompanyId) {
        companyId = formCompanyId;
    }

    if (!companyId) throw new Error("Company ID required");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.businessProcess.create({
        data: {
            companyId,
            title,
            description,
        }
    });

    revalidatePath("/corp/analysis");
    redirect(`/corp/analysis${formCompanyId ? `?companyId=${formCompanyId}` : ''}`);
}

export async function updateBusinessProcess(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.businessProcess.update({
        where: { id },
        data: {
            title,
            description,
        }
    });

    revalidatePath(`/corp/analysis/${id}`);
    revalidatePath("/corp/analysis");
}

export async function deleteBusinessProcess(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.businessProcess.delete({
        where: { id }
    });

    revalidatePath("/corp/analysis");
}

export async function linkCarbonEntryToProcess(processId: string, entryId: string) {
    await prisma.carbonEntry.update({
        where: { id: entryId },
        data: { businessProcessId: processId }
    });
    revalidatePath(`/corp/analysis/${processId}`);
}

export async function unlinkCarbonEntry(entryId: string, processId: string) {
    await prisma.carbonEntry.update({
        where: { id: entryId },
        data: { businessProcessId: null }
    });
    revalidatePath(`/corp/analysis/${processId}`);
}

export async function linkWaterProcessToBusinessProcess(processId: string, waterProcessId: string) {
    await prisma.waterProcess.update({
        where: { id: waterProcessId },
        data: { businessProcessId: processId }
    });
    revalidatePath(`/corp/analysis/${processId}`);
}

export async function unlinkWaterProcess(waterProcessId: string, processId: string) {
    await prisma.waterProcess.update({
        where: { id: waterProcessId },
        data: { businessProcessId: null }
    });
    revalidatePath(`/corp/analysis/${processId}`);
}

// --- Equipment Actions ---

export async function addEquipment(processId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const hasIoT = formData.get("hasIoT") === "on";
    const currentDraw = parseFloat(formData.get("currentDraw") as string) || 0;
    const unit = formData.get("unit") as string || "kW";

    await prisma.facilityEquipment.create({
        data: {
            businessProcessId: processId,
            name,
            type,
            hasIoT,
            currentDraw,
            unit,
            iotStatus: hasIoT ? "ONLINE" : "OFFLINE"
        }
    });

    revalidatePath(`/corp/analysis/${processId}`);
}

export async function deleteEquipment(equipmentId: string, processId: string) {
    await prisma.facilityEquipment.delete({
        where: { id: equipmentId }
    });
    revalidatePath(`/corp/analysis/${processId}`);
}

export async function toggleIoTStatus(equipmentId: string, currentStatus: string, processId: string) {
    await prisma.facilityEquipment.update({
        where: { id: equipmentId },
        data: {
            iotStatus: currentStatus === "ONLINE" ? "OFFLINE" : "ONLINE",
            hasIoT: true
        }
    });
    revalidatePath(`/corp/analysis/${processId}`);
}
