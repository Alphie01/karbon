import { getInbox } from "@/lib/mail";
import MailInbox from "@/components/admin/MailInbox";
import { Mail } from "lucide-react";

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
                    Gelen kutunuzu görüntüleyin ve tanımlı hesaptan e-posta gönderin.
                </p>
            </div>

            <MailInbox initialEmails={emails} />
        </div>
    );
}
