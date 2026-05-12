"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    angle?: number;
    spinSpeed?: number;
}

interface ParticleBackgroundProps {
    type?: "carbon" | "water";
    count?: number;
}

export default function ParticleBackground({ type = "carbon", count = 30 }: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Colors based on type
        const getColors = () => {
            if (type === "carbon") {
                // Grays, blacks, dark slates for carbon
                return ["#1e293b", "#334155", "#475569", "#64748b", "#0f172a"];
            } else {
                // Blues for water
                return ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb", "#1d4ed8"];
            }
        };

        const colors = getColors();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    // Carbon particles are usually larger, water can be varied
                    size: type === "water" ? Math.random() * 8 + 4 : Math.random() * 12 + 6,
                    // Water flows a bit faster downwards, carbon floats around
                    speedX: type === "water" ? Math.random() * 1 - 0.5 : Math.random() * 0.5 - 0.25,
                    speedY: type === "water" ? Math.random() * 1.5 + 0.5 : Math.random() * 1 - 0.5,
                    opacity: Math.random() * 0.4 + 0.1,
                    angle: Math.random() * Math.PI * 2,
                    spinSpeed: (Math.random() - 0.5) * 0.05
                });
            }
        };

        const drawHexagon = (p: Particle) => {
            if (!ctx) return;
            ctx.save();
            ctx.translate(p.x, p.y);
            // Spin effect for carbon
            if (p.angle !== undefined && p.spinSpeed !== undefined) {
                p.angle += p.spinSpeed;
                ctx.rotate(p.angle);
            }

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = p.size * Math.cos(angle);
                const y = p.size * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            ctx.fillStyle = colors[Math.floor((p.opacity * Number.MAX_SAFE_INTEGER) % colors.length)];
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.restore();
        };

        const drawDroplet = (p: Particle) => {
            if (!ctx) return;
            ctx.save();
            ctx.translate(p.x, p.y);

            ctx.beginPath();
            // Simple water drop shape
            ctx.moveTo(0, -p.size);
            ctx.bezierCurveTo(p.size, p.size / 2, p.size, p.size, 0, p.size);
            ctx.bezierCurveTo(-p.size, p.size, -p.size, p.size / 2, 0, -p.size);
            ctx.closePath();

            ctx.fillStyle = colors[Math.floor((p.opacity * Number.MAX_SAFE_INTEGER) % colors.length)];
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.restore();
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges
                if (p.x < -p.size) p.x = canvas.width + p.size;
                if (p.x > canvas.width + p.size) p.x = -p.size;
                if (p.y < -p.size) p.y = canvas.height + p.size;
                if (p.y > canvas.height + p.size) {
                    p.y = -p.size;
                    p.x = Math.random() * canvas.width; // Randomize X when falling from top
                }

                if (type === "carbon") {
                    drawHexagon(p);
                } else {
                    drawDroplet(p);
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [type, count]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1]"
            style={{ opacity: 0.6 }}
        />
    );
}
