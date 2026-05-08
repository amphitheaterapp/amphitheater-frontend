"use client";

import { useEffect, useRef } from "react";

// Background stars
const NUM_BG_STARS = 180;

// Constellation definitions — coordinates in actual pixels relative to origin
// These are designed to actually look like the shapes
const CONSTELLATIONS = [
    {
        id: "camera",
        ox: 0.08,
        oy: 0.18,
        stars: [
            { id: "tl", x: 0, y: 40 },
            { id: "tr", x: 150, y: 40 },
            { id: "br", x: 150, y: 120 },
            { id: "bl", x: 0, y: 120 },
            { id: "vf-l", x: 20, y: 40 },
            { id: "vf-tl", x: 20, y: 10 },
            { id: "vf-tr", x: 65, y: 10 },
            { id: "vf-r", x: 65, y: 40 },
            { id: "l0", x: 105, y: 52 },
            { id: "l1", x: 122, y: 59 },
            { id: "l2", x: 128, y: 76 },
            { id: "l3", x: 122, y: 93 },
            { id: "l4", x: 105, y: 100 },
            { id: "l5", x: 88, y: 93 },
            { id: "l6", x: 82, y: 76 },
            { id: "l7", x: 88, y: 59 },
        ],
        edges: [
            ["tl", "tr"],
            ["tr", "br"],
            ["br", "bl"],
            ["bl", "tl"],
            ["vf-l", "vf-tl"],
            ["vf-tl", "vf-tr"],
            ["vf-tr", "vf-r"],
            ["l0", "l1"],
            ["l1", "l2"],
            ["l2", "l3"],
            ["l3", "l4"],
            ["l4", "l5"],
            ["l5", "l6"],
            ["l6", "l7"],
            ["l7", "l0"],
        ],
    },
    {
        id: "pen",
        ox: 0.8,
        oy: 0.12,
        stars: [
            { id: "tl", x: 15, y: 0 },
            { id: "tr", x: 45, y: 0 },
            { id: "ml", x: 15, y: 90 },
            { id: "mr", x: 45, y: 90 },
            { id: "nib-l", x: 10, y: 90 },
            { id: "nib-r", x: 50, y: 90 },
            { id: "tip", x: 30, y: 150 },
            { id: "split", x: 30, y: 120 },
            { id: "clip-t", x: 45, y: 5 },
            { id: "clip-m", x: 62, y: 50 },
            { id: "clip-b", x: 58, y: 85 },
            { id: "cap-l", x: 15, y: 20 },
            { id: "cap-r", x: 45, y: 20 },
        ],
        edges: [
            ["tl", "tr"],
            ["tr", "mr"],
            ["mr", "ml"],
            ["ml", "tl"],
            ["nib-l", "tip"],
            ["nib-r", "tip"],
            ["tip", "split"],
            ["clip-t", "clip-m"],
            ["clip-m", "clip-b"],
            ["cap-l", "cap-r"],
        ],
    },
    {
        id: "filmreel",
        ox: 0.42,
        oy: 0.55,
        stars: [
            { id: "o0", x: 90, y: 0 },
            { id: "o1", x: 135, y: 12 },
            { id: "o2", x: 163, y: 47 },
            { id: "o3", x: 170, y: 90 },
            { id: "o4", x: 156, y: 133 },
            { id: "o5", x: 123, y: 160 },
            { id: "o6", x: 80, y: 168 },
            { id: "o7", x: 37, y: 156 },
            { id: "o8", x: 10, y: 123 },
            { id: "o9", x: 0, y: 80 },
            { id: "o10", x: 14, y: 37 },
            { id: "o11", x: 47, y: 10 },
            { id: "c", x: 85, y: 84 },
            { id: "i0", x: 85, y: 54 },
            { id: "i1", x: 111, y: 62 },
            { id: "i2", x: 120, y: 88 },
            { id: "i3", x: 104, y: 110 },
            { id: "i4", x: 76, y: 113 },
            { id: "i5", x: 57, y: 94 },
            { id: "i6", x: 58, y: 68 },
        ],
        edges: [
            ["o0", "o1"],
            ["o1", "o2"],
            ["o2", "o3"],
            ["o3", "o4"],
            ["o4", "o5"],
            ["o5", "o6"],
            ["o6", "o7"],
            ["o7", "o8"],
            ["o8", "o9"],
            ["o9", "o10"],
            ["o10", "o11"],
            ["o11", "o0"],
            ["c", "o0"],
            ["c", "o3"],
            ["c", "o6"],
            ["c", "o9"],
            ["i0", "i1"],
            ["i1", "i2"],
            ["i2", "i3"],
            ["i3", "i4"],
            ["i4", "i5"],
            ["i5", "i6"],
            ["i6", "i0"],
        ],
    },
    {
        id: "musicnote",
        ox: 0.18,
        oy: 0.65,
        stars: [
            { id: "h0", x: 30, y: 108 },
            { id: "h1", x: 44, y: 100 },
            { id: "h2", x: 52, y: 112 },
            { id: "h3", x: 48, y: 126 },
            { id: "h4", x: 34, y: 134 },
            { id: "h5", x: 18, y: 130 },
            { id: "h6", x: 10, y: 118 },
            { id: "h7", x: 16, y: 106 },
            { id: "s-b", x: 52, y: 112 },
            { id: "s-t", x: 52, y: 0 },
            { id: "f1", x: 52, y: 0 },
            { id: "f2", x: 95, y: 15 },
            { id: "f3", x: 100, y: 45 },
            { id: "f4", x: 52, y: 55 },
        ],
        edges: [
            ["h0", "h1"],
            ["h1", "h2"],
            ["h2", "h3"],
            ["h3", "h4"],
            ["h4", "h5"],
            ["h5", "h6"],
            ["h6", "h7"],
            ["h7", "h0"],
            ["s-b", "s-t"],
            ["f1", "f2"],
            ["f2", "f3"],
            ["f3", "f4"],
        ],
    },
    {
        id: "clapper",
        ox: 0.75,
        oy: 0.62,
        stars: [
            { id: "tl", x: 0, y: 55 },
            { id: "tr", x: 140, y: 55 },
            { id: "br", x: 140, y: 140 },
            { id: "bl", x: 0, y: 140 },
            { id: "bar-l", x: 10, y: 30 },
            { id: "bar-r", x: 140, y: 30 },
            { id: "hinge", x: 0, y: 0 },
            { id: "s1-t", x: 38, y: 30 },
            { id: "s1-b", x: 25, y: 55 },
            { id: "s2-t", x: 78, y: 30 },
            { id: "s2-b", x: 65, y: 55 },
            { id: "s3-t", x: 118, y: 30 },
            { id: "s3-b", x: 105, y: 55 },
        ],
        edges: [
            ["tl", "tr"],
            ["tr", "br"],
            ["br", "bl"],
            ["bl", "tl"],
            ["bar-l", "bar-r"],
            ["bar-l", "tl"],
            ["bar-r", "tr"],
            ["hinge", "bar-l"],
            ["hinge", "tl"],
            ["s1-t", "s1-b"],
            ["s2-t", "s2-b"],
            ["s3-t", "s3-b"],
        ],
    },
];
interface BgStar {
    x: number;
    y: number;
    radius: number;
    baseOpacity: number;
    opacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
}

