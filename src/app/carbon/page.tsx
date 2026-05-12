import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PersonalCarbonCalculator from "@/components/PersonalCarbonCalculator";
import InfoWidget from "@/components/ui/InfoWidget";
import { Leaf, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function CarbonPage() {
    const session = await auth();
    if (session?.user) {
        redirect("/corp/carbon");
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Page Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <Leaf size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            Karbon Ayak İzi
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        Karbon Ayak İzinizi Ölçün
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-6">
                        Bireysel etkinizi hemen ücretsiz hesaplayın. Kurumsal raporlama, Kapsam 1/2/3 analizi ve detaylı ISO 14064 uyumlu ölçümler için giriş yapın.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            Kurumsal Giriş <ArrowRight size={14} />
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            ISO 14064 Uyumlu Hesaplama
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PersonalCarbonCalculator />
                    </div>
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24">
                            <InfoWidget type="carbon" />
                        </div>
                    </div>
                </div>
                <div className="mt-6 lg:hidden">
                    <InfoWidget type="carbon" />
                </div>
            </div>

        </div>
    );
}
