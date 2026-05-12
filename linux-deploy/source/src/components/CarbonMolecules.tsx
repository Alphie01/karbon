"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Type interface for a molecule
interface Molecule {
    id: number;
    size: number;
    startX: string;
    startY: string;
    moveX: string;
    moveY: string;
    duration: number;
    delay: number;
    glow: string;
}

export default function CarbonMolecules() {
    const [mounted, setMounted] = useState(false);
    const [molecules, setMolecules] = useState<Molecule[]>([]);

    useEffect(() => {
        // Generate molecules only on the client side to avoid hydration mismatch
        const generatedMolecules = Array.from({ length: 15 }).map((_, i) => ({
            id: i + 1,
            size: Math.random() * 30 + 20, // 20px to 50px
            startX: `${Math.random() * 100}vw`,
            startY: `${Math.random() * 100}vh`,
            moveX: `${(Math.random() - 0.5) * 50}vw`, // Move randomly up to 25vw left/right
            moveY: `${(Math.random() - 0.5) * 50}vh`, // Move randomly up to 25vh up/down
            duration: Math.random() * 20 + 20, // 20s to 40s
            delay: Math.random() * -20, // Random start time
            glow: ["from-emerald-400 to-cyan-500", "from-blue-500 to-purple-500", "from-brand-green to-emerald-400"][Math.floor(Math.random() * 3)],
        }));
        // eslint-disable-next-line
        setMolecules(generatedMolecules);
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[0] select-none overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
            {/* Glowing Auras */}
            {molecules.map((m) => (
                <motion.div
                    key={`glow-${m.id}`}
                    className={`absolute rounded-full blur-[40px] opacity-40 bg-gradient-to-r ${m.glow}`}
                    style={{ width: m.size * 3, height: m.size * 3, left: m.startX, top: m.startY }}
                    animate={{
                        x: [0, m.moveX, 0],
                        y: [0, m.moveY, 0],
                        scale: [1, 1.5, 0.8, 1],
                    }}
                    transition={{
                        duration: m.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: m.delay,
                    }}
                />
            ))}

            {/* Solid Shapes */}
            {molecules.map((m) => (
                <motion.div
                    key={`shape-${m.id}`}
                    className="absolute flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    style={{ width: m.size, height: m.size, left: m.startX, top: m.startY }}
                    animate={{
                        x: [0, m.moveX, 0],
                        y: [0, m.moveY, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: m.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: m.delay,
                    }}
                >
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500/80 dark:text-emerald-400/80">
                        {/* Carbon molecule structure */}
                        <circle cx="50" cy="50" r="14" fill="currentColor" />

                        <circle cx="20" cy="20" r="8" fill="currentColor" />
                        <circle cx="80" cy="20" r="8" fill="currentColor" />
                        <circle cx="20" cy="80" r="8" fill="currentColor" />
                        <circle cx="80" cy="80" r="8" fill="currentColor" />

                        <line x1="50" y1="50" x2="20" y2="20" className="opacity-80" strokeWidth="3" />
                        <line x1="50" y1="50" x2="80" y2="20" className="opacity-80" strokeWidth="3" />
                        <line x1="50" y1="50" x2="20" y2="80" className="opacity-80" strokeWidth="3" />
                        <line x1="50" y1="50" x2="80" y2="80" className="opacity-80" strokeWidth="3" />

                        {/* Decorative floating dots around the molecule */}
                        <motion.circle cx="5" cy="50" r="4" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                        <motion.circle cx="95" cy="50" r="4" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
                        <motion.circle cx="50" cy="5" r="4" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                        <motion.circle cx="50" cy="95" r="4" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
