import { Leaf, Activity, TrendingUp, HandCoins, Workflow, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import GSAPReveal from "@/components/ui/GSAPReveal";

const services = [
    {
        icon: Workflow,
        title: "Süreç Analizi",
        description: "Her iş sürecinizin karbon ve su ayak izini ölçün, yüksek emisyonlu operasyonları tespit edin.",
        href: "/consultancy/compass",
        color: "emerald",
    },
    {
        icon: HandCoins,
        title: "Hibe & Teşvik Uyumu",
        description: "Verilerinizi yeşil hibe şartlarına göre hazırlayın, KOSGEB ve TÜBİTAK programlarına uygunluğu belgeleyin.",
        href: "/consultancy/eia",
        color: "amber",
    },
    {
        icon: Leaf,
        title: "ÇED & Atık Yönetimi",
        description: "Çevresel etki değerlendirmesi ve atık yönetim planlaması için uzman rehberlik.",
        href: "/consultancy/waste",
        color: "blue",
    },
];

const capabilities = [
    "ISO 14064-1 Karbon Envanteri",
    "ISO 14046 Su Ayak İzi Hesabı",
    "GHG Protocol Uyumu",
    "SKDM / CBAM Hazırlığı",
    "Yeşil Hibe Raporlaması",
    "Üçüncü Taraf Doğrulama Desteği",
];

export default function ConsultPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <Activity size={16} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                            İş Analizi & Danışmanlık
                        </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Süreçlerinizi Optimize Edin,<br />Teşvikleri Yakalayın
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                Her iş sürecinizin çevresel ayak izini ölçün. Elde ettiğiniz verilerle yeşil dönüşüm yatırımlarınızı planlayın ve hibe programlarına uygunluğunuzu belgeleyin.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                Platforma Erişin <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Capability checklist */}
                        <div className="grid grid-cols-1 gap-2">
                            {capabilities.map((cap) => (
                                <div key={cap} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <CheckCircle2 size={14} className="text-amber-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{cap}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Hizmet Alanları</p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danışmanlık Modülleri</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {services.map((svc) => (
                        <GSAPReveal key={svc.title} className="bg-white dark:bg-slate-900 p-6 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <Link href={svc.href} className="block h-full">
                                <div className={`inline-flex p-2.5 rounded-lg mb-4 ${
                                    svc.color === "emerald" ? "bg-emerald-50 dark:bg-emerald-900/20" :
                                    svc.color === "amber" ? "bg-amber-50 dark:bg-amber-900/20" :
                                    "bg-blue-50 dark:bg-blue-900/20"
                                }`}>
                                    <svc.icon size={18} className={
                                        svc.color === "emerald" ? "text-emerald-600 dark:text-emerald-400" :
                                        svc.color === "amber" ? "text-amber-600 dark:text-amber-400" :
                                        "text-blue-600 dark:text-blue-400"
                                    } />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 transition-colors">
                                    {svc.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {svc.description}
                                </p>
                                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-amber-600 transition-colors">
                                    Modüle Git <ArrowRight size={11} />
                                </div>
                            </Link>
                        </GSAPReveal>
                    ))}
                </div>

                {/* Grant Compliance CTA */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <div className="bg-white dark:bg-slate-900 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={16} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">Süreç İyileştirme</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Karbon ve su ayak izi verilerinizi süreç bazında kıyaslayarak operasyonel verimliliği artırın.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <HandCoins size={16} className="text-amber-500" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">Hibe Raporlaması</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Platform verilerini doğrudan hibe başvuru belgelerine dönüştürün. KOSGEB, TÜBİTAK ve AB fonları için hazır.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
