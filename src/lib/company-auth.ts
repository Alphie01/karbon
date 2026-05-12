import { cookies } from "next/headers";

export async function getEffectiveCompanyId(user: any, searchParams?: { [key: string]: string | string[] | undefined }) {
    // 1. If user has a fixed companyId (Standard User / Company Admin), they MUST use it.
    if (user.companyId) {
        // Optional: If they try to access another company via param, clean it up or ignore.
        // For strict security, if param exists and != user.companyId, maybe warn or redirect?
        // But simply ignoring it and returning user.companyId is safe enough.
        return user.companyId;
    }

    // 2. If user is Super Admin (no companyId), check searchParams
    if (user.role === 'ADMIN' || user.roles?.includes('ADMIN') || user.roles?.includes('SUPER_ADMIN')) {
        const companyIdParam = searchParams?.companyId;

        if (typeof companyIdParam === 'string' && companyIdParam) {
            return companyIdParam;
        }

        // 3. Check admin_company_id cookie as fallback for global state
        const cookieStore = await cookies();
        const cookieCompanyId = cookieStore.get("admin_company_id")?.value;
        if (cookieCompanyId) {
            return cookieCompanyId;
        }

        // If Super Admin is viewing a page that REQUIRES a company context but none provided:
        // They might be on a general dashboard or we might need to redirect them to company selection.
        // For now, return null to indicate "Global Context" or "No specific company selected".
        return null;
    }

    return null;
}
