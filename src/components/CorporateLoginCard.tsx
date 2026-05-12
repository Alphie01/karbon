import Link from "next/link";
import { Building2, ArrowRight, Lock } from "lucide-react";

export default function CorporateLoginCard() {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-slate-900 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform opacity-100" />
            <div className="relative bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-6">
                <div className="h-16 w-16 bg-brand-navy/10 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
                    <Building2 className="h-8 w-8 text-brand-navy dark:text-white" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kurumsal Çözümler</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                        Şirketiniz için gelişmiş özellikler, detaylı raporlama ve API erişimi.
                    </p>
                </div>

                <div className="w-full space-y-3 pt-4">
                    <Link
                        href="/login"
                        className="flex items-center justify-center w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                        Kurumsal Giriş Yap <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Lock className="inline w-3 h-3 mr-1" />
                        Kurumsal üyelik davetiye usulüyle çalışır.{" "}
                        <Link href="/request-access" className="text-brand-navy dark:text-brand-green underline hover:text-brand-green transition-colors">
                            Üyelik ve bilgi için bizimle iletişime geçin.
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
