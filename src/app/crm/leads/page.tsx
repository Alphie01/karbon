import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Building2, User, Phone, Mail, Clock, ArrowRight } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
    NEW: "Yeni",
    CONTACTED: "İletişimde",
    PROPOSAL: "Teklifte",
    WON: "Kazanıldı",
    LOST: "Kaybedildi",
};

const STATUS_STYLES: Record<string, string> = {
    NEW: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
    CONTACTED: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40",
    PROPOSAL: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
    WON: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/40",
    LOST: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

export default async function CRMLeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { updatedAt: "desc" },
        include: { activities: { orderBy: { date: "desc" }, take: 1 } },
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Müşteriler & Leads</h1>
                    <p className="text-sm text-slate-500">Satış fırsatlarınızı ve potansiyel müşterilerinizi yönetin.</p>
                </div>
                <Link
                    href="/crm/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                    <Plus size={15} /> Yeni Müşteri Ekle
                </Link>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">

                {/* Search Bar */}
                <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Müşteri veya şirket ara..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                    </div>
                    <span className="text-xs text-slate-400 ml-auto">{leads.length} kayıt</span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-5 py-3 font-semibold">Müşteri / Firma</th>
                                <th className="px-5 py-3 font-semibold">Durum</th>
                                <th className="px-5 py-3 font-semibold hidden md:table-cell">İletişim</th>
                                <th className="px-5 py-3 font-semibold hidden lg:table-cell">Son Etkileşim</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {lead.contactPerson ? <User size={14} /> : <Building2 size={14} />}
                                            </div>
                                            <div>
                                                <Link href={`/crm/leads/${lead.id}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                                                    {lead.name}
                                                </Link>
                                                {lead.contactPerson && <div className="text-xs text-slate-400">{lead.contactPerson}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${STATUS_STYLES[lead.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                            {STATUS_LABELS[lead.status] || lead.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                                        {lead.email && (
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={11} className="text-slate-300" />
                                                <a href={`mailto:${lead.email}`} className="hover:text-blue-600 truncate max-w-[160px]">{lead.email}</a>
                                            </div>
                                        )}
                                        {lead.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={11} className="text-slate-300" />
                                                <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                                            </div>
                                        )}
                                        {!lead.email && !lead.phone && <span className="text-slate-300 italic">—</span>}
                                    </td>
                                    <td className="px-5 py-3.5 hidden lg:table-cell">
                                        {lead.activities.length > 0 ? (
                                            <div>
                                                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">{lead.activities[0].subject}</div>
                                                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                                    <Clock size={10} />
                                                    {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(lead.activities[0].date))}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-300 italic">Etkileşim yok</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Link href={`/crm/leads/${lead.id}`} className="text-slate-300 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <ArrowRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                                        Henüz müşteri kaydı (Lead) bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
