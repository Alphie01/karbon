import { CheckCircle, XCircle, Clock, Check, X, Trash2 } from "lucide-react";
import { approveRequest, deleteRequest, rejectRequest } from "@/app/manage/actions";
import { prisma } from "@/lib/prisma";
import CreateUserButton from "@/app/manage/users/CreateUserButton";
import UserList from "@/app/manage/users/UserList";

async function getRequests() {
    return await prisma.membershipRequest.findMany({
        orderBy: { createdAt: "desc" }
    });
}

async function getUsers() {
    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { company: true }
    });
}

async function getCompanies() {
    return await prisma.company.findMany({
        orderBy: { name: "asc" }
    });
}

export default async function CRMUsersPage() {
    const requests = await getRequests();
    const users = await getUsers();
    const companies = await getCompanies();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Kullanıcılar ve Ekipler</h1>
                <div className="flex items-center gap-4">
                    <CreateUserButton companies={companies} />
                    <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                        <span className="text-sm text-slate-500">Toplam Başvuru:</span>
                        <span className="ml-2 font-bold text-lg text-brand-navy dark:text-brand-green">{requests.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckCircle className="text-brand-green" /> Üyelik Talepleri
                    </h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Şirket</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Yetkili</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">İletişim</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Durum</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Tarih</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-slate-900 dark:text-white">{req.companyName}</div>
                                    {req.message && <div className="text-xs text-slate-500 mt-1 truncate max-w-xs">{req.message}</div>}
                                </td>
                                <td className="p-4 text-slate-700 dark:text-slate-300">{req.contactName}</td>
                                <td className="p-4 text-sm">
                                    <div className="text-slate-900 dark:text-white">{req.email}</div>
                                    <div className="text-slate-500">{req.phone}</div>
                                </td>
                                <td className="p-4">
                                    {req.status === "PENDING" && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                            <Clock size={12} /> Bekliyor
                                        </span>
                                    )}
                                    {req.status === "APPROVED" && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            <CheckCircle size={12} /> Onaylandı
                                        </span>
                                    )}
                                    {req.status === "REJECTED" && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                            <XCircle size={12} /> Reddedildi
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {req.status === "PENDING" && (
                                            <>
                                                <form action={approveRequest.bind(null, req.id) as any}>
                                                    <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 transition-colors" title="Onayla">
                                                        <Check size={16} />
                                                    </button>
                                                </form>
                                                <form action={rejectRequest.bind(null, req.id) as any}>
                                                    <button className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 transition-colors" title="Reddet">
                                                        <X size={16} />
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                        <form action={deleteRequest.bind(null, req.id) as any}>
                                            <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors" title="Sil">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">Henüz bir talep bulunmuyor.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UserList users={users} companies={companies} />
        </div>
    );
}
