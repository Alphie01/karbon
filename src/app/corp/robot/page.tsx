import { auth } from "@/auth";
import RobotClient from "@/app/manage/robot/RobotClient";
import { getEffectiveCompanyId } from "@/lib/company-auth";

export default async function CorpRobotPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const companyId = await getEffectiveCompanyId(user, searchParams);

    if (!companyId) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <p className="text-slate-500">Lütfen analiz yapmak için bir şirket seçiniz.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Akıllı Hibe & Teşvik Robotu</h1>
                    <p className="text-sm text-slate-500">Karbon ve Su verilerinizi analiz ederek size özel hibeleri bulun.</p>
                </div>
            </div>

            <RobotClient companyId={companyId} />
        </div>
    );
}
