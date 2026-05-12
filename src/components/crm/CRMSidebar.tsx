"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Mail,
    Calendar,
    Briefcase,
    FileText,
    PieChart,
    Share2,
    LogOut,
    X,
    Settings,
    Users
} from "lucide-react";
import clsx from "clsx";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "CRM Ana Ekran", href: "/crm", icon: LayoutDashboard },
    { name: "Satış & Lead (Müşteriler)", href: "/crm/leads", icon: Briefcase },
    { name: "Teklifler (Proposals)", href: "/crm/proposals", icon: FileText },
    { name: "Takvim & Toplantılar", href: "/crm/calendar", icon: Calendar },
    { name: "Finans & Gelir", href: "/crm/finance", icon: PieChart },
    { name: "Ortak Mail (Gelen Kutusu)", href: "/crm/mail", icon: Mail },
    { name: "Sosyal Medya Yönetimi", href: "/crm/social-media", icon: Share2 },
    { name: "Kullanıcılar ve Ekipler", href: "/crm/users", icon: Users },
];

export default function CRMSidebar({ user, isOpen, onClose }: { user?: any; isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <Link href="/crm" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                            CRM
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Portalı
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        // Check if active (handle sub-paths like /crm/leads/new)
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/crm");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <Link
                            href="/manage"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <Settings size={20} />
                            Sistem Yönetimi (Admin)
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Güvenli Çıkış
                    </button>
                </div>
            </div>
        </>
    );
}
