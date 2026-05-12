"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-200 transition-colors print:hidden"
            onClick={() => window.print()}
        >
            <Printer size={18} /> Yazdır / PDF
        </button>
    );
}
