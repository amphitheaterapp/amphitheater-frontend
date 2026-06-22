"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface DetailRole {
    role: string;
    data?: Record<string, any>;
    detail_unavailable?: boolean;
}

interface Props {
    roles: DetailRole[];
    activeTab: number;
    onTabChange: (index: number) => void;
}

export default function DetailTabs({ roles, activeTab, onTabChange }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (!indicatorRef.current || !containerRef.current) return;
        if (roles.length <= 1) return;

        const tab = tabRefs.current[activeTab];
        if (!tab) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        const x = tabRect.left - containerRect.left;
        const width = tabRect.width;

        if (isFirstRender.current) {
            gsap.set(indicatorRef.current, { x, width, opacity: 1 });
            isFirstRender.current = false;
        } else {
            gsap.to(indicatorRef.current, {
                x,
                width,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [activeTab, roles]);

    // Single role, render as static label not a clickable tab
    if (roles.length <= 1) {
        return (
            <div
                style={{
                    padding: "0 24px 16px",
                    borderBottom: "1px solid rgba(212,185,106,0.12)",
                    marginBottom: "20px",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        paddingBottom: "10px",
                        borderBottom: "2px solid var(--gold-accent)",
                        display: "inline-block",
                    }}
                >
                    {roles[0]?.role}
                </span>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                display: "flex",
                gap: "32px",
                padding: "0 24px 0",
                borderBottom: "1px solid rgba(212,185,106,0.12)",
                marginBottom: "20px",
            }}
        >
            {roles.map((r, i) => (
                <button
                    key={r.role}
                    ref={(el) => {
                        tabRefs.current[i] = el;
                    }}
                    onClick={() => onTabChange(i)}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color:
                            i === activeTab
                                ? "var(--gold)"
                                : "var(--cream-muted)",
                        padding: "0 0 12px",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                    }}
                >
                    {r.role}
                </button>
            ))}

            <div
                ref={indicatorRef}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    background: "var(--gold-accent)",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
