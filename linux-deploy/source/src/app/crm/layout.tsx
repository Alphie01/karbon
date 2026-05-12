import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ForceHidePublicNav from "@/components/ForceHidePublicNav";
import CRMShell from "@/components/crm/CRMShell";

export default async function CRMLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const roles = (session?.user as any)?.roles || "";

    if (!roles.includes("SUPER_ADMIN") && !roles.includes("CRM")) {
        redirect("/access-denied");
    }

    // Fetch companies for the Super Admin switcher
    const companies = await prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });

    const cookieStore = await cookies();
    const currentCompanyId = cookieStore.get("admin_company_id")?.value || "ALL";

    return (
        <>
            <style>{`
                #global-header, #public-sidebar { display: none !important; }
            `}</style>
            <ForceHidePublicNav />
            <CRMShell user={session?.user} companies={companies} currentCompanyId={currentCompanyId}>
                {children}
            </CRMShell>
        </>
    );
}
