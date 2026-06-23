"use client";

import { useState } from "react";
import { FeedEntry } from "@/hooks/useFieldList";
import { getInitials } from "@/lib/initials";
import { useMessaging } from "@/context/MessagingContext";

interface Props {
    entry: FeedEntry;
    selected: boolean;
    onSelect: () => void;
    onPass: () => void;
}

export default function FeedCard({ entry, selected, onSelect, onPass }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [saved, setSaved] = useState(false);
    const { openConversation } = useMessaging();

    const profile = entry.profiles[activeIndex];
    const { data, role } = profile;
    const hasMultiple = entry.profiles.length > 1;

    const headline =
        role === "actor"
            ? data.special_skills?.slice(0, 3).join(" · ")
            : data.genres?.slice(0, 3).join(" · ");

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((i) => (i === 0 ? entry.profiles.length - 1 : i - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((i) => (i === entry.profiles.length - 1 ? 0 : i + 1));
    };

    const handleMessage = (e: React.MouseEvent) => {
        e.stopPropagation();
        openConversation({
            id: entry.user_id,
            name: data.name,
            avatar_url: data.avatar_url,
        });
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSaved((s) => !s);
    };

    const handlePass = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPass();
    };

    return (
        <div
            onClick={onSelect}
            style={{
                border: selected
                    ? "1px solid var(--gold-accent)"
                    : "1px solid rgba(212,185,106,0.15)",
                background: selected ? "rgba(212,185,106,0.06)" : "transparent",
                padding: "16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "border-color 0.15s ease, background 0.15s ease",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                }}
            >
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "rgba(212,185,106,0.15)",
                        border: "1px solid var(--gold-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "var(--gold-accent)",
                        flexShrink: 0,
                        overflow: "hidden",
                    }}
                >
                    {data.avatar_url ? (
                        <img
                            src={data.avatar_url}
                            alt={data.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        getInitials(data.name)
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            color: "var(--cream)",
                            margin: 0,
                        }}
                    >
                        {data.name}
                    </p>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--gold)",
                            margin: "2px 0 0",
                        }}
                    >
                        {role} · {data.location_label}
                    </p>
                    {headline && (
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "var(--cream-muted)",
                                margin: "6px 0 0",
                            }}
                        >
                            {headline}
                        </p>
                    )}
                </div>
            </div>

            {hasMultiple && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                    }}
                >
                    <button
                        onClick={handlePrev}
                        aria-label="Previous profile"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--cream-muted)",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        ‹
                    </button>
                    <div style={{ display: "flex", gap: "4px" }}>
                        {entry.profiles.map((_, i) => (
                            <span
                                key={i}
                                style={{
                                    width: "5px",
                                    height: "5px",
                                    borderRadius: "50%",
                                    background:
                                        i === activeIndex
                                            ? "var(--gold-accent)"
                                            : "rgba(212,185,106,0.25)",
                                }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        aria-label="Next profile"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--cream-muted)",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        ›
                    </button>
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                }}
            >
                <button
                    onClick={handleSave}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: saved
                            ? "rgba(212,185,106,0.15)"
                            : "transparent",
                        color: saved
                            ? "var(--gold-accent)"
                            : "var(--cream-muted)",
                        border: "1px solid rgba(212,185,106,0.25)",
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    {saved ? "Saved" : "Save"}
                </button>
                <button
                    onClick={handlePass}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: "transparent",
                        color: "var(--cream-muted)",
                        border: "1px solid rgba(212,185,106,0.25)",
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    Pass
                </button>
                <button
                    onClick={handleMessage}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: "transparent",
                        color: "var(--gold-accent)",
                        border: "1px solid var(--gold-accent)",
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    Message
                </button>
            </div>
        </div>
    );
}
