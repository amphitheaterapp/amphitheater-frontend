"use client";

import type { CSSProperties } from "react";
import { ColumnIcon } from "@/assets/InternalSVGPack";
import { useAuth } from "@/context/AuthContext";

const linkStyle: CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--cream-muted)",
    textDecoration: "none",
};

export default function Nav() {
    const { user, logout } = useAuth();

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 32px",
                borderBottom: "1px solid transparent",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ColumnIcon
                    style={{
                        width: "36px",
                        height: "36px",
                        color: "var(--cream)",
                    }}
                />
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--cream-dim)",
                    }}
                >
                    Amphitheater
                </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                <a href="#how-it-works" style={linkStyle}>
                    How it works
                </a>
                <a href="#verification" style={linkStyle}>
                    Verification
                </a>
                {user ? (
                    <button
                        onClick={logout}
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--gold)",
                            border: "1px solid var(--gold)",
                            background: "transparent",
                            padding: "8px 20px",
                            cursor: "pointer",
                        }}
                    >
                        Log out
                    </button>
                ) : (
                    <button
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--gold)",
                            border: "1px solid var(--gold)",
                            background: "transparent",
                            padding: "8px 20px",
                            cursor: "pointer",
                        }}
                    >
                        Request Access
                    </button>
                )}
            </div>
        </nav>
    );
}
