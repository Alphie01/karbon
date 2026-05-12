import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import FinanceChart from "@/components/crm/FinanceChart";

export const metadata: Metadata = {
    title: "Ön Muhasebe | CRM",
};

export default async function FinancePage() {
    const records = await prisma.financialRecord.findMany({ orderBy: { date: "desc" } });

    const totalIncome = records.filter((r) => r.type === "INCOME").reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter((r) => r.type === "EXPENSE").reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    const chartRecords = records.map((r) => ({
        type: r.type,
        amount: r.amount,
        date: r.date.toString(),
        category: r.category,
    }));

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Ön Muhasebe</h1>
                    <p className="text-sm text-slate-500">Gelir ve giderlerinizi takip edin.</p>
                </div>
                <Link href="/crm/finance/new" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-lg transition-colors">
                    <Plus size={15} /> Yeni İşlem
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex-shrink-0">
                        <ArrowUpCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Toplam Gelir</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{totalIncome.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg flex-shrink-0">
                        <ArrowDownCircle size={18} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Toplam Gider</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{totalExpense.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${balance >= 0 ? "bg-blue-50 dark:bg-blue-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`}>
                        {balance >= 0
                            ? <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                            : <TrendingDown size={18} className="text-amber-600 dark:text-amber-400" />
                        }
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Net Bakiye</p>
                        <p className={`text-lg font-bold ${balance >= 0 ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400"}`}>
                            {balance.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <FinanceChart income={totalIncome} expense={totalExpense} records={chartRecords} />

            {/* Transactions Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">İşlem Geçmişi</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-5 py-3 font-semibold">Tarih</th>
                                <th className="px-5 py-3 font-semibold">Tür</th>
                                <th className="px-5 py-3 font-semibold">Kategori</th>
                                <th className="px-5 py-3 font-semibold hidden md:table-cell">Açıklama</th>
                                <th className="px-5 py-3 font-semibold text-right">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-5 py-3 text-sm text-slate-500">
                                        {new Date(record.date).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${record.type === "INCOME"
                                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40"
                                            }`}>
                                            {record.type === "INCOME" ? "Gelir" : "Gider"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">{record.category}</td>
                                    <td className="px-5 py-3 text-sm text-slate-500 hidden md:table-cell max-w-[200px] truncate">{record.description}</td>
                                    <td className={`px-5 py-3 text-sm font-bold text-right ${record.type === "INCOME" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                        {record.type === "INCOME" ? "+" : "-"}{record.amount.toLocaleString("tr-TR", { style: "currency", currency: record.currency, maximumFractionDigits: 0 })}
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">Henüz finansal kayıt yok.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
