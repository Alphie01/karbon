import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveCompanyId } from "@/lib/company-auth";
import { Activity, Droplet, TreePine, Zap, Factory, TrendingUp, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function CorpDashboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const companyId = await getEffectiveCompanyId(user, searchParams);

    // Fetch footprints
    const currentYear = 2026; // Demo Focus
    const previousYear = 2025;

    // Carbon
    const carbonEntries = await prisma.carbonEntry.findMany({
        where: companyId === "ALL" ? {} : { companyId },
        orderBy: { date: 'desc' }
    });

    const getCarbonForYear = (year: number) => {
        const yearEntries = carbonEntries.filter(e => e.date.startsWith(year.toString()));
        const total = yearEntries.reduce((acc, curr) => acc + curr.calculatedEmission, 0);
        const s1 = yearEntries.filter(e => e.scope === "SCOPE_1").reduce((acc, curr) => acc + curr.calculatedEmission, 0);
        const s2 = yearEntries.filter(e => e.scope === "SCOPE_2").reduce((acc, curr) => acc + curr.calculatedEmission, 0);
        const s3 = yearEntries.filter(e => e.scope === "SCOPE_3").reduce((acc, curr) => acc + curr.calculatedEmission, 0);
        return { total, s1, s2, s3 };
    };

    const carbonCurrent = getCarbonForYear(currentYear);
    const carbonPrevious = getCarbonForYear(previousYear);

    const carbonReduction = carbonPrevious.total > 0
        ? ((carbonPrevious.total - carbonCurrent.total) / carbonPrevious.total) * 100
        : 0;

    // Water
    const waterReports = await prisma.waterReport.findMany({
        where: companyId === "ALL" ? {} : { companyId },
        orderBy: { year: 'desc' }
    });

    const report2026 = waterReports.find(r => r.year === 2026);
    const report2025 = waterReports.find(r => r.year === 2025);

    const waterCurrent = report2026?.totalWater || 0;
    const waterPrevious = report2025?.totalWater || 0;
    const waterReduction = waterPrevious > 0
        ? ((waterPrevious - waterCurrent) / waterPrevious) * 100
        : 0;

    const latestWaterReport = report2026 || report2025 || waterReports[0];

    // TEP (Ton Eşdeğer Petrol) Calculations
    // 1 TEP ≈ 11,628 kWh (Electricity) or 10M kcal. 
    // Roughly 1000 m3 of Natural Gas ≈ 0.82-0.90 TEP.
    const energyEntries = carbonEntries.filter(e =>
        (e.activity.includes("Elektrik") || e.activity.includes("Doğalgaz")) &&
        e.date.startsWith(currentYear.toString())
    );

    const totalTEP = energyEntries.reduce((acc, curr) => {
        let tep = 0;
        if (curr.unit === "kWh") tep = curr.amount / 11628;
        else if (curr.unit === "m³" || curr.unit === "m3") tep = (curr.amount * 0.82) / 1000; // Simplified NG to TEP
        return acc + tep;
    }, 0);

    // Business Processes & Breakdown
    const businessProcesses = await prisma.businessProcess.findMany({
        where: companyId === "ALL" ? {} : { companyId },
        include: {
            carbonEntries: true,
            waterProcesses: true
        }
    });

    const processBreakdown = businessProcesses.map(bp => {
        const carbon = bp.carbonEntries
            .filter(e => e.date.startsWith(currentYear.toString()))
            .reduce((acc: number, curr: any) => acc + curr.calculatedEmission, 0);

        const water = bp.waterProcesses
            .filter(wp => {
                // Link water processes to current year via their report if possible
                // For simplicity in demo, we associate them if they exist
                return true;
            })
            .reduce((acc: number, curr: any) => acc + (curr.input || 0), 0);

        return { title: bp.title, carbon, water };
    }).filter(pb => pb.carbon > 0 || pb.water > 0);

    // Intensity Metrics
    const mockArea = 25000;
    const mockEmployees = 1200;
    const carbonIntensity = carbonCurrent.total / mockArea;
    const waterIntensity = waterCurrent / mockEmployees;

    // Distribution Helper
    const getStrokeDash = (percentage: number, radius: number) => {
        const circumference = 2 * Math.PI * radius;
        return `${(Math.max(0, Math.min(100, percentage)) * circumference) / 100} ${circumference}`;
    };

    return (
        <div className="space-y-8  max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Kurumsal Panel: {user?.name}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        {latestWaterReport?.orgName || "Şirketinizin"} güncel sürdürülebilirlik özetine aşağıdan ulaşabilirsiniz.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-blue-100 dark:border-blue-800 text-sm">
                        <Activity size={16} />
                        Raporlama Yılı: {currentYear}
                    </div>
                    {carbonReduction > 0 && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg font-bold text-xs border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                            <TrendingUp size={12} className="rotate-180" />
                            Emisyon Azaltımı: %{carbonReduction.toFixed(1)}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Stats - Intensity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="relative z-10">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Emisyon Yoğunluğu</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {carbonIntensity.toFixed(2)} <span className="text-xs font-medium text-slate-400">kgCO2e / m²</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="relative z-10">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Kişi Başı Su Ayak İzi</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {waterIntensity.toFixed(2)} <span className="text-xs font-medium text-slate-400">m³ / Kişi</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="relative z-10">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Enerji Yoğunluğu (TEP)</div>
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                            {totalTEP.toFixed(2)} <span className="text-xs font-medium text-slate-400">Ton Eşdeğer Petrol</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Carbon Footprint Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                <TreePine className="text-emerald-600 dark:text-emerald-400" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Karbon Ayak İzi</h2>
                        </div>
                        {carbonReduction > 0 ? (
                            <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                                -%{carbonReduction.toFixed(1)} İyileşme
                            </div>
                        ) : <TrendingUp size={20} className="text-emerald-500" />}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div>
                                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                                    {carbonCurrent.total.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                    <span className="text-lg text-slate-500 font-normal ml-2">kgCO₂e</span>
                                </div>
                                <p className="text-sm text-slate-500">GHG Protokolü Standart Toplam</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-emerald-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> KAPSAM 1</span>
                                    <span>%{carbonCurrent.total > 0 ? Math.round((carbonCurrent.s1 / carbonCurrent.total) * 100) : 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-amber-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> KAPSAM 2</span>
                                    <span>%{carbonCurrent.total > 0 ? Math.round((carbonCurrent.s2 / carbonCurrent.total) * 100) : 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-indigo-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> KAPSAM 3</span>
                                    <span>%{carbonCurrent.total > 0 ? Math.round((carbonCurrent.s3 / carbonCurrent.total) * 100) : 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center relative">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-50 dark:text-slate-800" />
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-indigo-500" strokeDasharray={getStrokeDash(100, 80)} />
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-amber-500" strokeDasharray={getStrokeDash((carbonCurrent.s1 + carbonCurrent.s2) / carbonCurrent.total * 100, 80)} />
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-emerald-500" strokeDasharray={getStrokeDash(carbonCurrent.s1 / carbonCurrent.total * 100, 80)} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col transform rotate-0">
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Dağılım</span>
                                <span className="text-slate-900 dark:text-white font-black">CO2e</span>
                            </div>
                        </div>
                    </div>

                    <Link href="/corp/carbon" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all border border-slate-100 dark:border-slate-700">
                        Veri Girişi & Detaylar <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Water Footprint Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <Droplet className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Su Ayak İzi</h2>
                        </div>
                        {waterReduction > 0 ? (
                            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                                -%{waterReduction.toFixed(1)} Verimlilik
                            </div>
                        ) : <Info size={20} className="text-blue-400" />}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div>
                                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                                    {waterCurrent.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                    <span className="text-lg text-slate-500 font-normal ml-2">m³</span>
                                </div>
                                <p className="text-sm text-slate-500">ISO 14046 Analiz Toplamı</p>
                            </div>

                            <div className="space-y-2">
                                <div className="h-12 w-full flex rounded-xl overflow-hidden shadow-inner">
                                    <div className="h-full bg-blue-500" style={{ width: `${waterCurrent > 0 ? (report2026!.blueWater / waterCurrent) * 100 : 0}%` }} title="Mavi Su"></div>
                                    <div className="h-full bg-emerald-500" style={{ width: `${waterCurrent > 0 ? (report2026!.greenWater / waterCurrent) * 100 : 0}%` }} title="Yeşil Su"></div>
                                    <div className="h-full bg-slate-400" style={{ width: `${waterCurrent > 0 ? (report2026!.greyWater / waterCurrent) * 100 : 0}%` }} title="Gri Su"></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    <span className="text-blue-500">Mavi</span>
                                    <span className="text-emerald-500">Yeşil</span>
                                    <span className="text-slate-500">Gri</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-bold text-slate-400 mb-1">Geri Kazanım Oranı</div>
                                <div className="text-xl font-black text-slate-900 dark:text-white">%16.4</div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-bold text-slate-400 mb-1">Su Stresi Risk Seviyesi</div>
                                <div className="text-xl font-black text-amber-500">Orta-Yüksek</div>
                            </div>
                        </div>
                    </div>

                    <Link href="/corp/water" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all border border-slate-100 dark:border-slate-700">
                        Veri Girişi & Raporlama <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Business Process Breakdown Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">İş Süreçleri Bazlı Dağılım</h3>
                        <p className="text-sm text-slate-500 mt-1">Süreçlerinizin çevresel etki kırılımı.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {processBreakdown.map((pb, idx) => (
                        <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/40 transition-colors">
                            <h4 className="font-bold text-slate-800 dark:text-white mb-4 line-clamp-1">{pb.title}</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                                        <span className="text-emerald-600">Karbon</span>
                                        <span className="text-slate-500">{pb.carbon.toLocaleString()} kg</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${carbonCurrent.total > 0 ? (pb.carbon / carbonCurrent.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                                        <span className="text-blue-600">Su</span>
                                        <span className="text-slate-500">{pb.water.toLocaleString()} m³</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${waterCurrent > 0 ? (pb.water / waterCurrent) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {processBreakdown.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium italic">
                            Henüz süreçlerle ilişkilendirilmiş veri bulunmuyor.
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Robot & Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex-shrink-0">
                            <Zap size={20} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Hibe & Teşvik Robotu</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                {carbonEntries.length} veri girişi ve su profili tarandı. Şirket profilinize uygun hibe fırsatlarını görüntüleyin.
                            </p>
                            <Link href="/corp/robot" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                Robotu Çalıştır <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0">
                            <Factory size={20} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Senaryo Simülasyonu</h3>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">AI SIM</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                &quot;GES yatırımı yaparsam karbon ayak izim ne kadar düşer?&quot; gibi senaryoları PySD motoruyla test edin.
                            </p>
                            <Link href="/corp/simulation" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg transition-colors">
                                Simülasyona Git <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Son Veri Girişleri</h3>
                <div className="space-y-4">
                    {carbonEntries.slice(0, 3).map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.scope === 'SCOPE_1' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-white">{entry.activity}</div>
                                    <div className="text-[10px] text-slate-500">{entry.category} • {entry.date}</div>
                                </div>
                            </div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                                +{entry.calculatedEmission.toLocaleString()} kgCO2e
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
