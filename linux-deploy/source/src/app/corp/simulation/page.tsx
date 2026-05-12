import { auth } from "@/auth";
import { getEffectiveCompanyId } from "@/lib/company-auth";
import SimulationClient from "./SimulationClient";
import { prisma } from "@/lib/prisma";

export default async function SimulationPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const companyId = await getEffectiveCompanyId(user, searchParams);

    if (!companyId) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <p className="text-slate-500">Lütfen analiz yapmak için bir şirket seçiniz.</p>
            </div>
        );
    }

    // Fetch Base Data
    const currentYear = 2026;

    // Carbon Base
    const carbonEntries = await prisma.carbonEntry.findMany({
        where: companyId === "ALL" ? { date: { startsWith: "2026" } } : { companyId, date: { startsWith: "2026" } },
    });

    const baseCarbonTotal = carbonEntries.reduce((acc, curr) => acc + curr.calculatedEmission, 0);

    // Water Base
    const waterReports = await prisma.waterReport.findMany({
        where: companyId === "ALL" ? { year: 2026 } : { companyId, year: 2026 },
        take: 1
    });

    const baseWaterTotal = waterReports[0]?.totalWater || 0;

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Senaryo Simülasyonu (AI SIM)</h1>
                    <p className="text-sm text-slate-500">Olası yatırımlarınızın çevresel ayak izinize etkisini simüle edin.</p>
                </div>
            </div>

            <SimulationClient
                baseCarbon={baseCarbonTotal}
                baseWater={baseWaterTotal}
                year={currentYear}
            />
        </div>
    );
}
