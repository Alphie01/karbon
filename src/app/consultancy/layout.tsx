import Link from "next/link";
import { Compass, Leaf, Recycle, Map, LogOut } from "lucide-react";
import ForceHidePublicNav from "@/components/ForceHidePublicNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ConsultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Optionally check if user is logged in if this should be protected
    // const session = await auth();
    // if (!session?.user) redirect("/login");

    return (
        <>
            <style>{`
                #global-header, #public-sidebar { display: none !important; }
            `}</style>
            <ForceHidePublicNav />
            <div className="flex h-screen bg-emerald-50 dark:bg-emerald-950/20 overflow-hidden font-geist-sans">
                {/* Consult Sidebar */}
                <aside className="w-64 bg-emerald-900 text-emerald-50 flex flex-col hidden md:flex">
                    <div className="p-6 flex items-center gap-3">
                        <Leaf className="w-8 h-8 text-emerald-400" />
                        <span className="font-bold text-xl tracking-tight">Eco Consult</span>
                    </div>

                    <nav className="flex-1 px-4 py-8 space-y-2">
                        <Link href="/consultancy" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors">
                            <Map className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium">Genel Bakış</span>
                        </Link>
                        <Link href="/consultancy/compass" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-800/50 hover:bg-emerald-800 transition-colors border border-emerald-700/50">
                            <Compass className="w-5 h-5 text-amber-400" />
                            <span className="font-medium">Yeşil Pusula</span>
                        </Link>
                        <div className="pt-4 mt-4 border-t border-emerald-800/50">
                            <div className="px-4 py-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">Hizmetler</div>
                            <Link href="/consultancy/waste" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-left">
                                <Recycle className="w-5 h-5 text-emerald-400" />
                                <span className="font-medium">Atık Yönetimi</span>
                            </Link>
                            <Link href="/consultancy/eia" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-left">
                                <Leaf className="w-5 h-5 text-emerald-400" />
                                <span className="font-medium">ÇED Danışmanlığı</span>
                            </Link>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-emerald-800">
                        <Link href="/home" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-emerald-200 hover:text-white">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Ana Sayfaya Dön</span>
                        </Link>
                    </div>
                </aside>

                {/* Consult Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0 z-10">
                        <h1 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Danışmanlık Merkezi
                        </h1>
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                            <span className="text-sm font-medium">Hoş Geldiniz</span>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
