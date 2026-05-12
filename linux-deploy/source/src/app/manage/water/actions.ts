"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Types ---

interface WaterSource {
    withdraw: number;
    return: number;
}

interface WaterProcess {
    input: number;
    output: number;
}

interface WaterGreyEntry {
    wfgrey: number;
}

// --- Helper for Recalculating Totals ---

async function recalculateWaterTotals(reportId: string) {
    const report = await prisma.waterReport.findUnique({
        where: { id: reportId },
        include: {
            sources: true,
            processes: true,
            greyEntries: true
        }
    });

    if (!report) return;

    // 1. Blue Water calculation (Based on selection)
    const netFromSources = report.sources.reduce((sum: number, s: WaterSource) => sum + Math.max(0, s.withdraw - s.return), 0);
    const consFromProcesses = report.processes.reduce((sum: number, p: WaterProcess) => sum + Math.max(0, p.input - p.output), 0);

    let blueWater = report.blueDirect;
    if (report.blueMethod === "NetConsumption") blueWater = netFromSources;
    else if (report.blueMethod === "ProcessSum") blueWater = consFromProcesses;

    // 2. Green Water (Mostly manual for now)
    const greenWater = report.greenDirect;

    // 3. Grey Water
    const greyWater = report.greyEntries.reduce((sum: number, g: WaterGreyEntry) => sum + g.wfgrey, 0);

    // 4. Update Report
    await prisma.waterReport.update({
        where: { id: reportId },
        data: {
            blueWater,
            greenWater,
            greyWater,
            totalWater: blueWater + greenWater + greyWater
        }
    });
}

// --- Water Report ---

export async function getOrCreateWaterReport(companyId: string, year: number) {
    try {
        let report = await prisma.waterReport.findFirst({
            where: { companyId, year },
            include: {
                sources: true,
                processes: true,
                greyEntries: true
            }
        });

        if (!report) {
            report = await prisma.waterReport.create({
                data: {
                    companyId,
                    year,
                    period: "Annual",
                    status: "DRAFT"
                },
                include: {
                    sources: true,
                    processes: true,
                    greyEntries: true
                }
            });
        }
        return { success: true, data: report };
    } catch {
        return { success: false, error: "Rapor getirilemedi." };
    }
}

export async function updateWaterReportMeta(id: string, data: {
    orgName?: string;
    reportYear?: number;
    period?: string;
    basin?: string;
    methodology?: string;
    boundary?: string;
    fu?: string;
    preparedBy?: string;
    contact?: string;
    dqNote?: string;
    boundaryNote?: string;
    blueDirect?: string | number;
    greenDirect?: string | number;
    blueMethod?: string;
    greenMethod?: string;
}) {
    try {
        await prisma.waterReport.update({
            where: { id },
            data: {
                orgName: data.orgName,
                year: data.reportYear, // mapped from frontend
                period: data.period,
                basin: data.basin,
                methodology: data.methodology,
                boundary: data.boundary,
                fu: data.fu,
                preparedBy: data.preparedBy,
                contact: data.contact,
                dqNote: data.dqNote,
                boundaryNote: data.boundaryNote,
                // Blue/Green settings
                blueDirect: parseFloat(data.blueDirect?.toString() || "0"),
                greenDirect: parseFloat(data.greenDirect?.toString() || "0"),
                blueMethod: data.blueMethod,
                greenMethod: data.greenMethod,
            }
        });

        // Always recalculate when meta (methods) change
        await recalculateWaterTotals(id);

        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true };
    } catch {
        return { success: false, error: "Rapor güncellenemedi." };
    }
}

export async function deleteWaterReport(id: string) {
    try {
        await prisma.waterReport.delete({ where: { id } });
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true };
    } catch {
        return { success: false, error: "Rapor silinemedi." };
    }
}

export async function copyWaterReport(sourceId: string, targetCompanyId: string, targetYear: number) {
    try {
        const source = await prisma.waterReport.findUnique({
            where: { id: sourceId },
            include: {
                sources: true,
                processes: true,
                greyEntries: true
            }
        });

        if (!source) return { success: false, error: "Kaynak rapor bulunamadı." };

        let newReportId = "";
        await prisma.$transaction(async (tx) => {
            const newReport = await tx.waterReport.create({
                data: {
                    companyId: targetCompanyId,
                    year: targetYear,
                    period: source.period,
                    status: "DRAFT",
                    orgName: source.orgName,
                    basin: source.basin,
                    methodology: source.methodology,
                    boundary: source.boundary,
                    fu: source.fu,
                    preparedBy: source.preparedBy,
                    contact: source.contact,
                    dqNote: source.dqNote,
                    boundaryNote: source.boundaryNote,
                    blueDirect: source.blueDirect,
                    greenDirect: source.greenDirect,
                    blueMethod: source.blueMethod,
                    greenMethod: source.greenMethod
                }
            });
            newReportId = newReport.id;

            if (source.sources.length > 0) {
                await tx.waterSource.createMany({
                    data: source.sources.map(s => ({
                        reportId: newReport.id,
                        type: s.type,
                        name: s.name,
                        withdraw: s.withdraw,
                        return: s.return,
                        note: s.note
                    }))
                });
            }

            if (source.processes.length > 0) {
                await tx.waterProcess.createMany({
                    data: source.processes.map(p => ({
                        reportId: newReport.id,
                        date: p.date,
                        name: p.name,
                        type: p.type,
                        input: p.input,
                        output: p.output,
                        product: p.product,
                        productUnit: p.productUnit,
                        note: p.note
                    }))
                });
            }

            if (source.greyEntries.length > 0) {
                await tx.waterGreyEntry.createMany({
                    data: source.greyEntries.map(g => ({
                        reportId: newReport.id,
                        date: new Date().toISOString(),
                        param: g.param,
                        Q: g.Q,
                        Ceff: g.Ceff,
                        Cnat: g.Cnat,
                        Cmax: g.Cmax,
                        wfgrey: g.wfgrey,
                        evidence: g.evidence,
                        note: g.note
                    }))
                });
            }
        });

        await recalculateWaterTotals(newReportId);
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true };
    } catch {
        return { success: false, error: "Rapor kopyalanamadı." };
    }
}

