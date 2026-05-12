import { prisma } from "@/lib/prisma";
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ön Muhasebe | CRM",
};

export default async function FinancePage() {
    const records = await prisma.financialRecord.findMany({
        orderBy: {
            date: 'desc'
        }
    });

    const totalIncome = records.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Wallet /> Ön Muhasebe
                    </h1>
                    <p className="text-slate-500 text-sm">Gelir ve giderlerinizi takip edin.</p>
                </div>
                <Link href="//crm/finance/new" className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
                    <Plus size={18} /> Yeni İşlem Ekle
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ArrowUpCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Toplam Gelir</p>
                        <h3 className="text-2xl font-bold text-slate-800">{totalIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <ArrowDownCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Toplam Gider</p>
                        <h3 className="text-2xl font-bold text-slate-800">{totalExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${balance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        {balance >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Net Bakiye</p>
                        <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                            {balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                            <th className="p-4 font-semibold">Tarih</th>
                            <th className="p-4 font-semibold">Türü</th>
                            <th className="p-4 font-semibold">Kategori</th>
                            <th className="p-4 font-semibold">Açıklama</th>
                            <th className="p-4 font-semibold text-right">Tutar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-500 text-sm">
                                    {new Date(record.date).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${record.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.type === 'INCOME' ? 'Gelir' : 'Gider'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-800 font-medium">
                                    {record.category}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {record.description}
                                </td>
                                <td className={`p-4 font-bold text-right ${record.type === 'INCOME' ? 'text-green-700' : 'text-red-700'}`}>
                                    {record.type === 'INCOME' ? '+' : '-'}{record.amount.toLocaleString('tr-TR', { style: 'currency', currency: record.currency })}
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                                    Henüz finansal kayıt bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
