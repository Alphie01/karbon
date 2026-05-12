"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Leaf,
    Droplets,
    Bot,
    BookOpen,
    Scale,
    LogOut,
    MessageSquare,
    Menu,
    X,
    Workflow
} from "lucide-react";
import clsx from "clsx";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Panelim", href: "/corp/dashboard", icon: LayoutDashboard },
    { name: "Karbon Ayak İzi", href: "/corp/carbon", icon: Leaf },
    { name: "Su Ayak İzi", href: "/corp/water", icon: Droplets },
    { name: "Teşvik Robotu", href: "/corp/robot", icon: Bot },
    { name: "İş Süreç Analizi", href: "/corp/analysis", icon: Workflow },
    { name: "Eğitim Akademisi", href: "/corp/academy", icon: BookOpen },
    { name: "Mevzuat Kütüphanesi", href: "/corp/legislation", icon: Scale },
];

export default function CorpSidebar({ user, isOpen, onClose }: { user?: any; isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const roles = user?.roles || [];
    const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN") || (user?.role === "admin");

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
                    <Link href="/corp/dashboard" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                            BL
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Kurumsal Panel
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
                        const isActive = pathname === item.href || pathname.startsWith(item.href);
                        // Exception for dashboard to match exact
                        const isExactAPI = item.href === "/corp/dashboard" ? pathname === item.href : isActive;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isExactAPI
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <Link
                                href="/manage"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-slate-800 hover:text-purple-300 transition-colors"
                            >
                                <LayoutDashboard size={20} />
                                Yönetim Paneli
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </>
    );
}