interface CStar {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    radius: number;
    opacity: number;
    baseOpacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
}

interface CEdge {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    progress: number;
    targetProgress: number;
}

export default function ConstellationBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const bgStars = useRef<BgStar[]>([]);
    const cStars = useRef<CStar[][]>([]);
    const cEdges = useRef<CEdge[][]>([]);
    const rafRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        // Setup ─
        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Background stars
            bgStars.current = Array.from({ length: NUM_BG_STARS }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.3,
                baseOpacity: Math.random() * 0.25 + 0.05,
                opacity: 0,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
            }));

            // Constellation stars and edges
            cStars.current = [];
            cEdges.current = [];

            CONSTELLATIONS.forEach((c) => {
                const ox = c.ox * canvas.width;
                const oy = c.oy * canvas.height;

                const starMap: Record<string, { x: number; y: number }> = {};
                const stars: CStar[] = c.stars.map((s) => {
                    const sx = ox + s.x;
                    const sy = oy + s.y;
                    starMap[s.id] = { x: sx, y: sy };
                    return {
                        x: sx,
                        y: sy,
                        baseX: sx,
                        baseY: sy,
                        radius: Math.random() * 1.5 + 1.5,
                        opacity: 0,
                        baseOpacity: 0.5,
                        twinkleSpeed: Math.random() * 0.03 + 0.01,
                        twinkleOffset: Math.random() * Math.PI * 2,
                    };
                });

                const edges: CEdge[] = c.edges.map(([a, b]) => ({
                    x1: starMap[a].x,
                    y1: starMap[a].y,
                    x2: starMap[b].x,
                    y2: starMap[b].y,
                    progress: 0,
                    targetProgress: 0,
                }));

                cStars.current.push(stars);
                cEdges.current.push(edges);
            });
        };

        setup();
        window.addEventListener("resize", setup);

        // Mouse ─
        const onMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", onMouse);

        // Draw loop ─
        const draw = (timestamp: number) => {
            timeRef.current = timestamp * 0.001; // seconds
            const t = timeRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const mouse = mouseRef.current;

            // Background stars — twinkle
            bgStars.current.forEach((s) => {
                const twinkle = Math.sin(
                    t * s.twinkleSpeed * 60 + s.twinkleOffset,
                );
                s.opacity = s.baseOpacity + twinkle * s.baseOpacity * 0.6;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(242,235,196,${Math.max(0, s.opacity)})`;
                ctx.fill();
            });

            // Constellations
            CONSTELLATIONS.forEach((c, ci) => {
                const stars = cStars.current[ci];
                const edges = cEdges.current[ci];

                // Find center of this constellation
                const cx = c.ox * canvas.width + 80;
                const cy = c.oy * canvas.height + 65;
                const dx = mouse.x - cx;
                const dy = mouse.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const proximity = Math.max(0, 1 - dist / 320);

                // Stars
                stars.forEach((s) => {
                    // Drift toward cursor
                    const sdx = mouse.x - s.baseX;
                    const sdy = mouse.y - s.baseY;
                    const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
                    const sprox = Math.max(0, 1 - sdist / 350);
                    s.x += (s.baseX + sdx * sprox * 0.06 - s.x) * 0.08;
                    s.y += (s.baseY + sdy * sprox * 0.06 - s.y) * 0.08;

                    // Twinkle + cursor brightness
                    const twinkle = Math.sin(
                        t * s.twinkleSpeed * 60 + s.twinkleOffset,
                    );
                    const targetOp = 0.08 + proximity * 0.85 + twinkle * 0.1;
                    s.opacity += (targetOp - s.opacity) * 0.06;

                    // Glow effect for constellation stars
                    if (proximity > 0.1) {
                        const grd = ctx.createRadialGradient(
                            s.x,
                            s.y,
                            0,
                            s.x,
                            s.y,
                            s.radius * 6,
                        );
                        grd.addColorStop(
                            0,
                            `rgba(242,235,196,${s.opacity * 0.4})`,
                        );
                        grd.addColorStop(1, "rgba(242,235,196,0)");
                        ctx.beginPath();
                        ctx.arc(s.x, s.y, s.radius * 6, 0, Math.PI * 2);
                        ctx.fillStyle = grd;
                        ctx.fill();
                    }

                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(242,235,196,${Math.max(0, s.opacity)})`;
                    ctx.fill();
                });

                // Edges
                edges.forEach((e) => {
                    e.targetProgress = proximity;
                    e.progress += (e.targetProgress - e.progress) * 0.05;
                    if (e.progress < 0.01) return;

                    const ex = e.x1 + (e.x2 - e.x1) * e.progress;
                    const ey = e.y1 + (e.y2 - e.y1) * e.progress;

                    ctx.beginPath();
                    ctx.moveTo(e.x1, e.y1);
                    ctx.lineTo(ex, ey);
                    ctx.strokeStyle = `rgba(242,235,196,${0.1 + proximity * 0.45})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                });
            });

            rafRef.current = requestAnimationFrame(draw);
        };

        // Load sweep — fake mouse sweeps across to draw constellations in
        let sweepX = 0;
        const sweepY = window.innerHeight * 0.45;
        const sweepSpeed = window.innerWidth / 120; // pixels per frame

        const sweep = () => {
            if (sweepX < window.innerWidth + 200) {
                sweepX += sweepSpeed;
                mouseRef.current = { x: sweepX, y: sweepY };
                requestAnimationFrame(sweep);
            } else {
                // Fade out — move mouse off screen
                setTimeout(() => {
                    mouseRef.current = { x: -1000, y: -1000 };
                }, 800);
            }
        };

        setTimeout(sweep, 400);
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", setup);
            window.removeEventListener("mousemove", onMouse);
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
