import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDeniedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6">
            <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="mx-auto h-24 w-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Erişim Yetkiniz Yok
                </h1>

                <p className="text-slate-600 dark:text-slate-400">
                    Bu bölüme erişim yetkiniz bulunmamaktadır. Eğer bir yanlışlık olduğunu düşünüyorsanız veya bu modüle erişmek istiyorsanız, lütfen şirket yöneticiniz ile iletişime geçin.
                </p>

                <div className="pt-4 space-y-3">
                    <Link
                        href="/corp/dashboard"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Panele Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
