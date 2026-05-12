"use client";

import { useState } from "react";
import VideoUploader from "./VideoUploader";
import { addVideo, deleteVideo, updateVideo, addQuizQuestion, deleteQuizQuestion } from "@/app/manage/video-actions";
import { Film, Trash2, PlusCircle, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function CourseVideoManager({ courseId, initialVideos }: { courseId: string; initialVideos: any[] }) {
    const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);

    const handleUploadSuccess = async (url: string, title: string, attentionLevel: string) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("url", url);
        formData.append("courseId", courseId);
        formData.append("attentionLevel", attentionLevel);

        await addVideo(formData);
    };

    const handleAddQuiz = async (e: React.FormEvent, videoId: string) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        formData.append("videoId", videoId);

        // Options are taken as comma separated string for simple UI, convert to JSON array
        const optionsStr = formData.get("rawOptions") as string;
        const optionsList = optionsStr.split(",").map(s => s.trim()).filter(s => s.length > 0);
        formData.append("options", JSON.stringify(optionsList));

        await addQuizQuestion(formData);
        form.reset();
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Film className="text-brand-green" /> Yeni Video Ekle
                </h2>
                <VideoUploader courseId={courseId} onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Video List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Film className="text-brand-green" /> Kurstaki Videolar ({initialVideos.length})
                </h2>
                <div className="space-y-4">
                    {initialVideos.map((video) => (
                        <div key={video.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                            {/* Video Header (Clickable to expand quizzes) */}
                            <div
                                className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setExpandedVideoId(expandedVideoId === video.id ? null : video.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-16 bg-black rounded overflow-hidden relative">
                                        <video src={video.url} className="w-full h-full object-cover opacity-50" />
                                        <PlayCircleIcon className="absolute inset-0 m-auto text-white opacity-80" size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{video.title}</h3>
                                            {video.attentionLevel && video.attentionLevel !== "GENEL" && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${video.attentionLevel === 'HIGH' ? 'bg-purple-100 text-purple-700' :
                                                    video.attentionLevel === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {video.attentionLevel} ODAK
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">{video.quizzes?.length || 0} Anket/Soru Ekli</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <form action={deleteVideo.bind(null, video.id) as any} onClick={(e) => e.stopPropagation()}>
                                        <button className="text-slate-400 hover:text-red-500 transition-colors" title="Videoyu Sil">
                                            <Trash2 size={20} />
                                        </button>
                                    </form>
                                    {expandedVideoId === video.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {/* Quizzes Expansion */}
                            {expandedVideoId === video.id && (
                                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-8">
                                    {/* Edit Video Form */}
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Film size={16} className="text-emerald-500" /> Video Detaylarını Güncelle
                                        </h4>
                                        <form action={updateVideo as any} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <input type="hidden" name="id" value={video.id} />
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Video Başlığı</label>
                                                <input name="title" defaultValue={video.title} required className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Algı Odak Seviyesi</label>
                                                <select name="attentionLevel" defaultValue={video.attentionLevel || "GENEL"} className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                                                    <option value="GENEL">Genel / Yok</option>
                                                    <option value="LOW">Düşük (Low)</option>
                                                    <option value="MEDIUM">Orta (Medium)</option>
                                                    <option value="HIGH">Yüksek (High)</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-3 text-right">
                                                <button type="submit" className="bg-brand-navy hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block">
                                                    Değişiklikleri Kaydet
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Existing Quizzes */}
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-500" /> Videoya Ekli Anketi/Soruları Yönet
                                        </h4>
                                        <div className="space-y-2 mb-6">
                                            {video.quizzes?.map((quiz: any) => (
                                                <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded mb-1">
                                                            <Clock size={12} /> {Math.floor(quiz.timestamp / 60)}:{(quiz.timestamp % 60).toString().padStart(2, '0')}
                                                        </span>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{quiz.questionText}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Seçenekler: {JSON.parse(quiz.options).join(" | ")} (Doğru: {quiz.correctOptionIdx + 1}. seçenek)</p>
                                                    </div>
                                                    <form action={deleteQuizQuestion.bind(null, quiz.id) as any}>
                                                        <button className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                                    </form>
                                                </div>
                                            ))}
                                            {video.quizzes?.length === 0 && <p className="text-sm text-slate-500 italic">Bu videoda henüz soru yok.</p>}
                                        </div>

                                        {/* Add Quiz Form */}
                                        <form onSubmit={(e) => handleAddQuiz(e, video.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Soru Metni</label>
                                                <input name="questionText" required className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Örn: Karbon ayak izi hesaplamasında Kapsam 2 neleri içerir?" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Görünme Zamanı (Saniye)</label>
                                                <input type="number" name="timestamp" required min="0" className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Örn: 120 (2. dakika)" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Doğru Şık İndeksi (0, 1, 2...)</label>
                                                <input type="number" name="correctOptionIdx" required min="0" className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Örn: İlk şıksa 0 yazın" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Seçenekler (Virgülle ayırın)</label>
                                                <input name="rawOptions" required className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Satın alınan elektrik, Doğrudan yakıt tüketimi, Tedarik zinciri" />
                                            </div>
                                            <div className="md:col-span-2 text-right mt-2">
                                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ml-auto">
                                                    <PlusCircle size={16} /> Soruyu Ekle
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {initialVideos.length === 0 && (
                        <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            Bu kursta henüz video yok. Yukarıdan ilk videonuzu ekleyin.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// A simple icon missing above
function PlayCircleIcon({ className, size }: { className?: string; size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
        </svg>
    );
}
