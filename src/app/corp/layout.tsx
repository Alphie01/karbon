import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CorpShell from "@/components/corp/CorpShell";
import ForceHidePublicNav from "@/components/ForceHidePublicNav";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function CorpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/login");
    }

    const isSuperAdmin = (user as any).roles?.includes("SUPER_ADMIN");

    if (!user.companyId && !isSuperAdmin) {
        // Fallback for users without company (e.g. pending approval or error)
        // For now redirect to home or show error
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Erişim Hatası</h1>
                    <p>Bu alana sadece kurumsal hesaplar erişebilir.</p>
                </div>
            </div>
        );
    }

    let companies: { id: string; name: string }[] = [];
    if (isSuperAdmin) {
        companies = await prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
    }

    const cookieStore = await cookies();
    const currentCompanyId = cookieStore.get("admin_company_id")?.value || "ALL";

    return (
        <>
            <style>{`
                #global-header, #public-sidebar { display: none !important; }
            `}</style>
            <ForceHidePublicNav />
            <CorpShell user={user} companies={companies} currentCompanyId={currentCompanyId}>
                {children}
            </CorpShell>
        </>
    );
}
