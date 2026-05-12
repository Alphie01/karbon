import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import WaterTabs from "@/app/manage/water/WaterTabs";
import { getEffectiveCompanyId } from "@/lib/company-auth";

async function getWaterReports(companyId: string) {
    const reports = await prisma.waterReport.findMany({
        where: companyId === "ALL" ? undefined : { companyId },
        orderBy: { year: 'desc' },
        include: {
            sources: true,
            processes: true,
            greyEntries: true
        }
    });

    return reports;
}

export default async function CorpWaterPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const companyId = await getEffectiveCompanyId(user, searchParams);

    if (!companyId) {
        return (
            <div className="p-8 text-center bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                Lütfen bir firma seçiniz (Super Admin Modu).
            </div>
        );
    }

    const reports = await getWaterReports(companyId);
    const processes = await prisma.businessProcess.findMany({
        where: { companyId },
        orderBy: { title: 'asc' }
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Su Ayak İzi Yönetimi</h1>
                    <p className="text-sm text-slate-500">ISO 14046 standardına uygun su ayak izi hesaplamaları.</p>
                </div>
            </div>

            <WaterTabs
                initialReports={reports}
                companyId={companyId}
                businessProcesses={processes}
            />
        </div>
    );
}
