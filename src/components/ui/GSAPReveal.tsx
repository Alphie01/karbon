"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GSAPRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    duration?: number;
}

export default function GSAPReveal({ children, className, delay = 0, y = 20, duration = 0.5 }: GSAPRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.from(el, {
                opacity: 0,
                y,
                duration,
                delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });
        });

        return () => ctx.revert();
    }, [delay, y, duration]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
