"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const TABS = [
    { label: "Find People", href: "/app/feed" },
    { label: "Join a Project", href: "/app/join-project" },
    { label: "Create a Project", href: "/app/create-project" },
];

export default function NavTabs() {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const isFirstRender = useRef(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const activeIndex = TABS.findIndex((tab) => tab.href === pathname);

    useEffect(() => {
        if (!indicatorRef.current || !containerRef.current) return;

        const activeTab = tabRefs.current[activeIndex];

        if (!activeTab || activeIndex < 0) {
            gsap.to(indicatorRef.current, { opacity: 0, duration: 0.2 });
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        const x = tabRect.left - containerRect.left;
        const width = tabRect.width;

        if (isFirstRender.current) {
            // Snap into place on mount, no animation
            gsap.set(indicatorRef.current, { x, width, opacity: 1 });
            isFirstRender.current = false;
        } else {
            // Slide on every subsequent tab change
            gsap.to(indicatorRef.current, {
                x,
                width,
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
            });
        }
    }, [pathname, activeIndex]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "40px",
                paddingBottom: "4px",
            }}
        >
            {TABS.map((tab, i) => {
                const active = pathname === tab.href;
                const hovered = hoveredIndex === i;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        ref={(el) => {
                            tabRefs.current[i] = el;
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: active
                                ? "var(--gold)"
                                : hovered
                                  ? "var(--cream)"
                                  : "var(--cream-muted)",
                            textDecoration: "none",
                            transition: "color 0.2s ease",
                        }}
                    >
                        {tab.label}
                    </Link>
                );
            })}

            {/* Sliding gold indicator, GSAP moves this on tab change */}
            <div
                ref={indicatorRef}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "1px",
                    background: "var(--gold)",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
