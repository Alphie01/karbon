import { auth } from "@/auth";
import { Scale, Search, ExternalLink, ShieldCheck } from "lucide-react";
import { getLegislation, getLegislationCategories } from "@/actions/legislation";
import Link from "next/link";

export default async function CorpLegislationPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const session = await auth();
    const allArticles = await getLegislation();
    const categories = await getLegislationCategories();

    const resolvedParams = await searchParams;
    const activeCategory = resolvedParams.category || "Tümü";

    const filteredArticles = activeCategory === "Tümü"
        ? allArticles
        : allArticles.filter((a: any) => a.category?.trim().toLowerCase() === activeCategory?.trim().toLowerCase());

    // Get description of current category
    const activeCategoryData = categories.find((c: any) => c.name?.trim().toLowerCase() === activeCategory?.trim().toLowerCase());
    const categoryDescription = activeCategoryData?.description || "Çevre Mühendisliği mevzuatı, yönetmelikler ve güncel yasal düzenlemeler.";

    // Function to check if an article is new (added in last 7 days)
    const isNew = (dateStr: string, createdAt: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - new Date(createdAt).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Mevzuat <span className="text-purple-600">Kütüphanesi</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
                    {categoryDescription}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Filter */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Mevzuat Türleri</h3>
                        <ul className="space-y-2">
                            <li key="Tümü">
                                <Link
                                    href={`/corp/legislation`}
                                    className={`group flex items-center justify-between p-2 rounded-lg transition-colors ${activeCategory === "Tümü" ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                >
                                    <span className="font-medium">Tümü</span>
                                    <span className="text-xs font-bold opacity-60">{allArticles.length}</span>
                                </Link>
                            </li>
                            {categories.map((cat: any) => {
                                const count = allArticles.filter((a: any) => a.category === cat.name).length;
                                return (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/corp/legislation?category=${encodeURIComponent(cat.name)}`}
                                            className={`group flex items-center justify-between p-2 rounded-lg transition-colors ${activeCategory === cat.name ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                        >
                                            <span className="font-medium">{cat.name}</span>
                                            <span className="text-xs font-bold opacity-60">{count}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Content List */}
                <div className="lg:col-span-2 space-y-6">
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <Scale className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">İçerik Bulunamadı</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                Bu kategoriye ait mevzuat verisi henüz sistemde yer almıyor.
                            </p>
                        </div>
                    ) : (
                        filteredArticles.map((article: any) => {
                            const showNewBadge = isNew(article.date, article.createdAt);

                            return (
                                <div key={article.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-900 transition-all group relative overflow-hidden">
                                    {showNewBadge && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                                            YENİ
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 pr-12">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-md">
                                                    {article.category}
                                                </span>
                                                {article.date && (
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        • {article.date}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors leading-snug">
                                                {article.title}
                                            </h3>
                                            <div className="flex gap-4 mt-4">
                                                {/* Masked outgoing link */}
                                                <a
                                                    href={`/api/legislation/goto?id=${article.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg"
                                                >
                                                    Dokümanı Görüntüle <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {/* Footer Provider Notice */}
                    <div className="pt-8 text-center flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                        <ShieldCheck size={16} />
                        <span>Bu içerik <strong>cevremuhendisligi.org</strong> tarafından sağlanmaktadır.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
