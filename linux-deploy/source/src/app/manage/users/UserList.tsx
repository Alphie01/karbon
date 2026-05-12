"use client";

import { useState } from "react";
import { Users, Filter } from "lucide-react";
import UserRow from "./UserRow";

interface Company {
    id: string;
    name: string;
}

interface UserListProps {
    users: any[];
    companies: Company[];
}

export default function UserList({ users, companies }: UserListProps) {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("ALL");

    const filteredUsers = selectedCompanyId === "ALL"
        ? users
        : users.filter(user => user.companyId === selectedCompanyId);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="text-brand-navy dark:text-brand-green" /> Kayıtlı Kullanıcılar
                </h2>

                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500" />
                    <select
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-navy"
                    >
                        <option value="ALL">Tüm Firmalar</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Kullanıcı</th>
                        <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Firma</th>
                        <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Roller</th>
                        <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Erişim</th>
                        <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Durum</th>
                        <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((user) => (
                        <UserRow key={user.id} user={user} companies={companies} />
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">Bu kriterlere uygun kullanıcı bulunamadı.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
