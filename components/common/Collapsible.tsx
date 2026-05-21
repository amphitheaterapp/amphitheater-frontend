// components/common/Collapsible.tsx
"use client";

import { useState } from "react";

interface Props {
    title: string;
    children: React.ReactNode;
}

export default function Collapsible({ title, children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                borderTop: "1px solid rgba(212,185,106,0.15)",
                paddingTop: "20px",
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: 0,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--gold-accent)",
                    }}
                >
                    {title}
                </span>
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        color: "var(--gold-accent)",
                        transition: "transform 0.2s ease",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    +
                </span>
            </button>

            {open && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        marginTop: "24px",
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
