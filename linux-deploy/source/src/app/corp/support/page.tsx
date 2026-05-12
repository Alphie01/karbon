import { auth } from "@/auth";
import { getUserTickets, createTicket } from "@/actions/support";
import { MessageSquare, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";
import CorpShell from "@/components/corp/CorpShell";

export default async function CorpSupportPage() {
    const session = await auth();
    const tickets = await getUserTickets();

    return (
        <CorpShell user={session?.user}>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Destek ve Bildirimler</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Sistemle ilgili yaşadığınız sorunları veya taleplerinizi buradan iletebilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Ticket Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-brand-green" /> Yeni Talep Oluştur
                            </h2>
                            <form action={createTicket as any} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Konu
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-green outline-none"
                                        placeholder="Örn: Raporlama Hatası"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Öncelik
                                    </label>
                                    <select
                                        name="priority"
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-green outline-none"
                                    >
                                        <option value="LOW">Düşük</option>
                                        <option value="MEDIUM" selected>Orta</option>
                                        <option value="HIGH">Yüksek</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Mesajınız
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-green outline-none resize-none"
                                        placeholder="Sorunu detaylıca açıklayınız..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl font-medium transition-colors"
                                >
                                    Gönder
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Ticket List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-slate-500" /> Geçmiş Talepleriniz
                        </h2>

                        {tickets.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                                <p className="text-slate-500 font-medium">Henüz bir talep oluşturmadınız.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map((ticket: any) => (
                                    <div key={ticket.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                                    {ticket.subject}
                                                </h3>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(ticket.createdAt).toLocaleDateString("tr-TR")} • {new Date(ticket.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <StatusBadge status={ticket.status} />
                                                <PriorityBadge priority={ticket.priority} />
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-sm">
                                            {ticket.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CorpShell>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "OPEN":
            return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100"><AlertCircle size={14} /> Açık</span>;
        case "IN_PROGRESS":
            return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100"><Clock size={14} /> İnceleniyor</span>;
        case "CLOSED":
            return <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200"><CheckCircle size={14} /> Çözüldü</span>;
        default:
            return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{status}</span>;
    }
}

function PriorityBadge({ priority }: { priority: string }) {
    switch (priority) {
        case "HIGH":
            return <span className="text-xs font-bold text-red-500">Yüksek Öncelik</span>;
        case "MEDIUM":
            return <span className="text-xs font-bold text-orange-500">Orta Öncelik</span>;
        case "LOW":
            return <span className="text-xs font-bold text-green-500">Düşük Öncelik</span>;
        default:
            return null;
    }
}
