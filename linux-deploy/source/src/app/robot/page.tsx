
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GrantRobot from "@/components/GrantRobot";

export default async function RobotPage() {
    const session = await auth();
    if (session?.user) {
        redirect("/corp/robot");
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-12 max-w-2xl">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Finansal <span className="text-rose-500">Çözümler</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    İşletmeniz için en uygun hibe, teşvik ve kredi fırsatlarını yapay zeka ile bulun.
                    Detaylı proje analizi ve başvuru asistanı için <a href="/login" className="text-rose-500 font-bold hover:underline">giriş yapın</a>.
                </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                <GrantRobot />
            </div>
        </div>
    );
}
