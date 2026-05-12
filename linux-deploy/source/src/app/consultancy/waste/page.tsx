import { Recycle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WasteManagementPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6">
                    <Recycle size={16} /> Atık Yönetimi
                </div>
                <h1 className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-50 tracking-tight mb-4">
                    Tesis İçi <span className="text-emerald-600 dark:text-emerald-400">Atık Yönetim Sistemleri</span>
                </h1>
                <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-3xl">
                    Endüstriyel tesislerinizin veya işletmelerinizin sıfır atık hedeflerine ulaşmasını sağlıyoruz. Oluşan atıkların kaynağında, yasal mevzuata uygun şekilde yönetimi.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100 dark:border-emerald-800/50">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Hizmet Kapsamımız</h3>
                    <ul className="space-y-4">
                        {[
                            "Sıfır Atık Belgesi başvuru ve süreç yönetimi",
                            "Tesis İçi Atık Yönetim Planı hazırlanması",
                            "Tehlikeli ve Tehlikesiz atık beyanları (MOTAT-TABS)",
                            "Atık sahası tasarımı ve mevzuata uygunluk denetimi",
                            "Atık azaltım stratejileri ve geri kazanım projeleri",
                        ].map((item, index) => (
                            <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-800/30 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">Hemen Başlayın</h3>
                    <p className="text-emerald-700 dark:text-emerald-300 mb-8">
                        Tesisinizin mevcut durumunu analiz etmek ve yasal yükümlülüklerinizi öğrenmek için "Yeşil Pusula" modülünü kullanabilirsiniz.
                    </p>
                    <Link href="/consultancy/compass" className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-500 transition-colors w-full sm:w-auto shadow-lg shadow-emerald-600/20">
                        Yeşil Pusula'yı Başlat <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
