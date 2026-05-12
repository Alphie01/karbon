import { BookOpen, FileVideo, GraduationCap, Leaf, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import GSAPReveal from "@/components/ui/GSAPReveal";

const modules = [
    { title: "Karbon Muhasebesi Temelleri", category: "Temel", desc: "GHG Protokolü ve Kapsam 1/2/3 emisyon ölçüm yöntemleri." },
    { title: "ISO 14064 Uygulamaları", category: "İleri", desc: "Uluslararası doğrulama standartlarına uygun raporlama." },
    { title: "Su Ayak İzi Analizi", category: "Temel", desc: "ISO 14046 kapsamında mavi, yeşil ve gri su ölçümü." },
    { title: "SKDM & Karbon Vergisi", category: "Mevzuat", desc: "Sınırda Karbon Düzenleme Mekanizması ve kurumsal etkileri." },
    { title: "Teşvik & Hibe Yönetimi", category: "Pratik", desc: "KOSGEB, TÜBİTAK ve AB fonları için başvuru stratejileri." },
    { title: "Kurumsal ESG Raporlaması", category: "İleri", desc: "GRI, CDP ve CSRD standartlarında ESG raporu hazırlama." },
];

const CATEGORY_STYLE: Record<string, string> = {
    "Temel": "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
    "İleri": "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    "Mevzuat": "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400",
    "Pratik": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
};

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-background">

            {/* Page Header */}
            <div className="border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <GraduationCap size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            Sürdürülebilirlik Akademisi
                        </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Geleceği İnşa Eden<br />Kurumsal Eğitim Platformu
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                Karbon nötr hedeflerinden su ayak izi yönetimine, personelinizin yetkinliğini artırmak için tasarlanmış eğitim programları. ISO standartlarına uygun, sertifika destekli içerikler.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                İçeriklere Erişmek İçin Giriş Yap <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: BookOpen, label: "50+", sub: "Eğitim Modülü", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                                { icon: Leaf, label: "ISO", sub: "14064 & 14046", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
                                { icon: Globe, label: "GHG", sub: "Protokol", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
                            ].map((item) => (
                                <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
                                    <div className={`inline-flex p-2 rounded-lg ${item.bg} mb-2`}>
                                        <item.icon size={16} className={item.color} />
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.label}</div>
                                    <div className="text-[11px] text-slate-400">{item.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Grid */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Eğitim Modülleri</p>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Öne Çıkan İçerikler</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {modules.map((mod) => (
                        <GSAPReveal key={mod.title} className="bg-white dark:bg-slate-900 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <FileVideo size={16} className="text-slate-500" />
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${CATEGORY_STYLE[mod.category] || "bg-slate-100 text-slate-600"}`}>
                                    {mod.category}
                                </span>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{mod.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
                        </GSAPReveal>
                    ))}
                </div>

                {/* Platform Features */}
                <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Platform Özellikleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "İnteraktif Video Eğitimleri", desc: "İzleme, alıştırma ve değerlendirme aşamalı kurslar." },
                            { title: "Yetkinlik Değerlendirmesi", desc: "Katılım öncesi odak testi ve modül önerileri." },
                            { title: "Sertifika Desteği", desc: "ISO standartlarına uygun tamamlanma belgeleri." },
                            { title: "Çok Kullanıcılı Erişim", desc: "Kurumsal abonelikle tüm ekibinize erişim imkanı." },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
