// components/auth/LoginConstellation.tsx

"use client";

import { useEffect, useRef } from "react";

const NUM_STARS = 220;

interface Star {
    x: number;
    y: number;
    radius: number;
    baseOpacity: number;
    opacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    twinkleAmplitude: number;
}

export default function LoginConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            starsRef.current = Array.from({ length: NUM_STARS }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.4 + 0.2,
                baseOpacity: Math.random() * 0.4 + 0.05,
                opacity: 0,
                twinkleSpeed: Math.random() * 0.025 + 0.003,
                twinkleOffset: Math.random() * Math.PI * 2,
                twinkleAmplitude: Math.random() * 0.5 + 0.1, // different intensities
            }));
        };

        setup();
        window.addEventListener("resize", setup);

        const draw = (timestamp: number) => {
            const t = timestamp * 0.001;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            starsRef.current.forEach((s) => {
                const twinkle = Math.sin(
                    t * s.twinkleSpeed * 60 + s.twinkleOffset,
                );
                s.opacity =
                    s.baseOpacity +
                    twinkle * s.baseOpacity * s.twinkleAmplitude;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(242,235,196,${Math.max(0, s.opacity)})`;
                ctx.fill();
            });

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", setup);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}
