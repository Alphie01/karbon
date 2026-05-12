import { prisma } from "@/lib/prisma";
import { Plus, FileText, Download, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teklif Yönetimi | CRM",
};

export default async function ProposalsPage() {
    const proposals = await prisma.proposal.findMany({
        include: {
            lead: true,
            items: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText /> Teklif Yönetimi
                    </h1>
                    <p className="text-slate-500 text-sm">Müşterilerinize sunduğunuz teklifleri yönetin.</p>
                </div>
                <Link href="/crm/proposals/new" className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
                    <Plus size={18} /> Yeni Teklif Oluştur
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                            <th className="p-4 font-semibold">Teklif Başlığı</th>
                            <th className="p-4 font-semibold">Müşteri</th>
                            <th className="p-4 font-semibold">Tutar</th>
                            <th className="p-4 font-semibold">Durum</th>
                            <th className="p-4 font-semibold">Tarih</th>
                            <th className="p-4 font-semibold text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {proposals.map((proposal) => (
                            <tr key={proposal.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-800">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-slate-400" />
                                        {proposal.title}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">
                                    <Link href={`//crm/leads/${proposal.lead.id}`} className="hover:text-blue-600 hover:underline">
                                        {proposal.lead.name}
                                    </Link>
                                </td>
                                <td className="p-4 font-semibold text-slate-800">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: proposal.currency }).format(proposal.amount)}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                            proposal.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                proposal.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                        }`}>
                                        {proposal.status === 'ACCEPTED' ? 'Onaylandı' :
                                            proposal.status === 'REJECTED' ? 'Reddedildi' :
                                                proposal.status === 'SENT' ? 'Gönderildi' : 'Taslak'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {new Date(proposal.date).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`//crm/proposals/${proposal.id}`} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Görüntüle">
                                            <Eye size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {proposals.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                                    Henüz hiç teklif oluşturulmamış.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
