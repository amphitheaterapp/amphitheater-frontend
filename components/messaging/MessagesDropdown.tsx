// components/messaging/MessagesDropdown.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { useMessaging } from "@/context/MessagingContext";
import { getInitials } from "@/lib/initials";

// Inline for now since InternalSVGPack's export pattern hasn't been
// confirmed. Move into that pack once we know how icons are registered
// there, so this isn't a one-off duplicate of the icon system.
function MessageIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

export default function MessagesDropdown() {
    const { conversations, openConversation } = useMessaging();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = conversations.filter((c) => c.unread).length;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Messages"
                style={{
                    position: "relative",
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: open ? "rgba(212,185,106,0.15)" : "transparent",
                    border: open
                        ? "1px solid var(--gold-accent)"
                        : "1px solid rgba(212,185,106,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: open ? "var(--gold-accent)" : "var(--cream-muted)",
                    transition:
                        "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                }}
            >
                <MessageIcon size={16} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            background: "#e57373",
                            color: "white",
                            fontSize: "9px",
                            fontFamily: "var(--font-body)",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 12px)",
                        right: 0,
                        width: "280px",
                        background: "var(--ink)",
                        border: "1px solid rgba(212,185,106,0.3)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        maxHeight: "360px",
                        overflowY: "auto",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--gold)",
                            padding: "12px 14px 8px",
                        }}
                    >
                        Messages
                    </p>

                    {conversations.length === 0 && (
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "12px",
                                color: "var(--cream-muted)",
                                padding: "0 14px 16px",
                            }}
                        >
                            No conversations yet.
                        </p>
                    )}

                    {conversations.map((c) => {
                        const last = c.messages[c.messages.length - 1];
                        return (
                            <button
                                key={c.id}
                                onClick={() => {
                                    openConversation(c.user);
                                    setOpen(false);
                                }}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "10px 14px",
                                    background: "transparent",
                                    border: "none",
                                    borderTop:
                                        "1px solid rgba(212,185,106,0.08)",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background: "rgba(212,185,106,0.15)",
                                        border: "1px solid var(--gold-accent)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "10px",
                                        color: "var(--gold-accent)",
                                        flexShrink: 0,
                                    }}
                                >
                                    {getInitials(c.user.name)}
                                </div>
                                <div style={{ overflow: "hidden" }}>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "12px",
                                            color: c.unread
                                                ? "var(--cream)"
                                                : "var(--cream-muted)",
                                            fontWeight: c.unread ? 600 : 400,
                                            margin: 0,
                                        }}
                                    >
                                        {c.user.name}
                                    </p>
                                    {last && (
                                        <p
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "10px",
                                                color: "var(--cream-muted)",
                                                margin: 0,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {last.content}
                                        </p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
