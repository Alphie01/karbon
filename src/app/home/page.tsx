"use client";

import Link from "next/link";
import { Leaf, Droplets, BookOpen, TrendingUp, ArrowRight, ShieldCheck, Scale, CheckCircle2, UserCheck, Globe, BarChart3, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fade = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const stagger = {
    show: { transition: { staggerChildren: 0.09 } },
};

export default function HomePage() {
    const { t } = useLanguage();

    const modules = [
        {
            title: `${t.home.karbon} Ayak İzi`,
            desc: "GHG Protokolü ve ISO 14064 standartlarıyla Kapsam 1, 2 ve 3 emisyonlarınızı ölçün, raporlayın.",
            icon: Leaf,
            href: "/carbon",
            accent: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            title: `${t.home.su} Ayak İzi`,
            desc: "ISO 14046 standardıyla mavi, yeşil ve gri su tüketiminizi hesaplayın, su stresi riskini değerlendirin.",
            icon: Droplets,
            href: "/water",
            accent: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: t.home.financeAnalysis || "Teşvik Analizi",
            desc: "Şirket profilinize göre yerel ve uluslararası hibe programlarını, teşvikleri ve destekleri analiz edin.",
            icon: TrendingUp,
            href: "/robot",
            accent: "text-amber-600 dark:text-amber-400",
            iconBg: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            title: t.home.egitim,
            desc: "Sürdürülebilirlik, karbon muhasebesi ve çevre mevzuatı konularında kurumsal eğitim içerikleri.",
            icon: BookOpen,
            href: "/learn",
            accent: "text-violet-600 dark:text-violet-400",
            iconBg: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            title: t.home.mevzuat,
            desc: "Güncel çevre ve iklim mevzuatını takip edin. Mevzuat değişikliklerinden haberdar olun.",
            icon: Scale,
            href: "/legislation",
            accent: "text-slate-600 dark:text-slate-400",
            iconBg: "bg-slate-100 dark:bg-slate-800",
        },
        {
            title: t.home.danismanlik,
            desc: "Karbon yönetimi, ÇED raporları ve atık yönetimi için uzman danışmanlık hizmetleri.",
            icon: UserCheck,
            href: "/consultancy",
            accent: "text-teal-600 dark:text-teal-400",
            iconBg: "bg-teal-50 dark:bg-teal-900/20",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="pt-16 pb-24 px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial="hidden" animate="show" variants={stagger}>

                        <motion.div variants={fade} className="mb-6">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                                <Globe size={11} />
                                B2B Kurumsal Sürdürülebilirlik Platformu
                            </span>
                        </motion.div>

                        <motion.h1 variants={fade} className="text-4xl lg:text-[52px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
                            {t.home.heroTitle}
                            <br />
                            <span className="text-emerald-600 dark:text-emerald-400">{t.home.heroTitleAccent}</span>
                        </motion.h1>

                        <motion.p variants={fade} className="text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
                            {t.home.heroDesc}
                        </motion.p>

                        <motion.div variants={fade} className="flex flex-wrap gap-3">
                            <Link
                                href="/request-access"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                {t.home.demoRequest}
                                <ArrowRight size={15} />
                            </Link>
                            <Link
                                href="#modules"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                            >
                                {t.home.services || "Modülleri Keşfet"}
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                                {t.home.loginButton}
                                <ArrowRight size={14} />
                            </Link>
                        </motion.div>

                        <motion.div variants={fade} className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-8 gap-y-3">
                            {["ISO 14064 Uyumlu", "ISO 14046 Uyumlu", "GHG Protokolü Standart"].map((badge) => (
                                <div key={badge} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                    {badge}
                                </div>
                            ))}
                        </motion.div>

                    </motion.div>
                </div>
            </section>

            {/* ── PLATFORM PILLARS ─────────────────────────────────────── */}
            <section className="py-0 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                        {[
                            { label: t.home.stat1Title, desc: t.home.stat1Desc, icon: ShieldCheck },
                            { label: t.home.stat2Title, desc: t.home.stat2Desc, icon: BarChart3 },
                            { label: t.home.stat3Title, desc: t.home.stat3Desc, icon: Building2 },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07, duration: 0.3 }}
                                className="py-10 px-8"
                            >
                                <item.icon size={18} className="text-emerald-500 mb-3" />
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{item.label}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MODULES ──────────────────────────────────────────────── */}
            <section id="modules" className="py-20 px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                            {t.home.modulesTitle}
                        </p>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {t.home.modulesSubtitle}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        {modules.map((mod, i) => (
                            <motion.div
                                key={mod.href}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.3 }}
                                className="bg-white dark:bg-slate-900 p-6 flex flex-col"
                            >
                                <div className={`inline-flex p-2 rounded-lg ${mod.iconBg} mb-4 w-fit`}>
                                    <mod.icon size={18} className={mod.accent} />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{mod.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">{mod.desc}</p>
                                <Link
                                    href={mod.href}
                                    className={`inline-flex items-center gap-1 text-xs font-semibold ${mod.accent} hover:opacity-70 transition-opacity`}
                                >
                                    {t.home.explore || "İncele"}
                                    <ArrowRight size={11} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY US ───────────────────────────────────────────────── */}
            <section id="features" className="py-20 px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        <div>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
                                {t.home.whyUsTitle}
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                                {t.home.whyUsSubtitle}
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { title: t.home.why1Title, desc: t.home.why1Desc },
                                    { title: t.home.why2Title, desc: t.home.why2Desc },
                                    { title: t.home.why3Title, desc: t.home.why3Desc },
                                ].map((item) => (
                                    <li key={item.title} className="flex gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:border-l border-slate-200 dark:border-slate-800 lg:pl-12">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                                Platform Kapsamı
                            </p>
                            <div className="space-y-3">
                                {[
                                    { label: "GHG Protokolü — Kurumsal Standart", sub: "Kapsam 1, 2 ve 3 emisyon ölçümü" },
                                    { label: "ISO 14064-1:2018 Uyumlu Raporlama", sub: "Uluslararası sertifike hazır format" },
                                    { label: "ISO 14046:2014 Su Ayak İzi Analizi", sub: "Mavi, yeşil ve gri su kategorileri" },
                                    { label: "KOSGEB, TÜBİTAK ve AB Hibeleri", sub: "Teşvik uygunluk analizi" },
                                    { label: "Rol Tabanlı Erişim Kontrolü (RBAC)", sub: "SUPER_ADMIN / CORP_ADMIN / USER" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="py-20 px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.home.ctaTitle}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">{t.home.ctaDesc}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/request-access"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            {t.home.demoRequest}
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                        >
                            {t.home.loginButton}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────── */}
            <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
                {t.home.footer}
            </footer>

        </div>
    );
}
