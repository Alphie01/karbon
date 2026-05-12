"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { updateCarbonEntry } from "@/app/manage/carbon/actions";
import AdminModal from "./AdminModal";

export default function CarbonEditModal({ entry }: { entry: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        scope: entry.scope,
        category: entry.category,
        activity: entry.activity,
        amount: entry.amount,
        unit: entry.unit,
        emissionFactor: entry.emissionFactor,
        emissionStart: entry.calculatedEmission,
        date: new Date(entry.date).toISOString().split('T')[0],
        note: entry.description || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateCarbonEntry(entry.id, formData);
        setLoading(false);
        if (res.success) {
            setOpen(false);
            alert("Kayıt güncellendi");
        } else {
            alert(res.error);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                title="Düzenle"
            >
                <Pencil size={16} />
            </button>

            <AdminModal isOpen={open} onClose={() => setOpen(false)} title="Kayıt Düzenle">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Tarih</label>
                            <input
                                name="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Kapsam</label>
                            <select
                                name="scope"
                                value={formData.scope}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                            >
                                <option value="SCOPE_1">Kapsam 1</option>
                                <option value="SCOPE_2">Kapsam 2</option>
                                <option value="SCOPE_3">Kapsam 3</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                        <input
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Aktivite / Kaynak</label>
                        <input
                            name="activity"
                            required
                            value={formData.activity}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Miktar</label>
                            <input
                                name="amount"
                                type="number"
                                step="any"
                                required
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Birim</label>
                            <input
                                name="unit"
                                required
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Emisyon Faktörü</label>
                            <input
                                name="emissionFactor"
                                type="number"
                                step="any"
                                required
                                value={formData.emissionFactor}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Not / Açıklama</label>
                        <textarea
                            name="note"
                            rows={2}
                            value={formData.note}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-bold text-white bg-brand-navy hover:bg-brand-navy/90 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Güncelle
                        </button>
                    </div>
                </form>
            </AdminModal>
        </>
    );
}
