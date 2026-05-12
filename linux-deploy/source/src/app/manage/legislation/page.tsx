import { auth } from "@/auth";
import { getLegislationCategories, updateLegislationCategory } from "@/actions/legislation";
import { Settings, Save, RefreshCw } from "lucide-react";

export default async function AdminLegislationPage() {
    const session = await auth();
    const categories = await getLegislationCategories();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mevzuat Yönetimi</h1>
                    <p className="text-slate-600 dark:text-slate-400">Otomatik çekilen mevzuatların kategori isimlerini ve açıklamalarını buradan yönetin.</p>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm border border-blue-200 dark:border-blue-800">
                <strong className="block mb-1">Bilgi:</strong>
                Mevzuatlar düzenli olarak `cevremuhendisligi.org` üzerinden otomatik olarak senkronize edilmektedir.
                Manuel ekleme işlemi kaldırılmıştır. Aşağıdan kategori (Kanun, Yönetmelik vb.) üst açıklamalarını değiştirebilirsiniz.
            </div>

            <div className="space-y-6">
                {categories.length === 0 ? (
                    <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        Henüz hiç başlık / kategori çekilmedi. Arka plan servisinin çalışmasını bekleyin.
                    </div>
                ) : (
                    categories.map((cat: any) => (
                        <div key={cat.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <form action={updateLegislationCategory as any} className="flex flex-col md:flex-row gap-4">
                                <input type="hidden" name="id" value={cat.id} />

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Settings className="text-slate-400" size={18} />
                                        <input
                                            name="name"
                                            defaultValue={cat.name}
                                            className="font-bold text-lg bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-purple-500 outline-none text-slate-900 dark:text-white px-1 transition-colors w-full md:w-auto min-w-[200px]"
                                            placeholder="Kategori Başlığı (örn. Kanunlar)"
                                        />
                                    </div>
                                    <textarea
                                        name="description"
                                        defaultValue={cat.description || ""}
                                        rows={2}
                                        placeholder="Kullanıcılara bu başlık altında gösterilecek açıklama yazısı (örneğin: Son güncel çevre kanunları)"
                                        className="w-full text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-purple-500 transition-colors"
                                    ></textarea>
                                </div>

                                <div className="md:w-32 flex items-end">
                                    <button type="submit" className="w-full h-11 bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-purple-600 dark:hover:text-white transition-all rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm">
                                        <Save size={16} /> Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
