"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setAdminCompanyCookie(companyId: string) {
    const cookieStore = await cookies();
    if (companyId === "ALL") {
        cookieStore.delete("admin_company_id");
    } else {
        cookieStore.set("admin_company_id", companyId, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }

    // Yönlendirme yerine sadece revalidatePath kullanıyoruz
    // Bu sayede tüm sayfa güncellenip yeni verileri çekecektir.
    revalidatePath("/", "layout");
}
