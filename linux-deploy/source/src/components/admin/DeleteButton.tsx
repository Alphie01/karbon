"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import AdminModal from "./AdminModal";

export default function DeleteButton({
    id,
    onDelete
}: {
    id: string,
    onDelete: (id: string) => Promise<{ success: boolean, error?: string }>
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkDelete = async () => {
        setLoading(true);
        const res = await onDelete(id);
        setLoading(false);
        if (res.success) {
            setOpen(false);
            // toast.success("Silindi");
        } else {
            alert(res.error || "Silme işlemi başarısız.");
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                title="Sil"
            >
                <Trash2 size={16} />
            </button>

            <AdminModal isOpen={open} onClose={() => setOpen(false)} title="Emin misiniz?">
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">
                        Bu işlem geri alınamaz. Kayıt kalıcı olarak silinecektir.
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={checkDelete}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Sil
                        </button>
                    </div>
                </div>
            </AdminModal>
        </>
    );
}
