import { PrismaClient } from "@prisma/client";
import { Users, BookOpen, Scale, TrendingUp, Activity, FileCheck } from "lucide-react";

const prisma = new PrismaClient();

async function getStats() {
    const userCount = await prisma.user.count();
    const requestCount = await prisma.membershipRequest.count({ where: { status: "PENDING" } });
    const videoCount = await prisma.video.count();
    // In a real app, fetch more stats like total carbon calculations, etc.
    return { userCount, requestCount, videoCount };
}

export default async function ManagePage() {
    const stats = await getStats();

    const statCards = [
        { title: "Toplam Kullanıcı", value: stats.userCount.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { title: "Bekleyen Talepler", value: stats.requestCount.toString(), icon: FileCheck, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { title: "Eğitim Videoları", value: stats.videoCount.toString(), icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        { title: "Mevzuat Kaydı", value: "124", icon: Scale, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Genel Bakış</h1>
                <p className="text-slate-500">Platform istatistikleri ve özet durumu.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.title} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm">{stat.title}</h3>
                    </div>
                ))}
            </div>

            {/* Quick Activity or Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-80 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aktivite Grafiği (Hazırlanıyor)</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-80 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Kullanım İstatistikleri (Hazırlanıyor)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
