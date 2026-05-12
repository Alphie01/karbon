"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function ActivityForm({ action }: { action: (formData: FormData) => Promise<void> }) {
    const [type, setType] = useState("NOTE");

    return (
        <form action={action} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <select name="type" value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded-lg text-sm bg-white">
                    <option value="NOTE">Not</option>
                    <option value="MEETING">Toplantı</option>
                    <option value="CALL">Arama</option>
                    <option value="EMAIL">E-posta</option>
                </select>
                <input name="date" type="datetime-local" required defaultValue={new Date().toISOString().slice(0, 16)} className="p-2 border rounded-lg text-sm" />
            </div>

            {type === 'MEETING' && (
                <div className="grid grid-cols-2 gap-3">
                    <input name="duration" type="number" min="15" step="15" defaultValue="30" placeholder="Süre (dk)" className="p-2 border rounded-lg text-sm" />
                    <input name="location" type="text" placeholder="Toplantı Linki / Yeri" className="p-2 border rounded-lg text-sm" />
                </div>
            )}

            <input name="subject" required placeholder="Konu başlığı (Örn: Tanışma toplantısı)" className="w-full p-2 border rounded-lg text-sm" />
            <textarea name="notes" rows={3} placeholder="Detaylar..." className="w-full p-2 border rounded-lg text-sm"></textarea>
            <div className="flex justify-end">
                <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                    Ekle
                </button>
            </div>
        </form>
    );
}
