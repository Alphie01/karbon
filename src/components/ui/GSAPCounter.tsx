"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GSAPCounterProps {
    end: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    className?: string;
    duration?: number;
}

export default function GSAPCounter({ end, suffix = "", prefix = "", decimals = 0, className, duration = 1.8 }: GSAPCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obj = { val: 0 };
        const ctx = gsap.context(() => {
            gsap.to(obj, {
                val: end,
                duration,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
                onUpdate: () => {
                    el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
                },
            });
        });

        return () => ctx.revert();
    }, [end, suffix, prefix, decimals, duration]);

    return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
