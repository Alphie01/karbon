"use client";

import { useState } from "react";
import {
    Bot,
    Zap,
    Droplet,
    CheckCircle,
    ArrowRight,
    FileText,
    BarChart2,
    Loader2,
    Info,
    Landmark
} from "lucide-react";
import { analyzeCompanyData, generateProjectDraft } from "./actions";

export default function RobotClient({ companyId }: { companyId: string }) {
    const [step, setStep] = useState(1); // 1: Intro, 2: Analysis, 3: Selection, 4: Draft
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
    const [drafts, setDrafts] = useState<any[]>([]);

    const handleAnalyze = async () => {
        setLoading(true);
        const res = await analyzeCompanyData(companyId);
        if (res.success) {
            setAnalysis(res.data);
            setStep(2);
        } else {
            alert("Analiz hatası: " + res.error);
        }
        setLoading(false);
    };

    const handleSelection = () => {
        if (selectedGrants.length === 0) {
            alert("Lütfen en az bir proje seçin.");
            return;
        }
        setStep(3); // Wait, logic flow: 2 -> Show Analysis & Selection together?
        // Let's make Step 2 be "Analysis Results & Selection"
    };

    const handleGenerateDrafts = async () => {
        setLoading(true);
        const newDrafts = [];
        for (const grantId of selectedGrants) {
            const res = await generateProjectDraft(grantId, companyId);
            if (res.success) {
                newDrafts.push({ grantId, text: res.draft });
            }
        }
        setDrafts(newDrafts);
        setStep(4);
        setLoading(false);
    };

    const toggleGrant = (id: string) => {
        if (selectedGrants.includes(id)) {
            setSelectedGrants(selectedGrants.filter(g => g !== id));
        } else {
            setSelectedGrants([...selectedGrants, id]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header / Wizard Steps */}
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className={step >= 1 ? "text-blue-600" : ""}>1. Başlangıç</span>
                <ArrowRight size={16} />
                <span className={step >= 2 ? "text-blue-600" : ""}>2. Analiz & Seçim</span>
                <ArrowRight size={16} />
                <span className={step >= 4 ? "text-blue-600" : ""}>3. Proje Taslağı</span>
            </div>

            {/* STEP 1: Intro */}
            {step === 1 && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 mx-auto rounded-full flex items-center justify-center mb-6">
                        <Bot size={40} />
                    </div>
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Akıllı Hibe Asistanı</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8">
                        Şirketinizin Karbon ve Su Ayak İzi verilerini analiz ederek, size özel hibe ve teşvik fırsatlarını belirleyelim.
                        Ardından seçtiğiniz projeler için yapay zeka destekli başvuru taslağı oluşturalım.
                    </p>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <BarChart2 />}
                        Verileri Analiz Et
                    </button>
                </div>
            )}

            {/* STEP 2: Analysis Results & Selection */}
            {step === 2 && analysis && (
                <div className="space-y-6">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                            <h3 className="font-bold text-emerald-700 flex items-center gap-2"><Zap size={18} /> Karbon Profili</h3>
                            <p className="text-sm mt-2">Toplam: <b>{analysis.stats.carbon.total}</b> kgCO2e</p>
                            <p className="text-xs text-emerald-600">Kapsam 2 (Elektrik): {analysis.stats.carbon.scope2}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 className="font-bold text-blue-700 flex items-center gap-2"><Droplet size={18} /> Su Profili</h3>
                            <p className="text-sm mt-2">Toplam: <b>{analysis.stats.water.total}</b> m³</p>
                            <p className="text-xs text-blue-600">Gri Su: {analysis.stats.water.grey}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Önerilen Projeler</h3>
                            <p className="text-sm text-slate-500">Analiz sonuçlarına göre uygun bulunan fırsatlar.</p>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {analysis.suggestions.map((grant: any) => (
                                <div key={grant.id} className={`p-6 transition-colors ${selectedGrants.includes(grant.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedGrants.includes(grant.id)}
                                            onChange={() => toggleGrant(grant.id)}
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{grant.title}</h4>
                                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                                                    %{grant.score} Eşleşme
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{grant.provider} • {grant.scope}</p>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded text-xs font-bold border border-green-100 dark:border-green-800">
                                                    <Landmark size={14} />
                                                    Ortalama Destek: {grant.avgAmount}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 dark:border-slate-700">
                                                    %{grant.grantPct} Hibe
                                                </div>
                                                {grant.incentivePct > 0 && (
                                                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded text-xs font-bold border border-amber-100 dark:border-amber-800">
                                                        %{grant.incentivePct} Teşvik
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-sm text-blue-600 mt-4 bg-blue-50 dark:bg-blue-900/20 inline-block px-3 py-2 rounded border border-blue-100 dark:border-blue-800">
                                                💡 Neden: {grant.reason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                                <Info size={16} className="text-blue-500 shrink-0" />
                                <span>
                                    <strong>Önemli Not:</strong> Yukarıda yer alan hibe tutarları, oranlar ve teşvik miktarları <strong>2026 yılı ortalama verilerine</strong> göre hesaplanmıştır.
                                    Sunulan bu ortalama rakamlar; kurumların güncel mevzuat değişikliklerine, teşvik bütçelerine, projenizin yatırım lokasyonuna ve detaylı asgari/azami destek limitlerine bağlı olarak değişiklik gösterebilir. Kesin sonuçlar resmi başvuru onayında netleşmektedir.
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Geri</button>
                        <button
                            onClick={handleGenerateDrafts}
                            disabled={loading || selectedGrants.length === 0}
                            className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <FileText />}
                            Seçilenleri Projelendir ({selectedGrants.length})
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3 (Drafts) */}
            {step === 4 && (
                <div className="space-y-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-3 text-green-800 dark:text-green-300">
                        <CheckCircle />
                        <span className="font-bold">Başvuru taslakları başarıyla oluşturuldu.</span>
                    </div>

                    {drafts.map((draft, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                            <h4 className="font-bold text-lg mb-4 text-slate-400 uppercase tracking-widest border-b pb-2">
                                Taslak #{idx + 1}
                            </h4>
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                                {draft.text}
                            </pre>
                            <div className="mt-4 flex gap-2 justify-end">
                                <button onClick={() => navigator.clipboard.writeText(draft.text)} className="text-xs font-bold text-blue-600 hover:underline">
                                    Kopyala
                                </button>
                                <button onClick={() => window.print()} className="text-xs font-bold text-slate-500 hover:underline">
                                    Yazdır
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-center pt-8">
                        <button onClick={() => { setStep(1); setSelectedGrants([]); }} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                            Yeni Analiz Başlat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
