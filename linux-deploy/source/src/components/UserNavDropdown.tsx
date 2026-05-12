"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Briefcase, Building } from "lucide-react";

interface UserNavDropdownProps {
    user: any;
    hideNameOnMobile?: boolean;
}

export default function UserNavDropdown({ user, hideNameOnMobile = false }: UserNavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (!user) return null;

    const roles = user.roles || "";
    const isSuperAdmin = roles.includes("SUPER_ADMIN");
    const hasCRM = roles.includes("CRM") || isSuperAdmin;
    const isAdminMode = roles.includes("ADMIN") || isSuperAdmin || roles.includes("CORP_ADMIN") || user.role === "admin";

    const initial = user.name?.charAt(0) || "U";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white flex items-center justify-center text-xs sm:text-sm shadow-inner">
                    <User size={16} className="hidden sm:block" />
                    <span className="sm:hidden">{initial}</span>
                </div>
                <span className={`truncate max-w-[120px] ${hideNameOnMobile ? 'hidden sm:inline-block' : 'inline-block'}`}>
                    {user.name || user.email}
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                        {(isAdminMode || hasCRM) && (
                            <>
                                {isAdminMode && (
                                    <Link
                                        href="/manage"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                                    >
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-md group-hover:scale-110 transition-transform">
                                            <LayoutDashboard size={16} />
                                        </div>
                                        Sistem Yönetimi (Admin)
                                    </Link>
                                )}

                                {hasCRM && (
                                    <Link
                                        href="/crm"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                                    >
                                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-md group-hover:scale-110 transition-transform">
                                            <Briefcase size={16} />
                                        </div>
                                        CRM & Sosyal Medya
                                    </Link>
                                )}

                                {isAdminMode && (
                                    <Link
                                        href="/corp/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                                    >
                                        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-1.5 rounded-md group-hover:scale-110 transition-transform">
                                            <Building size={16} />
                                        </div>
                                        Kurumsal Panel (Müşteri Modu)
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Güvenli Çıkış
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
