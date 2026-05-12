import { Scale, FileText, Search, Bookmark, ExternalLink, Library, Users, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LegislationPage() {
    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 py-12 px-4">
            {/* Corporate Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-900 via-slate-900 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold">
                            <Scale size={16} /> Mevzuat ve Çevre Standartları
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Yasal Uyum ve <span className="text-purple-400">Güncel Bilgi</span> Kütüphanesi
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                            Kurumunuzun çevresel yasalara ve global standartlara tam uyum sağlaması için gerekli olan tüm yönetmeliklere tek bir noktadan erişin. Sektörel değişiklikleri anında takip edin ve uyarılarla riskleri minimuma indirin.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 text-sm text-purple-200">
                                <ShieldCheck size={18} className="text-purple-400" /> %100 Yasal Uyum
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 text-sm text-purple-200">
                                <Library size={18} className="text-purple-400" /> Sektörel Arşiv
                            </div>
                        </div>
                        <div className="pt-4">
                            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-600/20">
                                Platforma Tam Erişim İçin Giriş Yap <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:flex justify-end relative">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/20 rounded-2xl blur-xl transform rotate-3"></div>
                            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">Çevre Mühendisleri Forumu</div>
                                            <div className="text-xs text-purple-400">Canlı Destek Ağı</div>
                                        </div>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                        <div className="text-xs text-slate-400 mb-1">Ali Yılmaz (Kıdemli Müh.)</div>
                                        <div className="text-sm text-slate-200">Karbon Vergisi taslağı hakkında yeni güncellemeyi inceleyen var mı?</div>
                                    </div>
                                    <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30 ml-6">
                                        <div className="text-xs text-purple-300 mb-1">Ayşe Demir (Çevre Yön.)</div>
                                        <div className="text-sm text-slate-200">Evet, 3. madde ihracat yapan firmalar için kritik. Yorumlarımı kütüphaneye ekledim.</div>
                                    </div>
                                </div>
                                <Link href="/login" className="flex justify-center w-full py-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white rounded-lg text-sm font-medium">Foruma Katıl</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
