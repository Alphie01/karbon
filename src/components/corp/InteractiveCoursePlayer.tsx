"use client";

import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { CheckCircle2, PlayCircle } from "lucide-react";

export default function InteractiveCoursePlayer({ videos }: { videos: any[] }) {
    const [currentVideoId, setCurrentVideoId] = useState(videos[0]?.id);
    const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());

    const currentVideo = videos.find(v => v.id === currentVideoId) || videos[0];

    const handleVideoEnd = () => {
        setCompletedVideos(prev => new Set(prev).add(currentVideo.id));

        // Auto-play next
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        if (currentIndex < videos.length - 1) {
            setCurrentVideoId(videos[currentIndex + 1].id);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Player Area */}
            <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-black">
                    <VideoPlayer
                        key={currentVideo.id} // Force re-render on video change to reset state
                        src={currentVideo.url}
                        title={currentVideo.title}
                        poster={currentVideo.thumbnail || undefined}
                        quizzes={currentVideo.quizzes}
                        onEnded={handleVideoEnd}
                    />
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{currentVideo.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{currentVideo.description || "Bu bölüm için açıklama bulunmuyor."}</p>
                </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-8">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-900 dark:text-white">Ders İçeriği</h3>
                        <p className="text-sm text-slate-500">{videos.length} Bölüm</p>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                        {videos.map((video, index) => {
                            const isPlaying = video.id === currentVideoId;
                            const isCompleted = completedVideos.has(video.id);

                            return (
                                <button
                                    key={video.id}
                                    onClick={() => setCurrentVideoId(video.id)}
                                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${isPlaying ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                        }`}
                                >
                                    <div className="mt-1">
                                        {isCompleted ? (
                                            <CheckCircle2 className="text-emerald-500" size={20} />
                                        ) : isPlaying ? (
                                            <PlayCircle className="text-brand-green fill-brand-green/20" size={20} />
                                        ) : (
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 text-[10px] font-bold text-slate-500">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold text-sm ${isPlaying ? "text-brand-green" : "text-slate-700 dark:text-slate-300"}`}>
                                            {video.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {video.quizzes?.length > 0 ? `${video.quizzes.length} Soru İçerir` : "Video Dersi"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
