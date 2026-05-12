"use client";

import React, { useState } from 'react';
import { Factory, Droplet, TreePine, ArrowRight, Zap, Target } from 'lucide-react';

interface SimulationClientProps {
    baseCarbon: number;
    baseWater: number;
    year: number;
}

export default function SimulationClient({ baseCarbon, baseWater, year }: SimulationClientProps) {
    // Investment sliders (0 to 100 percentages)
    const [solarRoof, setSolarRoof] = useState<number>(0);
    const [solarFarm, setSolarFarm] = useState<number>(0);
    const [windEnergy, setWindEnergy] = useState<number>(0);
    const [evFleet, setEvFleet] = useState<number>(0);
    const [waterRecycling, setWaterRecycling] = useState<number>(0);

    // Renewable energy cap at 100% of consumption
    const totalRenewablePct = Math.min(100, solarRoof + solarFarm + windEnergy);

    // Hypothetical max impacts
    // Assume up to 60% of total emissions come from electricity
    // 60% max carbon reduction from renewables
    // 20% max carbon reduction if 100% EV fleet
    const projectedCarbon = Math.max(0, baseCarbon -
        (baseCarbon * 0.6 * (totalRenewablePct / 100)) -
        (baseCarbon * 0.2 * (evFleet / 100))
    );

    const projectedWater = Math.max(0, baseWater -
        (baseWater * 0.4 * (waterRecycling / 100))
    );

    const carbonReductionPct = baseCarbon > 0 ? ((baseCarbon - projectedCarbon) / baseCarbon) * 100 : 0;
    const waterReductionPct = baseWater > 0 ? ((baseWater - projectedWater) / baseWater) * 100 : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Sliders */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
                        <Zap className="text-amber-500" size={24} />
                        Yatırım Parametreleri
                    </h2>

                    <div className="space-y-8">
                        {/* Option 1: Solar Roof */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Çatı Tipi GES</label>
                                <span className="text-xs font-black text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">%{solarRoof}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" step="5"
                                value={solarRoof}
                                onChange={(e) => setSolarRoof(parseInt(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-slate-500">Çatıya kurulan panellerin enerji ihtiyacını karşılama oranı.</p>
                        </div>

                        {/* Option 1b: Solar Farm */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Arazi Tipi GES</label>
                                <span className="text-xs font-black text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">%{solarFarm}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" step="5"
                                value={solarFarm}
                                onChange={(e) => setSolarFarm(parseInt(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-slate-500">Güneş enerjisi tarlası (Arazi GES) yatırımı.</p>
                        </div>

                        {/* Option 1c: Wind */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Rüzgar Enerji Santrali (RES)</label>
                                <span className="text-xs font-black text-sky-600 bg-sky-100 dark:bg-sky-900/30 px-2 py-1 rounded">%{windEnergy}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" step="5"
                                value={windEnergy}
                                onChange={(e) => setWindEnergy(parseInt(e.target.value))}
                                className="w-full accent-sky-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-slate-500">Rüzgar enerjisi ile dışa bağımlılığın azaltılması.</p>
                        </div>

                        {/* Option 2: EV Fleet */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Filo Elektrifikasyonu</label>
                                <span className="text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">%{evFleet}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" step="5"
                                value={evFleet}
                                onChange={(e) => setEvFleet(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-slate-500">İçten yanmalı araçların elektrikli araçlarla değişimi.</p>
                        </div>

                        {/* Option 3: Water Recycling */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Gri Su Geri Kazanımı</label>
                                <span className="text-xs font-black text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">%{waterRecycling}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" step="5"
                                value={waterRecycling}
                                onChange={(e) => setWaterRecycling(parseInt(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-slate-500">Atık suların arıtılarak tesiste yeniden kullanımı.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setSolarRoof(0); setSolarFarm(0); setWindEnergy(0); setEvFleet(0); setWaterRecycling(0); }}
                        className="mt-8 w-full py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors"
                    >
                        Senaryoyu Sıfırla
                    </button>
                </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-2 space-y-6">

                {/* Carbon Projection */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                <TreePine className="text-emerald-600 dark:text-emerald-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Karbon Ayak İzi Projeksiyonu</h2>
                                <p className="text-xs text-slate-500">Mevcut yıl ({year}) verilerine göre tahmini etki</p>
                            </div>
                        </div>
                        {carbonReductionPct > 0 && (
                            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-black animate-pulse">
                                -%{carbonReductionPct.toFixed(1)}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mevcut Durum</div>
                            <div className="text-2xl font-bold text-slate-400">
                                {baseCarbon.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-sm font-normal">kgCO₂e</span>
                            </div>
                        </div>

                        <div className="hidden md:flex justify-center text-slate-300 dark:text-slate-700 pb-2">
                            <ArrowRight size={32} />
                        </div>

                        <div>
                            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Target size={12} /> Hedef Durum</div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">
                                {projectedCarbon.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-slate-500">kgCO₂e</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Water Projection */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <Droplet className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Su Ayak İzi Projeksiyonu</h2>
                                <p className="text-xs text-slate-500">Mevcut yıl ({year}) verilerine göre tahmini etki</p>
                            </div>
                        </div>
                        {waterReductionPct > 0 && (
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-black animate-pulse">
                                -%{waterReductionPct.toFixed(1)}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mevcut Durum</div>
                            <div className="text-2xl font-bold text-slate-400">
                                {baseWater.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-sm font-normal">m³</span>
                            </div>
                        </div>

                        <div className="hidden md:flex justify-center text-slate-300 dark:text-slate-700 pb-2">
                            <ArrowRight size={32} />
                        </div>

                        <div>
                            <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Target size={12} /> Hedef Durum</div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">
                                {projectedWater.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-slate-500">m³</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex gap-4 items-start">
                        <div className="text-indigo-500 mt-1"><Factory size={24} /></div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white mb-1">Simülasyon Hakkında</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Bu sayfada sunulan sonuçlar tahmini proje modellemelerine dayanmaktadır. Kesin yatırım analizi ve geri dönüşüm ROI oranları için lütfen <strong>Fizibilite ve Analiz</strong> bölümümüzden detaylı rapor talep ediniz.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
