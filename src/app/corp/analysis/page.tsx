import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveCompanyId } from "@/lib/company-auth";
import { Plus, Workflow, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createBusinessProcess } from "./actions";

async function getProcesses(companyId: string) {
    return await prisma.businessProcess.findMany({
        where: companyId === "ALL" ? undefined : { companyId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { carbonEntries: true, waterProcesses: true }
            }
        }
    });
}

export default async function AnalysisListPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const companyId = await getEffectiveCompanyId(user, searchParams);

    if (!companyId) {
        return <div className="p-8 text-center text-amber-600">Firma seçiniz.</div>;
    }

    const processes = await getProcesses(companyId);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Workflow className="text-brand-navy dark:text-brand-green" />
                        İş Süreç Analizi
                    </h1>
                    <p className="text-sm text-slate-500">
                        Faaliyetlerinizi süreç bazlı analiz edin ve ayak izlerini ilişkilendirin.
                    </p>
                </div>

                {/* Create Modal Trigger/Form - handling simplified inline form for MVP */}
                <div className="flex items-center gap-2">
                    {/* We can use a dialog here, but for now let's put a simple form at the bottom or use client component */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create Card */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col justify-center items-center text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <form action={createBusinessProcess} className="w-full space-y-4">
                        <input type="hidden" name="companyId" value={companyId} />
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Yeni Süreç Ekle</h3>
                        <input name="title" className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Süreç Adı (örn. Üretim Hattı 1)" required />
                        <textarea name="description" className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Açıklama..." rows={2}></textarea>
                        <button type="submit" className="w-full py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Plus size={16} /> Oluştur
                        </button>
                    </form>
                </div>

                {processes.map((proc: any) => (
                    <Link
                        key={proc.id}
                        href={`/corp/analysis/${proc.id}${searchParams?.companyId ? `?companyId=${searchParams.companyId}` : ''}`}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all group relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-brand-navy/10 text-brand-navy dark:bg-brand-green/10 dark:text-brand-green rounded-lg">
                                <Workflow size={24} />
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-brand-navy transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{proc.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">{proc.description || "Açıklama yok."}</p>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                {proc._count.carbonEntries} Karbon Kaydı
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                {proc._count.waterProcesses} Su Süreci
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
