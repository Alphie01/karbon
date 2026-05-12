
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PersonalWaterCalculator from "@/components/PersonalWaterCalculator";
import ParticleBackground from "@/components/ui/ParticleBackground";
import InfoWidget from "@/components/ui/InfoWidget";

export default async function WaterPage() {
    const session = await auth();
    if (session?.user) {
        redirect("/corp/water");
    }

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
            <ParticleBackground type="water" count={50} />

            <div className="text-center mb-12 max-w-2xl relative z-10">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Su Ayak İzinizi <span className="text-blue-500">Ölçün</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Bireysel su tüketiminizi hesaplayın.
                    Endüstriyel analiz ve raporlama için <a href="/login" className="text-blue-500 font-bold hover:underline">giriş yapın</a>.
                </p>
            </div>

            <div className="max-w-[1050px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3 relative z-10">
                <div className="lg:col-span-2 space-y-6 lg:pr-4">
                    <PersonalWaterCalculator />
                </div>

                <div className="lg:col-span-1 hidden lg:block sticky top-24 self-start">
                    <InfoWidget type="water" />
                </div>
            </div>

            <div className="mt-8 lg:hidden max-w-4xl w-full mx-auto">
                <InfoWidget type="water" />
            </div>
        </div>
    );
}
