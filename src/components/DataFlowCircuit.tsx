"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Pre-define some circuit paths (M = move to, L = line to, H = horizontal line, V = vertical line)
const paths = [
    "M 0 20 H 30 V 50 H 100",
    "M 10 90 V 60 H 40 V 20 H 80",
    "M 100 80 H 70 V 40 H 20",
    "M 50 0 V 30 H 80 V 70 H 100",
    "M 0 60 H 20 V 80 H 60 V 100",
    "M 90 100 V 70 H 60 V 40 H 90 V 0",
];

// Interface for randomly generated glow data
interface GlowAnimationProps {
    duration: number;
    delay: number;
}

export default function DataFlowCircuit() {
    const [mounted, setMounted] = useState(false);
    const [glowAnimations, setGlowAnimations] = useState<GlowAnimationProps[]>([]);

    useEffect(() => {
        // Generate random animation values only on the client side
        const animations = paths.map(() => ({
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
        // eslint-disable-next-line
        setGlowAnimations(animations);
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-[1] select-none overflow-hidden opacity-30 dark:opacity-40">
            {/* We create a grid of these SVG circuits to cover the screen */}
            {Array.from({ length: 9 }).map((_, gridIndex) => (
                <div
                    key={`grid-${gridIndex}`}
                    className="absolute"
                    style={{
                        width: '33vw',
                        height: '33vh',
                        left: `${(gridIndex % 3) * 33.33}vw`,
                        top: `${Math.floor(gridIndex / 3) * 33.33}vh`,
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Static circuit lines */}
                        {paths.map((d, i) => (
                            <path
                                key={`path-${gridIndex}-${i}`}
                                d={d}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.2"
                                className="text-emerald-500/30 dark:text-emerald-400/20"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}

                        {/* Animated glowing lines (data flow) */}
                        {paths.map((d, i) => (
                            <motion.path
                                key={`glow-path-${gridIndex}-${i}`}
                                d={d}
                                fill="none"
                                stroke="url(#cyan-glow)"
                                strokeWidth="0.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="filter drop-shadow-[0_0_3px_rgba(6,182,212,0.8)]"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 1],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: glowAnimations[i]?.duration || 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: glowAnimations[i]?.delay || 0,
                                }}
                            />
                        ))}

                        {/* Glowing Nodes (connection points) */}
                        <circle cx="30" cy="20" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="30" cy="50" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="10" cy="60" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="40" cy="60" r="1.5" className="fill-cyan-400/40" />
                        <circle cx="40" cy="20" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="80" cy="20" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="70" cy="80" r="1.5" className="fill-cyan-400/40" />
                        <circle cx="70" cy="40" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="80" cy="30" r="1.5" className="fill-cyan-400/40" />
                        <circle cx="80" cy="70" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="20" cy="60" r="1.5" className="fill-cyan-400/40" />
                        <circle cx="20" cy="80" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="60" cy="80" r="1.5" className="fill-cyan-400/40" />
                        <circle cx="60" cy="70" r="1.5" className="fill-emerald-400/40" />
                        <circle cx="60" cy="40" r="1.5" className="fill-cyan-400/40" />

                        {/* Pulsing Nodes */}
                        <motion.circle cx="30" cy="50" r="2" className="fill-cyan-400" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                        <motion.circle cx="70" cy="40" r="2" className="fill-cyan-400" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />
                        <motion.circle cx="40" cy="20" r="2" className="fill-emerald-400" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
                        <motion.circle cx="60" cy="70" r="2" className="fill-emerald-400" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }} />

                        <defs>
                            <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            ))}
        </div>
    );
}
