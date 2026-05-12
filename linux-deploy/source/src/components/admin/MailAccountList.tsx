"use client";

import { useState, useEffect } from "react";
import { Mail, Plus, Trash2, Key, MailWarning, Info } from "lucide-react";
import { getMailAccountsAction, createMailAccountAction, deleteMailAccountAction, changeMailPasswordAction } from "@/actions/mail-actions";

interface MailAccount {
    id: string;
    email: string;
    username: string;
}

export default function MailAccountList() {
    const [accounts, setAccounts] = useState<MailAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newAccount, setNewAccount] = useState({ email: "", username: "" });
    const [error, setError] = useState("");

    // Password Change State
    const [pwdModalOpen, setPwdModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState({ email: "", username: "" });
    const [newPassword, setNewPassword] = useState("");
    const [pwdChanging, setPwdChanging] = useState(false);
    const [pwdError, setPwdError] = useState("");

    const fetchAccounts = async () => {
        setLoading(true);
        const res = await getMailAccountsAction();
        if (res.success) setAccounts(res.accounts || []);
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await fetchAccounts();
        };
        init();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError("");

        const res = await createMailAccountAction(newAccount.email, newAccount.username);
        if (res.success) {
            setNewAccount({ email: "", username: "" });
            fetchAccounts();
        } else {
            setError(res.error || "Hesap oluşturma hatası");
        }
        setCreating(false);
    };

    const handleDelete = async (id: string, username: string) => {
        if (!confirm(`Bu hesabı (${username}) ve tüm verilerini silmek istediğinize emin misiniz?`)) return;

        const res = await deleteMailAccountAction(id, username);
        if (res.success) {
            fetchAccounts();
        } else {
            alert("Silme hatası: " + res.error);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdChanging(true);
        setPwdError("");

        const res = await changeMailPasswordAction(targetUser.username, newPassword);
        if (res.success) {
            setPwdModalOpen(false);
            setNewPassword("");
            alert("Şifre başarıyla güncellendi.");
        } else {
            setPwdError(res.error || "Şifre değiştirme hatası");
        }
        setPwdChanging(false);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Quick Info / Instructions for Client Setup */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Info size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">E-Posta İstemci Kurulum Ayarları</h3>
                        <p className="text-blue-700/70 dark:text-blue-300/60 mt-1 text-sm">
                            Outlook, Apple Mail veya Mobil posta uygulamanıza kurmak için aşağıdaki ayarları kullanın:
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
                                <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Gelen Sunucu (IMAP)</p>
                                <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                                    <li><span className="font-bold">Sunucu:</span> mail.beyondlimitsturkiye.tech</li>
                                    <li><span className="font-bold">Port:</span> 993</li>
                                    <li><span className="font-bold">Güvenlik:</span> SSL/TLS</li>
                                </ul>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
                                <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Giden Sunucu (SMTP)</p>
                                <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                                    <li><span className="font-bold">Sunucu:</span> mail.beyondlimitsturkiye.tech</li>
                                    <li><span className="font-bold">Port:</span> 587</li>
                                    <li><span className="font-bold">Güvenlik:</span> STARTTLS</li>
                                </ul>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-blue-500 italic">
                            * Kullanıcı adı olarak sadece hesap adını (örn: &apos;info&apos; veya &apos;elifn&apos;) kullanın.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Account Creation Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Plus className="text-brand-green" size={24} />
                            <h2 className="text-lg font-bold">Yeni Hesap Aç</h2>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-xs flex items-center gap-2">
                                    <MailWarning size={14} /> {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">E-Posta Adresi</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="isim@beyondlimitsturkiye.tech"
                                    value={newAccount.email}
                                    onChange={e => setNewAccount({ ...newAccount, email: e.target.value })}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-green transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Kullanıcı Adı (Sistem)</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="elifn"
                                    value={newAccount.username}
                                    onChange={e => setNewAccount({ ...newAccount, username: e.target.value })}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-green transition-all"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Sistem üzerinde bu isimle bir kullanıcı oluşturulacaktır.</p>
                            </div>

                            <button
                                disabled={creating}
                                type="submit"
                                className="w-full py-3 bg-brand-green hover:bg-brand-green/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? "Oluşturuluyor..." : "Hesabı Oluştur"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Account List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Mail className="text-slate-400" size={20} />
                            Mevcut Hesaplar
                        </h2>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 py-1 px-3 rounded-full font-medium">
                            {accounts.length} Toplam
                        </span>
                    </div>

                    {loading ? (
                        <div className="p-20 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                            <p className="text-slate-400">Henüz bir hesap eklenmemiş.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {accounts.map((acc) => (
                                <div key={acc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-4 group hover:border-brand-green transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{acc.email}</h3>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                    <Key size={10} /> {acc.username}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(acc.id, acc.username)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setTargetUser({ email: acc.email, username: acc.username });
                                                setPwdModalOpen(true);
                                            }}
                                            className="text-xs font-bold text-slate-400 hover:text-brand-green flex items-center gap-1 transition-colors"
                                        >
                                            <Key size={12} /> Şifreyi Değiştir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Password Change Modal Overlay */}
            {pwdModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Şifreyi Güncelle</h3>
                                <p className="text-sm text-slate-500 mt-1">{targetUser.email}</p>
                            </div>
                            <button onClick={() => setPwdModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <Plus size={24} className="rotate-45 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            {pwdError && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-xs flex items-center gap-2">
                                    <MailWarning size={14} /> {pwdError}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Yeni Şifre</label>
                                <input
                                    required
                                    autoFocus
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-green transition-all text-lg"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPwdModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    disabled={pwdChanging}
                                    type="submit"
                                    className="flex-[2] py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {pwdChanging ? "Güncelleniyor..." : "Şifreyi Kaydet"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
