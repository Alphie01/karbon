import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, BookOpen, Scale, FileCheck, ArrowRight, Building2, Leaf, Droplets, Bot } from "lucide-react";

async function getStats() {
    const userCount = await prisma.user.count();
    const requestCount = await prisma.membershipRequest.count({ where: { status: "PENDING" } });
    const videoCount = await prisma.video.count();
    const companyCount = await prisma.company.count();
    return { userCount, requestCount, videoCount, companyCount };
}

async function getRecentRequests() {
    return prisma.membershipRequest.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5,
    });
}

export default async function ManagePage() {
    const [stats, recentRequests] = await Promise.all([getStats(), getRecentRequests()]);

    const statCards = [
        { title: "Toplam Kullanıcı", value: stats.userCount.toString(), icon: Users, href: "/manage/users", accentText: "text-blue-600 dark:text-blue-400", accentBg: "bg-blue-50 dark:bg-blue-900/20" },
        { title: "Bekleyen Talepler", value: stats.requestCount.toString(), icon: FileCheck, href: "/manage/users", accentText: "text-amber-600 dark:text-amber-400", accentBg: "bg-amber-50 dark:bg-amber-900/20" },
        { title: "Kayıtlı Firmalar", value: stats.companyCount.toString(), icon: Building2, href: "/manage/companies", accentText: "text-emerald-600 dark:text-emerald-400", accentBg: "bg-emerald-50 dark:bg-emerald-900/20" },
        { title: "Eğitim Videoları", value: stats.videoCount.toString(), icon: BookOpen, href: "/manage/academy", accentText: "text-violet-600 dark:text-violet-400", accentBg: "bg-violet-50 dark:bg-violet-900/20" },
    ];

    const quickLinks = [
        { title: "Firma Yönetimi", desc: "Şirket ekle, düzenle, modül ata", href: "/manage/companies", icon: Building2 },
        { title: "Kullanıcılar", desc: "Kullanıcıları ve rolleri yönet", href: "/manage/users", icon: Users },
        { title: "Karbon Verileri", desc: "Emisyon girdilerini yönet", href: "/manage/carbon", icon: Leaf },
        { title: "Su Verileri", desc: "Su raporu verilerini yönet", href: "/manage/water", icon: Droplets },
        { title: "Mevzuat", desc: "Kayıtları düzenle ve içe aktar", href: "/manage/legislation", icon: Scale },
        { title: "Teşvik Robotu", desc: "Hibe ve teşvik verilerini güncelle", href: "/manage/robot", icon: Bot },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Genel Bakış</h1>
                <p className="text-sm text-slate-500">Platform istatistikleri ve hızlı erişim.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Link key={stat.title} href={stat.href} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
                        <div className={`inline-flex p-2 rounded-lg ${stat.accentBg} mb-3`}>
                            <stat.icon size={16} className={stat.accentText} />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                        <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Quick Links */}
                <div className="lg:col-span-3">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Hızlı Erişim</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors group"
                            >
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                    <link.icon size={15} className="text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{link.title}</p>
                                    <p className="text-xs text-slate-400">{link.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Bekleyen Talepler</h2>
                        <Link href="/manage/users" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                            Tümü <ArrowRight size={10} />
                        </Link>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        {recentRequests.length === 0 ? (
                            <div className="py-10 text-center text-sm text-slate-400">
                                Bekleyen talep yok.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentRequests.map((req) => (
                                    <div key={req.id} className="px-4 py-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{req.contactName}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[160px]">{req.email}</p>
                                        </div>
                                        <span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/40 whitespace-nowrap">
                                            Bekliyor
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
