"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MessagingProvider } from "@/context/MessagingContext";
import Navbar from "./Navbar";
import BubbleDock from "@/components/messaging/BubbleDock";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

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
        <MessagingProvider>
            <Navbar />
            <div style={{ paddingTop: "72px" }}>{children}</div>
            <BubbleDock />
        </MessagingProvider>
    );
}
