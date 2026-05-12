"use client";

import { useState } from "react";
import {
    Droplet,
    Settings,
    Activity,
    Trash2,
    Plus,
    Save,
    FileText,
    Info,
    Calendar,
    ChevronDown,
    Layers,
    Building,
    Leaf
} from "lucide-react";
import {
    updateWaterReportMeta,
    addWaterSource,
    deleteWaterSource,
    addWaterProcess,
    deleteWaterProcess,
    addGreyEntry,
    deleteGreyEntry,
    getOrCreateWaterReport
} from "./actions";
import { useRouter } from "next/navigation";

// --- Types ---
interface WaterSource {
    id: string;
    type: string;
    name: string;
    withdraw: number;
    return: number;
    consumptionMethod?: string | null;
    note?: string | null;
}

interface WaterProcess {
    id: string;
    name: string;
    input: number;
    output: number;
    date?: string | null;
    type?: string | null;
    product?: number | null;
    productUnit?: string | null;
    note?: string | null;
}

interface WaterGreyEntry {
    id: string;
    date?: string | null;
    param?: string | null;
    Q: number;
    Ceff: number;
    Cnat: number;
    Cmax: number;
    wfgrey: number;
    evidence?: string | null;
    note?: string | null;
}

interface WaterReport {
    id: string;
    year: number;
    orgName?: string | null;
    period?: string | null;
    basin?: string | null;
    methodology?: string | null;
    boundary?: string | null;
    fu?: string | null;
    preparedBy?: string | null;
    contact?: string | null;
    dqNote?: string | null;
    boundaryNote?: string | null;
    blueDirect: number;
    greenDirect: number;
    blueMethod: string | null;
    greenMethod: string | null;
    blueWater: number;
    greenWater: number;
    greyWater: number;
    totalWater: number;
    sources?: WaterSource[];
    processes?: WaterProcess[];
    greyEntries?: WaterGreyEntry[];
}

interface WaterTabsProps {
    initialReports?: WaterReport[];
    report?: WaterReport;
    companyId?: string;
    businessProcesses?: { id: string, title: string }[];
}

