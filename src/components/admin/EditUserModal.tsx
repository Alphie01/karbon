"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import MultiSelect from "@/components/ui/MultiSelect";
import { updateUserRole } from "@/app/manage/users/actions";

interface User {
    id: string;
    name: string | null;
    email: string;
    roles: string;
    allowedModules: string;
    isActive: boolean;
    companyId: string | null;
}

interface Company {
    id: string;
    name: string;
}

interface EditUserModalProps {
    user: User;
    companies: Company[];
    onClose: () => void;
}

const ROLE_OPTIONS = [
    { value: "ALL", label: "Tüm Yetkiler" },
    { value: "SUPER_ADMIN", label: "Süper Admin" },
    { value: "CORP_ADMIN", label: "Firma Admin" },
    { value: "ADMIN", label: "Yönetici" },
    { value: "CRM", label: "CRM Yetkilisi" },
    { value: "USER", label: "Kullanıcı" },
    { value: "STUDENT", label: "Öğrenci" },
];

const MODULE_OPTIONS = [
    { value: "ALL", label: "Tüm Modüller" },
    { value: "CARBON", label: "Karbon Ayak İzi" },
    { value: "WATER", label: "Su Ayak İzi" },
    { value: "ACADEMY", label: "Eğitim Akademisi" },
    { value: "LIBRARY", label: "Mevzuat Kütüphanesi" },
    { value: "INCENTIVES", label: "Teşvik Robotu" }
];

export default function EditUserModal({ user, companies, onClose }: EditUserModalProps) {
    const [loading, setLoading] = useState(false);

    const [roles, setRoles] = useState<string[]>(user.roles ? user.roles.split(",") : []);
    const [allowedModules, setAllowedModules] = useState<string[]>(user.allowedModules ? user.allowedModules.split(",") : []);
    const [companyId, setCompanyId] = useState(user.companyId || "NO_COMPANY");

    const [password, setPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("roles", roles.join(","));
        formData.append("allowedModules", allowedModules.join(","));
        formData.append("companyId", companyId);

        await updateUserRole(user.id, formData);
        setLoading(false);
        onClose();
    };

    const handlePasswordChange = async () => {
        if (password.length < 6) {
            setPasswordMessage({ type: "error", text: "Şifre en az 6 karakter olmalıdır." });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("password", password);

        // Import this from actions if not already imported above
        const { updateUserPassword } = await import("@/app/manage/users/actions");
        const res = await updateUserPassword(user.id, formData);

        setPasswordLoading(false);
        if (res.success) {
            setPasswordMessage({ type: "success", text: "Şifre başarıyla güncellendi." });
            setPassword("");
        } else {
            setPasswordMessage({ type: "error", text: res.error || "Şifre güncellenemedi." });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Kullanıcı Düzenle: <span className="text-brand-navy dark:text-brand-green">{user.name || "İsimsiz"}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable content area */}
                <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">

                        {/* LEFT COLUMN: Personal Details & Password */}
                        <div className="space-y-6">
                            <section className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                                    Kişisel Bilgiler
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                                    <input disabled value={user.name || "İsimsiz"} className="w-full p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                                    <input disabled value={user.email} className="w-full p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bağlı Olduğu Firma</label>
                                    <select
                                        value={companyId}
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-green outline-none transition-all"
                                    >
                                        <option value="NO_COMPANY">Firma Yok (Erişim Kısıtlı)</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </section>

                            <section className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Parola Sıfırlama
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yeni Parola</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="En az 6 karakter"
                                            className="flex-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handlePasswordChange}
                                            disabled={passwordLoading || !password}
                                            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            {passwordLoading && <Loader2 size={14} className="animate-spin" />}
                                            Güncelle
                                        </button>
                                    </div>
                                    {passwordMessage.text && (
                                        <p className={`mt-2 text-xs font-medium ${passwordMessage.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                            {passwordMessage.text}
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: Roles & Modules */}
                        <div className="space-y-6">
                            <section className="space-y-4 h-full flex flex-col">
                                <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                                    Erişim Kontrolü
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
                                        <p className="text-xs text-slate-500 mt-2">Bu kullanıcının sistemdeki genel yetkilerini belirler. Süper Admin her şeye erişebilir.</p>
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
                                        <p className="text-xs text-slate-500 mt-2">Hangi yan uygulamalara (su ayak izi, akademi vb.) girebileceğini sınırlar.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Değişiklikleri İptal Et
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-brand-green text-white px-6 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-bold flex items-center gap-2 shadow-sm"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Profili Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}
