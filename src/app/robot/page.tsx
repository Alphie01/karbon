import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GrantRobot from "@/components/GrantRobot";
import { TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function RobotPage() {
    const session = await auth();
    if (session?.user) {
        redirect("/corp/robot");
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Page Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <TrendingUp size={16} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                            Hibe & Teşvik Robotu
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        Finansal Çözümler
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-6">
                        İşletmenize uygun hibe, teşvik ve kredi fırsatlarını yapay zeka destekli analizle keşfedin. Detaylı proje analizi ve başvuru asistanı için giriş yapın.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            Kurumsal Giriş <ArrowRight size={14} />
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <ShieldCheck size={14} className="text-amber-500" />
                            KOSGEB, TÜBİTAK & AB Destekleri
                        </div>
                    </div>
                </div>
            </div>

            {/* Robot */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <GrantRobot />
            </div>

        </div>
    );
}
