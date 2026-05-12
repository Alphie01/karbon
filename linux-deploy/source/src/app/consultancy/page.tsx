import { Leaf, Recycle, ShieldCheck, ArrowRight, Activity, TrendingUp, HandCoins, Workflow } from "lucide-react";
import Link from "next/link";

export default function ConsultPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">

            {/* Corporate Hero Section for Business Analysis & Grants */}
            <div className="relative bg-gradient-to-br from-brand-navy to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-slate-800 mt-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-sm font-semibold">
                            <Activity size={16} /> İş Analizi & Teşvikler
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Süreçlerinizi Optimize Edin, <span className="text-amber-500">Teşvikleri</span> Yakalayın
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                            Her iş sürecinizin karbon ve su ayak izini ölçün. Elde ettiğiniz verilerle yeşil dönüşüm yatırımlarınızı planlayın, hibe ve uluslararası teşvik programlarına şirketinizin uygunluğunu anında belgeleyin.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1">
                                <div className="text-amber-500 mb-2"><HandCoins size={24} /></div>
                                <h3 className="text-white font-semibold mb-1">Teşvik Uyumluluğu</h3>
                                <p className="text-sm text-slate-400">Verilerinizi yeşil hibe şartlarına göre hazırlayın ve raporlayın.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1">
                                <div className="text-brand-green mb-2"><TrendingUp size={24} /></div>
                                <h3 className="text-white font-semibold mb-1">Süreç İyileştirme</h3>
                                <p className="text-sm text-slate-400">Yüksek emisyonlu operasyonlarınızı tespit edip optimize edin.</p>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Graphic Illustration */}
                    <div className="hidden md:flex justify-center xl:justify-end">
                        <div className="relative w-full max-w-sm">
                            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-white font-bold">Yeşil Dönüşüm Başarısı</div>
                                    <div className="text-xs bg-brand-green/20 text-brand-green px-2 py-1 rounded">+24% Artış</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                                            <span>Tesis Modernizasyonu Kredisi</span>
                                            <span className="text-white">%85 Uyum</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                                            <span>Karbon Nötr Hibe Programı</span>
                                            <span className="text-white">%60 Uyum</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-green rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/login" className="mt-8 flex items-center justify-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition-colors text-sm">
                                    Size Özel Analiz İçin Giriş <ArrowRight size={16} />
                                </Link>
                            </div>

                            {/* Floating decorative elements */}
                            <div className="absolute -right-6 top-10 bg-brand-navy border border-brand-green/30 p-3 rounded-lg shadow-lg rotate-12 z-20">
                                <Workflow className="text-brand-green" size={24} />
                            </div>
                            <div className="absolute -left-6 bottom-10 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg shadow-lg -rotate-12 z-20 backdrop-blur-md">
                                <HandCoins className="text-amber-500" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
