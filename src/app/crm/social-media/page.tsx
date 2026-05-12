"use client";

import { useState } from "react";
import { Plus, Link2, Calendar as CalendarIcon, FilePenLine, BarChart3, Settings2, Instagram, Twitter, Linkedin, Search } from "lucide-react";
import clsx from "clsx";

export default function SocialMediaDashboard() {
    const [activeTab, setActiveTab] = useState<"calendar" | "drafts" | "accounts" | "analytics">("calendar");

    const tabs = [
        { id: "calendar", name: "İçerik Takvimi", icon: CalendarIcon },
        { id: "drafts", name: "Taslaklar", icon: FilePenLine },
        { id: "accounts", name: "Bağlı Hesaplar", icon: Link2 },
        { id: "analytics", name: "Analizler & Raporlar", icon: BarChart3 }
    ] as const;

    return (
        <div className="max-w-7xl mx-auto space-y-6 ">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sosyal Medya Yönetimi</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gönderilerinizi tek bir merkezden planlayın, paylaşın ve analiz edin.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors ">
                    <Plus size={20} />
                    Yeni Gönderi Oluştur
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-800 pb-[#1px] overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                            activeTab === tab.id
                                ? "border-blue-600 text-blue-600 dark:text-blue-500"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Content Area Rendering */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 min-h-[500px]">

                {activeTab === "calendar" && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                        <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                            <CalendarIcon size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Henüz Planlanmış Gönderi Yok</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                            Haftalık ve aylık içeriklerinizi buradan planlayıp otomatik yayınlayabilirsiniz.
                        </p>
                        <button className="mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm">
                            Takvimi Oluşturmaya Başla
                        </button>
                    </div>
                )}

                {activeTab === "drafts" && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                        <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center">
                            <FilePenLine size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Taslaklar Boş</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">Oluşturduğunuz gönderileri taslak olarak kaydedip daha sonra düzenleyebilirsiniz.</p>
                    </div>
                )}

                {activeTab === "accounts" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bağlı Hesaplarınızı Yönetin</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                <Plus size={16} /> Yeni Hesap Ekle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* LinkedIn Example Card */}
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-[#0077b5]/10 text-[#0077b5] rounded-xl flex items-center justify-center">
                                            <Linkedin size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">LinkedIn</div>
                                            <div className="text-xs text-slate-500">beyond-limits-turkey</div>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600"><Settings2 size={18} /></button>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-emerald-600 font-medium flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Bağlı Aktif</span>
                                    <span className="text-slate-500">1,240 Takipçi</span>
                                </div>
                            </div>

                            {/* Instagram Example Card */}
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-pink-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white rounded-xl flex items-center justify-center">
                                            <Instagram size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">Instagram</div>
                                            <div className="text-xs text-slate-500">@beyondlimitstr</div>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600"><Settings2 size={18} /></button>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-400 font-medium flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-slate-300" /> Bağlantı Bekliyor</span>
                                </div>
                            </div>

                            {/* Twitter Example Card */}
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-500/50 transition-colors bg-slate-50/50 dark:bg-slate-800/20 border-dashed">
                                <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                                    <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors cursor-pointer">
                                        <Plus size={24} />
                                    </div>
                                    <div className="font-medium text-slate-600 dark:text-slate-400">Yeni Araç Bağla</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                        <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                            <BarChart3 size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Etkileşim Verileri Toplanıyor</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">Gönderileriniz yayınlandıktan sonra görüntülenme ve beğeni istatistiklerini buradan takip edebilirsiniz.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
