"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Calculator } from "lucide-react";
import { createProposalWithItems } from "../../actions_proposal";
import { useRouter } from "next/navigation";

interface Lead {
    id: string;
    name: string;
}

interface ProposalItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export default function NewProposalForm({ leads }: { leads: Lead[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<ProposalItem[]>([
        { id: '1', description: '', quantity: 1, unitPrice: 0 }
    ]);
    const [currency, setCurrency] = useState("TRY");
    const [taxRate, setTaxRate] = useState(20);

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof ProposalItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subTotal * (taxRate / 100);
    const totalAmount = subTotal + taxAmount;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        // We need to pass items as a JSON string because FormData doesn't support arrays of objects well
        formData.append("items", JSON.stringify(items));
        formData.append("amount", totalAmount.toString());
        formData.append("taxRate", taxRate.toString());

        // We'll use a new server action that handles items
        await createProposalWithItems(formData);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Seçin</label>
                    <select name="leadId" required className="w-full p-2 border rounded-lg">
                        <option value="">Seçiniz...</option>
                        {leads.map(lead => (
                            <option key={lead.id} value={lead.id}>{lead.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teklif Başlığı</label>
                    <input name="title" required placeholder="Örn: Web Sitesi Yenileme Projesi" className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Geçerlilik Tarihi</label>
                    <input name="validUntil" type="date" className="w-full p-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Para Birimi</label>
                        <select name="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="TRY">TRY (₺)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">KDV Oranı (%)</label>
                        <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Hizmet / Ürün Kalemleri</h3>

                <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 mb-2 px-2">
                        <div className="col-span-6">Açıklama</div>
                        <div className="col-span-2">Miktar</div>
                        <div className="col-span-2">Birim Fiyat</div>
                        <div className="col-span-1">Toplam</div>
                        <div className="col-span-1"></div>
                    </div>

                    {items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-start bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <div className="col-span-6">
                                <input
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    placeholder="Hizmet veya ürün açıklaması"
                                    required
                                    className="w-full p-2 border rounded-lg text-sm bg-white"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded-lg text-sm bg-white"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.unitPrice}
                                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded-lg text-sm bg-white"
                                />
                            </div>
                            <div className="col-span-1 flex items-center h-full text-sm font-semibold text-slate-700">
                                {(item.quantity * item.unitPrice).toLocaleString()}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <Plus size={16} /> Yeni Kalem Ekle
                </button>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-6">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-slate-600">
                        <span>Ara Toplam:</span>
                        <span>{subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currency}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>KDV (%{taxRate}):</span>
                        <span>{taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currency}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                        <span>Genel Toplam:</span>
                        <span>{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currency}</span>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Şartlar ve Koşullar</label>
                <textarea name="terms" rows={4} className="w-full p-2 border rounded-lg text-sm" placeholder="Ödeme koşulları, teslimat süresi vb."></textarea>
            </div>

            <div className="flex justify-end pt-6">
                <button disabled={loading} type="submit" className="bg-brand-green text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                    {loading ? 'Kaydediliyor...' : (
                        <>
                            <Save size={20} /> Teklifi Kaydet
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

