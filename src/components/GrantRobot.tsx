"use client";

import { useState } from "react";
import { grants, Grant } from "@/data/grants";
import { Bot, Search, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function GrantRobot() {
    const [step, setStep] = useState<"input" | "processing" | "results">("input");
    const [formData, setFormData] = useState({
        sector: "",
        employeeCount: "",
        projectType: "",
        budget: "",
        scope: "",
    });
    const [results, setResults] = useState<Grant[]>([]);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const runAnalysis = () => {
        setStep("processing");

        // Simulate AI Processing
        setTimeout(() => {
            const matchedGrants = grants.filter(grant => {
                // Simple matching logic
                const sectorMatch = grant.sectors.includes("All") || (formData.sector && grant.sectors.includes(formData.sector));
                const categoryMatch = !formData.projectType || grant.category === formData.projectType || grant.category === "Genel";
                const sizeMatch = !formData.employeeCount || !grant.maxEmployee || parseInt(formData.employeeCount) <= grant.maxEmployee;
                const scopeMatch = !formData.scope || grant.scope === formData.scope || (formData.scope === "International" && (grant.scope === "EU" || grant.scope === "Global"));

                return sectorMatch && categoryMatch && sizeMatch && scopeMatch;
            });

            setResults(matchedGrants);
            setStep("results");
        }, 2000);
    };

    if (step === "input") {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center">
                        <Bot className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hibe Analiz Robotu</h2>
                        <p className="text-slate-500 dark:text-slate-400">Firmanız için en uygun ulusal ve uluslararası destekleri yapay zeka ile bulun.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sektörünüz</label>
                        <select
                            name="sector"
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
                            onChange={handleInputChange}
                        >
                            <option value="" className="text-slate-900 dark:text-white">Seçiniz...</option>
                            <option value="Bilişim" className="text-slate-900 dark:text-white">Bilişim & Yazılım</option>
                            <option value="Üretim" className="text-slate-900 dark:text-white">Üretim & Sanayi</option>
                            <option value="Tarım" className="text-slate-900 dark:text-white">Tarım & Hayvancılık</option>
                            <option value="Turizm" className="text-slate-900 dark:text-white">Turizm & Hizmet</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Çalışan Sayısı</label>
                        <select
                            name="employeeCount"
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
                            onChange={handleInputChange}
                        >
                            <option value="">Seçiniz...</option>
                            <option value="5">0 - 10 (Mikro)</option>
                            <option value="25">10 - 50 (Küçük)</option>
                            <option value="100">50 - 250 (Orta)</option>
                            <option value="500">250+ (Büyük)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Proje Türü</label>
                        <select
                            name="projectType"
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
                            onChange={handleInputChange}
                        >
                            <option value="">Tümü</option>
                            <option value="Arg-Ge">Ar-Ge & İnovasyon</option>
                            <option value="Dijitalleşme">Dijitalleşme</option>
                            <option value="İhracat">İhracat</option>
                            <option value="Enerji">Yeşil Enerji</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hedeflenen Fon Kaynağı</label>
                        <select
                            name="scope"
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
                            onChange={handleInputChange}
                        >
                            <option value="">Farketmez (Tümü)</option>
                            <option value="National">Ulusal (Türkiye - KOSGEB, TÜBİTAK vb.)</option>
                            <option value="EU">Avrupa Birliği (Horizon, Erasmus+)</option>
                            <option value="Global">Global Fonlar</option>
                            <option value="International">Tüm Uluslararası (EU + Global)</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={runAnalysis}
                        disabled={!formData.sector || !formData.employeeCount}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search size={20} />
                        Analizi Başlat
                    </button>
                </div>
            </div>
        );
    }

    if (step === "processing") {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="mb-8 relative mx-auto h-32 w-32">
                    <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
                    <Bot className="absolute inset-0 m-auto h-12 w-12 text-rose-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Veritabanı Taranıyor...</h3>
                <p className="text-slate-500 dark:text-slate-400">Ulusal ve uluslararası hibe veritabanları (KOSGEB, Horizon Europe) analiz ediliyor.</p>

                <div className="mt-8 mx-auto max-w-sm space-y-2 text-sm text-slate-400">
                    <div className="flex justify-between items-center">
                        <span>Sektör Uyumu</span>
                        <span className="text-green-500"><CheckCircle2 size={16} /></span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Bölgesel Kapsam (TR/EU)</span>
                        <span className="text-green-500 animate-pulse">...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Modal Overlay */}
            {selectedGrant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                        selectedGrant.scope === "EU" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                            selectedGrant.scope === "Global" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    )}>
                                        {selectedGrant.scope === "EU" ? "AB Desteği" : selectedGrant.scope === "Global" ? "Global Fon" : "Ulusal Destek"}
                                    </span>
                                    <span className="text-slate-500 text-xs font-semibold">• {selectedGrant.organization}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {selectedGrant.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedGrant(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                                    Programın Amacı
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                    {selectedGrant.details.purpose}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Kimler Başvurabilir?</h4>
                                    <ul className="space-y-2">
                                        {selectedGrant.details.eligibleApplicants.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Destek Kapsamı</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedGrant.details.coverage}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex-1">
                                    <div className="text-xs text-slate-500 mb-1">Destek Üst Limiti</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                        {selectedGrant.maxAmount.toLocaleString('tr-TR')} {selectedGrant.currency}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-slate-500 mb-1">Hibe Oranı</div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-500">
                                        %{selectedGrant.matchRate}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-slate-500 mb-1">Son Başvuru</div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                        {selectedGrant.details.applicationDeadline || "Belirtilmemiş"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedGrant(null)}
                                className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Kapat
                            </button>
                            <button className="px-5 py-2.5 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-colors flex items-center gap-2">
                                Başvuru Ekranına Git <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analiz Sonuçları</h2>
                        <p className="text-slate-500 dark:text-slate-400">İşletmeniz için uygun {results.length} destek programı bulundu.</p>
                    </div>
                    <button
                        onClick={() => setStep("input")}
                        className="text-sm font-bold text-rose-500 hover:text-rose-600 underline"
                    >
                        Yeni Sorgu
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {results.length > 0 ? results.map((grant) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={grant.id}
                            className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 transition-colors group relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={clsx(
                                            "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                            grant.scope === "EU" ? "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" :
                                                grant.scope === "Global" ? "bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400" :
                                                    "bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                                        )}>
                                            {grant.scope === "EU" ? "🇪🇺 AB Desteği" : grant.scope === "Global" ? "🌍 Global" : "🇹🇷 Ulusal"}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                            {grant.organization}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400">
                                            {grant.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                        {grant.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {grant.description}
                                    </p>
                                </div>

                                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[140px] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                    <div className="text-left md:text-right">
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destek Limiti</div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                            {grant.maxAmount.toLocaleString('tr-TR')} {grant.currency}
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hibe Oranı</div>
                                        <div className="text-lg font-bold text-green-600 dark:text-green-500">
                                            %{grant.matchRate}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedGrant(grant)}
                                        className="hidden md:block w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Detaylı İncele
                                    </button>
                                </div>
                                {/* Mobile Button */}
                                <button
                                    onClick={() => setSelectedGrant(grant)}
                                    className="md:hidden w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity mt-4"
                                >
                                    Detaylı İncele
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-12">
                            <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sonuç Bulunamadı</h3>
                            <p className="text-slate-500">Kriterlerinize uygun bir destek programı şu an eşleşmedi.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
