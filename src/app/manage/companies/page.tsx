import { prisma } from "@/lib/prisma";
import { Building2, Users, Calendar, Trash2, Eye } from "lucide-react";
import CreateCompanyButton from "./CreateCompanyButton";
import { deleteCompany } from "./actions";

async function getCompanies() {
    return await prisma.company.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { users: true } } }
    });
}

export default async function AdminCompaniesPage() {
    const companies = await getCompanies();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Firma Yönetimi</h1>
                <div className="flex items-center gap-4">
                    <CreateCompanyButton />
                    <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                        <span className="text-sm text-slate-500">Toplam Firma:</span>
                        <span className="ml-2 font-bold text-lg text-brand-navy dark:text-brand-green">{companies.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Firma Adı</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Abonelik</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Kullanıcı Sayısı</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Kayıt Tarihi</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" />
                                        {company.name}
                                    </div>
                                    <div className="text-xs text-slate-500 pl-6">{company.id}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${company.subscriptionStatus === "ACTIVE"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {company.subscriptionStatus === "ACTIVE" ? "Aktif" : company.subscriptionStatus}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                        <Users size={14} />
                                        <span className="font-medium">{company._count.users}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {new Date(company.createdAt).toLocaleDateString("tr-TR")}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <form action={deleteCompany.bind(null, company.id) as any} className="inline-block">
                                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Firmayı Sil">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                    <a href={`/corp/dashboard?companyId=${company.id}`} className="inline-block ml-2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Firmayı Görüntüle" target="_blank">
                                        <Eye size={16} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">Henüz kayıtlı firma yok.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
