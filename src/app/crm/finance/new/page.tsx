import { prisma } from "@/lib/prisma";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createFinancialRecord } from "../../actions";

export default function NewTransactionPage() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Link href="//crm/finance" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} />
                Listeye Dön
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Yeni Finansal İşlem</h1>
                <p className="text-slate-500 text-sm">Gelir veya gider kaydı oluşturun.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <form action={createFinancialRecord} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">İşlem Türü</label>
                            <select name="type" className="w-full p-2 border rounded-lg bg-white">
                                <option value="INCOME">Gelir</option>
                                <option value="EXPENSE">Gider</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                            <input name="category" list="categories" placeholder="Kategori seçin veya yazın" required className="w-full p-2 border rounded-lg" />
                            <datalist id="categories">
                                <option value="Satış Geliri" />
                                <option value="Hizmet Bedeli" />
                                <option value="Maaş Ödemesi" />
                                <option value="Ofis Gideri" />
                                <option value="Vergi" />
                                <option value="Yemek / Yol" />
                            </datalist>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (TL)</label>
                            <input name="amount" type="number" step="0.01" min="0" required className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                            <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                        <textarea name="description" rows={3} required placeholder="İşlem detayları..." className="w-full p-2 border rounded-lg"></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-slate-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Save size={20} /> Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
