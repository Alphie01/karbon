"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function VideoUploader({ courseId, onUploadSuccess }: { courseId: string; onUploadSuccess: (url: string, title: string, attentionLevel: string) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [attentionLevel, setAttentionLevel] = useState("GENEL");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            // Call the success callback to trigger server action
            onUploadSuccess(data.url, title, attentionLevel);

            // Reset form
            setFile(null);
            setTitle("");
            setAttentionLevel("GENEL");
        } catch (err: any) {
            setError(err.message || "An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleUpload} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Başlığı</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    placeholder="Bölüm 1: Giriş"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hedef Kitle (Algı / Odak Seviyesi)</label>
                <select
                    value={attentionLevel}
                    onChange={(e) => setAttentionLevel(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                >
                    <option value="GENEL">Genel (Okul/Firma İçi Herkese Açık)</option>
                    <option value="LOW">Kısa Odak (LOW - Özet, Hızlı Bilgi)</option>
                    <option value="MEDIUM">Orta Odak (MEDIUM - Normal)</option>
                    <option value="HIGH">Uzun Odak (HIGH - Detaylı ve Derinlemesine)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Dosyası (Bilgisayardan Seç)</label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-slate-400" />
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="font-semibold">Yüklemek için tıklayın</span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">MP4, WEBM (Max 500MB)</p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            accept="video/mp4,video/webm"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>
                </div>
                {file && <p className="text-sm text-brand-green mt-2 font-medium">Seçilen dosya: {file.name}</p>}
            </div>

            <button
                type="submit"
                disabled={isUploading || !file || !title}
                className="w-full bg-brand-green text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <><Loader2 className="animate-spin" size={18} /> Yükleniyor...</>
                ) : (
                    "Videoyu Yükle ve Kursa Ekle"
                )}
            </button>
        </form>
    );
}
