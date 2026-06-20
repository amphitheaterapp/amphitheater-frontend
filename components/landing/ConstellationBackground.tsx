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
        id: "spotlight",
        ox: 0.45,
        oy: 0.05,
        stars: [
            // Housing — small rectangle at top
            { id: "h-tl", x: 35, y: 0 },
            { id: "h-tr", x: 75, y: 0 },
            { id: "h-br", x: 75, y: 25 },
            { id: "h-bl", x: 35, y: 25 },
            // Lens circle — 8 points
            { id: "lens0", x: 55, y: 18 },
            { id: "lens1", x: 68, y: 22 },
            { id: "lens2", x: 74, y: 34 },
            { id: "lens3", x: 68, y: 46 },
            { id: "lens4", x: 55, y: 50 },
            { id: "lens5", x: 42, y: 46 },
            { id: "lens6", x: 36, y: 34 },
            { id: "lens7", x: 42, y: 22 },
            // Beam — angled down-right
            { id: "b-tl", x: 42, y: 50 },
            { id: "b-tr", x: 68, y: 50 },
            { id: "b-bl", x: 20, y: 160 },
            { id: "b-br", x: 95, y: 160 },
            // Mount arm on top
            { id: "arm-l", x: 45, y: 0 },
            { id: "arm-t", x: 55, y: -20 },
            { id: "arm-r", x: 65, y: 0 },
            // Ground light pool — ellipse
            { id: "g0", x: 30, y: 175 },
            { id: "g1", x: 55, y: 168 },
            { id: "g2", x: 85, y: 175 },
            { id: "g3", x: 55, y: 185 },
        ],
        edges: [
            // Housing
            ["h-tl", "h-tr"],
            ["h-tr", "h-br"],
            ["h-br", "h-bl"],
            ["h-bl", "h-tl"],
            // Lens circle
            ["lens0", "lens1"],
            ["lens1", "lens2"],
            ["lens2", "lens3"],
            ["lens3", "lens4"],
            ["lens4", "lens5"],
            ["lens5", "lens6"],
            ["lens6", "lens7"],
            ["lens7", "lens0"],
            // Beam edges
            ["b-tl", "b-bl"],
            ["b-tr", "b-br"],
            // Beam top connects to lens
            ["b-tl", "lens4"],
            ["b-tr", "lens2"],
            // Mount
            ["arm-l", "arm-t"],
            ["arm-t", "arm-r"],
            // Ground pool
            ["g0", "g1"],
            ["g1", "g2"],
            ["g2", "g3"],
            ["g3", "g0"],
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
    const sweepRafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        // Logical (CSS pixel) viewport size — the canvas backing store is
        // scaled by devicePixelRatio so stars render sharp on retina.
        let vw = 0;
        let vh = 0;

        // Setup ─
        const setup = () => {
            vw = window.innerWidth;
            vh = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = vw * dpr;
            canvas.height = vh * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Background stars
            bgStars.current = Array.from({ length: NUM_BG_STARS }, () => ({
                x: Math.random() * vw,
                y: Math.random() * vh,
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
                const ox = c.ox * vw;
                const oy = c.oy * vh;

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

        // Reduced motion: render one calm, static frame. Constellations
        // are shown fully drawn at low opacity; nothing twinkles or chases
        // the cursor.
        const drawStatic = () => {
            ctx.clearRect(0, 0, vw, vh);
            bgStars.current.forEach((s) => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(242,235,196,${s.baseOpacity})`;
                ctx.fill();
            });
            cEdges.current.forEach((edges) => {
                edges.forEach((e) => {
                    ctx.beginPath();
                    ctx.moveTo(e.x1, e.y1);
                    ctx.lineTo(e.x2, e.y2);
                    ctx.strokeStyle = "rgba(242,235,196,0.14)";
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                });
            });
            cStars.current.forEach((stars) => {
                stars.forEach((s) => {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(242,235,196,0.35)";
                    ctx.fill();
                });
            });
        };

        // Debounced resize — the old handler re-randomised the whole field
        // on every resize event, which made the sky visibly "reshuffle"
        // while dragging a window edge.
        let resizeTimer: ReturnType<typeof setTimeout> | undefined;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setup();
                if (prefersReduced) drawStatic();
            }, 150);
        };
        window.addEventListener("resize", onResize);

        if (prefersReduced) {
            drawStatic();
            return () => {
                clearTimeout(resizeTimer);
                window.removeEventListener("resize", onResize);
            };
        }

        // Pointer ─ pointermove covers mouse and touch-drag, so mobile
        // users get the constellation reveal too.
        const onPointer = (e: PointerEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });

        // Draw loop ─
        const draw = (timestamp: number) => {
            const t = timestamp * 0.001; // seconds
            ctx.clearRect(0, 0, vw, vh);
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
                const cx = c.ox * vw + 80;
                const cy = c.oy * vh + 65;
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

        // Load sweep — fake pointer sweeps across to draw constellations in
        let sweepX = 0;
        const sweep = () => {
            const sweepY = vh * 0.45;
            if (sweepX < vw + 200) {
                sweepX += vw / 120; // pixels per frame
                mouseRef.current = { x: sweepX, y: sweepY };
                sweepRafRef.current = requestAnimationFrame(sweep);
            } else {
                // Fade out — move pointer off screen
                fadeTimer = setTimeout(() => {
                    mouseRef.current = { x: -1000, y: -1000 };
                }, 800);
            }
        };

        let fadeTimer: ReturnType<typeof setTimeout> | undefined;
        const startTimer = setTimeout(sweep, 400);
        rafRef.current = requestAnimationFrame(draw);

        // Don't burn the battery while the tab is hidden.
        const onVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(rafRef.current);
            } else {
                rafRef.current = requestAnimationFrame(draw);
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            cancelAnimationFrame(rafRef.current);
            cancelAnimationFrame(sweepRafRef.current);
            clearTimeout(startTimer);
            clearTimeout(fadeTimer);
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointer);
            window.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}
