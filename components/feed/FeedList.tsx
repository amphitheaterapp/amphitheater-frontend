"use client";

import { useEffect, useRef } from "react";
import { useFeedList } from "@/hooks/useFieldList";
import FeedCard from "./FeedCard";

interface Props {
    selectedUserId: string | null;
    onSelect: (userId: string) => void;
}

export default function FeedList({ selectedUserId, onSelect }: Props) {
    // 50km is the real default, not the 5000km used earlier purely to
    // surface results during local testing with sparse seed data.
    const { items, status, exhausted, loadMore, removeItem } = useFeedList(
        ["actor", "director", "producer", "cinematographer", "screenwriter"],
        50,
    );
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { rootMargin: "200px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <div
            style={{
                width: "420px",
                flexShrink: 0,
                borderRight: "1px solid rgba(212,185,106,0.15)",
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            {items.map((entry) => (
                <FeedCard
                    key={entry.user_id}
                    entry={entry}
                    selected={entry.user_id === selectedUserId}
                    onSelect={() => onSelect(entry.user_id)}
                    onPass={() => removeItem(entry.user_id)}
                />
            ))}

            {status === "computing" && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "var(--gold)",
                        textAlign: "center",
                    }}
                >
                    Computing feed...
                </p>
            )}

            {status === "loading" && items.length > 0 && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "var(--cream-muted)",
                        textAlign: "center",
                    }}
                >
                    Loading more...
                </p>
            )}

            {status === "error" && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "#e57373",
                        textAlign: "center",
                    }}
                >
                    Something went wrong loading the feed.
                </p>
            )}

            {!exhausted && <div ref={sentinelRef} style={{ height: "1px" }} />}

            {exhausted && items.length === 0 && status === "idle" && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "var(--cream-muted)",
                        textAlign: "center",
                        marginTop: "40px",
                    }}
                >
                    No profiles found nearby.
                </p>
            )}
        </div>
    );
}
