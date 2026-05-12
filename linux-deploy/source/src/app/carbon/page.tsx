
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PersonalCarbonCalculator from "@/components/PersonalCarbonCalculator";
import ParticleBackground from "@/components/ui/ParticleBackground";
import InfoWidget from "@/components/ui/InfoWidget";

export default async function CarbonPage() {
    const session = await auth();
    if (session?.user) {
        redirect("/corp/carbon");
    }

    // Pure landing page / personal calculator
    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
            <ParticleBackground type="carbon" count={40} />

            <div className="text-center mb-12 max-w-2xl relative z-10">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Karbon Ayak İzinizi <span className="text-brand-green">Ölçün</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Bireysel etkinizi hemen şimdi ücretsiz hesaplayın.
                    Kurumsal raporlama ve detaylı analiz için <a href="/login" className="text-brand-green font-bold hover:underline">giriş yapın</a>.
                </p>
            </div>

            <div className="max-w-[1050px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3 relative z-10">
                <div className="lg:col-span-2 space-y-6 lg:pr-4">
                    <PersonalCarbonCalculator />
                </div>

                <div className="lg:col-span-1 hidden lg:block sticky top-24 self-start">
                    <InfoWidget type="carbon" />
                </div>
            </div>

            <div className="mt-8 lg:hidden max-w-4xl w-full mx-auto">
                <InfoWidget type="carbon" />
            </div>
        </div>
    );
}
