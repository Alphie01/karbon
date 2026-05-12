"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createUser } from "./actions";
import MultiSelect from "@/components/ui/MultiSelect";

const ROLE_OPTIONS = [
    { value: "ALL", label: "Tüm Yetkiler" },
    { value: "SUPER_ADMIN", label: "Süper Admin" },
    { value: "CORP_ADMIN", label: "Firma Admin" },
    { value: "ADMIN", label: "Yönetici" },
    { value: "CRM", label: "CRM Yetkilisi" },
    { value: "USER", label: "Kullanıcı" },
    { value: "STUDENT", label: "Öğrenci" }
];

const MODULE_OPTIONS = [
    { value: "ALL", label: "Tüm Modüller" },
    { value: "CARBON", label: "Karbon Ayak İzi" },
    { value: "WATER", label: "Su Ayak İzi" },
    { value: "ACADEMY", label: "Eğitim Akademisi" },
    { value: "LIBRARY", label: "Mevzuat Kütüphanesi" },
    { value: "INCENTIVES", label: "Teşvik Robotu" }
];

interface Company {
    id: string;
    name: string;
}

export default function CreateUserButton({ companies }: { companies: Company[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // MultiSelect States
    const [roles, setRoles] = useState<string[]>(["USER"]);
    const [allowedModules, setAllowedModules] = useState<string[]>(["ALL"]);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        // Append array values to formData
        formData.set("roles", roles.join(","));
        formData.set("allowedModules", allowedModules.join(","));

        const companyId = formData.get("companyId") as string;
        if (companyId === "NO_COMPANY") {
            formData.delete("companyId");
        }

        const res = await createUser(formData);
        setLoading(false);
        if (res.success) {
            setIsOpen(false);
        } else {
            alert(res.error || "Hata oluştu");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-brand-navy hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors"
            >
                <Plus size={16} />
                Yeni Kullanıcı Ekle
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Yeni Kullanıcı Oluştur
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body - Scrollable content area */}
                        <form action={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                            <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">

                                    {/* LEFT COLUMN: Personal Details */}
                                    <div className="space-y-6">
                                        <section className="space-y-4">
                                            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                                                Hesap Bilgileri
                                            </h3>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                                                <input name="name" required className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-green outline-none transition-all" placeholder="Ad Soyad" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                                                <input name="email" type="email" required className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-green outline-none transition-all" placeholder="ornek@sirket.com" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Şifre</label>
                                                <input name="password" type="password" required className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-green outline-none transition-all" placeholder="En az 6 karakter" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bağlanacak Firma</label>
                                                <select
                                                    name="companyId"
                                                    className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-green outline-none transition-all"
                                                >
                                                    <option value="NO_COMPANY">Firma Atama (Seçimsiz)</option>
                                                    {companies.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-slate-500 mt-1">Eğer Süper Admin eklenecekse firma seçilmeyebilir.</p>
                                            </div>
                                        </section>
                                    </div>

                                    {/* RIGHT COLUMN: Roles & Modules */}
                                    <div className="space-y-6">
                                        <section className="space-y-4 h-full flex flex-col">
                                            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                                                Başlangıç Yetkileri
                                            </h3>

                                            <div className="space-y-6 flex-1">
                                                <div className="relative z-20">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Kullanıcı Rolleri
                                                    </label>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 overflow-visible">
                                                        <MultiSelect
                                                            options={ROLE_OPTIONS}
                                                            selected={roles}
                                                            onChange={setRoles}
                                                            placeholder="Rol arayın veya seçin..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="relative z-10 pt-4">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Uygulama Modülleri
                                                    </label>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 overflow-visible">
                                                        <MultiSelect
                                                            options={MODULE_OPTIONS}
                                                            selected={allowedModules}
                                                            onChange={setAllowedModules}
                                                            placeholder="Modül arayın veya seçin..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                                    İptal Et
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-brand-green text-white px-6 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-bold flex items-center gap-2 shadow-sm"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    Kullanıcıyı Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
