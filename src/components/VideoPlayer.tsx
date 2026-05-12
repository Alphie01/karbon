"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, XCircle } from "lucide-react";
import clsx from "clsx";

interface Quiz {
    id: string;
    timestamp: number;
    questionText: string;
    options: string | string[]; // Can be string or already parsed array
    correctOptionIdx: number;
}

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    quizzes?: Quiz[];
    onEnded?: () => void;
}

export default function VideoPlayer({ src, poster, title, quizzes = [], onEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [duration, setDuration] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure client-side only rendering for parts that might cause hydration mismatch
    useEffect(() => {
        // eslint-disable-next-line
        setIsMounted(true);
    }, []);

    // Quiz State
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
    const [quizError, setQuizError] = useState(false);

    const togglePlay = () => {
        if (activeQuiz) return; // Prevent playing while quiz is active

        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        setShowControls(true); // Show controls immediately when resuming
                    })
                    .catch((e: any) => {
                        console.error("Video play error:", e);
                        alert("Video oynatılamadı. Format desteklenmiyor veya tarayıcı engelledi: " + e.message);
                        setIsPlaying(false);
                    });
            }
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const current = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        if (dur > 0) {
            setProgress((current / dur) * 100);
            if (duration !== dur) setDuration(dur);
        }

        // Check for quizzes
        if (!activeQuiz && isPlaying && quizzes?.length > 0) {
            const pendingQuiz = quizzes.find(q =>
                q && !completedQuizzes.has(q?.id) &&
                current >= q?.timestamp &&
                current <= q?.timestamp + 1
            );

            if (pendingQuiz) {
                videoRef.current.pause();
                setIsPlaying(false);
                setActiveQuiz(pendingQuiz);
                setQuizError(false);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeQuiz) return; // Disable seek during quiz

        const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setProgress(parseFloat(e.target.value));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Auto-hide controls
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isPlaying && !activeQuiz) {
            timeout = setTimeout(() => setShowControls(false), 3000);
        }
        // Sync setState removed from here to satisfy "cascading render" lint.
        // Controls are reset to true in event handlers (togglePlay, handleQuizAnswer).
        return () => clearTimeout(timeout);
    }, [isPlaying, activeQuiz]);

    const handleQuizAnswer = (selectedIndex: number) => {
        if (!activeQuiz) return;

        if (selectedIndex === activeQuiz.correctOptionIdx) {
            // Correct Answer
            setCompletedQuizzes(prev => new Set(prev).add(activeQuiz.id));
            setActiveQuiz(null);
            setQuizError(false);

            // Resume video
            if (videoRef.current) {
                videoRef.current.play();
                setIsPlaying(true);
                setShowControls(true); // Reset controls timer
            }
        } else {
            // Wrong Answer
            setQuizError(true);
        }
    };

    const parseOptions = (options: string | string[]) => {
        if (Array.isArray(options)) return options;
        try {
            return JSON.parse(options || "[]");
        } catch (e) {
            console.error("Quiz options parse error:", e);
            return [];
        }
    };

    if (!isMounted) {
        return <div className="aspect-video bg-black rounded-2xl animate-pulse flex items-center justify-center text-slate-500 font-medium">Yükleniyor...</div>;
    }

    return (
        <div
            className="relative group rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl"
            onMouseEnter={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && !activeQuiz && setShowControls(false)}
        >
            <video
                ref={videoRef}
                key={src}
                src={src}
                poster={poster}
                playsInline
                preload="metadata"
                className={clsx("w-full h-full object-cover transition-all", activeQuiz && "blur-md brightness-50")}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onClick={togglePlay}
                onError={(e) => {
                    console.error("Video load error:", e.currentTarget.error);
                    alert("Video yüklenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin. (Hata Kodu: " + (e.currentTarget.error?.code || 'Bilinmiyor') + ")");
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    if (onEnded) onEnded();
                }}
            />

            {/* Quiz Overlay */}
            {activeQuiz && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-green"></div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                            Bilgi Kontrolü
                        </h3>
                        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 font-medium">
                            {activeQuiz.questionText}
                        </p>

                        <div className="space-y-3">
                            {parseOptions(activeQuiz.options).map((opt: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuizAnswer(idx)}
                                    className="w-full text-left p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand-green dark:hover:border-brand-green hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all font-medium text-slate-800 dark:text-slate-200"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {quizError && (
                            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 animate-in shake">
                                <XCircle size={20} />
                                <span className="font-semibold text-sm">Yanlış cevap. Lütfen doğru seçeneği bulana kadar tekrar deneyin.</span>
                            </div>
                        )}

                        {!quizError && (
                            <p className="mt-6 text-center text-sm text-slate-500 flex items-center justify-center gap-1">
                                Videoya devam etmek için doğru cevabı seçin.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Overlay Play Button (Big) */}
            {!isPlaying && !activeQuiz && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                    <div className="w-20 h-20 bg-brand-green/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform backdrop-blur-sm shadow-xl">
                        <Play className="text-white fill-white ml-2 h-8 w-8" />
                    </div>
                </div>
            )}

            {/* Custom Controls Bar */}
            <div className={clsx(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 z-10",
                (showControls || !isPlaying) && !activeQuiz ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                {/* Title */}
                {title && <h3 className="text-white font-medium text-sm mb-3 drop-shadow-md">{title}</h3>}

                {/* Progress Bar with Quiz Markers */}
                <div className="relative w-full h-2 mb-4 group/progress cursor-pointer">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-white/30 rounded-lg overflow-hidden transition-all group-hover/progress:h-2">
                        <div className="h-full bg-brand-green" style={{ width: `${progress}%` }} />
                    </div>

                    {/* Quiz Markers */}
                    {duration > 0 && quizzes?.map(quiz => (
                        <div
                            key={`marker-${quiz.id}`}
                            className={clsx(
                                "absolute w-2 h-3 rounded-sm top-1/2 -translate-y-1/2 -translate-x-1/2 z-0",
                                completedQuizzes.has(quiz.id) ? "bg-emerald-400" : "bg-amber-400"
                            )}
                            style={{ left: `${(quiz.timestamp / duration) * 100}%` }}
                        />
                    ))}

                    {/* Thumb visual */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-green rounded-full shadow z-0 scale-0 group-hover/progress:scale-125 transition-transform"
                        style={{ left: `calc(${progress}% - 6px)` }}
                    />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="hover:text-brand-green transition-colors">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={toggleMute} className="hover:text-brand-green transition-colors">
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    const vol = parseFloat(e.target.value);
                                    setVolume(vol);
                                    if (videoRef.current) videoRef.current.volume = vol;
                                    setIsMuted(vol === 0);
                                }}
                                className="w-0 overflow-hidden group-hover/vol:w-20 transition-all h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
