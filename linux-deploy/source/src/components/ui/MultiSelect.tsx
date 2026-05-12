"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

interface MultiSelectProps {
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export default function MultiSelect({ options, selected, onChange, placeholder = "Seçiniz" }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (value === "ALL") {
            if (selected.includes("ALL")) {
                onChange([]);
            } else {
                onChange(["ALL"]); // "ALL" seçilince diğerlerini temizler veya sadece ALL kalır
            }
            return;
        }

        let newSelected = [...selected];

        // Eğer "ALL" seçiliyse ve başka bir şey seçilirse "ALL" kaldır
        if (newSelected.includes("ALL")) {
            newSelected = newSelected.filter(item => item !== "ALL");
        }

        if (newSelected.includes(value)) {
            newSelected = newSelected.filter(item => item !== value);
        } else {
            newSelected.push(value);
        }

        onChange(newSelected);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 text-xs border rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[34px]"
            >
                <div className="flex flex-wrap gap-1">
                    {selected.length > 0 ? (
                        selected.map(val => {
                            const opt = options.find(o => o.value === val);
                            return (
                                <span key={val} className="bg-brand-navy/10 dark:bg-brand-green/20 text-brand-navy dark:text-brand-green px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    {opt?.label || val}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-slate-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={14} className="text-slate-400 opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-64 z-50 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {options.map((option) => {
                        const isSelected = selected.includes(option.value);
                        return (
                            <div
                                key={option.value}
                                onClick={() => toggleOption(option.value)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-brand-green border-brand-green text-white" : "border-slate-300 dark:border-slate-600"}`}>
                                    {isSelected && <Check size={10} />}
                                </div>
                                <span>{option.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
