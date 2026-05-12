"use client";

import { useState } from "react";
import CorpSidebar from "@/components/corp/CorpSidebar";
import CompanySwitcher from "@/components/admin/CompanySwitcher";
import UserNavDropdown from "@/components/UserNavDropdown";
import { Menu } from "lucide-react";

export default function CorpShell({
    children,
    user,
    companies,
    currentCompanyId
}: {
    children: React.ReactNode;
    user: any;
    companies?: { id: string; name: string }[];
    currentCompanyId?: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const safeCompanies = companies || [];
    const safeCompanyId = currentCompanyId || "ALL";

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <CorpSidebar
                user={user}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-sm font-bold text-slate-500 uppercase tracking-wider truncate max-w-[150px] md:max-w-none">
                            {user?.companyName || "Kurumsal Panel"}
                        </h1>
                    </div>

                    <div className="flex-1 md:flex-none flex justify-center px-4">
                        {user?.roles?.includes("SUPER_ADMIN") && (
                            <CompanySwitcher companies={safeCompanies} currentCompanyId={safeCompanyId} />
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <UserNavDropdown user={user} hideNameOnMobile={true} />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
