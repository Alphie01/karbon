"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Scale,
    Leaf,
    Droplets,
    Bot,
    LogOut,
    Building2,
    FileVideo,
    MessageSquare,
    Briefcase,
    X,
    Mail
} from "lucide-react";
import clsx from "clsx";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Genel Bakış", href: "/manage", icon: LayoutDashboard },
    { name: "Firma Yönetimi", href: "/manage/companies", icon: Building2 },
    { name: "Kullanıcılar", href: "/manage/users", icon: Users },
    { name: "Eğitim Akademisi", href: "/manage/academy", icon: BookOpen },
    { name: "Mevzuat Kütüphanesi", href: "/manage/legislation", icon: Scale },
    { name: "Karbon Ayak İzi", href: "/manage/carbon", icon: Leaf },
    { name: "Su Ayak İzi", href: "/manage/water", icon: Droplets },
    { name: "Teşvik Robotu", href: "/manage/robot", icon: Bot },
];

export default function AdminSidebar({ user, isOpen, onClose }: { user?: any; isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const roles = user?.roles || "";

    const isSuperAdmin = roles.includes("SUPER_ADMIN");

    // Filter navigation based on roles
    const filteredNavigation = navigation.filter(item => {
        // Restricted items for Super Admin
        if (
            item.href === "/manage/users" ||
            item.href === "/manage/companies" ||
            item.href === "/manage" ||
            item.href === "/manage/academy"
        ) {
            return isSuperAdmin;
        }

        return true;
    });

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
                    <Link href="/home" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-brand-green rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                            BL
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Yönetim Paneli
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
                    {filteredNavigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
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
                            href="/corp/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-400 hover:bg-slate-800 hover:text-blue-300 transition-colors"
                        >
                            <LayoutDashboard size={20} />
                            Kurumsal Panel
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
