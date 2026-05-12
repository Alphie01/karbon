import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Factory, TrendingUp } from "lucide-react";
import CarbonEditModal from "@/components/admin/CarbonEditModal";
import CarbonCopyModal from "@/components/admin/CarbonCopyModal";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCarbonEntry } from "./actions";

async function getAllCarbonEntries() {
    return await prisma.carbonEntry.findMany({
        orderBy: { date: 'desc' },
        include: { company: true },
        take: 50
    });
}

async function getCompanies() {
    return await prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });
}

export default async function AdminCarbonPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    if (!session.user.roles?.includes("ADMIN") && session.user.companyId) {
        redirect("/corp/carbon");
    }

    const [entries, companies] = await Promise.all([
        getAllCarbonEntries(),
        getCompanies()
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Karbon Raporları (Admin)</h1>
                    <p className="text-slate-600 dark:text-slate-400">Tüm şirketlerin karbon emisyon raporları.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-sm font-bold text-slate-500">Toplam Rapor:</span>
                    <span className="ml-2 font-bold text-lg text-emerald-600">{entries.length}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-500">Şirket</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Kapsam 1 (Ton)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Kapsam 2 (Ton)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Toplam (Ton)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Tarih</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {entries.map((entry: any) => (
                            <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    <Factory size={16} className="text-slate-400" />
                                    {entry.company?.name || "Bilinmiyor"}
                                </td>
                                <td className="p-4 text-slate-700 dark:text-slate-300">
                                    {(entry.scope1 / 1000).toFixed(2)}
                                </td>
                                <td className="p-4 text-slate-700 dark:text-slate-300">
                                    {(entry.scope2 / 1000).toFixed(2)}
                                </td>
                                <td className="p-4 font-bold text-emerald-600">
                                    {((entry.scope1 + entry.scope2 + entry.scope3) / 1000).toFixed(2)}
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(entry.date).toLocaleDateString("tr-TR")}
                                </td>
                                <td className="p-4 flex items-center justify-end gap-2">
                                    <CarbonEditModal entry={entry} />
                                    <CarbonCopyModal entryId={entry.id} companies={companies} />
                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                                    <DeleteButton
                                        id={entry.id}
                                        onDelete={async (id) => {
                                            "use server";
                                            return await deleteCarbonEntry(id);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {entries.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Henüz raporlanmış veri bulunmuyor.</div>
                )}
            </div>
        </div>
    );
}
