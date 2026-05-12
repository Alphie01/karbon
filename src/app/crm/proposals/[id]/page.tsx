import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "@/components/crm/PrintButton";
import ProposalActions from "@/components/crm/ProposalActions";

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: {
            lead: true,
            items: true
        }
    });

    if (!proposal) {
        notFound();
    }

    const calculatedSubTotal = proposal.items.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxAmount = calculatedSubTotal * (proposal.taxRate / 100);
    const totalAmount = calculatedSubTotal + taxAmount;

    const statusColors: Record<string, string> = {
        DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
        SENT: "bg-blue-100 text-blue-600 border-blue-200",
        ACCEPTED: "bg-emerald-100 text-emerald-600 border-emerald-200",
        REJECTED: "bg-rose-100 text-rose-600 border-rose-200",
    };

    return (
        <div className="p-6 max-w-5xl mx-auto print:p-0 print:max-w-none">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/crm/proposals" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={16} />
                        Tekliflere Dön
                    </Link>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${statusColors[proposal.status]}`}>
                        {proposal.status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <PrintButton />
                    <ProposalActions proposalId={proposal.id} currentStatus={proposal.status} />
                </div>
            </div>

            {/* Proposal Document */}
            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">

                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        {/* Logo Area */}
                        <div className="h-16 w-16 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center font-black text-white dark:text-slate-900 text-2xl mb-6 shadow-xl shadow-slate-900/10 print:shadow-none print:border-2 print:border-slate-900 print:text-slate-900">
                            BL
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">TEKLİF</h1>
                        <p className="text-slate-500 font-medium mt-2">No: <span className="text-slate-900 font-bold">#{proposal.id.slice(-6).toUpperCase()}</span></p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                        <p className="font-bold text-slate-900 text-lg">EcoPilot</p>
                        <p>Monolith Yazılım</p>
                        <p>İstanbul, Türkiye</p>
                        <p>info@ecopilot.com</p>
                    </div>
                </div>

                {/* Client & Date Info */}
                <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sayın</p>
                        <h2 className="text-xl font-bold text-slate-900">{proposal.lead.name}</h2>
                        {proposal.lead.contactPerson && <p className="text-slate-600">{proposal.lead.contactPerson}</p>}
                        {proposal.lead.email && <p className="text-slate-600">{proposal.lead.email}</p>}
                        {proposal.lead.phone && <p className="text-slate-600">{proposal.lead.phone}</p>}
                    </div>
                    <div className="text-right">
                        <div className="mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teklif Tarihi</p>
                            <p className="font-medium text-slate-900">{new Date(proposal.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                        {proposal.validUntil && (
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Geçerlilik Tarihi</p>
                                <p className="font-medium text-slate-900">{new Date(proposal.validUntil).toLocaleDateString('tr-TR')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800">{proposal.title}</h3>
                </div>

                {/* Items Table */}
                <table className="w-full text-left mb-8">
                    <thead>
                        <tr className="border-b-2 border-slate-100">
                            <th className="py-3 font-bold text-slate-700 w-1/2">Hizmet / Ürün Açıklaması</th>
                            <th className="py-3 font-bold text-slate-700 text-right">Miktar</th>
                            <th className="py-3 font-bold text-slate-700 text-right">Birim Fiyat</th>
                            <th className="py-3 font-bold text-slate-700 text-right">Toplam</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {proposal.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4 text-slate-600">{item.description}</td>
                                <td className="py-4 text-slate-600 text-right">{item.quantity}</td>
                                <td className="py-4 text-slate-600 text-right">
                                    {item.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {proposal.currency}
                                </td>
                                <td className="py-4 font-medium text-slate-900 text-right">
                                    {item.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {proposal.currency}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-slate-600">
                            <span>Ara Toplam:</span>
                            <span>{calculatedSubTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {proposal.currency}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>KDV (%{proposal.taxRate}):</span>
                            <span>{taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {proposal.currency}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t-2 border-slate-100">
                            <span>Genel Toplam:</span>
                            <span>{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {proposal.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Notes */}
                {(proposal.terms || proposal.notes) && (
                    <div className="bg-slate-50 p-6 rounded-lg print:bg-white print:border print:border-slate-200">
                        {proposal.terms && (
                            <div className="mb-6">
                                <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Şartlar ve Koşullar</h4>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{proposal.terms}</p>
                            </div>
                        )}
                        {proposal.notes && (
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Notlar</h4>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{proposal.notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Signature Area */}
                <div className="mt-32 grid grid-cols-2 gap-20 print:visible hidden">
                    <div className="text-center pt-8 border-t-2 border-slate-900/10">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Hizmet Sağlayıcı</p>
                        <p className="font-black text-lg text-slate-900">EcoPilot</p>
                        <div className="mt-12 w-40 h-px bg-slate-200 mx-auto"></div>
                        <p className="text-[10px] text-slate-400 mt-2 italic hover:underline cursor-default">Kaşe ve İmza</p>
                    </div>
                    <div className="text-center pt-8 border-t-2 border-slate-900/10">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Müşteri Onayı</p>
                        <p className="font-black text-lg text-slate-900">{proposal.lead.name}</p>
                        <div className="mt-12 w-40 h-px bg-slate-200 mx-auto"></div>
                        <p className="text-[10px] text-slate-400 mt-2 italic hover:underline cursor-default">Ad Soyad / İmza</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
