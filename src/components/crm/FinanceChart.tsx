"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface FinanceChartProps {
    income: number;
    expense: number;
    records: { type: string; amount: number; date: string; category: string }[];
}

export default function FinanceChart({ income, expense, records }: FinanceChartProps) {
    const categoryTotals: Record<string, { income: number; expense: number }> = {};

    records.forEach((r) => {
        if (!categoryTotals[r.category]) categoryTotals[r.category] = { income: 0, expense: 0 };
        if (r.type === "INCOME") categoryTotals[r.category].income += r.amount;
        else categoryTotals[r.category].expense += r.amount;
    });

    const categories = Object.keys(categoryTotals).slice(0, 6);
    const incomeData = categories.map((c) => Math.round(categoryTotals[c].income));
    const expenseData = categories.map((c) => Math.round(categoryTotals[c].expense));

    const barOptions: ApexCharts.ApexOptions = {
        chart: { type: "bar", toolbar: { show: false }, background: "transparent", fontFamily: "inherit" },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 } },
        dataLabels: { enabled: false },
        grid: { borderColor: "#e2e8f0", strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
        colors: ["#059669", "#ef4444"],
        xaxis: { categories, labels: { style: { colors: "#94a3b8", fontSize: "11px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "11px" }, formatter: (v) => v.toLocaleString("tr-TR") } },
        legend: { position: "top", horizontalAlign: "left", labels: { colors: "#64748b" } },
        tooltip: { y: { formatter: (v) => v.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }) } },
        theme: { mode: "light" },
    };

    const donutOptions: ApexCharts.ApexOptions = {
        chart: { type: "donut", background: "transparent", fontFamily: "inherit" },
        colors: ["#059669", "#ef4444"],
        labels: ["Gelir", "Gider"],
        dataLabels: { enabled: false },
        legend: { position: "bottom", labels: { colors: "#64748b" } },
        plotOptions: { pie: { donut: { size: "70%", labels: { show: true, total: { show: true, label: "Net", color: "#0f172a", fontSize: "14px", fontWeight: "700", formatter: () => (income - expense).toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }) } } } } },
        tooltip: { y: { formatter: (v) => v.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }) } },
    };

    if (records.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Kategoriye Göre Dağılım</p>
                {categories.length > 0 ? (
                    <Chart type="bar" options={barOptions} series={[{ name: "Gelir", data: incomeData }, { name: "Gider", data: expenseData }]} height={220} width="100%" />
                ) : (
                    <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">Kategori verisi yok</div>
                )}
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Gelir / Gider Oranı</p>
                <div className="flex-1 flex items-center justify-center">
                    <Chart type="donut" options={donutOptions} series={[income, expense]} height={220} width="100%" />
                </div>
            </div>
        </div>
    );
}
