import { getInbox } from "@/lib/mail";
import MailInbox from "@/components/admin/MailInbox";
import { Mail, Settings } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "E-Posta Yönetimi | EcoPilot",
};

// Next.js config parameter to ensure it checks dynamically instead of caching
export const dynamic = "force-dynamic";

export default async function MailPage() {
    // Fetch initial emails server-side
    const emails = await getInbox(50);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 ">
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Mail className="text-brand-green" size={32} />
                    E-Posta Yönetimi
                </h1>
                <p className="text-slate-500 mt-2">
                    Gelen kutunuzu görüntüleyin ve kurumsal e-posta adreslerinizi yönetin.
                </p>
            </div>
            <div className="flex justify-end">
                <Link
                    href="/crm/mail/accounts"
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Settings size={16} /> Hesap Yönetimi
                </Link>
            </div>

            <MailInbox initialEmails={emails} />
        </div>
    );
}
