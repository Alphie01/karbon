import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CarbonTabs from "@/app/manage/carbon/CarbonTabs";
import { getEffectiveCompanyId } from "@/lib/company-auth";

async function getCarbonData(companyId: string) {
    const entries = await prisma.carbonEntry.findMany({
        where: companyId === "ALL" ? undefined : { companyId },
        orderBy: { date: 'desc' }
    });

    const factorWhere = companyId === "ALL"
        ? undefined
        : {
            OR: [
                { companyId: null },
                { companyId: companyId }
            ]
        };

    const factors = await prisma.emissionFactor.findMany({
        where: factorWhere,
        orderBy: { name: 'asc' }
    });

    return { entries, factors };
}

export default async function CorpCarbonPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
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

    const { entries, factors } = await getCarbonData(companyId);
    const processes = await prisma.businessProcess.findMany({
        where: companyId === "ALL" ? undefined : { companyId },
        orderBy: { title: 'asc' }
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Karbon Ayak İzi Yönetimi</h1>
                    <p className="text-sm text-slate-500">Kapsam 1, 2 ve 3 emisyonlarını hesaplayın ve raporlayın.</p>
                </div>
            </div>

            <CarbonTabs
                initialEntries={entries}
                initialFactors={factors}
                companyId={companyId}
                businessProcesses={processes}
            />
        </div>
    );
}
