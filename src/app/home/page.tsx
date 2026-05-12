"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Minimal SVG Icons ───────────────────────────────────────────────────
function Ic({ children, size = 20, className = "" }: { children: React.ReactNode; size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            {children}
        </svg>
    );
}
const IcArrow   = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></Ic>;
const IcArrowUR = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M7 17 17 7"/><path d="M8 7h9v9"/></Ic>;
const IcMenu    = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M3 7h18"/><path d="M3 17h18"/></Ic>;
const IcXIcon   = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M6 6 18 18"/><path d="M18 6 6 18"/></Ic>;
const IcCarbon  = (p: { size?: number; className?: string }) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12c4 0 6-3 9-3s5 3 9 3"/></Ic>;
const IcWater   = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M12 3c4 5 7 8 7 12a7 7 0 1 1-14 0c0-4 3-7 7-12Z"/><path d="M8.5 14a3.5 3.5 0 0 0 3.5 3.5"/></Ic>;
const IcGrant   = (p: { size?: number; className?: string }) => <Ic {...p}><rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3 10h18"/><path d="M8 6V4h8v2"/><path d="M10 14h4"/></Ic>;
const IcCRM     = (p: { size?: number; className?: string }) => <Ic {...p}><circle cx="9" cy="9" r="3"/><path d="M3 19c.8-3.2 3.2-5 6-5s5.2 1.8 6 5"/><circle cx="17" cy="7" r="2"/><path d="M15 12c2.6.4 4.4 2 5 5"/></Ic>;
const IcEdu     = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M3 8 12 4l9 4-9 4-9-4Z"/><path d="M7 10v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5"/><path d="M21 8v6"/></Ic>;
const IcShield  = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M12 3 4 6v6c0 4.5 3.2 8.3 8 9 4.8-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></Ic>;
const IcKey     = (p: { size?: number; className?: string }) => <Ic {...p}><circle cx="8" cy="14" r="4"/><path d="m11 11 9-9"/><path d="m17 5 3 3"/><path d="m14 8 3 3"/></Ic>;
const IcLayers  = (p: { size?: number; className?: string }) => <Ic {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17 9 5 9-5"/></Ic>;
const IcDB      = (p: { size?: number; className?: string }) => <Ic {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/></Ic>;
const IcBolt    = (p: { size?: number; className?: string }) => <Ic {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z"/></Ic>;

// ─── Dashboard Mockup Components ────────────────────────────────────────
function DashChrome({ children, title = "EcoPilot · Dashboard" }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="rounded border border-white/10 bg-ink-800/95 text-ink-100 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-ink-900/60">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ink-500" />
                    <span className="w-2 h-2 rounded-full bg-ink-500" />
                    <span className="w-2 h-2 rounded-full bg-ink-500" />
                    <span className="ml-3 font-mono text-[11px] tracking-wide text-ink-300">{title}</span>
                </div>
                <div className="font-mono text-[11px] text-ink-400">v2.4 · prod</div>
            </div>
            {children}
        </div>
    );
}

function DashSidebar() {
    const items = [
        { l: "Genel Bakış", active: true, ic: "■" },
        { l: "Karbon Ayak İzi", ic: "◇" },
        { l: "Su Ayak İzi", ic: "◇" },
        { l: "Teşvik & Hibe", ic: "▢" },
        { l: "CRM", ic: "▢" },
        { l: "Eğitim", ic: "▢" },
        { l: "Raporlar", ic: "▦" },
        { l: "Ayarlar", ic: "✕" },
    ];
    return (
        <aside className="hidden md:flex flex-col w-[180px] border-r border-white/10 bg-ink-900/60 py-4">
            <div className="px-4 mb-4">
                <div className="text-[11px] font-mono text-ink-400 uppercase tracking-widest">Workspace</div>
                <div className="mt-1 text-sm font-medium text-ink-100">Plastik A.Ş.</div>
                <div className="text-[11px] text-ink-400">Bursa · OSB</div>
            </div>
            <nav className="px-2 flex-1">
                {items.map((it, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded text-[12.5px] flex items-center gap-2 ${it.active ? "bg-white/5 text-ink-100" : "text-ink-300"}`}>
                        <span className="font-mono text-[10px] text-ink-400 w-3">{it.ic}</span>
                        <span>{it.l}</span>
                    </div>
                ))}
            </nav>
            <div className="px-4 pt-3 border-t border-white/10 text-[11px] text-ink-400">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-forest-700 flex items-center justify-center text-[10px] text-white font-medium">MK</div>
                    <div>
                        <div className="text-ink-200 leading-tight">M. Kaya</div>
                        <div className="font-mono">Sürd. Mgr.</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function KPI({ label, value, unit, delta, deltaPos, accent = "forest" }: { label: string; value: string; unit: string; delta?: string; deltaPos?: boolean; accent?: string }) {
    const accentMap: Record<string, string> = {
        forest: "text-forest-300",
        deep: "text-deep-300",
        amber: "text-amber-400",
        ink: "text-ink-100",
    };
    return (
        <div className="p-2.5 border border-white/10 rounded bg-ink-900/40 min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-widest text-ink-400 leading-tight truncate">{label}</div>
            <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                <div className={`text-lg font-medium tabular-nums leading-none ${accentMap[accent]}`}>{value}</div>
                <div className="text-[9px] text-ink-400 font-mono truncate">{unit}</div>
            </div>
            {delta && (
                <div className="mt-1 flex items-center gap-1 text-[9px] font-mono">
                    <span className={deltaPos ? "text-forest-300" : "text-amber-400"}>
                        {deltaPos ? "↓" : "↑"} {delta}
                    </span>
                    <span className="text-ink-500">YoY</span>
                </div>
            )}
        </div>
    );
}

function BarChart() {
    const chartRef = useRef<HTMLDivElement>(null);
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const data   = [78, 82, 71, 69, 64, 58, 61, 55, 52, 48, 51, 46];
    const target = [70, 70, 68, 66, 62, 60, 58, 56, 54, 52, 50, 48];
    const max = 90;

    useLayoutEffect(() => {
        if (!chartRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bars = chartRef.current.querySelectorAll<HTMLElement>(".bar-inner");
        gsap.set(Array.from(bars), { scaleY: 0, transformOrigin: "50% 100%" });
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some(e => e.isIntersecting)) {
                    observer.disconnect();
                    gsap.to(Array.from(bars), {
                        scaleY: 1, duration: 0.65, ease: "power3.out", stagger: 0.04,
                    });
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(chartRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={chartRef} className="p-4 border border-white/10 rounded bg-ink-900/40">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Aylık Emisyon</div>
                    <div className="text-sm text-ink-100 mt-0.5">Karbon (tCO₂e) · 2025</div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-ink-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-forest-500 inline-block" />Ölçüm</span>
                </div>
            </div>
            <div className="relative h-[120px] flex items-end gap-1">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map(i => <div key={i} className="border-t border-white/5" />)}
                </div>
                {data.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative">
                        <div
                            className="bar-inner w-full bg-forest-500/70 relative"
                            style={{ height: `${(v / max) * 100}%` }}
                        >
                            <div className="absolute left-0 right-0 border-t border-deep-300 border-dashed"
                                style={{ top: `${100 - (target[i] / v) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[9px] text-ink-500">
                {months.map(m => <span key={m}>{m}</span>)}
            </div>
        </div>
    );
}

function WaterChart() {
    const pts = [12, 14, 13, 11, 9, 10, 8, 7.5, 8, 7, 6.5, 6];
    const max = 16;
    const w = 320, h = 100, pad = 6;
    const step = (w - pad * 2) / (pts.length - 1);
    const toXY = (v: number, i: number): [number, number] => [pad + i * step, h - pad - (v / max) * (h - pad * 2)];
    const line = pts.map((v, i) => toXY(v, i)).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const area = line + ` L${(pad + (pts.length - 1) * step).toFixed(1)} ${(h - pad)} L${pad} ${(h - pad)} Z`;
    return (
        <div className="p-4 border border-white/10 rounded bg-ink-900/40">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Su Yoğunluğu</div>
                    <div className="text-sm text-ink-100 mt-0.5">m³ / ton üretim</div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-medium tabular-nums text-deep-300">6.0</div>
                    <div className="text-[10px] font-mono text-forest-300">↓ 50% YoY</div>
                </div>
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[100px]">
                <defs>
                    <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2D5F8B" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#2D5F8B" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" x2={w} y1={pad + i * ((h - pad * 2) / 3)} y2={pad + i * ((h - pad * 2) / 3)} stroke="rgba(255,255,255,0.05)" />
                ))}
                <path d={area} fill="url(#waterFill)" />
                <path d={line} fill="none" stroke="#7FA0BE" strokeWidth="1.5" />
                {pts.map((v, i) => {
                    const [x, y] = toXY(v, i);
                    return <circle key={i} cx={x} cy={y} r="2" fill="#0B1620" stroke="#7FA0BE" strokeWidth="1.2" />;
                })}
            </svg>
        </div>
    );
}

function ActivityList() {
    const rows = [
        { code: "S2-EL-04", label: "Elektrik tüketim verisi onaylandı", who: "E. Yılmaz", t: "08:42", tag: "Scope 2" },
        { code: "H2O-PR-12", label: "Üretim hattı 3 — su sayacı eşleştirildi", who: "S. Demir", t: "08:31", tag: "Su" },
        { code: "TŞV-021", label: "TÜBİTAK 1707 — başvuru taslağı kaydedildi", who: "M. Kaya", t: "Dün", tag: "Teşvik" },
        { code: "CRM-118", label: "Acme Polimer — kapsamlı görüşme planlandı", who: "B. Aksoy", t: "Dün", tag: "CRM" },
        { code: "EDU-09", label: "ISO 14064-1 modülü tamamlandı (24/30 kişi)", who: "Eğitim", t: "2 gün", tag: "Akademi" },
    ];
    const tagColor: Record<string, string> = {
        "Scope 2": "text-forest-300 border-forest-700",
        "Su": "text-deep-300 border-deep-700",
        "Teşvik": "text-amber-400 border-amber-500/40",
        "CRM": "text-ink-100 border-ink-600",
        "Akademi": "text-forest-300 border-forest-700",
    };
    return (
        <div className="p-4 border border-white/10 rounded bg-ink-900/40">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Aktivite</div>
                    <div className="text-sm text-ink-100 mt-0.5">Son veri kayıtları</div>
                </div>
                <div className="font-mono text-[10px] text-ink-400">Bugün · 5</div>
            </div>
            <div className="divide-y divide-white/5">
                {rows.map((r, i) => (
                    <div key={i} className="py-2 flex items-center gap-3 text-[12px]">
                        <span className="font-mono text-[10px] text-ink-500 w-[72px] shrink-0">{r.code}</span>
                        <span className="flex-1 text-ink-200 truncate">{r.label}</span>
                        <span className={`hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 border rounded ${tagColor[r.tag]}`}>{r.tag}</span>
                        <span className="font-mono text-[10px] text-ink-500 w-10 text-right">{r.t}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DashboardMockup({ compact = false }: { compact?: boolean }) {
    return (
        <DashChrome>
            <div className="flex">
                {!compact && <DashSidebar />}
                <div className="flex-1 p-4 bg-ink-800 overflow-hidden min-w-0">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Genel Bakış</div>
                            <div className={`${compact ? "text-sm" : "text-base"} text-ink-100 font-medium mt-0.5`}>Karbon &amp; Su · 2025</div>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                            <span className="px-2 py-1 border border-white/10 text-ink-300 rounded">2024</span>
                            <span className="px-2 py-1 border border-forest-700 bg-forest-700/30 text-forest-300 rounded">2025</span>
                        </div>
                    </div>
                    <div className={`grid gap-2 mb-2 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
                        <KPI label={compact ? "Karbon S1+2" : "Karbon (Scope 1+2)"} value="734" unit="tCO₂e" delta="12.4%" deltaPos accent="forest" />
                        <KPI label="Su Çekimi" value="18.4" unit="bin m³" delta="9.1%" deltaPos accent="deep" />
                        <KPI label="Açık Teşvik" value="14" unit="başvuru" accent="amber" />
                        <KPI label="Eğitim" value="78%" unit="ekip" delta="6 pt" deltaPos accent="ink" />
                    </div>
                    <div className={`grid gap-2 mb-2 ${compact ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"}`}>
                        <BarChart />
                        <WaterChart />
                    </div>
                    {!compact && <ActivityList />}
                </div>
            </div>
        </DashChrome>
    );
}

function AdminMockup() {
    return (
        <DashChrome title="EcoPilot · Admin">
            <div className="flex">
                <DashSidebar />
                <div className="flex-1 p-4 bg-ink-800">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Admin · Şirketler</div>
                            <div className="text-base text-ink-100 font-medium mt-0.5">Komite paydaşları — 42 şirket</div>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                            <span className="px-2 py-1 border border-forest-700 bg-forest-700/30 text-forest-300 rounded">Aktif 38</span>
                            <span className="px-2 py-1 border border-white/10 text-ink-300 rounded">Beklemede 4</span>
                        </div>
                    </div>
                    <div className="p-4 border border-white/10 rounded bg-ink-900/40 overflow-x-auto">
                        <div className="grid grid-cols-12 gap-2 pb-2 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-ink-500 min-w-[540px]">
                            <div className="col-span-4">Şirket</div>
                            <div className="col-span-2">Kapsam</div>
                            <div className="col-span-2">Sorumlu</div>
                            <div className="col-span-2">Aşama</div>
                            <div className="col-span-2 text-right">Erişim</div>
                        </div>
                        {[
                            { n: "Acme Polimer", k: "Karbon · Su", r: "M. Kaya", a: "Veri toplama", e: "Operatör + Yönetici" },
                            { n: "Bursa Plastik San.", k: "Karbon", r: "E. Yılmaz", a: "Raporlama", e: "Yönetici" },
                            { n: "Kıraç Enjeksiyon", k: "Karbon · Su · Teşvik", r: "S. Demir", a: "Onay", e: "Operatör" },
                            { n: "Polimera A.Ş.", k: "Su", r: "B. Aksoy", a: "Veri toplama", e: "Yönetici" },
                            { n: "Nilüfer Kompozit", k: "Karbon", r: "M. Kaya", a: "Onay", e: "Yalnız okuma" },
                        ].map((r, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 py-2 text-[11px] border-b border-white/5 last:border-0 min-w-[540px]">
                                <div className="col-span-4 text-ink-100">{r.n}</div>
                                <div className="col-span-2 font-mono text-[10px] text-forest-300">{r.k}</div>
                                <div className="col-span-2 text-ink-300">{r.r}</div>
                                <div className="col-span-2 text-ink-300">{r.a}</div>
                                <div className="col-span-2 text-right font-mono text-[10px] text-ink-400">{r.e}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashChrome>
    );
}

// ─── Module Data ─────────────────────────────────────────────────────────
const MODULES = [
    {
        id: "karbon", code: "M.01", title: "Karbon Ayak İzi Ölçümü", short: "Karbon",
        Icon: IcCarbon, color: "forest",
        summary: "İşletmelerin faaliyetlerinden kaynaklanan karbon etkisini ölçülebilir hale getirir; veri girişi, hesaplama ve raporlama tek akış içinde yürütülür.",
        bullets: ["Scope 1, 2 ve 3 ayrımı ile kategori bazlı veri girişi", "Tesis, hat ve süreç bazında emisyon kırılımı", "ISO 14064‑1 referanslı hesaplama mantığı", "Yıllık, çeyreklik ve dönemsel karşılaştırma"],
        metric: { label: "Aylık Emisyon", value: "58.2", unit: "tCO₂e", sub: "Haz · 2025 dönemi" },
    },
    {
        id: "su", code: "M.02", title: "Su Ayak İzi Ölçümü", short: "Su",
        Icon: IcWater, color: "deep",
        summary: "Üretim ve operasyon süreçlerindeki su tüketimini takip eder; süreç bazında yoğunluk analizleriyle iyileştirme alanlarını ortaya koyar.",
        bullets: ["Süreç bazında m³ / ton üretim yoğunluğu", "Proses, soğutma, temizlik ayrımı", "ISO 14046 referanslı raporlama mantığı", "Sayaç eşleştirme ve sapma uyarıları"],
        metric: { label: "Su Yoğunluğu", value: "6.0", unit: "m³/t", sub: "50% YoY azalış" },
    },
    {
        id: "tesvik", code: "M.03", title: "Teşvik ve Hibe Listesi", short: "Teşvik",
        Icon: IcGrant, color: "amber",
        summary: "Sürdürülebilirlik, enerji verimliliği ve dijital dönüşüm alanlarındaki teşviklerin tek listede erişilebilir biçimde takibini sağlar.",
        bullets: ["Konu, kurum ve son başvuru tarihine göre filtre", "Uygunluk değerlendirme şablonları", "Başvuru taslağı kaydı ve süreç takibi", "Açık çağrı bildirimi ve gündem akışı"],
        metric: { label: "Açık Çağrı", value: "14", unit: "başvurulabilir", sub: "5 yeni · son 30 gün" },
    },
    {
        id: "crm", code: "M.04", title: "CRM ve Kurumsal Takip", short: "CRM",
        Icon: IcCRM, color: "ink",
        summary: "Firma, görüşme, teklif ve süreç yönetimini tek merkezde toplayarak sürdürülebilirlik danışmanlığını yönetilebilir hale getirir.",
        bullets: ["Firma kartı: faaliyet, kapsam, ekip ve geçmiş", "Görüşme ve saha ziyareti planlaması", "Teklif ve süreç durumu izleme", "Komite paydaşları için ortak görünüm"],
        metric: { label: "Aktif Süreç", value: "38", unit: "firma", sub: "12 değerlendirme aşamasında" },
    },
    {
        id: "egitim", code: "M.05", title: "Akademik Eğitimler", short: "Akademi",
        Icon: IcEdu, color: "forest",
        summary: "Sürdürülebilirlik, karbon hesaplama, su yönetimi ve mevzuat konularında eğitim içeriklerini ekip bazında sunar.",
        bullets: ["Modüler eğitim içerikleri ve ilerleme takibi", "Mevzuat ve raporlama referans kütüphanesi", "Sertifika ve tamamlama kaydı", "Şirket bazında ekip görünümü"],
        metric: { label: "Tamamlama", value: "78%", unit: "ekip", sub: "24 / 30 kişi · ISO 14064‑1" },
    },
];

function ModuleVisual({ id }: { id: string }) {
    if (id === "karbon") return <BarChart />;
    if (id === "su") return <WaterChart />;
    if (id === "tesvik") return (
        <div className="p-4 border border-white/10 rounded bg-ink-900/40">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400 mb-3">Açık çağrılar · seçili</div>
            <div className="space-y-1.5">
                {[
                    { c: "TÜBİTAK 1707", t: "Siparişe Dayalı Ar‑Ge", d: "31 Tem", s: "Uygun" },
                    { c: "KOSGEB", t: "Yeşil Sanayi Programı", d: "15 Eyl", s: "Değerlendir" },
                    { c: "İKMİB", t: "Çevresel Yatırım Desteği", d: "02 Eki", s: "Uygun" },
                    { c: "AB IPA", t: "Döngüsel Ekonomi Hibesi", d: "21 Eki", s: "Belge eksik" },
                ].map((r, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 py-1.5 border-b border-white/5 text-[11px]">
                        <div className="col-span-3 font-mono text-[10px] text-ink-300">{r.c}</div>
                        <div className="col-span-5 text-ink-100">{r.t}</div>
                        <div className="col-span-2 font-mono text-[10px] text-ink-400">{r.d}</div>
                        <div className={`col-span-2 text-right font-mono text-[10px] ${r.s === "Uygun" ? "text-forest-300" : r.s === "Belge eksik" ? "text-amber-400" : "text-deep-300"}`}>{r.s}</div>
                    </div>
                ))}
            </div>
        </div>
    );
    if (id === "crm") return (
        <div className="p-4 border border-white/10 rounded bg-ink-900/40">
            <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">CRM · firma kartı</div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 border border-forest-700 text-forest-300 rounded">Aktif</span>
            </div>
            <div className="text-[15px] text-ink-100 font-medium">Acme Polimer Sanayi A.Ş.</div>
            <div className="text-[12px] text-ink-400 mt-0.5">Plastik enjeksiyon · 142 çalışan · Bursa OSB</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {[{ l: "Kapsam", v: "Karbon + Su" }, { l: "Sorumlu", v: "M. Kaya" }, { l: "Aşama", v: "Veri toplama" }].map((x, i) => (
                    <div key={i} className="p-2 border border-white/10 rounded">
                        <div className="font-mono text-[9px] text-ink-500 uppercase tracking-wider">{x.l}</div>
                        <div className="mt-1 text-[12px] text-ink-100">{x.v}</div>
                    </div>
                ))}
            </div>
            <div className="mt-3 text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-2">Son etkileşim</div>
            <ul className="space-y-1.5 text-[11px] text-ink-200">
                <li className="flex gap-3"><span className="font-mono text-[10px] text-ink-500 w-12">12 Haz</span>Saha ziyareti tamamlandı</li>
                <li className="flex gap-3"><span className="font-mono text-[10px] text-ink-500 w-12">04 Haz</span>Veri toplama şablonu paylaşıldı</li>
            </ul>
        </div>
    );
    if (id === "egitim") return (
        <div className="p-4 border border-white/10 rounded bg-ink-900/40">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400 mb-3">Eğitim akışı</div>
            {[
                { t: "ISO 14064‑1 — Kuruluş düzeyi sera gazı", p: 80, m: "24/30" },
                { t: "ISO 14046 — Su ayak izi", p: 55, m: "16/30" },
                { t: "Scope 3 — Değer zinciri emisyonları", p: 30, m: "9/30" },
                { t: "Sürdürülebilirlik raporlama temelleri", p: 92, m: "28/30" },
            ].map((e, i) => (
                <div key={i} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-[12px] text-ink-100">
                        <span>{e.t}</span>
                        <span className="font-mono text-[10px] text-ink-400">{e.m}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-white/10 rounded">
                        <div className="h-full bg-forest-500 rounded" style={{ width: `${e.p}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
    return null;
}

// ─── Page Sections ───────────────────────────────────────────────────────

function SiteHeader() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const nav = [
        { l: "Modüller", h: "#moduller" },
        { l: "Nasıl Çalışır?", h: "#nasil-calisir" },
        { l: "Platform", h: "#platform" },
        { l: "Plastik Sektörü", h: "#plastik-sektoru" },
        { l: "İletişim", h: "#iletisim" },
    ];

    return (
        <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${scrolled ? "bg-ink-50/95 border-b hairline text-ink-900" : "bg-transparent text-ink-50"}`}>
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between">
                <a href="#top" className="flex items-baseline gap-2">
                    <span className={`text-[20px] font-medium tracking-tight ${scrolled ? "text-ink-900" : "text-ink-50"}`}>EcoPilot</span>
                    <span className={`hidden sm:inline font-mono text-[11px] ${scrolled ? "text-ink-400" : "text-ink-300"}`}>by Monolith Yazılım</span>
                </a>
                <nav className={`hidden lg:flex items-center gap-7 text-[13.5px] ${scrolled ? "text-ink-700" : "text-ink-200"}`}>
                    {nav.map(n => (
                        <a key={n.h} href={n.h} className={`transition-colors ${scrolled ? "hover:text-ink-900" : "hover:text-ink-50"}`}>{n.l}</a>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <Link href="/login" className={`hidden sm:inline-flex items-center gap-1.5 text-[13px] px-3 py-2 transition-colors ${scrolled ? "text-ink-700 hover:text-ink-900" : "text-ink-200 hover:text-ink-50"}`}>
                        Giriş Yap
                    </Link>
                    <a href="#iletisim" className={`inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-sm transition-colors ${scrolled ? "bg-ink-900 text-ink-50 hover:bg-ink-800" : "bg-ink-50 text-ink-900 hover:bg-white"}`}>
                        Platforma Katıl <IcArrow size={14} />
                    </a>
                    <button className="lg:hidden p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Menü">
                        {open ? <IcXIcon size={20} className={scrolled ? "text-ink-900" : "text-ink-50"} /> : <IcMenu size={20} className={scrolled ? "text-ink-900" : "text-ink-50"} />}
                    </button>
                </div>
            </div>
            {open && (
                <div className="lg:hidden bg-ink-50 border-t hairline">
                    <div className="max-w-[1280px] mx-auto px-5 py-3 flex flex-col">
                        {nav.map(n => (
                            <a key={n.h} href={n.h} onClick={() => setOpen(false)}
                                className="py-2.5 text-[15px] text-ink-700 border-b hairline last:border-0">{n.l}</a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

function HeroSection() {
    return (
        <section id="top" className="relative pt-[68px] bg-ink-900 text-ink-50 overflow-hidden">
            <div className="absolute inset-0 topo-bg opacity-50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-900 to-ink-800 pointer-events-none" />

            <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-14 md:pb-24">
                <div className="hero-eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-mono uppercase tracking-widest text-ink-300 mb-8">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-300" />
                        Sürdürülebilirlik Platformu
                    </span>
                    <span className="text-ink-500">/</span>
                    <span>BTSO Plastik Komitesi için geliştirildi</span>
                    <span className="text-ink-500">/</span>
                    <span>v2.4 · 2026</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-x-10 gap-y-10 items-end">
                    <div className="lg:col-span-7">
                        <h1 className="hero-title text-[38px] sm:text-[48px] md:text-[60px] lg:text-[68px] leading-[1.03] tracking-tight font-medium text-ink-50">
                            Plastik sektörü için
                            <br />
                            <span className="text-forest-300">sürdürülebilirlik</span>
                            <br />
                            ölçüm ve yönetim platformu.
                        </h1>
                        <p className="hero-body mt-7 max-w-[58ch] text-[15.5px] md:text-[16.5px] leading-relaxed text-ink-200">
                            EcoPilot, Monolith Yazılım tarafından BTSO Plastik Komitesi için geliştirilen;
                            karbon ayak izi, su ayak izi, teşvik, CRM ve akademik eğitim süreçlerini tek
                            dijital platformda bir araya getiren kurumsal sürdürülebilirlik çözümüdür.
                        </p>
                        <div className="hero-ctas mt-9 flex flex-wrap items-center gap-3">
                            <a href="#platform" className="inline-flex items-center gap-2 bg-ink-50 text-ink-900 px-5 py-3 rounded-sm text-[14px] font-medium hover:bg-white transition-colors">
                                Platformu İncele <IcArrow size={16} />
                            </a>
                            <a href="#moduller" className="inline-flex items-center gap-2 border border-white/15 text-ink-100 px-5 py-3 rounded-sm text-[14px] hover:bg-white/5 transition-colors">
                                Modülleri Gör
                            </a>
                        </div>
                        <dl className="hero-stats mt-12 grid grid-cols-3 max-w-[520px] gap-x-6 border-t border-white/10 pt-6">
                            {[
                                { k: "5", l: "Entegre modül" },
                                { k: "ISO 14064‑1", l: "Hesaplama referansı" },
                                { k: "Rol bazlı", l: "Kurumsal erişim" },
                            ].map((s, i) => (
                                <div key={i}>
                                    <dt className="text-[22px] md:text-[26px] font-medium tabular-nums text-ink-50">{s.k}</dt>
                                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-400">{s.l}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="hero-dash lg:col-span-5">
                        <div className="relative">
                            <div className="absolute -inset-3 bg-gradient-to-tr from-forest-700/20 to-deep-500/10 blur-2xl pointer-events-none" />
                            <div className="relative">
                                <DashboardMockup compact />
                            </div>
                            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-400">
                                <span>fig. 01 — Genel bakış paneli</span>
                                <span>ecopilot.app/dashboard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative border-t border-white/10 bg-ink-900">
                <div className="overflow-hidden">
                    <div className="marquee-track flex whitespace-nowrap py-3.5 text-[11px] font-mono uppercase tracking-widest text-ink-400">
                        {[0, 1].map((_, k) => (
                            <div key={k} className="flex items-center gap-10 pr-10">
                                {["Karbon ayak izi · ISO 14064‑1", "Su ayak izi · ISO 14046", "Scope 1 · 2 · 3", "Teşvik & hibe takibi", "CRM & saha yönetimi", "Akademik eğitim", "Rol bazlı erişim", "Çok şirketli yapı"].map((t, i) => (
                                    <span key={i} className="flex items-center gap-10">
                                        <span>{t}</span>
                                        <span className="text-ink-700">◆</span>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function AttributionSection() {
    return (
        <section className="bg-ink-50 border-b hairline">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14">
                <div className="grid md:grid-cols-12 gap-y-8 gap-x-10 items-start">
                    <div className="md:col-span-3">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500">Proje Künyesi</div>
                        <h2 className="mt-2 text-[20px] md:text-[22px] text-ink-900 font-medium leading-snug">Kurumsal bir iş birliği.</h2>
                    </div>
                    <div className="md:col-span-9 grid sm:grid-cols-3 gap-x-8 gap-y-6 sm:pl-10 border-l-0 sm:border-l hairline">
                        {[
                            { k: "Developed by", v: "Monolith Yazılım", d: "Yazılım mimarisi, arayüz ve dijital platform altyapısı." },
                            { k: "Developed for", v: "BTSO Plastik Komitesi", d: "Plastik sektörünün sürdürülebilirlik ihtiyaçları için." },
                            { k: "Focus Area", v: "Plastik sanayisi sürdürülebilirlik yönetimi", d: "Karbon, su, teşvik, CRM ve eğitim süreçleri." },
                        ].map((x, i) => (
                            <div key={i}>
                                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500">{x.k}</div>
                                <div className="mt-1.5 text-[15px] text-ink-900 font-medium leading-snug">{x.v}</div>
                                <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{x.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProblemSection() {
    const items = [
        { n: "01", t: "Karbon emisyonlarını takip etme ihtiyacı", d: "Üretim, enerji ve lojistik kaynaklı emisyonlar; Scope 1‑2‑3 ayrımı yapılmadan değerlendirilemez. Tutarlı veri girişi ve hesaplama referansı gerekir." },
        { n: "02", t: "Su tüketimini ölçme gerekliliği", d: "Proses suyu, soğutma, temizlik ve hammadde adımlarındaki su yoğunluğu çoğu işletmede dağınık tutuluyor. Tek bir referans değere ihtiyaç var." },
        { n: "03", t: "Teşvik ve desteklere erişim zorluğu", d: "Sürdürülebilirlik ve çevre yatırımı teşvikleri farklı kurumlarda; başvuru takibi ve uygunluk değerlendirmesi merkezi değil." },
        { n: "04", t: "Sürdürülebilirlik bilgisinin dağınık olması", d: "Veri farklı tablolarda, sorumluluk farklı ekiplerde. Raporlama dönemi geldiğinde tutarlılığı sağlamak ekstra emek istiyor." },
    ];
    return (
        <section className="bg-ink-50">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-y-10 gap-x-10">
                    <div className="md:col-span-5">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">§ 01 — Sektörel Bağlam</div>
                        <h2 className="text-[34px] md:text-[44px] leading-[1.08] tracking-tight font-medium text-ink-900">
                            Plastik sektörü için<br />
                            <span className="text-forest-700">ölçülebilir sürdürülebilirlik</span> dönemi.
                        </h2>
                        <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-ink-600">
                            Plastik sektörü; enerji kullanımı, su tüketimi, karbon emisyonları ve raporlama yükümlülükleri nedeniyle
                            daha sistematik dijital araçlara ihtiyaç duyuyor. EcoPilot bu ihtiyaçları tek panel üzerinden yönetilebilir hale getirmek için geliştirildi.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <ul className="border-t hairline">
                            {items.map(it => (
                                <li key={it.n} className="grid grid-cols-12 gap-4 py-6 border-b hairline">
                                    <div className="col-span-2 md:col-span-1 font-mono text-[11px] text-ink-400 pt-1">{it.n}</div>
                                    <div className="col-span-10 md:col-span-11">
                                        <div className="text-[17px] md:text-[18.5px] text-ink-900 font-medium leading-snug">{it.t}</div>
                                        <p className="mt-2 text-[14px] text-ink-500 leading-relaxed max-w-[64ch]">{it.d}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ModulesSection() {
    const [active, setActive] = useState("karbon");
    const m = MODULES.find(x => x.id === active)!;
    const accentText: Record<string, string> = { forest: "text-forest-300", deep: "text-deep-300", amber: "text-amber-400", ink: "text-ink-100" };

    return (
        <section id="moduller" className="bg-ink-900 text-ink-100">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 items-end">
                    <div className="md:col-span-7">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-400 mb-4">§ 02 — Platform Modülleri</div>
                        <h2 className="text-[34px] md:text-[48px] leading-[1.05] tracking-tight font-medium">
                            Beş entegre modül,<br />
                            <span className="text-forest-300">tek dijital platformda.</span>
                        </h2>
                    </div>
                    <div className="md:col-span-5 text-[14.5px] text-ink-300 leading-relaxed">
                        Modüller birbiriyle veri paylaşır ve tek bir kurumsal yapı içinde çalışır.
                        Her modül gerçek bir iş akışını destekleyecek şekilde tasarlandı.
                    </div>
                </div>

                <div className="mt-10 md:mt-14 flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
                    {MODULES.map(x => {
                        const isActive = x.id === active;
                        return (
                            <button key={x.id} onClick={() => setActive(x.id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-[13px] transition-colors ${isActive ? "bg-ink-50 text-ink-900" : "border border-white/10 text-ink-300 hover:text-ink-100 hover:border-white/20"}`}>
                                <x.Icon size={15} />
                                <span className="font-mono text-[10px] opacity-60">{x.code}</span>
                                <span className="hidden sm:inline">{x.short}</span>
                            </button>
                        );
                    })}
                </div>

                <div key={m.id} className="mt-10 grid md:grid-cols-12 gap-x-10 gap-y-8">
                    <div className="md:col-span-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 border border-white/10 rounded flex items-center justify-center ${accentText[m.color]}`}>
                                <m.Icon size={20} />
                            </div>
                            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-400">{m.code}</div>
                        </div>
                        <h3 className="mt-5 text-[28px] md:text-[34px] leading-tight tracking-tight font-medium text-ink-50">{m.title}</h3>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-300 max-w-[56ch]">{m.summary}</p>
                        <ul className="mt-7 space-y-3">
                            {m.bullets.map((b, i) => (
                                <li key={i} className="flex gap-3 text-[14px] text-ink-200">
                                    <span className="font-mono text-[10.5px] text-ink-500 w-8 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 inline-flex items-center gap-2 text-[13px] text-ink-100 border-b border-ink-100/40 pb-0.5 cursor-default">
                            Detaylı modül dökümanı <IcArrowUR size={14} />
                        </div>
                    </div>
                    <div className="md:col-span-6">
                        <ModuleVisual id={m.id} />
                        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-500">
                            <span>fig. {m.code} — {m.metric.label}</span>
                            <span>{m.metric.value} {m.metric.unit} · {m.metric.sub}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProcessSection() {
    const steps = [
        { n: "01", t: "Firma profili", d: "Faaliyet, kapsam, tesis ve ekip yapısı tanımlanır." },
        { n: "02", t: "Veri girişi", d: "Karbon ve su için referans dönem verileri sisteme aktarılır." },
        { n: "03", t: "Ölçüm & analiz", d: "Sistem; Scope ayrımı, kategori ve süreç bazlı analizi destekler." },
        { n: "04", t: "Dashboard", d: "Sonuçlar gerçek zamanlı panel üzerinden görüntülenir." },
        { n: "05", t: "Gelişim", d: "Teşvik ve eğitim modülleri ile gelişim alanları desteklenir." },
        { n: "06", t: "Kurumsal takip", d: "CRM yapısı ile süreç ve paydaş yönetimi merkezi tutulur." },
    ];
    return (
        <section id="nasil-calisir" className="bg-ink-50">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-6 items-end mb-12">
                    <div className="md:col-span-7">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">§ 03 — Akış</div>
                        <h2 className="text-[34px] md:text-[44px] leading-[1.08] tracking-tight font-medium text-ink-900">Platform nasıl çalışır?</h2>
                    </div>
                    <p className="md:col-span-5 text-[15px] leading-relaxed text-ink-600 max-w-[48ch]">
                        Veri girişinden raporlamaya kadar olan süreç tek bir akış olarak kurgulandı. Adımlar birbirinin çıktısı üzerine ilerler.
                    </p>
                </div>
                <ol className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-px bg-ink-200 border hairline">
                    {steps.map((s, i) => (
                        <li key={s.n} className="bg-ink-50 p-5 md:p-6 min-h-[160px] flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="font-mono text-[10.5px] text-ink-500 tracking-widest">{s.n}</div>
                                <div className="font-mono text-[10px] text-ink-400">Adım {i + 1}/6</div>
                            </div>
                            <div className="mt-5 text-[15.5px] md:text-[17px] font-medium text-ink-900 leading-snug">{s.t}</div>
                            <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">{s.d}</p>
                            <div className="mt-auto pt-4">
                                <div className="h-px bg-forest-700/30" />
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

function PlatformSection() {
    const [view, setView] = useState("kurumsal");
    return (
        <section id="platform" className="bg-ink-800 text-ink-100">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-6 items-end">
                    <div className="md:col-span-7">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-400 mb-4">§ 04 — Yönetim Paneli</div>
                        <h2 className="text-[34px] md:text-[44px] leading-[1.08] tracking-tight font-medium">
                            Sadece bir bilgilendirme sitesi değil;<br />
                            <span className="text-deep-300">gerçek bir yönetim platformu.</span>
                        </h2>
                    </div>
                    <p className="md:col-span-5 text-[15px] text-ink-300 leading-relaxed">
                        EcoPilot; kurumsal kullanıcı paneli, admin yönetimi, rol bazlı erişim ve
                        şirket bazlı veri ayrımı ile uçtan uca bir yönetim aracı olarak çalışır.
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-1.5">
                    {[{ id: "kurumsal", l: "Kurumsal kullanıcı" }, { id: "admin", l: "Admin paneli" }].map(t => (
                        <button key={t.id} onClick={() => setView(t.id)}
                            className={`px-3.5 py-2 rounded-sm text-[12.5px] font-mono uppercase tracking-widest transition-colors ${view === t.id ? "bg-ink-50 text-ink-900" : "border border-white/10 text-ink-300 hover:text-ink-100"}`}>
                            {t.l}
                        </button>
                    ))}
                    <span className="ml-2 font-mono text-[11px] text-ink-500">canlı önizleme · static</span>
                </div>

                <div className="mt-8">
                    {view === "kurumsal" ? <DashboardMockup /> : <AdminMockup />}
                </div>

                <div className="mt-12 grid md:grid-cols-4 gap-px bg-white/10 border border-white/10">
                    {[
                        { t: "Rol bazlı erişim", d: "Modül ve ekran düzeyinde yetkilendirme." },
                        { t: "Çok şirketli yapı", d: "Şirket bazlı veri ayrımı ve denetim izi." },
                        { t: "Raporlama", d: "Dönemsel kıyas ve dışa aktarım." },
                        { t: "Modüler yetki", d: "Modül bazlı atama ve onay zinciri." },
                    ].map((f, i) => (
                        <div key={i} className="bg-ink-800 p-5">
                            <div className="text-[15px] text-ink-50 font-medium">{f.t}</div>
                            <p className="mt-2 text-[12.5px] text-ink-400 leading-relaxed">{f.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PlastikSection() {
    return (
        <section id="plastik-sektoru" className="bg-ink-50">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-10">
                    <div className="md:col-span-5">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">§ 05 — Sektörel Yaklaşım</div>
                        <h2 className="text-[34px] md:text-[44px] leading-[1.08] tracking-tight font-medium text-ink-900">
                            Plastik sanayisinin sürdürülebilirlik ihtiyaçlarına göre <span className="text-forest-700">tasarlandı.</span>
                        </h2>
                        <p className="mt-6 text-[15px] leading-relaxed text-ink-600 max-w-[44ch]">
                            EcoPilot; plastik sektöründeki üretim süreçleri, hammadde kullanımı, enerji tüketimi ve çevresel raporlama
                            beklentileri dikkate alınarak tasarlandı. BTSO Plastik Komitesi için geliştirilen bu yapı sektörün dönüşüm
                            hedeflerine dijital altyapı kazandırmayı amaçlar.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="border hairline">
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 hairline">
                                {[
                                    { l: "Enerji tüketimi", v: "Süreç bazlı", Ic: IcBolt },
                                    { l: "Hammadde", v: "Polimer girdi", Ic: IcLayers },
                                    { l: "Su kullanımı", v: "Proses + soğutma", Ic: IcWater },
                                    { l: "Emisyon", v: "Scope 1·2·3", Ic: IcCarbon },
                                ].map((x, i) => (
                                    <div key={i} className="p-5 md:p-6">
                                        <x.Ic size={20} className="text-forest-700" />
                                        <div className="mt-4 font-mono text-[10.5px] uppercase tracking-widest text-ink-500">{x.l}</div>
                                        <div className="mt-1 text-[15px] font-medium text-ink-900">{x.v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t hairline p-5 md:p-6 bg-white">
                                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-3">Kapsam alanları</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {["Enjeksiyon", "Ekstrüzyon", "Termoform", "Blow molding", "Geri dönüşüm", "Kompound", "Ambalaj", "Otomotiv tedarik", "Beyaz eşya tedarik", "İnşaat profilleri"].map((t, i) => (
                                        <span key={i} className="text-[12px] px-2.5 py-1 border hairline rounded-sm text-ink-700 bg-ink-50">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid sm:grid-cols-3 gap-4 items-center bg-ink-900 text-ink-100 p-6">
                            <div className="sm:col-span-2 text-[15px] leading-relaxed">
                                "Plastik sektörünün dönüşümünü ölçülebilir ve yönetilebilir kılmak için kurgulanan ortak bir dijital altyapı."
                            </div>
                            <div className="sm:text-right">
                                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-400">Komite paydaşı</div>
                                <div className="mt-1 text-[14px] text-ink-100">BTSO Plastik Komitesi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MonolithSection() {
    return (
        <section id="monolith" className="bg-ink-900 text-ink-100">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-10 items-start">
                    <div className="md:col-span-7">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-400 mb-4">§ 06 — Teknoloji Geliştirme</div>
                        <h2 className="text-[34px] md:text-[44px] leading-[1.08] tracking-tight font-medium">
                            Teknoloji geliştirme süreci<br />
                            <span className="text-forest-300">Monolith Yazılım tarafından yürütüldü.</span>
                        </h2>
                        <p className="mt-6 text-[15px] leading-relaxed text-ink-300 max-w-[60ch]">
                            Monolith Yazılım; EcoPilot projesinin yazılım mimarisi, kullanıcı arayüzü, yönetim paneli,
                            modül yapısı ve dijital platform altyapısının geliştirilmesini üstlendi.
                        </p>
                        <div className="mt-8 grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
                            {[
                                { t: "Yazılım mimarisi", d: "Modüler servis yapısı, denetim izi ve yetkilendirme." },
                                { t: "Arayüz tasarımı", d: "Kurumsal kullanıcı paneli ve admin görünümleri." },
                                { t: "Modül yapısı", d: "Karbon, su, teşvik, CRM, eğitim — ortak veri modeli." },
                                { t: "Platform altyapısı", d: "Çok şirketli, rol bazlı, raporlamaya hazır." },
                            ].map((x, i) => (
                                <div key={i} className="bg-ink-900 p-5">
                                    <div className="text-[15px] text-ink-50 font-medium">{x.t}</div>
                                    <p className="mt-2 text-[12.5px] text-ink-400 leading-relaxed">{x.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <aside className="md:col-span-5">
                        <div className="border border-white/10 p-6 md:p-7 bg-ink-800">
                            <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-400">Çözüm ortağı</div>
                            <div className="mt-2 text-[24px] font-medium text-ink-50">Monolith Yazılım</div>
                            <p className="mt-3 text-[13.5px] text-ink-300 leading-relaxed">
                                Kurumsal yazılım, dijital dönüşüm ve sürdürülebilirlik odaklı platform geliştirme.
                                EcoPilot&apos;un teknoloji geliştirme ve yazılım altyapısını hayata geçiren çözüm ortağı.
                            </p>
                            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                                {[
                                    { k: "Rol", v: "Teknoloji geliştirici" },
                                    { k: "Domain", v: "monolithyazilim.com" },
                                    { k: "Kapsam", v: "Platform · Modüller · Admin" },
                                    { k: "Yöntem", v: "Modüler · ölçeklenebilir" },
                                ].map((x, i) => (
                                    <div key={i}>
                                        <dt className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500">{x.k}</dt>
                                        <dd className="mt-1 text-[13.5px] text-ink-100">{x.v}</dd>
                                    </div>
                                ))}
                            </dl>
                            <a href="#iletisim" className="mt-7 inline-flex items-center gap-2 text-[13px] text-ink-100 border-b border-ink-100/40 pb-0.5">
                                Monolith Yazılım ile İletişime Geç <IcArrowUR size={14} />
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

function SecuritySection() {
    const items = [
        { Ic: IcKey, t: "Rol bazlı erişim", d: "Yönetici, operatör ve yalnız‑okuma rolleri." },
        { Ic: IcLayers, t: "Şirket bazlı veri ayrımı", d: "Her şirketin verisi izole çalışır." },
        { Ic: IcShield, t: "Admin yönetimi", d: "Komite paydaşları için merkezi panel." },
        { Ic: IcDB, t: "Kurumsal veri yönetimi", d: "Denetim izi ve sürüm geçmişi." },
    ];
    return (
        <section className="bg-ink-50">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-10">
                    <div className="md:col-span-5">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">§ 07 — Güvenlik &amp; Yetkilendirme</div>
                        <h2 className="text-[34px] md:text-[44px] leading-[1.08] tracking-tight font-medium text-ink-900">
                            Kurumsal yapıya<br />uygun erişim modeli.
                        </h2>
                        <p className="mt-6 text-[15px] leading-relaxed text-ink-600 max-w-[44ch]">
                            Platform; komite paydaşları, danışmanlar ve şirket ekipleri için ayrı rollerle çalışır.
                            Veri sahipliği, sorumluluk ve denetim izi açıkça tanımlıdır.
                        </p>
                    </div>
                    <div className="md:col-span-7 grid sm:grid-cols-2 gap-px bg-ink-200 border hairline">
                        {items.map((x, i) => (
                            <div key={i} className="bg-ink-50 p-6">
                                <x.Ic size={20} className="text-forest-700" />
                                <div className="mt-4 text-[16px] font-medium text-ink-900">{x.t}</div>
                                <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">{x.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section id="iletisim" className="bg-forest-900 text-ink-50">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 items-end">
                    <div className="md:col-span-8">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-forest-300 mb-4">§ 08 — İletişim</div>
                        <h2 className="text-[36px] md:text-[56px] leading-[1.03] tracking-tight font-medium">
                            Sürdürülebilirlik süreçlerini<br />
                            <span className="text-forest-300">ölçülebilir hale getirin.</span>
                        </h2>
                        <p className="mt-6 max-w-[60ch] text-[15.5px] text-ink-200 leading-relaxed">
                            EcoPilot; karbon ayak izi, su ayak izi, teşvik takibi, CRM ve eğitim süreçlerini tek platformda
                            bir araya getirerek plastik sektörünün dijital sürdürülebilirlik dönüşümünü destekler.
                        </p>
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
                        <a href="#iletisim" className="inline-flex items-center justify-between gap-3 bg-ink-50 text-ink-900 px-5 py-3.5 rounded-sm text-[14px] font-medium w-full md:w-[280px] hover:bg-white transition-colors">
                            EcoPilot&apos;u İncele <IcArrow size={16} />
                        </a>
                        <a href="mailto:info@monolithyazilim.com" className="inline-flex items-center justify-between gap-3 border border-white/20 text-ink-100 px-5 py-3.5 rounded-sm text-[14px] w-full md:w-[280px] hover:bg-white/5 transition-colors">
                            Monolith Yazılım ile İletişim <IcArrowUR size={16} />
                        </a>
                        <div className="mt-2 text-[11.5px] font-mono text-forest-300 md:text-right">
                            info@monolithyazilim.com
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SiteFooter() {
    return (
        <footer className="bg-ink-900 text-ink-300">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14">
                <div className="grid md:grid-cols-12 gap-y-10 gap-x-10">
                    <div className="md:col-span-5">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[22px] text-ink-50 font-medium tracking-tight">EcoPilot</span>
                            <span className="font-mono text-[11px] text-ink-400">by Monolith Yazılım</span>
                        </div>
                        <p className="mt-4 max-w-[52ch] text-[13.5px] leading-relaxed text-ink-400">
                            EcoPilot, Monolith Yazılım tarafından BTSO Plastik Komitesi için geliştirilen
                            kurumsal sürdürülebilirlik ölçüm ve yönetim platformudur.
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4 max-w-[420px]">
                            <div className="border-t border-white/10 pt-3">
                                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Geliştiren</div>
                                <div className="mt-1 text-[13.5px] text-ink-100">Monolith Yazılım</div>
                            </div>
                            <div className="border-t border-white/10 pt-3">
                                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Geliştirildi</div>
                                <div className="mt-1 text-[13.5px] text-ink-100">BTSO Plastik Komitesi</div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">Modüller</div>
                        <ul className="space-y-2 text-[13.5px] text-ink-200">
                            {MODULES.map(m => (
                                <li key={m.id}><a href="#moduller" className="hover:text-ink-50 transition-colors">{m.short}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">Platform</div>
                        <ul className="space-y-2 text-[13.5px] text-ink-200">
                            <li><a href="#nasil-calisir" className="hover:text-ink-50 transition-colors">Nasıl Çalışır?</a></li>
                            <li><a href="#platform" className="hover:text-ink-50 transition-colors">Yönetim Paneli</a></li>
                            <li><a href="#plastik-sektoru" className="hover:text-ink-50 transition-colors">Plastik Sektörü</a></li>
                            <li><a href="#monolith" className="hover:text-ink-50 transition-colors">Monolith Yazılım</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-3">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500 mb-4">İletişim</div>
                        <ul className="space-y-2 text-[13.5px] text-ink-200">
                            <li>info@monolithyazilim.com</li>
                            <li className="text-ink-400">Bursa, Türkiye</li>
                        </ul>
                        <a href="#iletisim" className="mt-5 inline-flex items-center gap-2 text-[13px] text-ink-100 border-b border-ink-100/40 pb-0.5">
                            Bilgi talebi gönder <IcArrowUR size={14} />
                        </a>
                    </div>
                </div>
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-[11px] text-ink-500">
                    <div>© {new Date().getFullYear()} Monolith Yazılım · EcoPilot · Tüm hakları saklıdır.</div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        <span>BTSO Plastik Komitesi için geliştirildi</span>
                        <span>v2.4 · 2026</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────
export default function HomePage() {
    const containerRef = useRef<HTMLDivElement>(null);

    // useLayoutEffect fires before paint → eliminates the hero "flash" where
    // elements briefly appear at full opacity before GSAP sets the FROM state.
    useLayoutEffect(() => {
        if (!containerRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // The page scrolls inside the LayoutClient overflow-auto div, not window.
        // Tell ScrollTrigger to listen on that element so scroll position is tracked correctly.
        const scrollEl = document.getElementById("main-scroll");
        ScrollTrigger.defaults({ scroller: scrollEl ?? window });

        const ctx = gsap.context(() => {
            // ── Hero intro timeline ──────────────────────────────────────
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.fromTo(".hero-eyebrow", { y: 8,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 },  0.05)
              .fromTo(".hero-title",   { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 },  0.10)
              .fromTo(".hero-body",    { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 },  0.25)
              .fromTo(".hero-ctas > *",  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.40)
              .fromTo(".hero-stats > *", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.55)
              .fromTo(".hero-dash",    { y: 28, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 1.05 }, 0.20);

            // ── Section h2 scroll reveals ────────────────────────────────
            gsap.utils.toArray<HTMLElement>("section h2").forEach(el => {
                gsap.from(el, {
                    y: 24, opacity: 0, duration: 0.85, ease: "power3.out",
                    immediateRender: false,
                    scrollTrigger: { trigger: el, start: "top 82%", once: true },
                });
            });

            // Bar chart bars are animated by BarChart's own IntersectionObserver.
        }, containerRef.current);

        return () => {
            ctx.revert();
            ScrollTrigger.defaults({ scroller: window });
        };
    }, []);


    return (
        <div ref={containerRef} className="home-page min-h-screen bg-ink-900 text-ink-50" style={{ scrollBehavior: "smooth" }}>
            <SiteHeader />
            <HeroSection />
            <AttributionSection />
            <ProblemSection />
            <ModulesSection />
            <ProcessSection />
            <PlatformSection />
            <PlastikSection />
            <MonolithSection />
            <SecuritySection />
            <CTASection />
            <SiteFooter />
        </div>
    );
}
