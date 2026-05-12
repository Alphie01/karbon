"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LeadStatusChartProps {
    statusCounts: Record<string, number>;
}

const STATUS_LABELS: Record<string, string> = {
    NEW: "Yeni",
    CONTACTED: "İletişim",
    PROPOSAL: "Teklif",
    WON: "Kazanıldı",
    LOST: "Kaybedildi",
};

const STATUS_COLORS: Record<string, string> = {
    NEW: "#059669",
    CONTACTED: "#3b82f6",
    PROPOSAL: "#f59e0b",
    WON: "#10b981",
    LOST: "#ef4444",
};

export default function LeadStatusChart({ statusCounts }: LeadStatusChartProps) {
    const keys = Object.keys(statusCounts).filter((k) => statusCounts[k] > 0);
    const values = keys.map((k) => statusCounts[k]);
    const labels = keys.map((k) => STATUS_LABELS[k] || k);
    const colors = keys.map((k) => STATUS_COLORS[k] || "#94a3b8");
    const total = values.reduce((a, b) => a + b, 0);

    const options: ApexCharts.ApexOptions = {
        chart: { type: "donut", background: "transparent", fontFamily: "inherit" },
        colors,
        labels,
        dataLabels: { enabled: false },
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: "72%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Toplam",
                            color: "#64748b",
                            fontSize: "12px",
                            formatter: () => total.toString(),
                        },
                    },
                },
            },
        },
        stroke: { width: 0 },
        tooltip: { y: { formatter: (v) => `${v} lead` } },
    };

    if (total === 0) return null;

    return (
        <div>
            <Chart type="donut" options={options} series={values} height={180} width="100%" />
            <div className="space-y-1 mt-2">
                {keys.map((k, i) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
                            <span className="text-slate-500 dark:text-slate-400">{labels[i]}</span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{values[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
