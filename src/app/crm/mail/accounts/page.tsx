import MailAccountList from "@/components/admin/MailAccountList";
import { ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "E-Posta Hesap Yönetimi | EcoPilot",
};

export const dynamic = "force-dynamic";

export default async function MailAccountsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/crm/mail" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Shield className="text-blue-500" size={32} />
                            Hesap Yönetimi
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Kurumsal e-posta hesaplarını oluşturun ve servis ayarlarını görüntüleyin.
                        </p>
                    </div>
                </div>
            </div>

            <MailAccountList />
        </div>
    );
}
