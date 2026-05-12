"use client";

import { useState } from "react";
import { educationData, EducationCategory, EducationResource } from "@/lib/educationData";
import { PlayCircle, FileText, ChevronRight, Search } from "lucide-react";
import clsx from "clsx";

export default function EducationHub() {
    const [selectedCategory, setSelectedCategory] = useState<string>(educationData[0].id);
    const [searchQuery, setSearchQuery] = useState("");

    const activeCategory = educationData.find(c => c.id === selectedCategory);

    const filteredResources = activeCategory?.resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)]">
            {/* Sidebar / Category List */}
            <div className="w-full lg:w-1/4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="İçerik ara..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                        Konu Başlıkları
                    </div>
                    <div className="divide-y divide-slate-100">
                        {educationData.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={clsx(
                                    "w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between",
                                    selectedCategory === category.id ? "bg-emerald-50 border-l-4 border-emerald-500" : "border-l-4 border-transparent"
                                )}
                            >
                                <div className="flex flex-col">
                                    <span className={clsx("font-medium", selectedCategory === category.id ? "text-emerald-700" : "text-slate-700")}>
                                        {category.title}
                                    </span>
                                    <span className="text-xs text-slate-500 mt-1">{category.resources.length} İçerik</span>
                                </div>
                                {selectedCategory === category.id && <ChevronRight className="h-4 w-4 text-emerald-500" />}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4 overflow-y-auto pr-2">
                {activeCategory ? (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">{activeCategory.title}</h2>
                            <p className="text-slate-500 mt-1">{activeCategory.description}</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredResources?.map((resource) => (
                                <div key={resource.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="relative h-40 bg-slate-200">
                                        <img
                                            src={resource.thumbnail}
                                            alt={resource.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {resource.duration}
                                        </div>
                                        {resource.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 drop-shadow-md" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                            {resource.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                                            {resource.type === 'video' ? 'Video Ders' : 'Makale / Rehber'}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                                            {resource.description}
                                        </p>
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto block text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg transition"
                                        >
                                            İçeriği Görüntüle
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {filteredResources?.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-500">
                                    Aradığınız kriterlere uygun içerik bulunamadı.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-slate-400">
                        Bir kategori seçin.
                    </div>
                )}
            </div>
        </div>
    );
}
