"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import api from "@/lib/axios";

export interface FeedProfileEntry {
    role: string;
    data: {
        id: string;
        name: string;
        avatar_url: string | null;
        location_label: string;
        union_status: string;
        [key: string]: any;
    };
}

export interface FeedEntry {
    user_id: string;
    profiles: FeedProfileEntry[];
}

// Combines the cache-miss polling from the original dashboard test page
// with infinite-scroll accumulation. is_continuation tells the backend
// whether to reset the Redis cursor to the top or advance it.
export function useFeedList(roles: string[], radiusKm: number) {
    const [items, setItems] = useState<FeedEntry[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "computing" | "error">("idle");
    const [exhausted, setExhausted] = useState(false);

    const loadingRef = useRef(false);
    const retriesRef = useRef(0);
    const mountedRef = useRef(false);

    const fetchPage = useCallback(
        async (isContinuation: boolean) => {
            if (loadingRef.current) return;
            loadingRef.current = true;
            setStatus("loading");

            try {
                const res = await api.post("/api/v1/feed/", {
                    roles,
                    radius_km: radiusKm,
                    is_continuation: isContinuation,
                });

                if (res.status === 202) {
                    if (retriesRef.current >= 10) {
                        setStatus("error");
                        loadingRef.current = false;
                        return;
                    }
                    setStatus("computing");
                    const delay = Math.min(1000 * 2 ** retriesRef.current, 8000);
                    retriesRef.current += 1;
                    loadingRef.current = false;
                    setTimeout(() => fetchPage(isContinuation), delay);
                    return;
                }

                retriesRef.current = 0;
                setItems((prev) =>
                    isContinuation ? [...prev, ...res.data.results] : res.data.results
                );
                setExhausted(res.data.exhausted);
                setStatus("idle");
            } catch {
                setStatus("error");
            } finally {
                loadingRef.current = false;
            }
        },
        [roles, radiusKm]
    );

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        fetchPage(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = useCallback(() => {
        if (exhausted || loadingRef.current) return;
        fetchPage(true);
    }, [exhausted, fetchPage]);

    // Pass calls this. Local-only removal, no backend call yet.
    const removeItem = useCallback((userId: string) => {
        setItems((prev) => prev.filter((i) => i.user_id !== userId));
    }, []);

    return { items, status, exhausted, loadMore, removeItem };
}