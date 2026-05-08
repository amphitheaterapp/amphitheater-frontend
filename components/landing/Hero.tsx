"use client";

export default function Hero() {
    return (
        <section
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "120px 32px 80px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(28,28,56,0.6) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: "24px",
                }}
            >
                The Verified Creative Network
            </p>

            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(52px, 9vw, 128px)",
                    fontWeight: 300,
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                    color: "var(--cream)",
                    marginBottom: "32px",
                    maxWidth: "1000px",
                }}
            >
                Find your team.
                <br />
                <em style={{ fontStyle: "italic", color: "var(--cream-dim)" }}>
                    Build your record.
                </em>
            </h1>

            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--cream-muted)",
                    lineHeight: 1.8,
                    maxWidth: "480px",
                    marginBottom: "48px",
                }}
            >
                Amphitheater connects every discipline of film, television,
                theatre, music, and content production. Verified identities.
                Permanent credited work history. No noise.
            </p>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <button
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: "var(--gold)",
                        color: "var(--ink)",
                        border: "none",
                        padding: "16px 32px",
                        cursor: "pointer",
                        fontWeight: 500,
                    }}
                >
                    Request Early Access
                </button>
                <button
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: "transparent",
                        color: "var(--cream-dim)",
                        border: "1px solid rgba(240,234,216,0.2)",
                        padding: "16px 32px",
                        cursor: "pointer",
                    }}
                >
                    See How It Works
                </button>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--cream-muted)",
                    }}
                >
                    Scroll
                </span>
                <div
                    style={{
                        width: "1px",
                        height: "48px",
                        background:
                            "linear-gradient(to bottom, var(--gold), transparent)",
                    }}
                />
            </div>
        </section>
    );
}
