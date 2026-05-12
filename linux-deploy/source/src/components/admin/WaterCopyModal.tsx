"use client";

import { useState } from "react";
import { Files, Loader2 } from "lucide-react";
import { copyWaterReport } from "@/app/manage/water/actions";
import AdminModal from "./AdminModal";

export default function WaterCopyModal({ report, companies }: { report: any, companies: any[] }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [targetCompanyId, setTargetCompanyId] = useState("");
    const [targetYear, setTargetYear] = useState(new Date().getFullYear());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetCompanyId) return;

        setLoading(true);
        const res = await copyWaterReport(report.id, targetCompanyId, targetYear);
        setLoading(false);
        if (res.success) {
            setOpen(false);
            alert("Rapor kopyalandı");
        } else {
            alert(res.error);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                title="Kopyala"
            >
                <Files size={16} />
            </button>

            <AdminModal isOpen={open} onClose={() => setOpen(false)} title="Rapor Kopyala">
                <div className="text-sm text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold">{report.year}</span> yılına ait raporu ve alt verilerini kopyalıyorsunuz.
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hedef Yıl</label>
                        <input
                            type="number"
                            required
                            min="2000"
                            max="2100"
                            value={targetYear}
                            onChange={(e) => setTargetYear(parseInt(e.target.value))}
                            className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hedef Şirket</label>
                        <select
                            required
                            value={targetCompanyId}
                            onChange={(e) => setTargetCompanyId(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                        >
                            <option value="">Şirket seçiniz...</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !targetCompanyId}
                            className="px-4 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Kopyala
                        </button>
                    </div>
                </form>
            </AdminModal>
        </>
    );
}
