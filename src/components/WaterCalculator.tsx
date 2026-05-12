"use client";

import { useState } from "react";
import { Droplets, Bath, Utensils, ArrowRight, ArrowLeft } from "lucide-react";
import clsx from "clsx";

type WaterData = {
    showerDuration: number;
    showerFrequency: number;
    laundryFrequency: number;
    dishwasherFrequency: number;
    gardenWatering: number;
};

const initialData: WaterData = {
    showerDuration: 10,
    showerFrequency: 7,
    laundryFrequency: 3,
    dishwasherFrequency: 4,
    gardenWatering: 0,
};

export default function WaterCalculator() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WaterData>(initialData);
    const [result, setResult] = useState<number | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const calculateFootprint = () => {
        // Simplified Water Calculation (Liters per week)
        // Shower: ~12 liters/minute
        // Laundry: ~50 liters/load
        // Dishwasher: ~15 liters/load
        // Garden: ~20 liters/minute (rough estimate)

        let weeklyTotal = 0;

        // Hygiene
        weeklyTotal += data.showerDuration * 12 * data.showerFrequency;

        // Household
        weeklyTotal += data.laundryFrequency * 50;
        weeklyTotal += data.dishwasherFrequency * 15;

        // Outdoor
        weeklyTotal += data.gardenWatering * 20;

        // Convert to Cubic McKinney Meters per Year (m3/year) just for fun? No, liters/day is better.
        const dailyTotal = weeklyTotal / 7;

        setResult(dailyTotal);
        setStep(3);
    };

    const nextStep = () => setStep((p) => p + 1);
    const prevStep = () => setStep((p) => p - 1);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                    <span className={clsx(step >= 1 && "text-blue-600")}>1. Kişisel Hijyen</span>
                    <span className={clsx(step >= 2 && "text-blue-600")}>2. Ev Alışkanlıkları</span>
                    <span className={clsx(step >= 3 && "text-blue-600")}>3. Sonuç</span>
                </div>
                <div className="mt-2 h-2 w-full bg-slate-200 rounded-full">
                    <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${step * 33.3}%` }}
                    />
                </div>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Bath size={24} /></div>
                            <h3 className="text-xl font-semibold text-slate-900">Kişisel Hijyen</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Ortalama Duş Süreniz (Dakika)</label>
                            <input
                                type="number"
                                name="showerDuration"
                                value={data.showerDuration}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Haftalık Duş Sayısı</label>
                            <input
                                type="number"
                                name="showerFrequency"
                                value={data.showerFrequency}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-cyan-100 rounded-full text-cyan-600"><Utensils size={24} /></div>
                            <h3 className="text-xl font-semibold text-slate-900">Ev Alışkanlıkları ve Bahçe</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Haftalık Çamaşır Makinesi Çalıştırma Sayısı</label>
                            <input
                                type="number"
                                name="laundryFrequency"
                                value={data.laundryFrequency}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Haftalık Bulaşık Makinesi Çalıştırma Sayısı</label>
                            <input
                                type="number"
                                name="dishwasherFrequency"
                                value={data.dishwasherFrequency}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Haftalık Bahçe Sulama Süresi (Dakika)</label>
                            <input
                                type="number"
                                name="gardenWatering"
                                value={data.gardenWatering}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && result !== null && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center p-6 bg-blue-100 rounded-full mb-6">
                            <span className="text-4xl">💧</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Günlük Su Ayak İziniz</h3>
                        <div className="text-5xl font-extrabold text-blue-600 mb-4">
                            {Math.round(result)} <span className="text-2xl text-slate-500 font-medium">Litre</span>
                        </div>
                        <p className="text-slate-600 max-w-md mx-auto mb-8">
                            {result < 100 ? "Harika! Suyu çok tasarruflu kullanıyorsunuz." :
                                result < 200 ? "Ortalama bir tüketiminiz var. Basit önlemlerle azaltabilirsiniz." :
                                    "Dikkat! Su tüketiminiz oldukça yüksek."}
                        </p>
                        <button
                            onClick={() => { setStep(1); setResult(null); }}
                            className="text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                            Tekrar Hesapla
                        </button>
                    </div>
                )}

                {/* Navigation Buttons */}
                {step < 3 && (
                    <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Geri
                        </button>

                        {step === 2 ? (
                            <button
                                onClick={calculateFootprint}
                                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Hesapla <Droplets className="w-4 h-4 ml-2" />
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
