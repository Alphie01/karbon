
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RobotClient from "./RobotClient";

export default async function RobotPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");
    if (!session.user.companyId) return <div className="p-8">Şirket kaydı bulunamadı.</div>;

    return (
        <div className="max-w-[1400px] mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Akıllı Hibe & Teşvik Robotu</h1>
                    <p className="text-sm text-slate-500">Firmanızın verilerini analiz ederek en uygun projeleri bulun ve yazdırın.</p>
                </div>
            </div>

            <RobotClient companyId={session.user.companyId} />
        </div>
    );
}
