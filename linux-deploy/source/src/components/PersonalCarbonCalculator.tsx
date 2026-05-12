"use client";

import { useState } from "react";
import { MoveRight, RefreshCcw } from "lucide-react";

export default function PersonalCarbonCalculator() {
    const [step, setStep] = useState(1);
    const [score, setScore] = useState(0);

    const questions = [
        {
            id: 1,
            text: "Haftada kaç gün özel araç kullanıyorsunuz?",
            options: [
                { label: "Hiç (Toplu Taşıma/Yürüyerek)", value: 0 },
                { label: "1-2 Gün", value: 10 },
                { label: "3-5 Gün", value: 30 },
                { label: "Her Gün", value: 50 },
            ],
        },
        {
            id: 2,
            text: "Isınma türünüz nedir?",
            options: [
                { label: "Doğalgaz", value: 30 },
                { label: "Elektrik (Klima)", value: 20 },
                { label: "Kömür/Odun", value: 60 },
                { label: "Merkezi Sistem", value: 25 },
            ],
        },
        {
            id: 3,
            text: "Beslenme alışkanlığınız?",
            options: [
                { label: "Vegan", value: 10 },
                { label: "Vejetaryen", value: 20 },
                { label: "Karışık (Az Et)", value: 40 },
                { label: "Et Ağırlıklı", value: 70 },
            ],
        },
    ];

    const handleAnswer = (value: number) => {
        setScore(score + value);
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            setStep(4); // Result step
        }
    };

    const reset = () => {
        setScore(0);
        setStep(1);
    };

    if (step === 4) {
        return (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-auto border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-4">Sonucunuz</h3>
                <div className="text-6xl font-bold text-brand-green mb-2">{score}</div>
                <p className="text-slate-500 mb-6">Tahmini Yıllık CO2 Eşdeğeri (Puan)</p>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-8">
                    {score < 50 ? "Harika! Çok düşük bir karbon ayak iziniz var." :
                        score < 100 ? "Ortalama seviyedesiniz. Biraz daha dikkatle azaltabilirsiniz." :
                            "Yüksek seviye. Acilen önlem almalısınız!"}
                </p>

                <button onClick={reset} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 transition-colors">
                    <RefreshCcw size={18} /> Tekrar Hesapla
                </button>
            </div>
        );
    }

    const currentQuestion = questions[step - 1];

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto border border-slate-200 dark:border-slate-700 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Soru {step}/{questions.length}</span>
                <span className="text-xs font-bold text-brand-green">Bireysel Analiz</span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-8 text-center">{currentQuestion.text}</h3>

            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-green hover:bg-brand-green/5 transition-all group flex justify-between items-center"
                    >
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-brand-green">{option.label}</span>
                        <MoveRight size={16} className="opacity-0 group-hover:opacity-100 text-brand-green transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
}
