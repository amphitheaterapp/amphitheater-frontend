// app/(app)/feed/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import api from "@/lib/axios";

export default function FeedPage() {
    const [feedData, setFeedData] = useState<any>(null);
    const [feedStatus, setFeedStatus] = useState<
        "idle" | "computing" | "loaded" | "error"
    >("idle");
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const retriesRef = useRef(0);
    const loadedRef = useRef(false);

    const fetchFeed = useCallback(async (isContinuation = false) => {
        if (loadedRef.current && !isContinuation) return;

        try {
            const res = await api.post("/api/v1/feed/", {
                roles: ["actor", "director"],
                radius_km: 50,
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
                pollRef.current = setTimeout(
                    () => fetchFeed(isContinuation),
                    delay,
                );
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
        fetchFeed();
        return () => {
            if (pollRef.current) clearTimeout(pollRef.current);
        };
    }, [fetchFeed]);

    return (
        <main style={{ padding: "32px 48px" }}>
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
        </main>
    );
}
