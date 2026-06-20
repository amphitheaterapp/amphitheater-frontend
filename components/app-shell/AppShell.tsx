// components/app-shell/AppShell.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Route the user to login if they try direct URL entry without login.
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
        <>
            <Navbar />
            <div style={{ paddingTop: "72px" }}>{children}</div>
        </>
    );
}
