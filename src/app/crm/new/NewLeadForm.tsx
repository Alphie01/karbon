"use client";

import { createLead } from "../actions"; // We will create this
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function NewLeadForm() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        await createLead(formData);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Firma / Kişi Adı</label>
                    <input name="name" required className="w-full p-2 border rounded-lg" placeholder="Örn: ABC Lojistik A.Ş." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Yetkili Kişi</label>
                    <input name="contactPerson" className="w-full p-2 border rounded-lg" placeholder="Ad Soyad" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                    <input name="email" type="email" className="w-full p-2 border rounded-lg" placeholder="email@sirket.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                    <input name="phone" className="w-full p-2 border rounded-lg" placeholder="0555 123 45 67" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kaynak</label>
                    <select name="source" className="w-full p-2 border rounded-lg bg-white">
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Web Sitesi">Web Sitesi</option>
                        <option value="Referans">Referans</option>
                        <option value="Fuar">Fuar</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                    <select name="status" className="w-full p-2 border rounded-lg bg-white">
                        <option value="NEW">Yeni</option>
                        <option value="CONTACTED">İletişime Geçildi</option>
                        <option value="PROPOSAL">Teklif Aşamasında</option>
                        <option value="NEGOTIATION">Pazarlık</option>
                        <option value="WON">Kazanıldı</option>
                        <option value="LOST">Kaybedildi</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notlar</label>
                <textarea name="notes" rows={3} className="w-full p-2 border rounded-lg" placeholder="Genel notlar..." />
            </div>

            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {loading && <Loader2 className="animate-spin" size={16} />}
                Kaydet
            </button>
        </form>
    );
}
