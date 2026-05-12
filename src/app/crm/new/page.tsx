import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import NewLeadForm from "./NewLeadForm";

export default function NewLeadPage() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Link href="/crm" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                <ChevronLeft size={16} />
                Listeye Dön
            </Link>

            <h1 className="text-xl font-bold text-slate-900 mb-6">Yeni Müşteri / Proje Ekle</h1>

            <NewLeadForm />
        </div>
    );
}
