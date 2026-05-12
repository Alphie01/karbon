import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X, Loader2, LogIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import clsx from "clsx";
import UserNavDropdown from "./UserNavDropdown";

export default function GlobalHeader({ session }: { session?: any }) {
    const { language, setLanguage, t } = useLanguage();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(t.common.error);
            setIsLoading(false);
        } else {
            router.push("/manage"); // Redirect to admin/management panel
            router.refresh();
            setIsLoginOpen(false);
            setIsLoading(false);
        }
    }

    return (
        <header id="global-header" className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
            <div className="container mx-auto px-4 h-12 flex items-center justify-between">

                {/* Left: Logo & Brand */}
                <Link href="/home" className="flex items-center gap-2 group">
                    {/* Logo Image without dark background container */}
                    <div className="relative h-7 w-auto group-hover:scale-105 transition-transform">
                        <img src="/logo.png" alt="EcoPilot" className="h-full w-auto object-contain" />
                    </div>
                    <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight hidden sm:block">
                        Eco<span className="text-brand-green">Pilot</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setLanguage("tr")}
                            className={clsx(
                                "px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded shadow-sm transition-all",
                                language === "tr"
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            TR
                        </button>
                        <button
                            onClick={() => setLanguage("en")}
                            className={clsx(
                                "px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded shadow-sm transition-all",
                                language === "en"
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            EN
                        </button>
                    </div>



                    <div className="relative">
                        {session?.user ? (
                            <UserNavDropdown user={session.user} hideNameOnMobile={true} />
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg"
                                >
                                    <LogIn size={14} />
                                    <span className="hidden sm:inline">{t.common.login}</span>
                                </button>

                                {/* Login Popover */}
                                {isLoginOpen && (
                                    <div className="absolute right-0 top-full mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t.common.login}</h3>
                                            <button onClick={() => setIsLoginOpen(false)} className="text-slate-400 hover:text-slate-500">
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.common.email}</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    placeholder="ad@sirket.com"
                                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-green outline-none transition-all placeholder:font-normal"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.common.password}</label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-green outline-none transition-all placeholder:font-normal"
                                                />
                                            </div>

                                            {error && (
                                                <div className="text-red-600 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-lg font-medium">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-3 bg-brand-green hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20"
                                            >
                                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : t.common.secureLogin}
                                            </button>
                                        </form>

                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                                            <p className="text-xs text-slate-400 font-medium">
                                                Hesabınız yok mu?{" "}
                                                <Link href="/request-access" onClick={() => setIsLoginOpen(false)} className="text-brand-green hover:underline">
                                                    Erişim Talep Edin
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