export default function WaterTabs({ initialReports, report: propReport, companyId, businessProcesses = [] }: WaterTabsProps) {
    const router = useRouter();
    const reports = initialReports || (propReport ? [propReport] : []);
    const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id);
    const [isCreating, setIsCreating] = useState(false);
    const [newReportYear, setNewReportYear] = useState(new Date().getFullYear());

    const report = reports.find(r => r.id === selectedReportId) || reports[0];

    const [activeTab, setActiveTab] = useState("process");
    const [loading, setLoading] = useState(false);

    // --- Meta Form State ---
    const [meta, setMeta] = useState({
        orgName: report?.orgName || "",
        reportYear: report?.year || new Date().getFullYear(),
        period: report?.period || "Annual",
        basin: report?.basin || "",
        methodology: report?.methodology || "WFN",
        boundary: report?.boundary || "Facility",
        fu: report?.fu || "",
        preparedBy: report?.preparedBy || "",
        contact: report?.contact || "",
        dqNote: report?.dqNote || "",
        boundaryNote: report?.boundaryNote || "",
        blueDirect: report?.blueDirect || 0,
        greenDirect: report?.greenDirect || 0,
        blueMethod: report?.blueMethod || "NetConsumption",
        greenMethod: report?.greenMethod || "Manual"
    });

    // Adjust state if report changes (Adjusting state during render)
    const [prevReportId, setPrevReportId] = useState(report?.id);
    if (report?.id !== prevReportId) {
        setPrevReportId(report?.id);
        setMeta({
            orgName: report?.orgName || "",
            reportYear: report?.year || new Date().getFullYear(),
            period: report?.period || "Annual",
            basin: report?.basin || "",
            methodology: report?.methodology || "WFN",
            boundary: report?.boundary || "Facility",
            fu: report?.fu || "",
            preparedBy: report?.preparedBy || "",
            contact: report?.contact || "",
            dqNote: report?.dqNote || "",
            boundaryNote: report?.boundaryNote || "",
            blueDirect: report?.blueDirect || 0,
            greenDirect: report?.greenDirect || 0,
            blueMethod: report?.blueMethod || "NetConsumption",
            greenMethod: report?.greenMethod || "Manual"
        });
    }

    const handleCreateReport = async () => {
        if (!companyId) return;
        setLoading(true);
        const res = await getOrCreateWaterReport(companyId, newReportYear);
        if (res.success && res.data) {
            router.refresh();
            setSelectedReportId(res.data.id);
            setIsCreating(false);
        }
        setLoading(false);
    };

    const handleMetaSave = async () => {
        if (!report) return;
        setLoading(true);
        await updateWaterReportMeta(report.id, meta);
        setLoading(false);
    };

    if (!report && !isCreating) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <Droplet className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Henüz Rapor Bulunmuyor</h3>
                <p className="text-slate-500 mb-6 text-center max-w-sm">Şirketiniz için su ayak izi takibine başlamak için ilk raporunuzu oluşturun.</p>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newReportYear}
                        onChange={(e) => setNewReportYear(parseInt(e.target.value))}
                    />
                    <button onClick={handleCreateReport} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
                        <Plus size={18} /> Rapor Oluştur
                    </button>
                </div>
            </div>
        );
    }

    // --- Calculations ---
    const blueWater = report?.blueWater || 0;
    const greenWater = report?.greenWater || 0;
    const greyTotal = report?.greyWater || 0;
    const totalWater = report?.totalWater || 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Cards & Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <select
                            className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none"
                            value={selectedReportId}
                            onChange={(e) => setSelectedReportId(e.target.value)}
                        >
                            {reports.map((r: WaterReport) => (
                                <option key={r.id} value={r.id}>{r.year} Raporu</option>
                            ))}
                        </select>
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={16} />
                    </div>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-all shadow-sm"
                        title="Yeni Yıl Ekle"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                    <Info size={14} className="text-blue-500" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">ISO 14046 Standardı</span>
                </div>
            </div>

            {isCreating && (
                <div className="bg-blue-600 p-1 rounded-2xl animate-in zoom-in duration-300">
                    <div className="bg-white dark:bg-slate-950 rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Yeni Çalışma Yılı Ekle</h4>
                            <p className="text-sm text-slate-500">Hesaplama yapmak istediğiniz yılı seçerek yeni bir rapor başlatın.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 w-32 font-bold text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newReportYear}
                                onChange={(e) => setNewReportYear(parseInt(e.target.value))}
                            />
                            <div className="flex gap-2">
                                <button onClick={() => setIsCreating(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Vazgeç</button>
                                <button onClick={handleCreateReport} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                                    {loading ? "Oluşturuluyor..." : <><Plus size={18} /> Başlat</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Toplam Ayak İzi" value={totalWater} unit="m³ / yıl" color="from-blue-600 to-blue-800" icon={Layers} />
                <KPICard title="Mavi Su" value={blueWater} unit="m³ / yıl" color="from-cyan-500 to-blue-500" icon={Droplet} />
                <KPICard title="Yeşil Su" value={greenWater} unit="m³ / yıl" color="from-emerald-500 to-green-600" icon={Activity} />
                <KPICard title="Gri Su" value={greyTotal} unit="m³ / yıl" color="from-slate-500 to-slate-700" icon={Trash2} />
            </div>

            {/* Tabs Header */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-0 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
                <TabButton id="kurumsal" label="Kurumsal Veri Girişi" icon={Building} active={activeTab} onClick={setActiveTab} />
                <TabButton id="tesis" label="Tesis Veri Girişi (Mavi/Yeşil)" icon={Settings} active={activeTab} onClick={setActiveTab} />
                <TabButton id="proses" label="Proses Veri Girişi (Mavi/Gri)" icon={Activity} active={activeTab} onClick={setActiveTab} />
                <TabButton id="report" label="Rapor Özeti" icon={FileText} active={activeTab} onClick={setActiveTab} />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-slate-200 dark:border-slate-800 p-8 min-h-[600px] shadow-sm animate-in fade-in duration-1000">

                {/* 1. KURUMSAL TAB */}
                {activeTab === "kurumsal" && (
                    <div className="space-y-8 max-w-3xl animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                <Building className="text-indigo-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kurumsal Veri Girişi</h3>
                                <p className="text-sm text-slate-500 text-balance">Organizasyon, havza, metodoloji ve sınır bilgilerinizi yapılandırın.</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Organizasyon / Tesis Adı</label>
                                    <input
                                        type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={meta.orgName}
                                        onChange={e => setMeta({ ...meta, orgName: e.target.value })}
                                        placeholder="Tesis Adı"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Bulunan Su Havzası</label>
                                    <input
                                        type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={meta.basin}
                                        onChange={e => setMeta({ ...meta, basin: e.target.value })}
                                        placeholder="Örn: Marmara Havzası"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Değerlendirme Sınırı (Boundary)</label>
                                    <select
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={meta.boundary}
                                        onChange={e => setMeta({ ...meta, boundary: e.target.value })}
                                    >
                                        <option value="Facility">Sadece Tesis (Gate-to-Gate)</option>
                                        <option value="CradleToGate">Beşikten Kapıya (Cradle-to-Gate)</option>
                                        <option value="CradleToGrave">Beşikten Mezara (Cradle-to-Grave)</option>
                                        <option value="Corporate">Tüm Kurum (Corporate)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Hesaplama Metodolojisi</label>
                                    <select
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={meta.methodology}
                                        onChange={e => setMeta({ ...meta, methodology: e.target.value })}
                                    >
                                        <option value="WFN">Water Footprint Network (WFN)</option>
                                        <option value="ISO14046">ISO 14046 Standardı</option>
                                        <option value="Other">Diğer / Özel Metodoloji</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Raporlama Periyodu</label>
                                    <input
                                        type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={meta.period}
                                        onChange={e => setMeta({ ...meta, period: e.target.value })}
                                        placeholder="Örn: Yıllık"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Fonksiyonel Birim (ops.)</label>
                                    <input
                                        type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={meta.fu}
                                        onChange={e => setMeta({ ...meta, fu: e.target.value })}
                                        placeholder="Örn: 1 ton ürün / 1 m² kumaş"
                                    />
                                </div>

                                <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Detaylı Rapor Bilgileri</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Rapor Sorumlusu</label>
                                            <input
                                                type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                value={meta.preparedBy}
                                                onChange={e => setMeta({ ...meta, preparedBy: e.target.value })}
                                                placeholder="Çevre Mühendisi / Danışman"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">İletişim</label>
                                            <input
                                                type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                value={meta.contact}
                                                onChange={e => setMeta({ ...meta, contact: e.target.value })}
                                                placeholder="e-posta / telefon"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Veri Kalitesi / Varsayım</label>
                                            <textarea className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[80px]"
                                                value={meta.dqNote}
                                                onChange={e => setMeta({ ...meta, dqNote: e.target.value })}
                                                placeholder="Eksik veri, tahmin, ölçüm, belirsizlik..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Kapsam / Sınır Notu</label>
                                            <textarea className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[80px]"
                                                value={meta.boundaryNote}
                                                onChange={e => setMeta({ ...meta, boundaryNote: e.target.value })}
                                                placeholder="Dahil/haric prosesler, üretim hatları..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button onClick={handleMetaSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                                {loading ? "Kaydediliyor..." : <><Save size={20} /> Kurumsal Bilgileri Kaydet</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. TESİS TAB (Mavi Direct/Metod & Yeşil & Kaynaklar) */}
                {activeTab === "tesis" && (
                    <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Droplet className="text-blue-500" size={24} />
                                    Tesis Veri Girişi (Mavi / Yeşil)
                                </h3>
                                <p className="text-sm text-slate-500">Tesisin genel su kaynaklarını ve tüketim metodunu belirleyin.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Blue Config */}
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-4">Mavi Su Hesaplama Metodu</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {["NetConsumption", "ProcessSum", "Manual"].map((method) => (
                                        <button
                                            key={method}
                                            onClick={() => setMeta({ ...meta, blueMethod: method })}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${meta.blueMethod === method
                                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                                                }`}
                                        >
                                            <span className="font-bold text-sm">
                                                {method === "NetConsumption" ? "Net Tüketim (Kaynaklar)" : method === "ProcessSum" ? "Süreç Bazlı Toplam" : "Manuel Giriş"}
                                            </span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${meta.blueMethod === method ? "border-blue-500 bg-blue-500" : "border-slate-200 dark:border-slate-700"}`}>
                                                {meta.blueMethod === method && <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <button onClick={handleMetaSave} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                        {loading ? "..." : <><Save size={18} /> Metodu Güncelle</>}
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-800 dark:text-white mb-4">Manuel Mavi Su (m³)</h4>
                                    <p className="text-xs text-slate-500 mb-4">Sadece &quot;Manuel Giriş&quot; seçiliyse toplam hesaba dahil edilir.</p>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={meta.blueDirect}
                                                onChange={e => setMeta({ ...meta, blueDirect: parseFloat(e.target.value) })}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">m³</span>
                                        </div>
                                        <button onClick={handleMetaSave} disabled={loading} className="w-full bg-slate-900 dark:bg-slate-700 text-white p-3 rounded-xl font-bold transition-all">
                                            Manuel Değeri Kaydet
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Green Config */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Leaf className="text-emerald-500" size={20} />
                                        <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Yeşil Su Veri Girişi</h4>
                                    </div>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4">Yağmur suyu ve tarımsal kaynaklı su kullanımını belirtin.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-2 block">Yıllık Yeşil Su Tüketimi (m³)</label>
                                            <div className="relative">
                                                <input
                                                    type="number" className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-900 dark:text-emerald-100"
                                                    value={meta.greenDirect}
                                                    onChange={e => setMeta({ ...meta, greenDirect: parseFloat(e.target.value) })}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">m³</span>
                                            </div>
                                        </div>
                                        <button onClick={handleMetaSave} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex justify-center items-center gap-2">
                                            {loading ? "..." : <><Save size={18} /> Kaydet</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sources Sub-section */}
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                            <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white text-lg">
                                <Settings className="text-blue-500" size={24} />
                                Kaynaklar & Sayaçlar
                            </h4>
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                                <div className="xl:col-span-4 space-y-6">
                                    <div className="p-1 bg-gradient-to-br from-blue-600 to-slate-800 rounded-2xl shadow-lg shadow-blue-500/10">
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[14px]">
                                            <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white text-lg">
                                                <Plus size={20} className="text-blue-500" /> Yeni Kaynak Girişi
                                            </h4>
                                            <SourceForm reportId={report.id} />
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:col-span-8">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                        <SourceList sources={report.sources || []} onDelete={deleteWaterSource} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. PROSES TAB (Mavi Süreçler & Gri Su) */}
                {activeTab === "proses" && (
                    <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Activity className="text-blue-500" size={24} />
                                    Proses Veri Girişi (Mavi / Gri)
                                </h3>
                                <p className="text-sm text-slate-500">Tesisinizdeki proses, üretim hattı veya operasyonel bazlı su tüketimi ve deşarj kayıtlarını yönetin.</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Blue Processes */}
                            <div>
                                <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white text-lg">
                                    <Droplet className="text-blue-500" size={20} /> Mavi Su Süreçleri
                                </h4>
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                                    <div className="xl:col-span-4 space-y-6">
                                        <div className="p-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/10">
                                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[14px]">
                                                <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white text-lg">
                                                    <Plus size={20} className="text-blue-500" /> Yeni Süreç Ekle
                                                </h4>
                                                <ProcessForm reportId={report.id} businessProcesses={businessProcesses} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-8">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                            <ProcessList processes={report.processes || []} onDelete={deleteWaterProcess} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grey Processes */}
                            <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                                <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white text-lg">
                                    <Trash2 className="text-slate-500" size={20} /> Gri Su (Kirlilik & Deşarj)
                                </h4>
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                                    <div className="xl:col-span-4 space-y-6">
                                        <div className="p-1 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-lg shadow-slate-500/10">
                                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[14px]">
                                                <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white text-lg">
                                                    <Plus size={20} className="text-slate-500" /> Yeni Deşarj Kaydı
                                                </h4>
                                                <GreyForm reportId={report.id} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-8">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                            <GreyList entries={report.greyEntries || []} onDelete={deleteGreyEntry} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. REPORT TAB */}
                {activeTab === "report" && (
                    <div className="p-6 space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="text-blue-500" size={24} /> Rapor Önizleme
                                </h3>
                                <p className="text-sm text-slate-500">Girilen genel, mavi, yeşil ve gri su verilerine göre otomatik oluşturulan hesap özeti.</p>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-bold shrink-0 shadow-sm"
                            >
                                <FileText className="w-4 h-4" /> Yazdır / PDF
                            </button>
                        </div>

                        <div className="print-report bg-white text-black p-8 rounded-xl shadow-sm border border-slate-200" id="report-print-area">
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                @media print {
                                    body * { visibility: hidden; }
                                    #report-print-area, #report-print-area * { visibility: visible; }
                                    #report-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; background: white !important; box-shadow: none !important; border: none !important; color: black !important; }
                                    .print\\:hidden { display: none !important; }
                                    /* Force black text for print to ensure good contrast */
                                    #report-print-area * { color: black !important; border-color: #e5e7eb !important; }
                                    #report-print-area .bg-slate-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                    #report-print-area .bg-blue-50 { background-color: #eff6ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                    #report-print-area .bg-emerald-50 { background-color: #ecfdf5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                }
                            `}} />

                            <div className="mb-8 border-b-2 border-slate-800 pb-6 text-center">
                                <h2 className="text-3xl font-black mb-2 text-slate-900">Su Ayak İzi Raporu</h2>
                                <p className="text-slate-600 font-medium text-lg">
                                    Organizasyon/Tesis: <span className="font-bold">{meta.orgName || "-"}</span> |
                                    Yıl: <span className="font-bold">{report.year}</span> |
                                    Havza/Lokasyon: <span className="font-bold">{meta.basin || "-"}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
                                    <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Net Su Ayak İzi</div>
                                    <div className="text-2xl font-black text-slate-900">{totalWater.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} <span className="text-sm font-medium">m³ / yıl</span></div>
                                </div>
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                    <div className="text-sm text-blue-600 font-bold mb-1 uppercase tracking-wider">Mavi Su (Doğrudan)</div>
                                    <div className="text-2xl font-black text-blue-900">{blueWater.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} <span className="text-sm font-medium">m³</span></div>
                                </div>
                                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                                    <div className="text-sm text-emerald-600 font-bold mb-1 uppercase tracking-wider">Yeşil Su (Tarımsal)</div>
                                    <div className="text-2xl font-black text-emerald-900">{greenWater.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} <span className="text-sm font-medium">m³</span></div>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <div className="text-sm text-slate-600 font-bold mb-1 uppercase tracking-wider">Gri Su (Kirlilik Yükü)</div>
                                    <div className="text-2xl font-black text-slate-800">{greyTotal.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} <span className="text-sm font-medium">m³</span></div>
                                </div>
                            </div>

                            <div className="mb-8 pl-4 border-l-4 border-slate-800">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">A) Kapsam ve Metodoloji</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-slate-800">
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold text-slate-500">Metodoloji:</span> <span className="font-medium text-right">{meta.methodology}</span></div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold text-slate-500">Operasyonel sınır:</span> <span className="font-medium text-right">{meta.boundary}</span></div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold text-slate-500">Raporlama dönemi:</span> <span className="font-medium text-right">{meta.period}</span></div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold text-slate-500">Fonksiyonel birim:</span> <span className="font-medium text-right">{meta.fu || "-"}</span></div>
                                </div>
                                <div className="mt-4 text-sm space-y-3 text-slate-700">
                                    <div className="bg-slate-50 p-3 rounded"><span className="font-bold text-slate-900 block mb-1">Kapsam notu:</span> {meta.boundaryNote || "-"}</div>
                                    <div className="bg-slate-50 p-3 rounded"><span className="font-bold text-slate-900 block mb-1">Veri kalitesi / varsayım:</span> {meta.dqNote || "-"}</div>
                                </div>
                            </div>

                            <div className="mb-8 pl-4 border-l-4 border-blue-500">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">B) Su Kaynakları Envanteri (Mavi Su)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="border-y-2 border-slate-300 bg-slate-50">
                                                <th className="py-3 px-2 text-slate-700">Kaynak / Sayaç</th>
                                                <th className="py-3 px-2 text-slate-700">Tip</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Çekiş (m³)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">İade (m³)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Net Tüketim (m³)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-200 bg-slate-50/50">
                                                <td className="py-2 px-2 font-medium text-slate-600 line-through">Manuel Doğrudan Giriş</td>
                                                <td className="py-2 px-2 text-slate-500">-</td>
                                                <td className="py-2 px-2 text-right text-slate-500">-</td>
                                                <td className="py-2 px-2 text-right text-slate-500">-</td>
                                                <td className="py-2 px-2 text-right font-bold text-blue-600">{report.blueDirect?.toLocaleString("tr-TR") || 0}</td>
                                            </tr>
                                            {report.sources && report.sources.length > 0 ? report.sources.map(s => (
                                                <tr key={s.id} className="border-b border-slate-200">
                                                    <td className="py-2 px-2 font-medium text-slate-900">{s.name}</td>
                                                    <td className="py-2 px-2 text-slate-600">{s.type}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{s.withdraw.toLocaleString("tr-TR")}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{s.return.toLocaleString("tr-TR")}</td>
                                                    <td className="py-2 px-2 text-right font-bold text-slate-900">{Math.max(0, s.withdraw - s.return).toLocaleString("tr-TR")}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={5} className="py-4 text-center text-slate-400 italic">Kaynak kaydı bulunmuyor.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mb-8 pl-4 border-l-4 border-emerald-500">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">C) Süreç Bazlı Su Kullanımı</h3>
                                <div className="space-y-4 text-sm mb-4">
                                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                        <p><span className="font-bold text-slate-700">Yeşil Su (Tarımsal/Yağmur) Doğrudan Girişi:</span> <span className="font-bold text-emerald-600">{report.greenDirect?.toLocaleString("tr-TR") || 0} m³</span></p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="border-y-2 border-slate-300 bg-slate-50">
                                                <th className="py-3 px-2 text-slate-700">Süreç</th>
                                                <th className="py-3 px-2 text-slate-700">Tip</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Giren (m³)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Çıkan (m³)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Kayıp/Tüketim (m³)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {report.processes && report.processes.length > 0 ? report.processes.map(p => (
                                                <tr key={p.id} className="border-b border-slate-200">
                                                    <td className="py-2 px-2 font-medium text-slate-900">{p.name}</td>
                                                    <td className="py-2 px-2 text-slate-600">{p.type || "-"}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{p.input.toLocaleString("tr-TR")}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{p.output.toLocaleString("tr-TR")}</td>
                                                    <td className="py-2 px-2 text-right font-bold text-slate-900">{Math.max(0, p.input - p.output).toLocaleString("tr-TR")}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={5} className="py-4 text-center text-slate-400 italic">Süreç kaydı bulunmuyor.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mb-4 pl-4 border-l-4 border-slate-400">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">D) Gri Su Detayları (Kirlilik Yükü)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="border-y-2 border-slate-300 bg-slate-50">
                                                <th className="py-3 px-2 text-slate-700">Parametre</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Deşarj (Q) m³</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Ceff (mg/L)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Cmax (mg/L)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">Cnat (mg/L)</th>
                                                <th className="py-3 px-2 text-right text-slate-700">WFgrey (m³)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {report.greyEntries && report.greyEntries.length > 0 ? report.greyEntries.map(g => (
                                                <tr key={g.id} className="border-b border-slate-200">
                                                    <td className="py-2 px-2 font-medium text-slate-900">{g.param}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{g.Q.toLocaleString("tr-TR")}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{g.Ceff.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{g.Cmax.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}</td>
                                                    <td className="py-2 px-2 text-right text-slate-700">{g.Cnat.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}</td>
                                                    <td className="py-2 px-2 text-right font-bold text-slate-900">{g.wfgrey.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={6} className="py-4 text-center text-slate-400 italic">Gri su kaydı bulunmuyor.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-12 pt-6 border-t border-slate-300 text-sm flex flex-col md:flex-row justify-between items-center text-slate-600 font-medium">
                                <div className="mb-2 md:mb-0">Hazırlayan: <span className="font-bold text-slate-900">{meta.preparedBy || "-"}</span></div>
                                <div className="mb-2 md:mb-0">İletişim: <span className="font-bold text-slate-900">{meta.contact || "-"}</span></div>
                                <div className="text-xs text-slate-400">BLT Sürdürülebilirlik Platformu ({new Date().toLocaleDateString('tr-TR')})</div>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    );
}

// --- Helper Components ---

function KPICard({ title, value, unit, color, icon: Icon }: { title: string, value: number, unit: string, color: string, icon: React.ElementType }) {
    return (
        <div className={`p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`}></div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 text-white shadow-lg shadow-blue-500/10`}>
                    <Icon size={16} />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {value.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                </span>
                <span className="text-xs font-bold text-slate-400 mt-1">{unit}</span>
            </div>
        </div>
    );
}

function TabButton({ id, label, icon: Icon, active, onClick }: { id: string, label: string, icon: React.ElementType, active: string, onClick: (id: string) => void }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold transition-all relative overflow-hidden group ${isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
        >
            <Icon size={18} className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
            {label}
            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-500 animate-in slide-in-from-bottom-2 duration-300 rounded-t-full"></div>
            )}
        </button>
    );
}

function ProcessForm({ reportId, businessProcesses }: { reportId: string, businessProcesses: any[] }) {
    const [loading, setLoading] = useState(false);
    return (
        <form className="space-y-5" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setLoading(true);
            await addWaterProcess(reportId, formData);
            setLoading(false);
            (e.target as HTMLFormElement).reset();
        }}>
            <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">İlgili İş Süreci</label>
                <select name="businessProcessId" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option value="">Genel / Süreçsiz</option>
                    {businessProcesses.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Süreç / Ünite Adı (Detay)</label>
                <input name="name" type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Örn: Boyama Ünitesi" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Giriş (m³)</label>
                    <input name="input" type="number" step="any" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Çıkış (m³)</label>
                    <input name="output" type="number" step="any" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg active:scale-95 disabled:opacity-50">
                {loading ? "Ekleniyor..." : <><Plus size={18} /> Listeye Ekle</>}
            </button>
        </form>
    );
}

function ProcessList({ processes, onDelete }: { processes: WaterProcess[], onDelete: (id: string) => Promise<{ success: boolean }> }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Süreç Adı</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Giriş</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Çıkış</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Tüketim</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {processes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">Henüz kayıtlı süreç bulunmuyor.</td>
                        </tr>
                    ) : (
                        processes.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{p.name}</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">{p.input.toLocaleString()} m³</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">{p.output.toLocaleString()} m³</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs ring-1 ring-blue-500/20">
                                        {(p.input - p.output).toLocaleString()} m³
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onDelete(p.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function GreyForm({ reportId }: { reportId: string }) {
    const [loading, setLoading] = useState(false);
    const [calc, setCalc] = useState({ Q: "", Ceff: "", Cnat: "", Cmax: "" });
    const [wfgrey, setWfgrey] = useState("0");

    // ISO 14046 Grey Water Footprint Formula: (Q * (Ceff - Cnat)) / (Cmax - Cnat)
    const handleCalculate = () => {
        const q = parseFloat(calc.Q) || 0;
        const ceff = parseFloat(calc.Ceff) || 0;
        const cnat = parseFloat(calc.Cnat) || 0;
        const cmax = parseFloat(calc.Cmax) || 0;

        if (cmax > cnat && q > 0) {
            const result = (q * (ceff - cnat)) / (cmax - cnat);
            setWfgrey(result.toFixed(2));
        }
    };

    return (
        <form className="space-y-5" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.set("wfgrey", wfgrey);
            setLoading(true);
            await addGreyEntry(reportId, formData);
            setLoading(false);
            (e.target as HTMLFormElement).reset();
            setCalc({ Q: "", Ceff: "", Cnat: "", Cmax: "" });
            setWfgrey("0");
        }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Kirletici Parametre / Kaynak</label>
                    <input name="pollutant" type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Örn: COD, BOD, Toplam Azot" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Tahliye Debisi (Q - m³/gün)</label>
                    <input name="Q" type="number" step="any" value={calc.Q} onChange={e => { setCalc({ ...calc, Q: e.target.value }); }} onBlur={handleCalculate} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Deşarj Kons. (Ceff - mg/L)</label>
                    <input name="Ceff" type="number" step="any" value={calc.Ceff} onChange={e => { setCalc({ ...calc, Ceff: e.target.value }); }} onBlur={handleCalculate} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Doğal Kons. (Cnat - mg/L)</label>
                    <input name="Cnat" type="number" step="any" value={calc.Cnat} onChange={e => { setCalc({ ...calc, Cnat: e.target.value }); }} onBlur={handleCalculate} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Limit Kons. (Cmax - mg/L)</label>
                    <input name="Cmax" type="number" step="any" value={calc.Cmax} onChange={e => { setCalc({ ...calc, Cmax: e.target.value }); }} onBlur={handleCalculate} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 mt-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">Hesaplanan WFgrey:</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{wfgrey} <span className="text-xs">m³/gün</span></span>
                </div>
                <input type="hidden" name="wfgrey" value={wfgrey} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/10 active:scale-95 disabled:opacity-50">
                {loading ? "..." : <><Plus size={20} /> Gri Su Kaydı Ekle</>}
            </button>
        </form>
    );
}

function GreyList({ entries, onDelete }: { entries: WaterGreyEntry[], onDelete: (id: string) => Promise<{ success: boolean }> }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kirletici</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">WFgrey Değeri</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {entries.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">Henüz kayıtlı gri su verisi bulunmuyor.</td>
                        </tr>
                    ) : (
                        entries.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{e.param}</td>
                                <td className="px-6 py-4 text-right font-bold text-slate-600 dark:text-slate-400">{e.wfgrey.toLocaleString()} m³</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onDelete(e.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function SourceForm({ reportId }: { reportId: string }) {
    const [loading, setLoading] = useState(false);
    return (
        <form className="space-y-5" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setLoading(true);
            await addWaterSource(reportId, formData);
            setLoading(false);
            (e.target as HTMLFormElement).reset();
        }}>
            <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Kaynak Adı / Türü</label>
                <input name="name" type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Örn: Şebeke Suyu, Derin Kuyu 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Çekiş (m³)</label>
                    <input name="withdraw" type="number" step="any" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">İade (m³)</label>
                    <input name="return" type="number" step="any" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.00" />
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg active:scale-95 disabled:opacity-50">
                {loading ? "..." : <><Plus size={18} /> Envantere Ekle</>}
            </button>
        </form>
    );
}

function SourceList({ sources, onDelete }: { sources: WaterSource[], onDelete: (id: string) => Promise<{ success: boolean }> }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kaynak</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Çekiş</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İade</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right text-blue-500">Net</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sources.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">Henüz kayıtlı su kaynağı bulunmuyor.</td>
                        </tr>
                    ) : (
                        sources.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{s.name}</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">{s.withdraw.toLocaleString()} m³</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">{s.return.toLocaleString()} m³</td>
                                <td className="px-6 py-4 text-right font-black text-blue-600 dark:text-blue-400">
                                    {(s.withdraw - s.return).toLocaleString()} m³
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onDelete(s.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
