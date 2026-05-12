"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export function IoTTicker({ baseDraw, unit }: { baseDraw: number, unit: string }) {
    const [current, setCurrent] = useState(baseDraw);

    useEffect(() => {
        // Update the value slightly every 3 seconds to simulate live data
        const interval = setInterval(() => {
            const variance = baseDraw * 0.05; // 5% variance
            const shift = (Math.random() * (variance * 2)) - variance;
            setCurrent(baseDraw + shift);
        }, 3000);

        return () => clearInterval(interval);
    }, [baseDraw]);

    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800 text-sm font-mono mr-2">
            <Zap size={14} className="animate-pulse" />
            {current.toFixed(2)} {unit}
        </div>
    );
}
