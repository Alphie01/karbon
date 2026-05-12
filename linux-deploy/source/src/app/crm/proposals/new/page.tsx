import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import NewProposalForm from "./NewProposalForm";

export default async function NewProposalPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link href="//crm/proposals" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} />
                Tekliflere Dön
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Yeni Teklif Hazırla</h1>
                <p className="text-slate-500 text-sm">Hizmet kalemlerini girerek profesyonel bir teklif oluşturun.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <NewProposalForm leads={leads} />
            </div>
        </div>
    );
}
