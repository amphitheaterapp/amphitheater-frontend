"use client";

import { useState, useRef, useEffect } from "react";
import { useMessaging, Conversation } from "@/context/MessagingContext";
import { getInitials } from "@/lib/initials";

interface Props {
    conversation: Conversation;
    minimized: boolean;
}

export default function MessageBubble({ conversation, minimized }: Props) {
    const { closeBubble, toggleMinimize, sendMessage } = useMessaging();
    const [draft, setDraft] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!minimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation.messages, minimized]);

    const handleSend = () => {
        if (!draft.trim()) return;
        sendMessage(conversation.id, draft);
        setDraft("");
    };

    if (minimized) {
        return (
            <button
                onClick={() => toggleMinimize(conversation.id)}
                title={conversation.user.name}
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(212,185,106,0.15)",
                    border: "1px solid var(--gold-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--gold-accent)",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
            >
                {getInitials(conversation.user.name)}
            </button>
        );
    }

    return (
        <div
            style={{
                width: "280px",
                height: "360px",
                display: "flex",
                flexDirection: "column",
                background: "var(--ink)",
                border: "1px solid rgba(212,185,106,0.3)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(212,185,106,0.15)",
                    background: "rgba(255,255,255,0.02)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "rgba(212,185,106,0.15)",
                            border: "1px solid var(--gold-accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-body)",
                            fontSize: "9px",
                            color: "var(--gold-accent)",
                        }}
                    >
                        {getInitials(conversation.user.name)}
                    </div>
                    <span
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.05em",
                            color: "var(--cream)",
                        }}
                    >
                        {conversation.user.name}
                    </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => toggleMinimize(conversation.id)}
                        aria-label="Minimize"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--cream-muted)",
                            cursor: "pointer",
                            fontSize: "12px",
                            lineHeight: 1,
                        }}
                    >
                        &#8212;
                    </button>
                    <button
                        onClick={() => closeBubble(conversation.id)}
                        aria-label="Close"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--cream-muted)",
                            cursor: "pointer",
                            fontSize: "13px",
                            lineHeight: 1,
                        }}
                    >
                        &times;
                    </button>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                {conversation.messages.length === 0 && (
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            color: "var(--cream-muted)",
                            textAlign: "center",
                            marginTop: "20px",
                        }}
                    >
                        Say hello to {conversation.user.name.split(" ")[0]}
                    </p>
                )}
                {conversation.messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf:
                                msg.sender === "me" ? "flex-end" : "flex-start",
                            maxWidth: "85%",
                            background:
                                msg.sender === "me"
                                    ? "rgba(212,185,106,0.18)"
                                    : "rgba(255,255,255,0.05)",
                            border:
                                msg.sender === "me"
                                    ? "1px solid rgba(212,185,106,0.3)"
                                    : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px",
                            padding: "6px 10px",
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            color: "var(--cream)",
                            lineHeight: 1.4,
                        }}
                    >
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div
                style={{
                    display: "flex",
                    borderTop: "1px solid rgba(212,185,106,0.15)",
                    padding: "8px",
                    gap: "6px",
                }}
            >
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Write a message..."
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "1px solid rgba(212,185,106,0.2)",
                        borderRadius: "6px",
                        color: "var(--cream)",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        padding: "6px 8px",
                        outline: "none",
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: "var(--gold-accent)",
                        color: "var(--ink)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0 12px",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
