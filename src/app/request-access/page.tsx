"use client";

import { useState } from "react";
import { ArrowRight, Building2, CheckCircle, Mail, Phone, User, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RequestAccessPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/membership-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Submission failed");
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (status === "success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full text-center border border-slate-200 dark:border-slate-800"
                >
                    <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Talebiniz Alındı!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                        Üyelik başvurunuz başarıyla bize ulaştı. Ekibimiz başvurunuzu inceledikten sonra <strong>{formData.email}</strong> adresine dönüş yapacaktır.
                    </p>
                    <Link
                        href="/home"
                        className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all"
                    >
                        Ana Sayfaya Dön
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Left Side: Info */}
                <div className="bg-brand-navy p-10 flex flex-col justify-between text-white">
                    <div>
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                            <Building2 className="text-brand-green h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Kurumsal Erişim Talebi</h1>
                        <p className="text-slate-200 leading-relaxed text-lg">
                            EcoPilot platformunun gelişmiş özelliklerine erişmek için işletme hesabınızı oluşturun.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle className="h-5 w-5 text-brand-green" />
                                <span>Detaylı Kapsam 1-2-3 Emisyon Raporları</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle className="h-5 w-5 text-brand-green" />
                                <span>Yapay Zeka Destekli Hibe Robotu</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle className="h-5 w-5 text-brand-green" />
                                <span>Kurumsal Akademi ve Sertifikalar</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-400 mt-12">
                        &copy; 2025 EcoPilot — Monolith Yazılım
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-10 lg:p-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Başvuru Formu</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Firma Adı</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="companyName"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-green outline-none transition-all dark:text-white"
                                    placeholder="Şirket ünvanı"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Yetkili Kişi</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="contactName"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-navy outline-none transition-all dark:text-white"
                                        placeholder="Ad Soyad"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Telefon</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-navy outline-none transition-all dark:text-white"
                                        placeholder="0555..."
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">E-Posta Adresi</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-navy outline-none transition-all dark:text-white"
                                    placeholder="kurumsal@sirket.com"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mesajınız (Opsiyonel)</label>
                            <textarea
                                name="message"
                                rows={3}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-navy outline-none transition-all dark:text-white"
                                placeholder="Varsa eklemek istedikleriniz..."
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full bg-brand-navy hover:bg-brand-navy/90 dark:bg-brand-green dark:hover:bg-brand-green/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === "submitting" ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    Talebi Gönder <Send className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        {status === "error" && (
                            <p className="text-red-500 text-sm text-center font-medium">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
