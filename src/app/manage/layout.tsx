import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PlatformShell from "@/components/admin/PlatformShell";
import ForceHidePublicNav from "@/components/ForceHidePublicNav";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Basic admin check
    if (!session) {
        redirect("/");
    }

    // Sadece SUPER_ADMIN'ler şirket değiştiriciyi görecek, o yüzden onlara şirketleri çekelim
    let companies: { id: string; name: string }[] = [];
    if (session.user.roles?.includes("SUPER_ADMIN")) {
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
            <PlatformShell user={session.user} companies={companies} currentCompanyId={currentCompanyId}>
                {children}
            </PlatformShell>
        </>
    );
}
