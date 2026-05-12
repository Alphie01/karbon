"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Users, Droplet, ArrowRight, ArrowLeft, CheckCircle, Leaf, AlertTriangle, Recycle } from "lucide-react";

type Step = "intro" | "industry" | "capacity" | "result";

export default function EcoCompassWizard() {
    const [step, setStep] = useState<Step>("intro");
    const [data, setData] = useState({
        industry: "",
        employeeCount: "",
        hasChemicals: false
    });

    const handleNext = (nextStep: Step) => {
        setStep(nextStep);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
        exit: { opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.3 } }
    };

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 overflow-hidden relative">

            {/* Top decorative line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-600"></div>

            <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative">
                <AnimatePresence mode="wait">

                    {step === "intro" && (
                        <motion.div
                            key="intro"
                            variants={containerVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Leaf className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                                Yeşil Pusula'ya Hoş Geldiniz
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
                                Tesisinizin ÇED (Çevresel Etki Değerlendirmesi) ve Atık Yönetimi ihtiyaçlarını 2 dakikada analiz edelim.
                            </p>
                            <button
                                onClick={() => handleNext("industry")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold text-lg inline-flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-emerald-600/20"
                            >
                                Analize Başla <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === "industry" && (
                        <motion.div
                            key="industry"
                            variants={containerVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="w-full"
                        >
                            <button onClick={() => setStep("intro")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 mb-6 text-sm font-medium transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Geri
                            </button>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tesisiniz Hangi Sektörde?</h2>
                            <p className="text-slate-500 mb-8">Bu bilgi ÇED listelerini doğrulamak için gereklidir.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["Üretim / İmalat", "Lojistik / Depolama", "Tarım / Gıda", "Geri Dönüşüm", "Enerji", "Diğer"].map(ind => (
                                    <button
                                        key={ind}
                                        onClick={() => {
                                            setData({ ...data, industry: ind });
                                            setTimeout(() => handleNext("capacity"), 200);
                                        }}
                                        className={`p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20
                                            ${data.industry === ind ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-800'}`
                                        }
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border items-center justify-center flex shrink-0 border-slate-200 dark:border-slate-700">
                                            <Factory className={`w-5 h-5 ${data.industry === ind ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        </div>
                                        <span className={`font-semibold ${data.industry === ind ? 'text-emerald-800 dark:text-emerald-200' : 'text-slate-700 dark:text-slate-300'}`}>{ind}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === "capacity" && (
                        <motion.div
                            key="capacity"
                            variants={containerVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="w-full"
                        >
                            <button onClick={() => setStep("industry")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 mb-6 text-sm font-medium transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Geri
                            </button>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Kapasite ve Risk Durumu</h2>
                            <p className="text-slate-500 mb-8">Atık ve Çevre görevlisi zorunlulukları buna göre hesaplanır.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                        Çalışan Sayısı
                                    </label>
                                    <div className="flex gap-3">
                                        {["1-49", "50-250", "250+"].map(cap => (
                                            <button
                                                key={cap}
                                                onClick={() => setData({ ...data, employeeCount: cap })}
                                                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all
                                                    ${data.employeeCount === cap ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`
                                                }
                                            >
                                                {cap}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1">
                                                <Droplet className="w-4 h-4 text-amber-500" />
                                                Tehlikeli Madde / Kimyasal Kullanımı
                                            </span>
                                            <span className="text-xs text-slate-500 block">Üretimde kimyasal hammadde kullanılıyor mu?</span>
                                        </div>
                                        <div className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${data.hasChemicals ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            onClick={() => setData({ ...data, hasChemicals: !data.hasChemicals })}>
                                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${data.hasChemicals ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end">
                                <button
                                    disabled={!data.employeeCount}
                                    onClick={() => handleNext("result")}
                                    className="bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                                >
                                    Sonucu Gör <CheckCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "result" && (
                        <motion.div
                            key="result"
                            variants={containerVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="w-full"
                        >
                            <div className="text-center mb-8">
                                <div className="inline-block p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-2xl mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sürdürülebilirlik Raporunuz</h2>
                                <p className="text-slate-500">Tesisinizin tahmini uyumluluk yol haritası hazırlanmıştır.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex gap-4 items-start">
                                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-amber-900 dark:text-amber-500 mb-1">ÇED Uyumluluğu</h4>
                                        <p className="text-sm text-amber-800/80 dark:text-amber-200/70">
                                            {data.industry === "Üretim / İmalat" || data.industry === "Enerji" || data.industry === "Geri Dönüşüm"
                                                ? "Sektörünüz gereği, kapasitenize bağlı olarak ÇED (Ek-1) veya PTD (Ek-2) raporu almanız zorunludur. Uzmanlarımızla iletişime geçin."
                                                : "Muhtemelen ÇED Kapsam Dışı kalabilirsiniz. Resmi yazı ile belgelendirilmesi önerilir."}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl flex gap-4 items-start">
                                    <Recycle className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-emerald-900 dark:text-emerald-500 mb-1">Atık Yönetimi</h4>
                                        <p className="text-sm text-emerald-800/80 dark:text-emerald-200/70">
                                            {data.hasChemicals
                                                ? "Tehlikeli atıklarınız bulunacaktır. Motat üzerinden beyan edilmesi ve 6 ay - 1 yıl içinde lisanslı tesislere gönderilmesi zorunludur."
                                                : "Tehlikesiz atık planınız hazırlanmalı. Düzenli olarak sisteme bildirim yapılmalıdır."}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl flex gap-4 items-start">
                                    <Users className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-500 mb-1">Çevre Görevlisi İhtiyacı</h4>
                                        <p className="text-sm text-blue-800/80 dark:text-blue-200/70">
                                            {data.employeeCount === "250+" || (data.industry === "Üretim / İmalat" && data.hasChemicals)
                                                ? "Tesisiniz muhtemelen Çevre İzin ve Lisans Yönetmeliği kapsamında olup, tam zamanlı veya Danışmanlık firmasından hizmet alımı yoluyla Çevre Görevlisi bulundurmak zorundadır."
                                                : "Bulunduğunuz skalada Çevre Görevlisi zorunlu görünmüyor, ancak gönüllü ISO 14001 belgesi için yapılandırılabilir."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center flex gap-4">
                                <button onClick={() => { setStep("intro"); setData({ industry: '', employeeCount: '', hasChemicals: false }) }} className="flex-1 py-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-bold transition-colors">
                                    Yeniden Başla
                                </button>
                                <button className="flex-1 py-3 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20">
                                    Danışmana İlet
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
