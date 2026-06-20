"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function DashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const [feedData, setFeedData] = useState<any>(null);
    const [feedStatus, setFeedStatus] = useState<
        "idle" | "computing" | "loaded" | "error"
    >("idle");
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const retriesRef = useRef(0);
    const loadedRef = useRef(false); // never re-fetch once loaded

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const fetchFeed = useCallback(async (isContinuation = false) => {
        if (loadedRef.current) return; // already loaded, do nothing

        try {
            const res = await api.post("/api/v1/feed/", {
                roles: ["actor", "director", "producer", "cinematographer"],
                radius_km: 5000,
                is_continuation: isContinuation,
            });

            if (res.status === 202) {
                if (retriesRef.current >= 10) {
                    setFeedStatus("error");
                    return;
                }
                setFeedStatus("computing");
                const delay = Math.min(1000 * 2 ** retriesRef.current, 8000);
                retriesRef.current += 1;
                pollRef.current = setTimeout(fetchFeed, delay);
                return;
            }

            loadedRef.current = true;
            setFeedData(res.data);
            setFeedStatus("loaded");
            retriesRef.current = 0;
        } catch {
            setFeedStatus("error");
        }
    }, []);

    useEffect(() => {
        if (user && !loadedRef.current) {
            fetchFeed();
        }
        return () => {
            if (pollRef.current) clearTimeout(pollRef.current);
        };
    }, [user, fetchFeed]);

    const handleLogout = async () => {
        if (pollRef.current) clearTimeout(pollRef.current);
        await logout();
        router.push("/login");
    };

    if (isLoading || !user) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.3em",
                        color: "var(--cream-muted)",
                        textTransform: "uppercase",
                    }}
                >
                    loading...
                </p>
            </main>
        );
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: "48px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                    }}
                >
                    Amphitheater
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: "transparent",
                        color: "var(--cream-muted)",
                        border: "1px solid rgba(212,185,106,0.2)",
                        padding: "8px 16px",
                        cursor: "pointer",
                    }}
                >
                    sign out
                </button>
            </div>

            <div>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.4em",
                        textTransform: "lowercase",
                        color: "var(--gold)",
                        marginBottom: "8px",
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
                        lineHeight: 1.1,
                    }}
                >
                    {user.name}
                </h1>
            </div>

            <div>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--cream-muted)",
                        marginBottom: "16px",
                    }}
                >
                    Feed response
                </p>

                {feedStatus === "idle" && (
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            color: "var(--cream-muted)",
                        }}
                    >
                        Waiting...
                    </p>
                )}

                {feedStatus === "computing" && (
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            color: "var(--gold)",
                            letterSpacing: "0.1em",
                        }}
                    >
                        Computing feed... (retry {retriesRef.current}/10)
                    </p>
                )}

                {feedStatus === "error" && (
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            color: "#e57373",
                        }}
                    >
                        Feed failed to load.
                    </p>
                )}

                {feedStatus === "loaded" && feedData && (
                    <pre
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--cream)",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(212,185,106,0.15)",
                            padding: "24px",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            lineHeight: 1.6,
                        }}
                    >
                        {JSON.stringify(feedData, null, 2)}
                    </pre>
                )}
            </div>
        </main>
    );
}
