"use client";

import { useState } from "react";
import { Plus, X, Loader2, Building2 } from "lucide-react";
import { createCompany } from "./actions";

export default function CreateCompanyButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        const res = await createCompany(formData);
        setLoading(false);
        if (res.success) {
            setIsOpen(false);
        } else {
            alert(res.error || "Hata oluştu");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-brand-navy hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors"
            >
                <Plus size={16} />
                Yeni Firma Ekle
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-brand-navy/10 rounded-xl">
                                <Building2 className="text-brand-navy dark:text-brand-green" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Yeni Firma Oluştur</h2>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Firma Adı</label>
                                <input name="name" required className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Şirket Adı A.Ş." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Abonelik Durumu</label>
                                <select name="subscriptionStatus" className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                                    <option value="ACTIVE">Aktif</option>
                                    <option value="PAST_DUE">Ödeme Gecikmiş</option>
                                    <option value="CANCELLED">İptal Edilmiş</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-green text-white py-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-bold mt-2 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Firma Oluştur
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
