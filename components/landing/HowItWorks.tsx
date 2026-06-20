"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        num: "01",
        tag: "find people",
        headline: "every professional,\nverified.",
        body: "search the verified member base by role, location, union status, rate, and availability. or speak naturally — the ai voice search parses your description and surfaces ranked matches instantly.",
        details: [
            "filter by role, location, availability",
            "ai voice search — speak naturally",
            "discovery feed for passive browsing",
            "open messaging, no match required",
        ],
    },
    {
        num: "02",
        tag: "join a project",
        headline: "work that matches\nyour craft.",
        body: "browse open projects actively seeking your skillset. every listing is structured — role, rate, dates, budget tier. apply with a short intent note. no cold blind applications.",
        details: [
            "matched by role, location, budget, dates",
            "intent note required on every application",
            "track status from pending to accepted",
            "withdraw anytime before acceptance",
        ],
    },
    {
        num: "03",
        tag: "create a project",
        headline: "build your team\nfrom the ground up.",
        body: "define every role you need. the system surfaces ranked candidates per slot. send direct invites with full project context. escrow holds funds until the work ships.",
        details: [
            "define role slots with rate and requirements",
            "system proactively suggests candidates",
            "direct invites with full project context",
            "escrow-backed payments, milestone releases",
        ],
    },
];

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const section = sectionRef.current;
            if (section) {
                gsap.set(
                    [
                        labelRef.current,
                        headRef.current,
                        ...panelRefs.current,
                        ...Array.from(section.querySelectorAll(".detail-item")),
                    ],
                    { opacity: 1, x: 0, y: 0 },
                );
                gsap.set(section.querySelectorAll(".panel-num"), {
                    opacity: 0.2,
                    scale: 1,
                });
                gsap.set(
                    [
                        lineRef.current,
                        ...Array.from(section.querySelectorAll(".accent-line")),
                    ],
                    { scaleX: 1 },
                );
            }
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                labelRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: labelRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                },
            );

            gsap.fromTo(
                headRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                },
            );

            gsap.fromTo(
                lineRef.current,
                { scaleX: 0, transformOrigin: "left center" },
                {
                    scaleX: 1,
                    duration: 1.2,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: lineRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                },
            );

            panelRefs.current.forEach((panel, i) => {
                if (!panel) return;

                const isEven = i % 2 === 0;

                gsap.fromTo(
                    panel,
                    { opacity: 0, x: isEven ? -50 : 50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: panel,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    },
                );

                gsap.fromTo(
                    panel.querySelectorAll(".detail-item"),
                    { opacity: 0, x: -20 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: panel,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        },
                    },
                );

                gsap.fromTo(
                    panel.querySelector(".panel-num"),
                    { opacity: 0, scale: 0.8 },
                    {
                        opacity: 0.2,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.4)",
                        scrollTrigger: {
                            trigger: panel,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    },
                );

                gsap.fromTo(
                    panel.querySelector(".accent-line"),
                    { scaleX: 0, transformOrigin: "left center" },
                    {
                        scaleX: 1,
                        duration: 1,
                        ease: "power3.inOut",
                        scrollTrigger: {
                            trigger: panel,
                            start: "top 78%",
                            toggleActions: "play none none reverse",
                        },
                    },
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            style={{ padding: "120px 0" }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "0 32px",
                    maxWidth: "900px",
                    margin: "0 auto 80px",
                }}
            >
                <p
                    ref={labelRef}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "48px",
                        opacity: 0,
                    }}
                >
                    How It Works
                </p>

                <h2
                    ref={headRef}
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(36px, 5vw, 72px)",
                        fontWeight: 300,
                        lineHeight: 1.05,
                        color: "var(--cream)",
                        letterSpacing: "-0.01em",
                        opacity: 0,
                        textTransform: "lowercase",
                    }}
                >
                    built around projects,{" "}
                    <em style={{ color: "var(--cream-dim)" }}>not profiles.</em>
                </h2>

                <div
                    ref={lineRef}
                    aria-hidden="true"
                    style={{
                        width: "100%",
                        height: "1px",
                        background: "rgba(200,169,110,0.2)",
                        marginTop: "48px",
                    }}
                />
            </div>

            {/* Feature panels */}
            {features.map((f, i) => {
                const isEven = i % 2 === 0;
                return (
                    <div
                        key={f.num}
                        ref={(el) => {
                            panelRefs.current[i] = el;
                        }}
                        style={{
                            padding: "64px 32px",
                            borderTop: "1px solid rgba(200,169,110,0.08)",
                            background: isEven
                                ? "transparent"
                                : "var(--ink-mid)",
                            opacity: 0,
                        }}
                    >
                        <div
                            className="amphi-hiw-grid"
                            style={{
                                maxWidth: "1100px",
                                margin: "0 auto",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "80px",
                                alignItems: "center",
                            }}
                        >
                            {/* Text — alternates sides via grid order, not
                                direction:rtl, so text selection and reading
                                order stay sane */}
                            <div
                                className="amphi-hiw-text"
                                style={{ order: isEven ? 1 : 2 }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        marginBottom: "24px",
                                    }}
                                >
                                    <span
                                        className="panel-num"
                                        aria-hidden="true"
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "72px",
                                            fontWeight: 300,
                                            color: "var(--gold)",
                                            opacity: 0,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {f.num}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.3em",
                                            textTransform: "lowercase",
                                            color: "var(--gold)",
                                        }}
                                    >
                                        {f.tag}
                                    </span>
                                </div>

                                <div
                                    className="accent-line"
                                    aria-hidden="true"
                                    style={{
                                        width: "48px",
                                        height: "1px",
                                        background: "var(--gold)",
                                        marginBottom: "24px",
                                    }}
                                />

                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "clamp(28px, 3.5vw, 48px)",
                                        fontWeight: 300,
                                        lineHeight: 1.1,
                                        color: "var(--cream)",
                                        marginBottom: "24px",
                                        whiteSpace: "pre-line",
                                        textTransform: "lowercase",
                                    }}
                                >
                                    {f.headline}
                                </h3>

                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "13px",
                                        color: "var(--cream-muted)",
                                        lineHeight: 1.9,
                                        textTransform: "lowercase",
                                    }}
                                >
                                    {f.body}
                                </p>
                            </div>

                            {/* Detail card */}
                            <div
                                className="amphi-hiw-card"
                                style={{ order: isEven ? 2 : 1 }}
                            >
                                <ul
                                    style={{
                                        listStyle: "none",
                                        margin: 0,
                                        padding: "40px",
                                        border: "1px solid rgba(200,169,110,0.12)",
                                        background: "var(--ink-raised)",
                                    }}
                                >
                                    {f.details.map((d, di) => (
                                        <li
                                            key={di}
                                            className="detail-item"
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "16px",
                                                paddingBottom:
                                                    di < f.details.length - 1
                                                        ? "20px"
                                                        : 0,
                                                marginBottom:
                                                    di < f.details.length - 1
                                                        ? "20px"
                                                        : 0,
                                                borderBottom:
                                                    di < f.details.length - 1
                                                        ? "1px solid rgba(200,169,110,0.08)"
                                                        : "none",
                                                opacity: 0,
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    color: "var(--gold)",
                                                    fontSize: "10px",
                                                    marginTop: "2px",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                →
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize: "12px",
                                                    color: "var(--cream-dim)",
                                                    lineHeight: 1.7,
                                                    textTransform: "lowercase",
                                                }}
                                            >
                                                {d}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
