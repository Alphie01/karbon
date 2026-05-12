import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Droplet, Factory } from "lucide-react";
import WaterCopyModal from "@/components/admin/WaterCopyModal";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteWaterReport } from "./actions";

async function getAllWaterReports() {
    const reports = await prisma.waterReport.findMany({
        orderBy: { year: 'desc' },
        include: { company: true },
        take: 50
    });
    return reports;
}

async function getCompanies() {
    return await prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });
}

export default async function AdminWaterPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    if (!session.user.roles?.includes("ADMIN") && session.user.companyId) {
        redirect("/corp/water");
    }

    const [reports, companies] = await Promise.all([
        getAllWaterReports(),
        getCompanies()
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Su Ayak İzi Raporları (Admin)</h1>
                    <p className="text-slate-600 dark:text-slate-400">Tüm şirketlerin su kullanım metrikleri.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-sm font-bold text-slate-500">Toplam Rapor:</span>
                    <span className="ml-2 font-bold text-lg text-blue-600">{reports.length}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-500">Şirket</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Yıl</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Mavi Su (m³)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Yeşil Su (m³)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Gri Su (m³)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Toplam (m³)</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {reports.map((report: any) => (
                            <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    <Factory size={16} className="text-slate-400" />
                                    {report.company?.name || "Bilinmiyor"}
                                </td>
                                <td className="p-4 text-slate-700 dark:text-slate-300 font-bold">{report.year}</td>
                                <td className="p-4 text-blue-600">{report.blueWater}</td>
                                <td className="p-4 text-green-600">{report.greenWater}</td>
                                <td className="p-4 text-slate-500">{report.greyWater}</td>
                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                    {report.blueWater + report.greenWater + report.greyWater}
                                </td>
                                <td className="p-4 flex items-center justify-end gap-2">
                                    <WaterCopyModal report={report} companies={companies} />
                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                                    <DeleteButton
                                        id={report.id}
                                        onDelete={async (id) => {
                                            "use server";
                                            return await deleteWaterReport(id);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Henüz raporlanmış veri bulunmuyor.</div>
                )}
            </div>
        </div>
    );
}
