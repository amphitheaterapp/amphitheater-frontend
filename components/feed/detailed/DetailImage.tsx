// components/feed/detailed/DetailImage.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getInitials } from "@/lib/initials";

interface Props {
    name: string;
    avatarUrl: string | null;
    locationLabel: string;
    userId: string;
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

export default function DetailImage({
    name,
    avatarUrl,
    locationLabel,
    userId,
    profileLinks,
    pastWorks,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(
            containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "power3.out" },
        );
    }, [userId]);

    const linkEntries = Object.entries(profileLinks || {});
    const works = pastWorks || [];
    const hasLinks = linkEntries.length > 0 || works.length > 0;

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background: "rgba(9,11,54,0.6)",
            }}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                    }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "88px",
                            height: "88px",
                            borderRadius: "50%",
                            background: "rgba(212,185,106,0.1)",
                            border: "1px solid rgba(212,185,106,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: "28px",
                            fontWeight: 300,
                            color: "var(--gold-accent)",
                        }}
                    >
                        {getInitials(name)}
                    </div>
                </div>
            )}

            {/* Bottom gradient overlay — name + location + links */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "48px 20px 20px",
                    background:
                        "linear-gradient(to top, rgba(9,11,54,0.98) 0%, rgba(9,11,54,0.6) 60%, transparent 100%)",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        fontWeight: 300,
                        color: "var(--cream)",
                        margin: 0,
                        lineHeight: 1.2,
                    }}
                >
                    {name}
                </p>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        color: "var(--cream-muted)",
                        margin: "4px 0 0",
                        letterSpacing: "0.08em",
                    }}
                >
                    {locationLabel}
                </p>

                {hasLinks && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            marginTop: "14px",
                            paddingTop: "14px",
                            borderTop: "1px solid rgba(212,185,106,0.15)",
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
                                    fontSize: "10px",
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
                                    fontSize: "10px",
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
        </div>
    );
}
