// components/auth/LoginPage.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoginConstellation from "./LoginConstellation";
import AnimatedLogo from "./AnimatedLogo";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch {
            setError("Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main style={{ position: "relative", minHeight: "100vh" }}>
            <LoginConstellation />

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                }}
            >
                {/* Animated Logo */}
                <a href="/">
                    <div style={{ marginBottom: "16px" }}>
                        <AnimatedLogo />
                    </div>
                </a>

                {/* Wordmark */}
                <a
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        textDecoration: "none",
                        marginBottom: "24px",
                    }}
                >
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

                {/* Card */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        border: "1px solid rgba(212,185,106,0.3)",
                        padding: "48px 40px",
                        background: "rgba(9,11,54,0.6)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.4em",
                            textTransform: "lowercase",
                            color: "var(--gold)",
                            marginBottom: "12px",
                        }}
                    >
                        welcome back
                    </p>

                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "40px",
                            fontWeight: 300,
                            color: "var(--cream)",
                            marginBottom: "40px",
                            lineHeight: 1.1,
                        }}
                    >
                        Sign In
                    </h1>

                    {error && (
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "#e57373",
                                marginBottom: "24px",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "32px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <label
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "10px",
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                    color: "var(--cream-muted)",
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    borderBottom:
                                        "1px solid rgba(212,185,106,0.4)",
                                    color: "var(--cream)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "13px",
                                    padding: "8px 0",
                                    outline: "none",
                                    width: "100%",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <label
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "10px",
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                    color: "var(--cream-muted)",
                                }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    borderBottom:
                                        "1px solid rgba(212,185,106,0.4)",
                                    color: "var(--cream)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "13px",
                                    padding: "8px 0",
                                    outline: "none",
                                    width: "100%",
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                marginTop: "8px",
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                background: isLoading
                                    ? "transparent"
                                    : "var(--gold-accent)",
                                color: isLoading
                                    ? "var(--cream-muted)"
                                    : "var(--ink)",
                                border: "1px solid var(--gold-accent)",
                                padding: "16px 32px",
                                cursor: isLoading ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                width: "100%",
                            }}
                        >
                            {isLoading ? "signing in..." : "sign in"}
                        </button>
                    </form>

                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            color: "var(--cream-muted)",
                            marginTop: "32px",
                            textAlign: "center",
                            letterSpacing: "0.05em",
                        }}
                    >
                        no account?{" "}
                        <Link
                            href="/register"
                            style={{
                                color: "var(--gold-accent)",
                                textDecoration: "none",
                                letterSpacing: "0.1em",
                            }}
                        >
                            register
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
