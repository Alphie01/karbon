"use client";

import { useState } from "react";
import { Car, Zap, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import clsx from "clsx";

type CarbonData = {
    transportKM: number;
    flightsShortHaul: number;
    flightsLongHaul: number;
    electricityBill: number;
    gasBill: number;
    meatConsumption: "high" | "average" | "low" | "vegetarian" | "vegan";
};

const initialData: CarbonData = {
    transportKM: 0,
    flightsShortHaul: 0,
    flightsLongHaul: 0,
    electricityBill: 0,
    gasBill: 0,
    meatConsumption: "average",
};

export default function CarbonCalculator() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<CarbonData>(initialData);
    const [result, setResult] = useState<number | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: name === "meatConsumption" ? value : Number(value),
        }));
    };

    const calculateFootprint = () => {
        // Simplified Calculation Logic (Co2e in kg)
        // 1. Transport: ~0.12 kg/km for average car
        // 2. Flights: ~150kg for short, ~600kg for long
        // 3. Energy: ~0.5kg per currency unit (rough estimate based on bill)
        // 4. Food: High meat ~2.5 ton/year, Vegan ~1.0 ton/year

        let total = 0;

        // Transport
        total += data.transportKM * 0.12;
        total += data.flightsShortHaul * 150;
        total += data.flightsLongHaul * 600;

        // Energy (Monthly bill * 12 * factor)
        total += data.electricityBill * 12 * 0.4;
        total += data.gasBill * 12 * 0.2;

        // Food (Base annual values in kg)
        const foodImpact = {
            high: 2500,
            average: 1700,
            low: 1200,
            vegetarian: 900,
            vegan: 700,
        };
        total += foodImpact[data.meatConsumption];

        // Convert to Tonnes
        setResult(total / 1000);
        setStep(4);
    };

    const nextStep = () => setStep((p) => p + 1);
    const prevStep = () => setStep((p) => p - 1);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                    <span className={clsx(step >= 1 && "text-emerald-600")}>1. Ulaşım</span>
                    <span className={clsx(step >= 2 && "text-emerald-600")}>2. Enerji</span>
                    <span className={clsx(step >= 3 && "text-emerald-600")}>3. Yaşam</span>
                    <span className={clsx(step >= 4 && "text-emerald-600")}>4. Sonuç</span>
                </div>
                <div className="mt-2 h-2 w-full bg-slate-200 rounded-full">
                    <div
                        className="h-2 bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${step * 25}%` }}
                    />
                </div>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Car size={24} /></div>
                            <h3 className="text-xl font-semibold text-slate-900">Ulaşım Alışkanlıkları</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Haftalık araç kullanımınız (km)</label>
                            <input
                                type="number"
                                name="transportKM"
                                value={data.transportKM}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Yıllık Kısa Uçuş Sayısı (Internal)</label>
                                <input
                                    type="number"
                                    name="flightsShortHaul"
                                    value={data.flightsShortHaul}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Yıllık Uzun Uçuş Sayısı (External)</label>
                                <input
                                    type="number"
                                    name="flightsLongHaul"
                                    value={data.flightsLongHaul}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600"><Zap size={24} /></div>
                            <h3 className="text-xl font-semibold text-slate-900">Ev Enerji Tüketimi</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Aylık Ortalama Elektrik Faturası (TL)</label>
                            <input
                                type="number"
                                name="electricityBill"
                                value={data.electricityBill}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Aylık Ortalama Doğalgaz Faturası (TL)</label>
                            <input
                                type="number"
                                name="gasBill"
                                value={data.gasBill}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-100 rounded-full text-green-600"><ShoppingBag size={24} /></div>
                            <h3 className="text-xl font-semibold text-slate-900">Yaşam Tarzı ve Beslenme</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Beslenme Türünüz</label>
                            <select
                                name="meatConsumption"
                                // @ts-ignore
                                value={data.meatConsumption}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                            >
                                <option value="high">Yoğun Et Tüketimi (Her gün)</option>
                                <option value="average">Ortalama (Haftada 3-4 gün)</option>
                                <option value="low">Düşük (Haftada 1-2 gün)</option>
                                <option value="vegetarian">Vejetaryen</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 4 && result !== null && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center p-6 bg-emerald-100 rounded-full mb-6">
                            <span className="text-4xl">🌍</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Yıllık Karbon Ayak İziniz</h3>
                        <div className="text-5xl font-extrabold text-emerald-600 mb-4">
                            {result.toFixed(2)} <span className="text-2xl text-slate-500 font-medium">Ton CO2e</span>
                        </div>
                        <p className="text-slate-600 max-w-md mx-auto mb-8">
                            {result < 4 ? "Harika! Dünya ortalamasının altındasınız." :
                                result < 10 ? "Ortalama bir seviyedesiniz. İyileştirmeler yapabilirsiniz." :
                                    "Ortalamanın üzerindesiniz. Acil önlemler almalısınız!"}
                        </p>
                        <button
                            onClick={() => { setStep(1); setResult(null); }}
                            className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                        >
                            Tekrar Hesapla
                        </button>
                    </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                    <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Geri
                        </button>

                        {step === 3 ? (
                            <button
                                onClick={calculateFootprint}
                                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                            >
                                Hesapla <Zap className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition"
                            >
                                İleri <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
