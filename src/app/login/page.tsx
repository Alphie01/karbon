"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Droplets, TrendingUp, BookOpen, Scale, Loader2, LogIn, ArrowRight, ShieldCheck } from "lucide-react";

type LoginFormData = {
    email: string;
    password: string;
};

const modules = [
    { icon: Leaf, label: "Karbon Ayak İzi", color: "text-emerald-400" },
    { icon: Droplets, label: "Su Ayak İzi", color: "text-blue-400" },
    { icon: TrendingUp, label: "Hibe & Teşvik", color: "text-rose-400" },
    { icon: BookOpen, label: "Akademi", color: "text-amber-400" },
    { icon: Scale, label: "Mevzuat", color: "text-purple-400" },
];

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (res?.error) {
            setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
            setIsLoading(false);
        } else {
            router.push("/corp/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950">
            {/* Left panel: branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 flex-col justify-between p-12">
                {/* Background glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-lg shadow-emerald-500/30">
                            EP
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                            Eco<span className="text-emerald-400">Pilot</span>
                        </span>
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                            Sürdürülebilirlik<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Yolculuğunuz Burada
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm">
                            Karbon, su, teşvik ve ESG süreçlerinizi tek platformdan yönetin.
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            {modules.map((mod, i) => (
                                <motion.div
                                    key={mod.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                                >
                                    <mod.icon size={18} className={mod.color} />
                                    <span className="text-sm font-medium text-slate-300">{mod.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom */}
                <div className="relative z-10 flex items-center gap-2 text-slate-500 text-xs">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>ISO 14064 & 14046 uyumlu · Güvenli bağlantı · 256-bit şifreleme</span>
                </div>
            </div>

            {/* Right panel: form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-lg shadow-emerald-500/30">
                            EP
                        </div>
                        <span className="text-xl font-bold text-white">
                            Eco<span className="text-emerald-400">Pilot</span>
                        </span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-sm"
                >
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Kurumsal Giriş</h1>
                        <p className="text-slate-400 text-sm">Platform hesabınıza güvenli erişim.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                                E-posta Adresi
                            </label>
                            <input
                                type="email"
                                placeholder="ad@sirket.com"
                                {...register("email", { required: "E-posta gereklidir." })}
                                className="w-full rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                                Şifre
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("password", { required: "Şifre gereklidir." })}
                                className="w-full rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-900/20 border border-red-800 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Güvenli Giriş Yap
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-sm text-slate-500">
                            Kurumsal hesabınız yok mu?{" "}
                            <Link
                                href="/request-access"
                                className="font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                            >
                                Erişim Talep Edin
                                <ArrowRight size={13} />
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            href="/"
                            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                        >
                            ← Ana Sayfaya Dön
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
