"use client";

import { useState } from "react";
import {
    Factory,
    Truck,
    Zap,
    Trash2,
    Plus,
    FileText,
    Database,
    Info
} from "lucide-react";
import { createCarbonEntry, deleteCarbonEntry, createEmissionFactor, deleteEmissionFactor } from "./actions";

// Types
type CarbonEntry = {
    id: string;
    scope: string;
    category: string;
    activity: string;
    amount: number;
    unit: string;
    emissionFactor: number;
    calculatedEmission: number;
    date: string;
    description?: string | null;
};

type EmissionFactor = {
    id: string;
    name: string;
    scope: string;
    unit: string;
    value: number;
    year: number;
    source?: string | null;
    note?: string | null;
    isCustom: boolean;
};

interface CarbonTabsProps {
    initialEntries: CarbonEntry[];
    initialFactors: EmissionFactor[];
    companyId: string;
    businessProcesses?: { id: string, title: string }[];
}

export default function CarbonTabs({ initialEntries, initialFactors, companyId, businessProcesses = [] }: CarbonTabsProps) {
    const [activeTab, setActiveTab] = useState("scope1");
    const [entries, setEntries] = useState<CarbonEntry[]>(initialEntries);
    const [factors, setFactors] = useState<EmissionFactor[]>(initialFactors);

    // KPIs
    const totalEmission = entries.reduce((sum, e) => sum + e.calculatedEmission, 0);
    const scope1Total = entries.filter(e => e.scope === "SCOPE_1").reduce((sum, e) => sum + e.calculatedEmission, 0);
    const scope2Total = entries.filter(e => e.scope === "SCOPE_2").reduce((sum, e) => sum + e.calculatedEmission, 0);
    const scope3Total = entries.filter(e => e.scope === "SCOPE_3").reduce((sum, e) => sum + e.calculatedEmission, 0);

    // TEP Logic
    const calculateTEP = (amount: number, unit: string) => {
        const u = unit.toLowerCase();
        if (u === "kwh") return amount / 11628;
        if (u === "m3" || u === "m³") return (amount * 0.825) / 1000;
        if (u === "l" || u === "litre") return (amount * 0.82) / 1000; // Diesel/Gasoline approx
        if (u === "kg") return (amount * 1.0) / 1000; // 1 kg oil eq ≈ 1 TEP / 1000
        return 0;
    };

    const totalTEP = entries.reduce((sum, e) => sum + calculateTEP(e.amount, e.unit), 0);

    // --- Helpers ---
    const handleDeleteEntry = async (id: string) => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
        const res = await deleteCarbonEntry(id);
        if (res.success) {
            setEntries(entries.filter(e => e.id !== id));
        } else {
            alert(res.error);
        }
    };

    const handleDeleteFactor = async (id: string) => {
        if (!confirm("Bu faktörü silmek istediğinize emin misiniz?")) return;
        const res = await deleteEmissionFactor(id);
        if (res.success) {
            setFactors(factors.filter(f => f.id !== id));
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                {[
                    { id: "scope1", label: "Scope 1 (Doğrudan)", icon: Factory },
                    { id: "scope2", label: "Scope 2 (Enerji)", icon: Zap },
                    { id: "scope3", label: "Scope 3 (Dolaylı)", icon: Truck },
                    { id: "factors", label: "Faktör Kütüphanesi", icon: Database },
                    { id: "report", label: "Rapor Önizleme", icon: FileText },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors relative top-[1px] ${activeTab === tab.id
                            ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-b-white dark:border-b-slate-900 text-brand-green"
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* KPIs Widget */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <KPICard title="Toplam Emisyon" value={totalEmission} unit="tCO₂e" color="bg-brand-navy" />
                <KPICard title="Enerji Dengesi" value={totalTEP} unit="TEP" color="bg-brand-green" />
                <KPICard title="Scope 1" value={scope1Total} unit="tCO₂e" color="bg-orange-500" />
                <KPICard title="Scope 2" value={scope2Total} unit="tCO₂e" color="bg-yellow-500" />
                <KPICard title="Scope 3" value={scope3Total} unit="tCO₂e" color="bg-purple-500" />
            </div>

            {/* Content Areas */}
            <div className="bg-white dark:bg-slate-900 rounded-b-xl rounded-r-xl border border-slate-200 dark:border-slate-800 p-6 min-h-[500px]">
                {activeTab === "scope1" && (
                    <ScopeForm
                        scope="SCOPE_1"
                        entries={entries.filter(e => e.scope === "SCOPE_1")}
                        factors={factors.filter(f => f.scope === "SCOPE_1" || f.scope === "ALL")}
                        onAdd={(e: CarbonEntry) => setEntries([e, ...entries])}
                        onDelete={handleDeleteEntry}
                        companyId={companyId}
                        businessProcesses={businessProcesses}
                    />
                )}
                {activeTab === "scope2" && (
                    <ScopeForm
                        scope="SCOPE_2"
                        entries={entries.filter(e => e.scope === "SCOPE_2")}
                        factors={factors.filter(f => f.scope === "SCOPE_2" || f.scope === "ALL")}
                        onAdd={(e: CarbonEntry) => setEntries([e, ...entries])}
                        onDelete={handleDeleteEntry}
                        companyId={companyId}
                        businessProcesses={businessProcesses}
                    />
                )}
                {activeTab === "scope3" && (
                    <ScopeForm
                        scope="SCOPE_3"
                        entries={entries.filter(e => e.scope === "SCOPE_3")}
                        factors={factors.filter(f => f.scope === "SCOPE_3" || f.scope === "ALL")}
                        onAdd={(e: CarbonEntry) => setEntries([e, ...entries])}
                        onDelete={handleDeleteEntry}
                        companyId={companyId}
                        businessProcesses={businessProcesses}
                    />
                )}
                {activeTab === "factors" && (
                    <FactorsManager
                        factors={factors}
                        onAdd={(f: EmissionFactor) => setFactors([f, ...factors])}
                        onDelete={handleDeleteFactor}
                        companyId={companyId}
                    />
                )}
                {activeTab === "report" && (
                    <ReportView entries={entries} />
                )}
            </div>

            {/* TEP Conversion Table Utility */}
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Info size={18} className="text-brand-green" /> TEP Dönüşüm Cetveli
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-500 mb-1">Elektrik</p>
                        <p className="text-slate-900 dark:text-slate-300">11,628 kWh = 1 TEP</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-500 mb-1">Doğalgaz</p>
                        <p className="text-slate-900 dark:text-slate-300">1000 m³ ≈ 0.825 TEP</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-500 mb-1">Akaryakıt</p>
                        <p className="text-slate-900 dark:text-slate-300">1000 Litre ≈ 0.820 TEP</p>
                    </div>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 italic">
                    * Ton Eşdeğer Petrol (TEP), 1 ton ham petrolün yakılmasıyla açığa çıkan enerji miktarını (10 milyon kcal) tanımlar.
                </p>
            </div>
        </div>
    );
}

// --- Sub Components ---

function KPICard({ title, value, unit, color }: { title: string, value: number, unit: string, color: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                    {value.toLocaleString('tr-TR', { minimumFractionDigits: value > 1000 ? 0 : 3, maximumFractionDigits: 3 })}
                </div>
                <p className="text-xs text-slate-400">{unit}</p>
            </div>
            <div className={`w-2 h-12 rounded-full ${color} opacity-80`}></div>
        </div>
    );
}

function ScopeForm({ scope, entries, factors, onAdd, onDelete, companyId, businessProcesses }: any) {
    const [loading, setLoading] = useState(false);

    // Form State
    const [category, setCategory] = useState("");
    const [activity, setActivity] = useState("");
    const [amount, setAmount] = useState("");
    const [unit, setUnit] = useState("");
    const [selectedFactorId, setSelectedFactorId] = useState("");
    const [selectedProcessId, setSelectedProcessId] = useState("");
    const [note, setNote] = useState("");

    const selectedFactor = factors.find((f: any) => f.id === selectedFactorId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFactor || !amount) return;

        setLoading(true);
        const emissionStart = (parseFloat(amount) * selectedFactor.value) / 1000; // kg to ton conversion

        const newData = {
            companyId,
            scope,
            category: category || "General",
            activity,
            amount: parseFloat(amount),
            unit: unit || selectedFactor.unit, // Use factor unit if not specified
            emissionFactor: selectedFactor.value,
            emissionStart,
            date: new Date().toISOString().split('T')[0],
            businessProcessId: selectedProcessId,
            note
        };

        const res = await createCarbonEntry(newData);
        setLoading(false);

        if (res.success) {
            // For now reload window
            window.location.reload();
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Plus size={18} className="text-brand-green" /> Kayıt Ekle
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Kategori</label>
                        <input
                            className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            placeholder="Örn: Doğalgaz Tüketimi"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">İlgili İş Süreci</label>
                        <select
                            className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            value={selectedProcessId}
                            onChange={e => setSelectedProcessId(e.target.value)}
                        >
                            <option value="">Genel / Süreçsiz</option>
                            {businessProcesses && businessProcesses.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Faaliyet / Kaynak</label>
                        <input
                            className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            placeholder="Örn: Kazan 1"
                            value={activity}
                            onChange={e => setActivity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Miktar</label>
                            <input
                                type="number"
                                step="any"
                                className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Birim</label>
                            <input
                                className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                placeholder="Örn: m3"
                                value={unit}
                                onChange={e => setUnit(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Emisyon Faktörü</label>
                        <select
                            className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            value={selectedFactorId}
                            onChange={e => {
                                setSelectedFactorId(e.target.value);
                                const f = factors.find((x: any) => x.id === e.target.value);
                                if (f) setUnit(f.unit);
                            }}
                            required
                        >
                            <option value="">Seçiniz...</option>
                            {factors.map((f: EmissionFactor) => (
                                <option key={f.id} value={f.id}>{f.name} ({f.value} kgCO2e/{f.unit})</option>
                            ))}
                        </select>
                        {selectedFactor && (
                            <div className="text-xs text-brand-green mt-1 flex items-center gap-1">
                                <Info size={12} />
                                Ref: {selectedFactor.value} kgCO2e / {selectedFactor.unit}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Not / Kanıt</label>
                        <textarea
                            className="w-full text-sm p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-20 resize-none"
                            placeholder="Fatura no vb..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-navy hover:bg-opacity-90 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                    >
                        {loading ? "Kaydediliyor..." : "Ekle"}
                    </button>

                </form>
            </div>

            <div className="lg:col-span-2">
                <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Kayıtlı Veriler</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3 font-semibold">Tarih</th>
                                <th className="p-3 font-semibold">Kategori</th>
                                <th className="p-3 font-semibold">Miktar</th>
                                <th className="p-3 font-semibold text-brand-green">Enerji (TEP)</th>
                                <th className="p-3 font-semibold">Emisyon (t)</th>
                                <th className="p-3 font-semibold text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {entries.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Henüz kayıt yok.</td></tr>
                            ) : entries.map((entry: any) => (
                                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 text-slate-600 dark:text-slate-300">{entry.date}</td>
                                    <td className="p-3 font-medium text-slate-900 dark:text-white">
                                        <div className="text-sm">{entry.category}</div>
                                        <div className="text-[10px] text-slate-400">{entry.activity}</div>
                                    </td>
                                    <td className="p-3">
                                        {entry.amount.toLocaleString('tr-TR')} <span className="text-xs text-slate-400">{entry.unit}</span>
                                    </td>
                                    <td className="p-3 font-medium text-brand-green">
                                        {(() => {
                                            const u = entry.unit.toLowerCase();
                                            let tep = 0;
                                            if (u === "kwh") tep = entry.amount / 11628;
                                            else if (u === "m3" || u === "m³") tep = (entry.amount * 0.825) / 1000;
                                            else if (u === "l" || u === "litre") tep = (entry.amount * 0.82) / 1000;
                                            return tep > 0 ? tep.toFixed(4) : "-";
                                        })()}
                                    </td>
                                    <td className="p-3 font-bold text-brand-navy dark:text-blue-400">
                                        {entry.calculatedEmission.toFixed(4)}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => onDelete(entry.id)}
                                            className="text-slate-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function FactorsManager({ factors, onAdd, onDelete, companyId }: any) {
    const [loading, setLoading] = useState(false);

    // Simple state form for Factors
    const [name, setName] = useState("");
    const [scope, setScope] = useState("SCOPE_1");
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState("");
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await createEmissionFactor({
            name,
            scope,
            value,
            unit,
            year,
            companyId, // Custom factor for this company
            note: "Custom entry"
        });
        setLoading(false);
        if (res.success) window.location.reload();
        else alert(res.error);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h3 className="font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                    <Plus size={18} /> Yeni Faktör Tanımla
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="space-y-3">
                        <input className="input-std w-full p-2 border rounded" placeholder="Faktör Adı (Örn: Özel Dizel)" value={name} onChange={e => setName(e.target.value)} required />
                        <select className="input-std w-full p-2 border rounded" value={scope} onChange={e => setScope(e.target.value)}>
                            <option value="SCOPE_1">Scope 1</option>
                            <option value="SCOPE_2">Scope 2</option>
                            <option value="SCOPE_3">Scope 3</option>
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                            <input className="input-std w-full p-2 border rounded" placeholder="Değer (kgCO2e)" type="number" step="any" value={value} onChange={e => setValue(e.target.value)} required />
                            <input className="input-std w-full p-2 border rounded" placeholder="Birim (L, kWh)" value={unit} onChange={e => setUnit(e.target.value)} required />
                        </div>
                        <input className="input-std w-full p-2 border rounded" type="number" value={year} onChange={e => setYear(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-slate-800 text-white p-2 rounded hover:bg-slate-700">Kaydet</button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-bold flex items-center gap-2"><Info size={16} /> Bilgi</p>
                    <p className="mt-1 opacity-80">Burada eklediğiniz faktörler sadece sizin firmanız için görünür olacaktır. Sistem genelindeki faktörleri silemezsiniz.</p>
                </div>
            </div>

            <div className="lg:col-span-2">
                <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Emisyon Faktörleri Kütüphanesi</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                            <tr>
                                <th className="p-3 font-semibold">Ad</th>
                                <th className="p-3 font-semibold">Kapsam</th>
                                <th className="p-3 font-semibold">Değer</th>
                                <th className="p-3 font-semibold">Yıl</th>
                                <th className="p-3 font-semibold text-right">Tip</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {factors.map((f: any) => (
                                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{f.name}</td>
                                    <td className="p-3"><span className="tag">{f.scope}</span></td>
                                    <td className="p-3">{f.value} <span className="text-slate-400">/{f.unit}</span></td>
                                    <td className="p-3">{f.year}</td>
                                    <td className="p-3 text-right">
                                        {f.isCustom ? (
                                            <button onClick={() => onDelete(f.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
                                        ) : (
                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Global</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ReportView({ entries }: any) {
    // Basic report view
    const total = entries.reduce((s: number, e: any) => s + e.calculatedEmission, 0);

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg border text-slate-900 print:shadow-none print:border-none">
            <div className="text-center border-b pb-6 mb-6">
                <h1 className="text-3xl font-bold mb-2">Karbon Ayak İzi Raporu</h1>
                <p className="text-slate-500">Otomatik Oluşturulan Rapor - {(new Date()).toLocaleDateString('tr-TR')}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-50 p-6 rounded-lg">
                    <p className="text-sm text-slate-500 uppercase">Toplam Emisyon</p>
                    <p className="text-4xl font-bold text-brand-navy mt-2">{total.toFixed(3)}</p>
                    <p className="text-sm text-slate-400 mt-1">tCO₂e</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                        <span>Scope 1</span>
                        <span className="font-bold">{entries.filter((e: any) => e.scope === "SCOPE_1").reduce((s: number, x: any) => s + x.calculatedEmission, 0).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                        <span>Scope 2</span>
                        <span className="font-bold">{entries.filter((e: any) => e.scope === "SCOPE_2").reduce((s: number, x: any) => s + x.calculatedEmission, 0).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                        <span>Scope 3</span>
                        <span className="font-bold">{entries.filter((e: any) => e.scope === "SCOPE_3").reduce((s: number, x: any) => s + x.calculatedEmission, 0).toFixed(3)}</span>
                    </div>
                </div>
            </div>

            <h3 className="font-bold border-b pb-2 mb-4">Detaylı Döküm</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Kapsam</th>
                        <th className="text-left py-2">Kategori</th>
                        <th className="text-left py-2">Aktivite</th>
                        <th className="text-right py-2">Emisyon (tCO₂e)</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((e: any) => (
                        <tr key={e.id} className="border-b border-slate-100">
                            <td className="py-2 text-slate-500">{e.scope}</td>
                            <td className="py-2">{e.category}</td>
                            <td className="py-2">{e.activity}</td>
                            <td className="py-2 text-right font-mono">{e.calculatedEmission.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-8 pt-6 border-t text-center text-xs text-slate-400">
                Bu rapor EcoPilot Sürdürülebilirlik Platformu tarafından üretilmiştir.
            </div>

            <div className="mt-6 text-center no-print">
                <button onClick={() => window.print()} className="bg-brand-navy text-white px-6 py-2 rounded-lg hover:opacity-90">
                    Yazdır / PDF Olarak Kaydet
                </button>
            </div>
        </div>
    );
}
