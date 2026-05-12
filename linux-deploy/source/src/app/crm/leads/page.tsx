import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Building2, User, Phone, Mail, Clock } from "lucide-react";

export default async function CRMLeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
            activities: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Müşteriler & Leads</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tüm satış fırsatlarınızı ve potansiyel müşterilerinizi yönetin.</p>
                </div>
                <Link
                    href="/crm/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20"
                >
                    <Plus size={20} />
                    Yeni Müşteri (Lead) Ekle
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Müşteri, şirket veya e-posta ara..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 font-medium whitespace-nowrap">Müşteri / Firma</th>
                                <th className="p-4 font-medium whitespace-nowrap">İletişim Bilgileri</th>
                                <th className="p-4 font-medium whitespace-nowrap">Durum</th>
                                <th className="p-4 font-medium whitespace-nowrap">Son Etkileşim</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                                                {lead.contactPerson ? <User size={20} /> : <Building2 size={20} />}
                                            </div>
                                            <div>
                                                <Link href={`/crm/leads/${lead.id}`} className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                                                    {lead.name}
                                                </Link>
                                                <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                                    {lead.contactPerson ? lead.contactPerson : "Firma İletişimi"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                        {lead.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-slate-400" />
                                                <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                                            </div>
                                        )}
                                        {lead.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-slate-400" />
                                                <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                                            </div>
                                        )}
                                        {!lead.email && !lead.phone && <span className="text-slate-400 italic">Mevcut Değil</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${lead.status === 'NEW' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                lead.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    lead.status === 'PROPOSAL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        lead.status === 'WON' ? 'bg-brand-green text-white border-brand-green' :
                                                            'bg-slate-100 text-slate-700 border-slate-200'}
                                        `}>
                                            {lead.status === 'NEW' ? 'Yeni Kurşun' :
                                                lead.status === 'CONTACTED' ? 'İletişime Geçildi' :
                                                    lead.status === 'PROPOSAL' ? 'Teklif Aşamasında' :
                                                        lead.status === 'WON' ? 'Kazanıldı' : lead.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {lead.activities.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]" title={lead.activities[0].subject}>
                                                    {lead.activities[0].subject}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs opacity-80">
                                                    <Clock size={12} />
                                                    {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(lead.activities[0].date))}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="italic">Henüz etkileşim yok</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Henüz hiç müşteri kaydı (Lead) bulunmuyor.
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
