"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import GlobalHeader from "@/components/GlobalHeader";
import ActivityTracker from "@/components/ActivityTracker";

export default function LayoutClient({ children, session }: { children: React.ReactNode, session: any }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/home" || pathname === "/";
    const isLoginPage = pathname === "/login" || pathname === "/register"; // Clean view for login
    // Use includes to be safer against locale prefixes or trailing slashes
    const isDashboard = pathname?.includes("/manage") || pathname?.includes("/corp");

    if (isDashboard) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-full flex-col">
            {/* Activity Heartbeat */}
            <ActivityTracker session={session} />

            {/* Global Header: Visible everywhere except login and dashboard pages */}
            {!isLoginPage && !isDashboard && <GlobalHeader session={session} />}

            <div className="flex flex-1 overflow-hidden md:flex-row">
                {/* Sidebar: Visible ONLY for Guests (Demo Mode). Hidden for logged-in Corporate Users (Full focus). */}
                {!isHomePage && !isLoginPage && !isDashboard && !session && <Sidebar session={session} />}

                <main className="flex-1 flex flex-col bg-background text-foreground overflow-hidden">
                    <div className={`flex-1 overflow-auto ${isHomePage ? '' : 'p-4 md:p-8'} scroll-smooth relative`}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