// --- Sources ---

export async function addWaterSource(reportId: string, data: {
    type: string;
    name: string;
    withdraw: string | number;
    ret: string | number;
    note?: string;
} | FormData) {
    try {
        const isFormData = data instanceof FormData;
        const payload = isFormData ? {
            type: data.get("type") as string,
            name: data.get("name") as string,
            withdraw: data.get("withdraw") as string,
            ret: data.get("return") as string,
            note: data.get("note") as string
        } : data;

        const source = await prisma.waterSource.create({
            data: {
                reportId,
                type: payload.type,
                name: payload.name,
                withdraw: parseFloat(payload.withdraw?.toString() || "0"),
                return: parseFloat(payload.ret?.toString() || "0"),
                note: payload.note
            }
        });
        await recalculateWaterTotals(reportId);
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true, data: source };
    } catch (e) {
        console.error("addWaterSource error:", e);
        return { success: false, error: "Kaynak eklenemedi." };
    }
}

export async function deleteWaterSource(id: string) {
    try {
        const source = await prisma.waterSource.findUnique({ where: { id } });
        if (source) {
            await prisma.waterSource.delete({ where: { id } });
            await recalculateWaterTotals(source.reportId);
        }
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true };
    } catch {
        return { success: false, error: "Silinemedi." };
    }
}

// --- Processes ---

export async function addWaterProcess(reportId: string, data: {
    date: string;
    name: string;
    type: string;
    in: string | number;
    out: string | number;
    prod?: string | number;
    prodUnit?: string;
    note?: string;
    businessProcessId?: string;
} | FormData) {
    try {
        const isFormData = data instanceof FormData;
        const payload = isFormData ? {
            date: data.get("date") as string || new Date().toISOString(),
            name: data.get("name") as string,
            type: data.get("type") as string || "Process",
            in: data.get("input") as string,
            out: data.get("output") as string,
            prod: data.get("product") as string || "0",
            prodUnit: data.get("productUnit") as string || "m³",
            note: data.get("note") as string,
            businessProcessId: data.get("businessProcessId") as string
        } : data;

        const process = await prisma.waterProcess.create({
            data: {
                reportId,
                date: payload.date,
                name: payload.name,
                type: payload.type,
                input: parseFloat(payload.in?.toString() || "0"),
                output: parseFloat(payload.out?.toString() || "0"),
                product: parseFloat(payload.prod?.toString() || "0"),
                productUnit: payload.prodUnit,
                note: payload.note,
                businessProcessId: payload.businessProcessId
            }
        });
        await recalculateWaterTotals(reportId);
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true, data: process };
    } catch (e) {
        console.error("addWaterProcess error:", e);
        return { success: false, error: "Süreç eklenemedi." };
    }
}

export async function deleteWaterProcess(id: string) {
    try {
        const process = await prisma.waterProcess.findUnique({ where: { id } });
        if (process) {
            await prisma.waterProcess.delete({ where: { id } });
            await recalculateWaterTotals(process.reportId);
        }
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true };
    } catch {
        return { success: false, error: "Silinemedi." };
    }
}

// --- Grey Water ---

export async function addGreyEntry(reportId: string, data: {
    date: string;
    param: string;
    Q: string | number;
    Ceff: string | number;
    Cnat: string | number;
    Cmax: string | number;
    wfgrey: string | number;
    evidence?: string;
    note?: string;
} | FormData) {
    try {
        const isFormData = data instanceof FormData;
        const payload = isFormData ? {
            date: data.get("date") as string || new Date().toISOString(),
            param: data.get("pollutant") as string, // pollinat in form, param in DB
            Q: data.get("Q") as string || "0",
            Ceff: data.get("Ceff") as string || "0",
            Cnat: data.get("Cnat") as string || "0",
            Cmax: data.get("Cmax") as string || "0",
            wfgrey: data.get("wfgrey") as string || "0",
            evidence: data.get("evidence") as string,
            note: data.get("note") as string
        } : data;

        const entry = await prisma.waterGreyEntry.create({
            data: {
                reportId,
                date: payload.date,
                param: payload.param,
                Q: parseFloat(payload.Q?.toString() || "0"),
                Ceff: parseFloat(payload.Ceff?.toString() || "0"),
                Cnat: parseFloat(payload.Cnat?.toString() || "0"),
                Cmax: parseFloat(payload.Cmax?.toString() || "0"),
                wfgrey: parseFloat(payload.wfgrey?.toString() || "0"),
                evidence: payload.evidence,
                note: payload.note
            }
        });
        await recalculateWaterTotals(reportId);
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true, data: entry };
    } catch (e) {
        console.error("addGreyEntry error:", e);
        return { success: false, error: "Gri su kaydı eklenemedi." };
    }
}

export async function deleteGreyEntry(id: string) {
    try {
        const entry = await prisma.waterGreyEntry.findUnique({ where: { id } });
        if (entry) {
            await prisma.waterGreyEntry.delete({ where: { id } });
            await recalculateWaterTotals(entry.reportId);
        }
        revalidatePath("/manage/water");
        revalidatePath("/corp/water");
        return { success: true };
    } catch {
        return { success: false, error: "Silinemedi." };
    }
}
