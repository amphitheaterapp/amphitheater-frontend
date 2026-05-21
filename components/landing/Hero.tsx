"use client";

import { CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
    const tagRef = useRef<HTMLParagraphElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const linkStyle: CSSProperties = {
        fontFamily: "var(--font-body)",
        fontSize: "11px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        background: "transparent",
        color: "var(--cream-dim)",
        border: "1px solid rgba(240,234,216,0.2)",
        padding: "16px 32px",
        cursor: "pointer",
    };

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(
            tagRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        )
            .fromTo(
                headRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
                "-=0.4",
            )
            .fromTo(
                subRef.current,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.5",
            )
            .fromTo(
                ctaRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
                "-=0.4",
            )
            .fromTo(
                scrollRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: "power2.out" },
                "-=0.2",
            );
    }, []);

    return (
        <section
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "120px 32px 80px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(28,28,56,0.6) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <p
                ref={tagRef}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.4em",
                    textTransform: "lowercase",
                    color: "var(--gold)",
                    marginBottom: "24px",
                    opacity: 0,
                }}
            >
                the verified creative network
            </p>

            <h1
                ref={headRef}
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(52px, 9vw, 128px)",
                    fontWeight: 300,
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                    color: "var(--cream)",
                    marginBottom: "32px",
                    maxWidth: "1000px",
                    opacity: 0,
                }}
            >
                find your team.
                <br />
                <em style={{ fontStyle: "italic", color: "var(--cream-dim)" }}>
                    build your record.
                </em>
            </h1>

            <p
                ref={subRef}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--cream-muted)",
                    lineHeight: 1.8,
                    maxWidth: "480px",
                    marginBottom: "48px",
                    textTransform: "lowercase",
                    opacity: 0,
                }}
            >
                amphitheater connects every discipline of film, television,
                theatre, music, and content production. verified identities.
                permanent credited work history. no noise.
            </p>

            <div
                ref={ctaRef}
                style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    opacity: 0,
                }}
            >
                <button
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: "var(--gold)",
                        color: "var(--ink)",
                        border: "none",
                        padding: "16px 32px",
                        cursor: "pointer",
                        fontWeight: 500,
                    }}
                >
                    Request Early Access
                </button>
                <a href="#how-it-works" style={linkStyle}>
                    See how it works
                </a>
            </div>

            <div
                ref={scrollRef}
                style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    opacity: 0,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--cream-muted)",
                    }}
                >
                    Scroll
                </span>
                <div
                    style={{
                        width: "1px",
                        height: "48px",
                        background:
                            "linear-gradient(to bottom, var(--gold), transparent)",
                    }}
                />
            </div>
        </section>
    );
}
