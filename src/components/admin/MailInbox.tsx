"use client";

import { useState } from "react";
import { EmailMessage } from "@/lib/mail";
import { sendMailAction, markEmailReadAction, deleteEmailAction, fetchInboxAction } from "@/actions/mail-actions";
import { Mail, Send, Trash2, X, RefreshCw, MailOpen, AlertCircle } from "lucide-react";
import clsx from "clsx";

export default function MailInbox({ initialEmails }: { initialEmails: EmailMessage[] }) {
    const [emails, setEmails] = useState<EmailMessage[]>(initialEmails);
    const [loading, setLoading] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [composeData, setComposeData] = useState({ to: "", subject: "", message: "" });

    const refreshInbox = async () => {
        setLoading(true);
        const res = await fetchInboxAction();
        if (res.success && res.emails) {
            setEmails(res.emails);
        }
        setLoading(false);
    };

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setError("");
        const formData = new FormData(e.currentTarget);

        const res = await sendMailAction(formData);
        if (res.success) {
            setComposeOpen(false);
            setComposeData({ to: "", subject: "", message: "" });
            alert("E-Posta başarıyla gönderildi.");
            refreshInbox();
        } else {
            setError(res.error || "Gönderme hatası");
        }
        setSending(false);
    };

    const handleReply = (email: EmailMessage) => {
        const quotedMessage = `\n\n--- Orijinal Mesaj ---\nKimden: ${email.from}\nTarih: ${new Date(email.date).toLocaleString("tr-TR")}\nKonu: ${email.subject}\n\n${email.snippet}...`;

        setComposeData({
            to: email.from,
            subject: `Re: ${email.subject}`,
            message: quotedMessage
        });
        setComposeOpen(true);
    };

    const handleRead = async (email: EmailMessage) => {
        setSelectedEmail(email);
        if (!email.isRead) {
            await markEmailReadAction(email.uid);
            setEmails(emails.map(e => e.uid === email.uid ? { ...e, isRead: true } : e));
        }
    };

    const handleDelete = async (uid: number) => {
        if (!confirm("Bu e-postayı silmek istediğinize emin misiniz?")) return;
        const res = await deleteEmailAction(uid);
        if (res.success) {
            setEmails(emails.filter(e => e.uid !== uid));
            if (selectedEmail?.uid === uid) setSelectedEmail(null);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row h-[750px] overflow-hidden">
            {/* Sidebar / List */}
            <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Mail className="text-brand-green" /> Gelen Kutusu
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={refreshInbox} disabled={loading} className="p-2 text-slate-500 hover:text-brand-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50">
                            <RefreshCw size={18} className={clsx(loading && "animate-spin")} />
                        </button>
                        <button onClick={() => setComposeOpen(true)} className="px-3 py-1.5 bg-brand-navy hover:bg-brand-navy/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Send size={14} /> Yeni E-Posta
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {emails.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                            <MailOpen size={40} className="mb-3 text-slate-300" />
                            <p>Hiç e-posta bulunmuyor.</p>
                        </div>
                    ) : (
                        emails.map(email => (
                            <button
                                key={email.uid}
                                onClick={() => handleRead(email)}
                                className={clsx(
                                    "w-full text-left p-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 focus:outline-none",
                                    selectedEmail?.uid === email.uid && "bg-slate-100 dark:bg-slate-800 border-l-4 border-l-brand-green",
                                    !email.isRead && "bg-white dark:bg-slate-900"
                                )}
                            >
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={clsx("font-medium truncate pr-4 text-sm text-slate-900 dark:text-white", !email.isRead && "font-bold")}>
                                        {email.from}
                                    </span>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">
                                        {new Date(email.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <div className={clsx("text-sm truncate mb-1", !email.isRead ? "text-slate-800 dark:text-slate-200 font-semibold" : "text-slate-600 dark:text-slate-300")}>
                                    {email.subject}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                    {email.snippet}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden relative">
                {selectedEmail ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedEmail.subject}</h1>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedEmail.from}</span>
                                    <span>•</span>
                                    <span>{new Date(selectedEmail.date).toLocaleString("tr-TR")}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(selectedEmail.uid)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                title="Sil"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => handleReply(selectedEmail)}
                                className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <Send size={14} /> Yanıtla
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div
                                className="prose dark:prose-invert max-w-none prose-sm sm:prose-base"
                                dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <Mail size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Okumak için bir e-posta seçin</p>
                        </div>
                    </div>
                )}

                {/* Compose Modal Overlay */}
                {composeOpen && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Yeni E-Posta</h3>
                            <button onClick={() => setComposeOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSend} className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Kime</label>
                                <input required name="to" type="email" placeholder="ornek@firma.com" value={composeData.to} onChange={e => setComposeData({ ...composeData, to: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-green transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Konu</label>
                                <input required name="subject" type="text" placeholder="Görüşme Talebi" value={composeData.subject} onChange={e => setComposeData({ ...composeData, subject: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-green transition-colors" />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Mesajınız</label>
                                <textarea required name="message" placeholder="Mesajınızı buraya yazın..." value={composeData.message} onChange={e => setComposeData({ ...composeData, message: e.target.value })} className="w-full flex-1 min-h-[200px] p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-green transition-colors resize-none"></textarea>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button disabled={sending} type="submit" className="px-6 py-2.5 bg-brand-green hover:bg-brand-green/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                                    <Send size={18} /> {sending ? "Gönderiliyor..." : "Gönder"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
