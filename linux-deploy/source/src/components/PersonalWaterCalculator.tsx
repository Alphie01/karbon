"use client";

import { useState } from "react";
import { MoveRight, RefreshCcw, Droplets } from "lucide-react";

export default function PersonalWaterCalculator() {
    const [step, setStep] = useState(1);
    const [score, setScore] = useState(0);

    const questions = [
        {
            id: 1,
            text: "Duş alma süreniz ortalama ne kadar?",
            options: [
                { label: "5 dakikadan az", value: 40 },
                { label: "5-10 dakika", value: 80 },
                { label: "10-15 dakika", value: 150 },
                { label: "15 dakikadan fazla", value: 250 },
            ],
        },
        {
            id: 2,
            text: "Bulaşıkları nasıl yıkarsınız?",
            options: [
                { label: "Makinede (Tam Dolu)", value: 15 },
                { label: "Makinede (Yarı Dolu)", value: 30 },
                { label: "Elde (Akan Suda)", value: 100 },
                { label: "Elde (Durgun Suda)", value: 50 },
            ],
        },
        {
            id: 3,
            text: "Haftada kaç kez çamaşır yıkarsınız?",
            options: [
                { label: "1-2 kez", value: 100 },
                { label: "3-4 kez", value: 200 },
                { label: "5+ kez", value: 400 },
            ],
        },
        {
            id: 4,
            text: "Et tüketim sıklığınız?",
            options: [
                { label: "Hiç (Vegan)", value: 500 },
                { label: "Az (Haftada 1-2)", value: 1500 },
                { label: "Orta (Haftada 3-4)", value: 2500 },
                { label: "Çok (Her gün)", value: 4000 },
            ],
            note: "Gıda üretimi için harcanan sanal su (Litre/Hafta)"
        }
    ];

    const handleAnswer = (value: number) => {
        setScore(score + value);
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            setStep(5); // Result step
        }
    };

    const reset = () => {
        setScore(0);
        setStep(1);
    };

    if (step === 5) {
        return (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-auto border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Droplets className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-2">Haftalık Su Ayak İziniz</h3>
                <div className="text-5xl font-bold text-blue-500 mb-2">{score} <span className="text-lg text-slate-400 font-normal">Litre</span></div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 mt-4">
                    {score < 1500 ? "Tebrikler! Su tasarrufu konusunda bilinçlisiniz." :
                        score < 3000 ? "Ortalama bir tüketiminiz var. Gıda tercihlerinizi gözden geçirebilirsiniz." :
                            "Dikkat! Su ayak iziniz oldukça yüksek. Önlem almalısınız."}
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
                <span className="text-xs font-bold text-blue-500">Bireysel Su Analizi</span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 text-center">{currentQuestion.text}</h3>
            {currentQuestion.note && <p className="text-xs text-slate-400 text-center mb-6">{currentQuestion.note}</p>}
            {!currentQuestion.note && <div className="mb-8"></div>}

            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group flex justify-between items-center"
                    >
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">{option.label}</span>
                        <MoveRight size={16} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
}
