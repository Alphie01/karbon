"use server";

import { auth } from "@/auth";
import { sendEmail, getInbox, markAsRead, deleteEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function sendMailAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) {
        return { success: false, error: "Yetkisiz erişim" };
    }

    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!to || !subject || !message) {
        return { success: false, error: "Lütfen tüm alanları doldurun" };
    }

    // Convert newlines to breaks for basic HTML
    const html = message.replace(/\n/g, "<br>");

    const res = await sendEmail(to, subject, html);

    if (res.success) {
        revalidatePath("/manage/crm/mail");
        return { success: true };
    } else {
        return { success: false, error: res.error };
    }
}

export async function fetchInboxAction() {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) {
        return { success: false, error: "Yetkisiz erişim", emails: [] };
    }

    // Fetch last 50 emails
    const emails = await getInbox(50);
    return { success: true, emails };
}

export async function markEmailReadAction(uid: number) {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) return { success: false };

    const res = await markAsRead(uid);
    if (res.success) revalidatePath("/manage/crm/mail");
    return res;
}

export async function deleteEmailAction(uid: number) {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) return { success: false };

    const res = await deleteEmail(uid);
    if (res.success) revalidatePath("/manage/crm/mail");
    return res;
}

export async function getMailAccountsAction() {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) return { success: false, accounts: [] };

    const accounts = await prisma.mailAccount.findMany({
        orderBy: { email: "asc" }
    });
    return { success: true, accounts };
}

export async function createMailAccountAction(email: string, username: string) {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) return { success: false, error: "Yetkisiz erişim" };

    try {
        // 1. Create on VPS
        // Note: This assumes the app is running on the VPS with enough permissions or sudoers set up.
        // For now, we'll try to create the system user.
        await execPromise(`sudo useradd -m -s /bin/bash ${username}`);

        // 2. Save to DB
        const account = await prisma.mailAccount.create({
            data: { email, username }
        });

        revalidatePath("/manage/crm/mail/accounts");
        return { success: true, account };
    } catch (error: any) {
        console.error("Mail Account Creation Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteMailAccountAction(id: string, username: string) {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) return { success: false, error: "Yetkisiz erişim" };

    try {
        // 1. Delete from VPS
        await execPromise(`sudo userdel -r ${username}`);

        // 2. Delete from DB
        await prisma.mailAccount.delete({
            where: { id }
        });

        revalidatePath("/manage/crm/mail/accounts");
        return { success: true };
    } catch (error: any) {
        console.error("Mail Account Deletion Error:", error);
        return { success: false, error: error.message };
    }
}

export async function changeMailPasswordAction(username: string, newPassword: string) {
    const session = await auth();
    if (!session?.user?.roles?.includes("SUPER_ADMIN")) return { success: false, error: "Yetkisiz erişim" };

    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: "Şifre en az 6 karakter olmalıdır" };
    }

    try {
        // Use chpasswd which is more automation-friendly
        // Command: echo "user:pass" | sudo chpasswd
        const escapedPassword = newPassword.replace(/"/g, '\\"');
        await execPromise(`echo "${username}:${escapedPassword}" | sudo chpasswd`);

        return { success: true };
    } catch (error: any) {
        console.error("Mail Password Change Error:", error);
        return { success: false, error: error.message };
    }
}
