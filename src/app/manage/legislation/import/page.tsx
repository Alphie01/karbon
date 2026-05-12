"use client";

import { useState } from "react";
import { authenticateAndList, importSelectedTopics } from "./actions";
import { CrawlerTopic } from "@/services/crawler";
import { Loader2, Lock, CheckCircle, AlertCircle, ArrowLeft, Download, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ImportPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [topics, setTopics] = useState<CrawlerTopic[]>([]);
    const [cookies, setCookies] = useState<string>("");
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
    const [importResult, setImportResult] = useState<any>(null);

    // Step 1: Login
    const handleLogin = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        const res = await authenticateAndList(formData);

        if (res.success && res.topics && res.cookies) {
            setTopics(res.topics);
            setCookies(res.cookies);
            setStep(2);
        } else {
            setError(res.error || "Giriş başarısız.");
        }
        setLoading(false);
    };

    // Step 2: Selection
    const toggleSelect = (url: string) => {
        if (selectedUrls.includes(url)) {
            setSelectedUrls(selectedUrls.filter(u => u !== url));
        } else {
            setSelectedUrls([...selectedUrls, url]);
        }
    };

    const toggleAll = () => {
        if (selectedUrls.length === topics.length) {
            setSelectedUrls([]);
        } else {
            setSelectedUrls(topics.map(t => t.url));
        }
    };

    // Step 3: Import
    const handleImport = async () => {
        if (selectedUrls.length === 0) return;

        setLoading(true);
        // Filter selected topcis
        const toImport = topics.filter(t => selectedUrls.includes(t.url));

        const res = await importSelectedTopics(toImport, cookies);
        setImportResult(res);
        setLoading(false);
        setStep(3);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 ">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/manage/legislation" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forum İçerik Aktarımı</h1>
                        <p className="text-slate-500 text-sm">Cevremuhendisligi.org forumundan içerik çekin.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <span className={step === 1 ? "text-purple-600 font-bold" : ""}>1. Giriş</span>
                    <span className="text-slate-300">/</span>
                    <span className={step === 2 ? "text-purple-600 font-bold" : ""}>2. Seçim</span>
                    <span className="text-slate-300">/</span>
                    <span className={step === 3 ? "text-purple-600 font-bold" : ""}>3. Tamamlandı</span>
                </div>
            </div>

            {/* Step 1: Login Form */}
            {step === 1 && (
                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Forum Girişi</h2>
                        <p className="text-slate-500 text-sm mt-1">İçerikleri görebilmek için yetkili hesap ile giriş yapın.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form action={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kullanıcı Adı</label>
                            <input name="username" required className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="Kullanıcı adı" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Şifre</label>
                            <input name="password" type="password" required className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="••••••••" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Globe size={18} />}
                            Bağlan ve Tarat
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: List & Select */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-slate-700 dark:text-slate-300">Bulunan Konular ({topics.length})</span>
                                <button onClick={toggleAll} className="text-sm text-purple-600 font-medium hover:underline">
                                    {selectedUrls.length === topics.length ? "Seçimi Kaldır" : "Tümünü Seç"}
                                </button>
                            </div>
                            <span className="text-sm text-slate-500">
                                {selectedUrls.length} seçildi
                            </span>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto">
                            {topics.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">
                                    Aranan kriterlere uygun konu bulunamadı.
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0">
                                        <tr>
                                            <th className="p-4 w-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUrls.length > 0 && selectedUrls.length === topics.length}
                                                    onChange={toggleAll}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                />
                                            </th>
                                            <th className="p-4">Konu Başlığı</th>
                                            <th className="p-4">Kategori</th>
                                            <th className="p-4">Yazar</th>
                                            <th className="p-4">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {topics.map((topic, i) => (
                                            <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedUrls.includes(topic.url) ? "bg-purple-50 dark:bg-purple-900/10" : ""}`}>
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUrls.includes(topic.url)}
                                                        onChange={() => toggleSelect(topic.url)}
                                                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                </td>
                                                <td className="p-4 font-medium text-slate-900 dark:text-white">
                                                    <a href={topic.url} target="_blank" className="hover:underline flex items-center gap-2">
                                                        {topic.title}
                                                        <Globe size={12} className="text-slate-400" />
                                                    </a>
                                                </td>
                                                <td className="p-4 text-slate-500">{topic.category}</td>
                                                <td className="p-4 text-slate-500">{topic.author}</td>
                                                <td className="p-4 text-slate-500">{topic.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={loading || selectedUrls.length === 0}
                            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                            {loading ? "İçerikler Aktarılıyor..." : "Seçilenleri İçe Aktar"}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && importResult && (
                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mx-auto flex items-center justify-center mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">İşlem Tamamlandı</h2>
                    <p className="text-slate-500 mb-8">
                        Toplam <b>{importResult.imported}</b> konu başarıyla kütüphaneye eklendi.
                        {importResult.failed > 0 && <span className="block text-red-500 mt-2">{importResult.failed} adet hata oluştu.</span>}
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href="/manage/legislation" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                            Kütüphaneye Git
                        </Link>
                        <button onClick={() => { setStep(2); setImportResult(null); }} className="text-slate-500 font-medium py-2 hover:text-slate-700 dark:hover:text-slate-300">
                            Listeye Dön
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
