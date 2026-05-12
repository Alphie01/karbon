"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, Droplets, BookOpen, MessageSquare, Gift, LogOut, Scale, ChevronLeft, ChevronRight, Workflow, UserCheck } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";



import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar({ session }: { session: any }) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const userRoles = (session?.user as any)?.roles || "";
    const allowedModulesStr = (session?.user as any)?.allowedModules || "";
    const allowedModules = allowedModulesStr.split(",");
    const hasFullAccess = allowedModules.includes("ALL") || userRoles.includes("SUPER_ADMIN") || userRoles.includes("CORP_ADMIN");

    const navigation = [
        { name: t.nav.home, href: "/home", icon: Home, module: "ALL" },
        { name: t.nav.carbon, href: "/carbon", icon: Leaf, module: "CARBON" },
        { name: t.nav.water, href: "/water", icon: Droplets, module: "WATER" },
        { name: t.nav.learn, href: "/learn", icon: BookOpen, module: "ACADEMY" },
        { name: t.nav.legislation, href: "/legislation", icon: Scale, module: "LIBRARY" },
        { name: t.nav.robot, href: "/robot", icon: Gift, module: "INCENTIVES" },
        { name: t.nav.consultancy, href: "/consultancy", icon: UserCheck, module: "ALL" },
    ].filter(item => {
        if (!session) return true; // Show all for guests (Demo mode)
        if (item.module === "ALL") return true;
        if (hasFullAccess) return true;
        return allowedModules.includes(item.module);
    });

    // Hide Sidebar on Home Page explicitly if Layout logic misses it (double safety)
    if (pathname === "/home" || pathname === "/") {
        return null;
    }

    return (
        <div
            id="public-sidebar"
            className={clsx(
                "relative flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-all duration-300 ease-in-out shadow-xl z-20",
                isCollapsed ? "w-0 border-none" : "w-72 border-r border-slate-200 dark:border-slate-800"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Toggle "Ear" Tab */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={clsx(
                    "absolute top-24 -right-6 w-6 h-12 bg-brand-navy dark:bg-brand-green rounded-r-lg flex items-center justify-center cursor-pointer shadow-md transition-all z-50",
                    isCollapsed ? "opacity-100" : "opacity-50 hover:opacity-100"
                )}
                title={isCollapsed ? t.common.menuShow : t.common.menuHide}
            >
                {isCollapsed ? (
                    <ChevronRight className="text-white h-4 w-4" />
                ) : (
                    <ChevronLeft className="text-white h-4 w-4" />
                )}
            </button>

            {/* Sidebar Content (Hidden if collapsed) */}
            <div className={clsx("flex flex-col h-full overflow-hidden", isCollapsed && "hidden")}>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "group relative flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/25"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-brand-green rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}

                                <item.icon
                                    className={clsx(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-brand-green" : "text-slate-400 group-hover:text-brand-navy dark:group-hover:text-white"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {session && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/30">
                        <button
                            onClick={() => import("next-auth/react").then(({ signOut }) => signOut())}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/10 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                        >
                            <LogOut size={18} />
                            {t.common.logout}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
