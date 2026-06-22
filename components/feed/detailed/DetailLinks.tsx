"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
    profileLinks: Record<string, string>;
    pastWorks: string[];
}

function ExternalLinkIcon() {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    );
}

export default function DetailLinks({ profileLinks, pastWorks }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current,
            { opacity: 0, y: 8 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                delay: 0.15,
            },
        );
    }, [profileLinks, pastWorks]);

    const linkEntries = Object.entries(profileLinks || {});
    const works = pastWorks || [];
    const hasLinks = linkEntries.length > 0 || works.length > 0;

    return (
        <div
            ref={ref}
            style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(212,185,106,0.12)",
                flexShrink: 0,
            }}
        >
            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    margin: "0 0 8px",
                }}
            >
                Links
            </p>

            {!hasLinks ? (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "var(--cream-muted)",
                        fontStyle: "italic",
                        margin: 0,
                        opacity: 0.6,
                    }}
                >
                    No links added yet
                </p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                    }}
                >
                    {linkEntries.map(([label, url]) => (
                        <a
                            key={label}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "var(--gold-accent)",
                                textDecoration: "none",
                                letterSpacing: "0.05em",
                            }}
                        >
                            <ExternalLinkIcon />
                            {label}
                        </a>
                    ))}
                    {works.map((url, i) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "var(--cream-muted)",
                                textDecoration: "none",
                            }}
                        >
                            <ExternalLinkIcon />
                            {`Work ${i + 1}`}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
