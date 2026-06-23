// components/feed/detailed/DetailPanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import api from "@/lib/axios";
import DetailTabs from "./DetailTabs";
import DetailFields from "./DetailFields";

interface DetailRole {
    role: string;
    data?: Record<string, any>;
    detail_unavailable?: boolean;
}

interface ProfileDetail {
    user: {
        id: string;
        name: string;
        avatar_url: string | null;
        location_label: string;
    };
    roles: DetailRole[];
}

interface Props {
    userId: string | null;
    onClose: () => void;
}

function ExternalLinkIcon() {
    return (
        <svg
            width="11"
            height="11"
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

function getInitials(name?: string | null) {
    if (!name) return "";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function DetailPanel({ userId, onClose }: Props) {
    const [detail, setDetail] = useState<ProfileDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) {
            setDetail(null);
            return;
        }

        setLoading(true);
        setError(false);
        setActiveTab(0);

        api.get(`/api/v1/profile/detail/${userId}/`)
            .then((res) => {
                setDetail(res.data);
                if (contentRef.current) {
                    gsap.fromTo(
                        contentRef.current,
                        { opacity: 0, y: 12 },
                        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                    );
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [userId]);

    if (!userId) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        width: "1px",
                        height: "40px",
                        background: "rgba(212,185,106,0.2)",
                    }}
                />
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--cream-muted)",
                        opacity: 0.35,
                        margin: 0,
                    }}
                >
                    Select a profile
                </p>
                <div
                    style={{
                        width: "1px",
                        height: "40px",
                        background: "rgba(212,185,106,0.2)",
                    }}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        letterSpacing: "0.2em",
                        color: "var(--cream-muted)",
                        opacity: 0.4,
                    }}
                >
                    Loading...
                </p>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "#e57373",
                    }}
                >
                    Couldn't load this profile.
                </p>
            </div>
        );
    }

    const activeRole = detail.roles[activeTab];
    const roleData = activeRole?.data || {};
    const linkEntries = Object.entries(roleData.profile_links || {});
    const pastWorks: string[] = roleData.past_works || [];
    const hasLinks = linkEntries.length > 0 || pastWorks.length > 0;

    return (
        <div
            style={{
                flex: 1,
                overflowY: "auto",
                minWidth: 0,
                position: "relative",
            }}
        >
            {/* Close button — floats top right */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "24px",
                    right: "32px",
                    zIndex: 10,
                    background: "transparent",
                    border: "1px solid rgba(212,185,106,0.25)",
                    color: "var(--cream-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "8px 14px",
                    cursor: "pointer",
                }}
            >
                &times; close
            </button>

            <div
                ref={contentRef}
                style={{ padding: "40px 40px 48px", maxWidth: "720px" }}
            >
                {/* ── Identity header: photo + name side by side ── */}
                <div
                    style={{
                        display: "flex",
                        gap: "28px",
                        alignItems: "center",
                        marginBottom: "8px",
                    }}
                >
                    {/* Portrait card */}
                    <div
                        style={{
                            width: "140px",
                            height: "140px",
                            flexShrink: 0,
                            borderRadius: "4px",
                            overflow: "hidden",
                            background: "rgba(212,185,106,0.06)",
                            border: "1px solid rgba(212,185,106,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {detail.user.avatar_url ? (
                            <img
                                src={detail.user.avatar_url}
                                alt={detail.user.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "44px",
                                    fontWeight: 300,
                                    color: "var(--gold-accent)",
                                }}
                            >
                                {getInitials(detail.user.name)}
                            </span>
                        )}
                    </div>

                    {/* Name + location + role */}
                    <div style={{ minWidth: 0 }}>
                        <h2
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "32px",
                                fontWeight: 300,
                                color: "var(--cream)",
                                margin: 0,
                                lineHeight: 1.15,
                            }}
                        >
                            {detail.user.name}
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "13px",
                                color: "var(--cream-muted)",
                                margin: "8px 0 0",
                                letterSpacing: "0.04em",
                            }}
                        >
                            {detail.user.location_label}
                        </p>

                        {hasLinks && (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    marginTop: "14px",
                                }}
                            >
                                {linkEntries.map(([label, url]) => (
                                    <a
                                        key={label}
                                        href={url as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            color: "var(--gold-accent)",
                                            textDecoration: "none",
                                            border: "1px solid rgba(212,185,106,0.25)",
                                            padding: "5px 10px",
                                        }}
                                    >
                                        <ExternalLinkIcon />
                                        {label}
                                    </a>
                                ))}
                                {pastWorks.map((url, i) => (
                                    <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            color: "var(--cream-muted)",
                                            textDecoration: "none",
                                            border: "1px solid rgba(212,185,106,0.15)",
                                            padding: "5px 10px",
                                        }}
                                    >
                                        <ExternalLinkIcon />
                                        Work {i + 1}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ marginTop: "36px" }}>
                    <DetailTabs
                        roles={detail.roles}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Fields */}
                <div style={{ marginTop: "24px" }}>
                    {activeRole?.detail_unavailable ? (
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "12px",
                                color: "var(--cream-muted)",
                                fontStyle: "italic",
                                opacity: 0.5,
                            }}
                        >
                            Full detail for this role is coming soon.
                        </p>
                    ) : (
                        <DetailFields
                            role={activeRole?.role || ""}
                            data={roleData}
                            tabIndex={activeTab}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
