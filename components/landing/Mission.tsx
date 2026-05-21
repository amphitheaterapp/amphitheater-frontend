"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
    const labelRef = useRef<HTMLParagraphElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLParagraphElement>(null);
    const closerRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
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
                { opacity: 0, y: 40 },
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

            gsap.fromTo(
                bodyRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bodyRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                },
            );

            gsap.fromTo(
                closerRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: closerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                },
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            style={{
                padding: "160px 32px",
                maxWidth: "900px",
                margin: "0 auto",
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
                Our Mission
            </p>

            <h2
                ref={headRef}
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 5vw, 72px)",
                    fontWeight: 300,
                    lineHeight: 1.05,
                    color: "var(--cream)",
                    textTransform: "lowercase",
                    marginBottom: "48px",
                    letterSpacing: "-0.01em",
                    opacity: 0,
                }}
            >
                Every role, every craft, every discipline it takes to bring a
                vision to life.
                <br />
                <br />
                <em style={{ color: "var(--cream-dim)", fontStyle: "italic" }}>
                    Your people are here.
                </em>
            </h2>

            <div
                ref={lineRef}
                style={{
                    width: "100%",
                    height: "1px",
                    background: "rgba(200,169,110,0.2)",
                    marginBottom: "48px",
                }}
            />

            <p
                ref={bodyRef}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--cream-muted)",
                    textTransform: "lowercase",
                    lineHeight: 2,
                    maxWidth: "640px",
                    marginBottom: "32px",
                    opacity: 0,
                }}
            >
                The new age of technology and streaming is giving the power back
                to independent creators. We are building the home for that
                movement — for everyone behind the scenes, front and center,
                just starting out, or vastly experienced.
            </p>

            <p
                ref={closerRef}
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3vw, 40px)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "var(--gold)",
                    textTransform: "lowercase",
                    lineHeight: 1.3,
                    opacity: 0,
                }}
            >
                We are living in the golden age of art.
                <br />
                And it belongs to you.
            </p>
        </section>
    );
}
