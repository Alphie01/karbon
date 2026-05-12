"use client";

import { useRouter } from "next/navigation";
import { setAdminCompanyCookie } from "@/app/actions/cookie";

interface Company {
    id: string;
    name: string;
}

interface Props {
    companies: Company[];
    currentCompanyId: string;
}

export default function CompanySwitcher({ companies, currentCompanyId }: Props) {
    const router = useRouter();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        await setAdminCompanyCookie(value);
        router.refresh(); // Sadece emin olmak için UI'ı yenile
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline-block">
                Firma:
            </span>
            <select
                value={currentCompanyId}
                onChange={handleChange}
                className="bg-slate-100 min-w-[200px] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-green transition-all"
            >
                <option value="ALL" className="font-bold">Tüm Firmalar</option>
                <optgroup label="Kayıtlı Firmalar">
                    {companies.map(company => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </optgroup>
            </select>
        </div>
    );
}
