import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, Search, Calendar, FileText, Wallet, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import NewLeadForm from "./new/NewLeadForm";

export default async function CRMPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5 // Only show recent 5 leads
    });

    const totalLeads = await prisma.lead.count();

    // Fetch Financial Summary
    const financialRecords = await prisma.financialRecord.findMany();
    const totalIncome = financialRecords.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = financialRecords.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    // Fetch Upcoming Meetings
    const upcomingMeetings = await prisma.activity.findMany({
        where: {
            type: 'MEETING',
            date: {
                gte: new Date()
            }
        },
        include: {
            lead: true
        },
        orderBy: {
            date: 'asc'
        },
        take: 3
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Proje / CRM Yönetimi</h1>
                    <p className="text-slate-500 text-sm">Müşteri ilişkileri ve iş süreçlerinizi yönetin.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="//crm/proposals/new" className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
                        <FileText size={18} /> Yeni Teklif
                    </Link>
                    <Link href="//crm/new" className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
                        <Plus size={18} /> Yeni Müşteri
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Link href="//crm/leads" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{totalLeads}</h3>
                        <p className="text-slate-500 text-sm">Toplam Müşteri</p>
                    </div>
                </Link>

                <Link href="//crm/finance" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg transition-colors ${balance >= 0 ? 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white' : 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                            <Wallet size={24} />
                        </div>
                        {balance >= 0 ? <TrendingUp size={20} className="text-green-500" /> : <TrendingDown size={20} className="text-red-500" />}
                    </div>
                    <div>
                        <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                            {balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })}
                        </h3>
                        <p className="text-slate-500 text-sm">Net Finansal Durum</p>
                    </div>
                </Link>

                <Link href="//crm/calendar" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{upcomingMeetings.length}</h3>
                        <p className="text-slate-500 text-sm">Yaklaşan Toplantı</p>
                    </div>
                </Link>

                <Link href="//crm/proposals" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Teklifler</h3>
                        <p className="text-slate-500 text-sm">Yönetim</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf: Son Müşteriler */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Son Güncellenen Müşteriler</h3>
                            <Link href="//crm/leads" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Tümünü Gör</Link>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">Müşteri</th>
                                    <th className="p-4 font-medium">Durum</th>
                                    <th className="p-4 font-medium">İletişim</th>
                                    <th className="p-4 font-medium text-right">Detay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">{lead.name}</div>
                                            <div className="text-xs text-slate-500">{lead.contactPerson}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'WON' ? 'bg-green-100 text-green-700' :
                                                    lead.status === 'LOST' ? 'bg-red-100 text-red-700' :
                                                        lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {lead.email || lead.phone || '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`//crm/leads/${lead.id}`} className="text-slate-400 hover:text-blue-600">
                                                <ArrowRight size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">Henüz müşteri kaydı yok.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sağ Taraf: Yaklaşan Toplantılar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Yaklaşan Toplantılar</h3>
                            <Link href="//crm/calendar" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Takvim</Link>
                        </div>
                        <div className="p-4 space-y-4">
                            {upcomingMeetings.map(meeting => (
                                <div key={meeting.id} className="flex gap-4 items-start p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="bg-purple-200 text-purple-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-bold">{new Date(meeting.date).getDate()}</span>
                                        <span className="text-[10px] uppercase">{new Date(meeting.date).toLocaleString('tr-TR', { month: 'short' })}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{meeting.subject}</h4>
                                        <p className="text-xs text-slate-600 mb-1">{meeting.lead.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Calendar size={12} />
                                            {new Date(meeting.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {upcomingMeetings.length === 0 && (
                                <div className="text-center py-8 text-slate-500 text-sm italic">
                                    Planlanmış toplantı bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
