"use client";

import { useState } from "react";
import { updateProposalStatus, deleteProposal } from "@/app/crm/actions_proposal";
import { CheckCircle, XCircle, Send, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProposalActions({ proposalId, currentStatus }: { proposalId: string, currentStatus: string }) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(newStatus);
        try {
            await updateProposalStatus(proposalId, newStatus);
            router.refresh();
        } catch (error) {
            console.error("Status update error:", error);
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu teklifi silmek istediğinize emin misiniz?")) return;
        setLoading("delete");
        try {
            await deleteProposal(proposalId);
        } catch (error) {
            console.error("Delete error:", error);
            setLoading(null);
        }
    };

    return (
        <div className="flex gap-2 print:hidden">
            {currentStatus === "DRAFT" && (
                <button
                    disabled={!!loading}
                    onClick={() => handleStatusUpdate("SENT")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {loading === "SENT" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Gönderildi İşaretle
                </button>
            )}

            {currentStatus === "SENT" && (
                <>
                    <button
                        disabled={!!loading}
                        onClick={() => handleStatusUpdate("ACCEPTED")}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        {loading === "ACCEPTED" ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                        Onaylandı
                    </button>
                    <button
                        disabled={!!loading}
                        onClick={() => handleStatusUpdate("REJECTED")}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                        {loading === "REJECTED" ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                        Reddedildi
                    </button>
                </>
            )}

            <button
                disabled={!!loading}
                onClick={handleDelete}
                className="bg-slate-100 text-slate-500 p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                title="Teklifi Sil"
            >
                {loading === "delete" ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
        </div>
    );
}
