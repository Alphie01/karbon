"use client";

import { useState } from "react";
import { Power, Trash2, Edit2, Save, X, Building2 } from "lucide-react";
import { toggleUserStatus, deleteUser, updateUserRole } from "./actions";
import MultiSelect from "@/components/ui/MultiSelect";
import EditUserModal from "@/components/admin/EditUserModal";

interface User {
    id: string;
    name: string | null;
    email: string;
    roles: string;
    allowedModules: string;
    isActive: boolean;
    lastSeen: string | Date | null;
    companyId: string | null;
    company?: { name: string } | null;
}

interface Company {
    id: string;
    name: string;
}

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

export default function UserRow({ user, companies }: { user: User, companies: Company[] }) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-medium text-slate-900 dark:text-white">{user.name || "İsimsiz"}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                            {user.lastSeen && (new Date().getTime() - new Date(user.lastSeen).getTime() < 300000) && (
                                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Çevrimiçi" />
                            )}
                        </div>
                    </td>
                    <td className="p-4">
                        {user.company ? (
                            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Building2 size={14} className="text-slate-400" />
                                {user.company.name}
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic">Firma Yok</span>
                        )}
                    </td>
                    <td className="p-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                            {user.roles.split(",").map((role, i) => (
                                <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold">
                                    {ROLE_OPTIONS.find(o => o.value === role)?.label || role}
                                </span>
                            ))}
                        </div>
                    </td>
                    <td className="p-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                            {user.allowedModules.split(",").map((mod, i) => (
                                <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs">
                                    {MODULE_OPTIONS.find(o => o.value === mod)?.label || mod}
                                </span>
                            ))}
                        </div>
                    </td>
                    <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                            {user.isActive ? "Aktif" : "Pasif"}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                        {/* Empty buttons or keep them disabled to show it's being edited */}
                        <div className="flex items-center justify-end gap-2 opacity-50">
                            <div className="p-2 text-blue-500 rounded-lg"><Edit2 size={16} /></div>
                            <div className={`p-2 rounded-lg ${user.isActive ? "text-red-500" : "text-green-500"}`}><Power size={16} /></div>
                            <div className="p-2 text-slate-400"><Trash2 size={16} /></div>
                        </div>
                    </td>
                </tr>
                <EditUserModal
                    user={user}
                    companies={companies}
                    onClose={() => setIsEditing(false)}
                />
            </>
        );
    }

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="font-medium text-slate-900 dark:text-white">{user.name || "İsimsiz"}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    {user.lastSeen && (new Date().getTime() - new Date(user.lastSeen).getTime() < 300000) && (
                        <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Çevrimiçi" />
                    )}
                </div>
                {user.lastSeen && (
                    <div className="text-[10px] text-slate-400 mt-0.5">
                        Son görülme: {new Date(user.lastSeen).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </td>
            <td className="p-4">
                {user.company ? (
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Building2 size={14} className="text-slate-400" />
                        {user.company.name}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">Firma Yok</span>
                )}
            </td>
            <td className="p-4 text-sm">
                <div className="flex flex-wrap gap-1">
                    {user.roles.split(",").map((role, i) => (
                        <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold">
                            {ROLE_OPTIONS.find(o => o.value === role)?.label || role}
                        </span>
                    ))}
                </div>
            </td>
            <td className="p-4 text-sm">
                <div className="flex flex-wrap gap-1">
                    {user.allowedModules.split(",").map((mod, i) => (
                        <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs">
                            {MODULE_OPTIONS.find(o => o.value === mod)?.label || mod}
                        </span>
                    ))}
                </div>
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {user.isActive ? "Aktif" : "Pasif"}
                </span>
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Düzenle"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`p-2 rounded-lg transition-colors ${user.isActive ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
                        title={user.isActive ? "Pasife Al" : "Aktifleştir"}
                    >
                        <Power size={16} />
                    </button>
                    <button
                        onClick={() => {
                            if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
                                deleteUser(user.id);
                            }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Kullanıcıyı Sil"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
