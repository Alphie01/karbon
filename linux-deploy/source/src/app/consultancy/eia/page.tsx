import { Leaf, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function EIAConsultancyPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6">
                    <Leaf size={16} /> ÇED Danışmanlığı
                </div>
                <h1 className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-50 tracking-tight mb-4">
                    Çevresel Etki Değerlendirmesi <span className="text-emerald-600 dark:text-emerald-400">(ÇED) Süreçleri</span>
                </h1>
                <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-3xl">
                    Yatırımlarınızın planlama aşamasından işletmeye alınmasına kadar tüm süreçlerde, çevre mevzuatına tam uyum sağlamanız için gerekli "ÇED Olumlu" veya "ÇED Gerekli Değildir" kararlarının alınması uzmanlığımızdır.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100 dark:border-emerald-800/50">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Uyguladığımız Aşamalar</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Ön Değerlendirme & Kapsam Belirleme</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Projenizin ÇED Yönetmeliği kapsamındaki yerinin (Ek-1 veya Ek-2) tespit edilmesi.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Raporlama ve Başvuru</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Proje Tanıtım Dosyası (PTD) veya ÇED Raporunun ilgili bakanlık/müdürlük standartlarına uygun hazırlanması.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Süreç Takibi & Onay</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">İnceleme Değerlendirme Komisyonu (İDK) ve Halkın Katılımı Toplantısı (HKT) süreçlerinin profesyonel yönetimi.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-600 rounded-2xl p-8 border border-emerald-500 flex flex-col justify-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                    <ShieldCheck className="w-12 h-12 text-emerald-200 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Risk Almayın</h3>
                    <p className="text-emerald-100 mb-8 max-w-md">
                        ÇED Mevzuatına aykırı faaliyetler tesisinizin durdurulmasına ve idari para cezalarına yol açabilir. Hemen işletmenizin ÇED muafiyet durumunu Yeşil Pusula ile sorgulayın.
                    </p>
                    <Link href="/consultancy/compass" className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors w-full sm:w-auto shadow-lg shadow-emerald-900/20">
                        Yeşil Pusula ile Analiz Et <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
