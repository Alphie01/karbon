import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, Calendar, FileText, Wallet, TrendingUp, TrendingDown, ArrowRight, Clock } from "lucide-react";
import LeadStatusChart from "@/components/crm/LeadStatusChart";

const STATUS_LABELS: Record<string, string> = {
    NEW: "Yeni",
    CONTACTED: "İletişimde",
    PROPOSAL: "Teklifte",
    WON: "Kazanıldı",
    LOST: "Kaybedildi",
};

const STATUS_COLORS: Record<string, string> = {
    NEW: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40",
    CONTACTED: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40",
    PROPOSAL: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40",
    WON: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/40",
    LOST: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
};

export default async function CRMPage() {
    const [leads, totalLeads, financialRecords, upcomingMeetings] = await Promise.all([
        prisma.lead.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
        prisma.lead.count(),
        prisma.financialRecord.findMany(),
        prisma.activity.findMany({
            where: { type: "MEETING", date: { gte: new Date() } },
            include: { lead: true },
            orderBy: { date: "asc" },
            take: 4,
        }),
    ]);

    const totalIncome = financialRecords.filter((r) => r.type === "INCOME").reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = financialRecords.filter((r) => r.type === "EXPENSE").reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    // Lead status distribution for chart
    const statusCounts: Record<string, number> = {};
    leads.forEach((l) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">CRM Yönetimi</h1>
                    <p className="text-sm text-slate-500">Müşteri ilişkileri ve iş süreçlerini yönetin.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/crm/proposals/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:border-slate-300 transition-colors">
                        <FileText size={15} /> Yeni Teklif
                    </Link>
                    <Link href="/crm/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-lg transition-colors">
                        <Plus size={15} /> Yeni Müşteri
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/crm/leads" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit mb-3">
                        <Users size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{totalLeads}</div>
                    <p className="text-xs text-slate-500 font-medium">Toplam Müşteri</p>
                </Link>

                <Link href="/crm/finance" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
                    <div className={`p-2 rounded-lg w-fit mb-3 ${balance >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                        <Wallet size={16} className={balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${balance >= 0 ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                        {balance.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Net Bakiye</p>
                </Link>

                <Link href="/crm/calendar" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
                    <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg w-fit mb-3">
                        <Calendar size={16} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{upcomingMeetings.length}</div>
                    <p className="text-xs text-slate-500 font-medium">Yaklaşan Toplantı</p>
                </Link>

                <Link href="/crm/proposals" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg w-fit mb-3">
                        <FileText size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {balance >= 0 ? <TrendingUp size={22} className="text-emerald-500" /> : <TrendingDown size={22} className="text-red-500" />}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Teklifler</p>
                </Link>
            </div>

            {/* Main Content: Leads + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Leads Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Son Müşteriler</h3>
                        <Link href="/crm/leads" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                            Tümünü Gör <ArrowRight size={11} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-5 py-3 font-semibold">Müşteri</th>
                                    <th className="px-5 py-3 font-semibold">Durum</th>
                                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">İletişim</th>
                                    <th className="px-5 py-3 font-semibold text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lead.name}</div>
                                            {lead.contactPerson && <div className="text-xs text-slate-400">{lead.contactPerson}</div>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_COLORS[lead.status] || "bg-slate-100 text-slate-600"}`}>
                                                {STATUS_LABELS[lead.status] || lead.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-slate-500 hidden sm:table-cell">
                                            {lead.email || lead.phone || "—"}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Link href={`/crm/leads/${lead.id}`} className="text-slate-300 hover:text-blue-500 transition-colors">
                                                <ArrowRight size={15} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-400">
                                            Henüz müşteri kaydı yok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar: Chart + Meetings */}
                <div className="space-y-4">
                    {/* Lead Status Chart */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Lead Dağılımı</p>
                        <LeadStatusChart statusCounts={statusCounts} />
                    </div>

                    {/* Upcoming Meetings */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Yaklaşan Toplantılar</h3>
                            <Link href="/crm/calendar" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Takvim</Link>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {upcomingMeetings.map((m) => (
                                <div key={m.id} className="px-5 py-3 flex items-start gap-3">
                                    <div className="flex-shrink-0 text-center bg-violet-50 dark:bg-violet-900/20 rounded-lg px-2 py-1.5 min-w-[40px]">
                                        <div className="text-sm font-bold text-violet-700 dark:text-violet-300 leading-none">{new Date(m.date).getDate()}</div>
                                        <div className="text-[10px] text-violet-500 uppercase">{new Date(m.date).toLocaleString("tr-TR", { month: "short" })}</div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{m.subject}</p>
                                        <p className="text-xs text-slate-400">{m.lead.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                            <Clock size={10} />
                                            {new Date(m.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {upcomingMeetings.length === 0 && (
                                <div className="px-5 py-8 text-center text-sm text-slate-400">Planlanmış toplantı yok.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
