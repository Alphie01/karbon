import { BookOpen, FileVideo, ChevronRight, GraduationCap, Leaf, Globe } from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 py-12 px-4">
            {/* Corporate Hero Section */}
            <div className="relative bg-gradient-to-br from-brand-navy to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm font-semibold">
                            <GraduationCap size={16} /> Kurumsal Eğitim Portalı
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Geleceği İnşa Eden <span className="text-brand-green">Sürdürülebilirlik</span> Akademisi
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                            İşletmenizin çevresel dönüşüm yolculuğunda ihtiyaç duyduğunuz tüm teorik ve pratik bilgelik. Karbon nötr hedeflerinden su ayak izi yönetimine, personelinizin yetkinliğini artırmak için özel olarak tasarlanmış eğitim programları.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Leaf className="text-brand-green" size={18} /> Çevre Bilinci
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Globe className="text-blue-400" size={18} /> Global Standartlar
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <FileVideo className="text-purple-400" size={18} /> İnteraktif Modüller
                            </div>
                        </div>
                        <div className="pt-4">
                            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-green/20">
                                İçerikleri Görmek İçin Giriş Yap <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <div className="space-y-4 translate-y-8">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-40 flex flex-col justify-end">
                                <div className="text-brand-green font-bold text-3xl mb-1">50+</div>
                                <div className="text-slate-300 text-sm font-medium">Özel Eğitim Modülü</div>
                            </div>
                            <div className="bg-brand-green/20 backdrop-blur-md border border-brand-green/20 p-6 rounded-2xl h-48 flex flex-col justify-end">
                                <div className="text-white font-bold text-2xl mb-2">Karbon Azaltımı</div>
                                <p className="text-brand-green text-xs">Uygulamalı stratejilerle kurum içi farkındalık.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/20 p-6 rounded-2xl h-48 flex flex-col justify-end">
                                <div className="text-white font-bold text-2xl mb-2">Su Yönetimi</div>
                                <p className="text-blue-300 text-xs">Su kaynaklı riskleri anlama ve proaktif çözümler.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-40 flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center mb-3 text-brand-green">
                                    <BookOpen size={20} />
                                </div>
                                <div className="text-white font-medium">Sertifikalı Gelişim</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
