"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            aria-label="Primary"
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
                background: scrolled
                    ? "color-mix(in srgb, var(--ink) 80%, transparent)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(12px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
                borderBottom: scrolled
                    ? "1px solid rgba(200,169,110,0.12)"
                    : "1px solid transparent",
                transition:
                    "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
            }}
        >
            <a
                href="#top"
                aria-label="Amphitheater — back to top"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textDecoration: "none",
                }}
            >
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
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                <a
                    href="#how-it-works"
                    className="amphi-nav-link amphi-nav-secondary"
                    style={linkStyle}
                >
                    How it works
                </a>
                <a
                    href="#verification"
                    className="amphi-nav-link amphi-nav-secondary"
                    style={linkStyle}
                >
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
