"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ColumnIcon } from "@/assets/InternalSVGPack";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/initials";
import MessagesDropdown from "@/components/messaging/MessagesDropdown";

const TABS = [
    { label: "Find People", href: "/app/feed" },
    { label: "Join a Project", href: "/app/join-project" },
    { label: "Create a Project", href: "/app/create-project" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

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
                background: "color-mix(in srgb, var(--ink) 90%, transparent)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(200,169,110,0.12)",
            }}
        >
            <Link
                href=""
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
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                {TABS.map((tab) => {
                    const active = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: active
                                    ? "var(--gold)"
                                    : "var(--cream-muted)",
                                textDecoration: "none",
                                paddingBottom: "4px",
                                borderBottom: active
                                    ? "1px solid var(--gold)"
                                    : "1px solid transparent",
                                transition:
                                    "color 0.2s ease, border-color 0.2s ease",
                            }}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <MessagesDropdown />

                <div
                    title={user?.name}
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(212,185,106,0.15)",
                        border: "1px solid var(--gold-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.05em",
                        color: "var(--gold-accent)",
                        overflow: "hidden",
                    }}
                >
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        getInitials(user?.name)
                    )}
                </div>

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
                    Sign out
                </button>
            </div>
        </nav>
    );
}
