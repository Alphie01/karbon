import { Scale, ShieldCheck, Library, ArrowRight, CheckCircle2, BookOpen, Globe, Users } from "lucide-react";
import Link from "next/link";
import GSAPReveal from "@/components/ui/GSAPReveal";

const regulations = [
    { title: "SKDM (Sınırda Karbon Düzenleme Mekanizması)", category: "AB Mevzuatı", year: "2026", desc: "İhracat yapan firmalar için karbon ayak izi bildirimleri." },
    { title: "Çevre Kanunu Güncellemeleri", category: "Türkiye", year: "2025", desc: "2872 sayılı kanun kapsamındaki kurumsal yükümlülükler." },
    { title: "ISO 14064-3 Doğrulama Standardı", category: "ISO Standartları", year: "2024", desc: "Emisyon beyanlarının üçüncü taraf doğrulama gereksinimleri." },
    { title: "Kurumsal Sürdürülebilirlik Raporlama Direktifi (CSRD)", category: "AB Mevzuatı", year: "2024", desc: "Büyük şirketler için ESG raporlama zorunlulukları." },
    { title: "Kyoto Protokolü Ek Yükümlülükleri", category: "Uluslararası", year: "2024", desc: "Sera gazı azaltım hedefleri ve izleme protokolleri." },
    { title: "Türkiye İklim Kanunu Taslağı", category: "Türkiye", year: "2025", desc: "Net sıfır hedeflerine yönelik yasal çerçeve." },
];

const CATEGORY_STYLE: Record<string, string> = {
    "AB Mevzuatı": "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    "Türkiye": "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
    "ISO Standartları": "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400",
    "Uluslararası": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
};

export default function LegislationPage() {
    return (
        <div className="min-h-screen bg-background">

            {/* Page Header */}
            <div className="border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                            <Scale size={16} className="text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                            Mevzuat & Çevre Standartları
                        </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Yasal Uyum ve<br />Güncel Bilgi Kütüphanesi
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                Kurumunuzun çevresel yasalara ve global standartlara tam uyum sağlaması için gerekli tüm yönetmeliklere tek noktadan erişin. Değişiklikleri anlık takip edin.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                                    <ShieldCheck size={14} className="text-violet-500" /> %100 Yasal Uyum
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                                    <Library size={14} className="text-violet-500" /> Sektörel Arşiv
                                </div>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                Platforma Tam Erişim İçin Giriş Yap <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: BookOpen, value: "500+", label: "Mevzuat Kaydı" },
                                { icon: Globe, value: "3", label: "Yasal Çerçeve" },
                                { icon: Users, value: "12", label: "Uzman Editör" },
                                { icon: Scale, value: "Anlık", label: "Güncelleme" },
                            ].map((item) => (
                                <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
                                    <div className="inline-flex p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg mb-2">
                                        <item.icon size={15} className="text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.value}</div>
                                    <div className="text-[11px] text-slate-400">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Regulations Grid */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Mevzuat Kütüphanesi</p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Güncel Düzenlemeler</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {regulations.map((reg) => (
                        <GSAPReveal key={reg.title} className="bg-white dark:bg-slate-900 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${CATEGORY_STYLE[reg.category] || "bg-slate-100 text-slate-600"}`}>
                                    {reg.category}
                                </span>
                                <span className="text-xs text-slate-400">{reg.year}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">{reg.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{reg.desc}</p>
                        </GSAPReveal>
                    ))}
                </div>

                {/* Access CTA */}
                <div className="mt-10 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Tam Arşive Erişmek İçin Giriş Yapın</h3>
                        <p className="text-xs text-slate-500">500+ mevzuat kaydı, anlık güncellemeler ve çevre mühendisleri forumuna katılın.</p>
                    </div>
                    <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
                        Giriş Yap <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Features List */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: "Sektörel Filtreleme", desc: "Sektörünüze özel mevzuatı filtreleyin." },
                        { title: "Anlık Değişiklik Bildirimleri", desc: "Yeni düzenlemelerden ilk siz haberdar olun." },
                        { title: "Çevre Mühendisleri Forumu", desc: "Uzmanlarla tartışın ve yorum paylaşın." },
                        { title: "PDF & İçe Aktarma", desc: "Mevzuatı kurumsal sistemlerinize entegre edin." },
                    ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <CheckCircle2 size={15} className="text-violet-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
