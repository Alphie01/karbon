import { Leaf, Recycle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ConsultPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12 text-center mt-8">
                <h1 className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-50 tracking-tight mb-4">
                    Sürdürülebilirlik <span className="text-emerald-600 dark:text-emerald-400">Danışmanlık Merkezi</span>
                </h1>
                <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
                    Tesisinizin çevresel uyumluluğunu sağlamak, ÇED raporlama süreçlerini yönetmek ve atık/geri dönüşüm sistemlerini optimize etmek için doğru yerdesiniz.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100 dark:border-emerald-800/50 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                        <Recycle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Atık Yönetimi</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Tesisinizde oluşan atıkların yasal mevzuatlara uygun şekilde karakterizasyonu, beyanı ve yönetimi.
                    </p>
                    <button className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                        Detaylı Bilgi <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100 dark:border-emerald-800/50 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ÇED Süreçleri</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Çevresel Etki Değerlendirmesi raporlarının hazırlanması ve "ÇED Gerekli Değildir" vb. süreçlerin yönetimi.
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                        Detaylı Bilgi <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Yeşil Pusula</h3>
                    <p className="text-emerald-50 mb-6 opacity-90">
                        Tesisinize özel anında ÇED / Atık mevzuat analizi yapmak için akıllı sihirbazımızı kullanın.
                    </p>
                    <Link href="/consult/compass" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-50 transition-colors">
                        Sihirbazı Başlat <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
