"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Droplets, Info, Sparkles } from "lucide-react";

interface InfoWidgetProps {
    type: "carbon" | "water";
}

const CARBON_FACTS = [
    "Bir yetişkin ağaç, yılda ortalama 22 kg karbondioksit emer.",
    "Ortalama bir benzinli araç, yılda yaklaşık 4.6 metrik ton karbon emisyonu üretir.",
    "Kısa mesafeli uçuşlar, yolcu başına en yüksek karbon salınımına sahip ulaşım türlerinden biridir.",
    "Binalar, küresel sera gazı emisyonlarının yaklaşık %40'ından sorumludur.",
    "E-postalarınızı silmek küçük çapta da olsa enerji tasarrufu sağlar ve karbon ayak izinizi düşürür.",
    "LED ampuller, geleneksel akkor ampullere göre %80 daha az enerji tüketerek karbon salınımını azaltır.",
    "Sığır eti üretimi, tavuk veya sebze üretimine kıyasla ciddi oranda daha fazla karbon ve metan gazı üretir."
];

const WATER_FACTS = [
    "1 parça pamuklu tişört üretmek için yaklaşık 2.700 litre su harcanır.",
    "Dünyadaki suyun sadece %1'inden azı insanların kullanımına uygundur.",
    "Bir fincan kahve üretmek için toplamda yaklaşık 130 litre su gereklidir.",
    "Damlayan bir musluk, ayda yaklaşık 300 litre suyun boşa gitmesine neden olabilir.",
    "Bulaşık makinesi kullanmak, bulaşıkları elde yıkamaya kıyasla %50'den fazla su tasarrufu sağlayabilir.",
    "Sığır eti üretiminde, kilogram başına ortalama 15.000 litre su ayak izi oluşmaktadır.",
    "Evinizdeki su tüketiminin yaklaşık %30'u tuvalet rezervuarlarından kaynaklanır."
];

export default function InfoWidget({ type }: InfoWidgetProps) {
    const [factIndex, setFactIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const facts = type === "carbon" ? CARBON_FACTS : WATER_FACTS;

    // Pick random initial fact
    useEffect(() => {
        setFactIndex(Math.floor(Math.random() * facts.length));
    }, [facts.length]);

    // Rotate facts every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setFactIndex((prev) => (prev + 1) % facts.length);
                setIsAnimating(false);
            }, 300); // Wait for fade out
        }, 8000);

        return () => clearInterval(interval);
    }, [facts.length]);

    const Icon = type === "carbon" ? Lightbulb : Droplets;
    const accentColor = type === "carbon" ? "text-brand-green" : "text-blue-500";
    const bgColor = type === "carbon" ? "bg-brand-green/10" : "bg-blue-500/10";
    const borderColor = type === "carbon" ? "border-brand-green/20" : "border-blue-500/20";
    const title = type === "carbon" ? "Karbon Bilgisi" : "Su Bilgisi";

    return (
        <div className={`rounded-2xl border ${borderColor} bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl`}>
            <div className={`p-4 border-b ${borderColor} ${bgColor} flex items-center gap-3`}>
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0`}>
                    <Icon className={accentColor} size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Bunları Biliyor muydunuz?
                        <Sparkles size={14} className="text-amber-500" />
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center relative min-h-[200px]">
                <div className="absolute top-4 left-4 text-slate-200 dark:text-slate-800">
                    <Info size={40} className="opacity-50" />
                </div>

                <p className={`text-slate-700 dark:text-slate-200 text-lg leading-relaxed relative z-10 transition-opacity duration-300 font-medium ${isAnimating ? "opacity-0" : "opacity-100"}`}>
                    "{facts[factIndex]}"
                </p>

                <div className="mt-6 flex justify-between items-center relative z-10">
                    <div className="flex gap-1">
                        {facts.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === factIndex
                                        ? `w-4 ${type === 'carbon' ? 'bg-brand-green' : 'bg-blue-500'}`
                                        : "w-1.5 bg-slate-200 dark:bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
