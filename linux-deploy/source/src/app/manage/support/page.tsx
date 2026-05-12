import { auth } from "@/auth";
import { getAllTickets, updateTicketStatus } from "@/actions/support";
import { MessageSquare, AlertCircle, CheckCircle, Clock, Building2, User } from "lucide-react";

export default async function AdminSupportPage() {
    const session = await auth();
    const tickets = await getAllTickets();

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Destek Talepleri</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Kullanıcılardan gelen tüm bildirimler ve durumları.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold">
                                <th className="p-4">Durum</th>
                                <th className="p-4">Konu / Mesaj</th>
                                <th className="p-4">Kullanıcı / Firma</th>
                                <th className="p-4">Tarih</th>
                                <th className="p-4">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tickets.map((ticket: any) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            <StatusBadge status={ticket.status} />
                                            <PriorityBadge priority={ticket.priority} />
                                        </div>
                                    </td>
                                    <td className="p-4 align-top max-w-md">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                            {ticket.subject}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {ticket.message}
                                        </p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                                                <User size={14} className="text-slate-400" />
                                                {ticket.user.name || ticket.user.email}
                                            </div>
                                            {ticket.company && (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Building2 size={12} />
                                                    {ticket.company.name}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(ticket.createdAt).toLocaleDateString("tr-TR")}
                                        <br />
                                        <span className="text-xs text-slate-400">
                                            {new Date(ticket.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <form action={async (formData) => {
                                            "use server";
                                            await updateTicketStatus(ticket.id, formData.get("status") as string);
                                        }}>
                                            <select
                                                name="status"
                                                defaultValue={ticket.status}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm border-none focus:ring-2 focus:ring-brand-navy cursor-pointer"
                                                onChange={async (e) => {
                                                    // In a real client component we'd utilize onChange, but this is a server component wrapper hack.
                                                    // For better UX, this form should ideally have a submit button or be a client component.
                                                    // Adding a submit button for robustness.
                                                }}
                                            >
                                                <option value="OPEN">Açık</option>
                                                <option value="IN_PROGRESS">İnceleniyor</option>
                                                <option value="CLOSED">Çözüldü</option>
                                            </select>
                                            <button type="submit" className="ml-2 text-xs text-brand-navy hover:underline">Kaydet</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "OPEN":
            return <span className="flex items-center gap-1.5 text-blue-600 text-xs font-bold"><AlertCircle size={14} /> Açık</span>;
        case "IN_PROGRESS":
            return <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold"><Clock size={14} /> İnceleniyor</span>;
        case "CLOSED":
            return <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold"><CheckCircle size={14} /> Çözüldü</span>;
        default:
            return <span className="text-gray-600 text-xs font-bold">{status}</span>;
    }
}

function PriorityBadge({ priority }: { priority: string }) {
    switch (priority) {
        case "HIGH":
            return <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">Yüksek</span>;
        case "MEDIUM":
            return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">Orta</span>;
        case "LOW":
            return <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-[10px] font-bold">Düşük</span>;
        default:
            return null;
    }
}
